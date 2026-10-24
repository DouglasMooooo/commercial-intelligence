import {baseScenario, type Sale, type SKU, type Scenario, type Filters} from './types';

export const sum = <T>(rows:T[],f:(r:T)=>number)=>rows.reduce((a,r)=>a+f(r),0);
export const ratio = (a:number,b:number):number|null=>b>0?a/b:null;
export function nonnegative(n:number,name='Input'){
 if(!Number.isFinite(n)||n<0)throw new Error(`${name} must be finite and nonnegative`);
 return n;
}
export function wape(actual:number[],predicted:number[]){
 if(actual.length!==predicted.length)throw new Error('Periods must match');
 actual.forEach(n=>nonnegative(n));predicted.forEach(n=>nonnegative(n));
 return ratio(sum(actual.map((a,i)=>Math.abs(a-predicted[i])),a=>a),sum(actual,a=>a));
}
export function forecast(history:number[]){
 history.forEach(n=>nonnegative(n));const recent=history.slice(-4);
 return recent.length?sum(recent,n=>n)/recent.length:0;
}
export function reorder(demand:number,stock:number,incoming:number,lead:number,target:number,safety:number,pack:number){
 [demand,stock,incoming,lead,target,safety].forEach(n=>nonnegative(n));
 if(!Number.isInteger(pack)||pack<1)throw new Error('Pack must be a positive integer');
 return Math.ceil(Math.max(0,demand*(lead+target+safety)-stock-incoming)/pack)*pack;
}
export function stockEquation(beginning:number,receipts:number,returns:number,sold:number){
 [beginning,receipts,returns,sold].forEach(n=>nonnegative(n));
 const closing=beginning+receipts+returns-sold;
 if(closing<0)throw new Error('Insufficient physical stock');return closing;
}
export function dedupe<T extends {id:string}>(rows:T[]){
 const seen=new Set<string>();return rows.filter(r=>{if(seen.has(r.id))return false;seen.add(r.id);return true;});
}
// Fail closed at the public calculation boundary; never silently count duplicate facts.
export function validateFacts(rows:Sale[]){
 const ids=new Set<string>(),grain=new Set<string>();
 const histories=new Map<string,Sale[]>();
 for(const r of rows){
  const key=JSON.stringify([r.sku,r.store,r.channel,r.week]);
  if(ids.has(r.id)||grain.has(key))throw new Error('Duplicate retail fact; investigate before aggregation');
  ids.add(r.id);grain.add(key);
  const location=JSON.stringify([r.sku,r.store,r.channel]);histories.set(location,[...(histories.get(location)||[]),r]);
  [r.week,r.sold,r.returns,r.price,r.actualPrice,r.cost,r.beginning,r.receipts,r.closing,r.onOrder,r.leadTime,r.forecast].forEach(n=>nonnegative(n));
  if(!r.id||!r.sku||!r.store||!Number.isInteger(r.week)||r.returns>r.sold)throw new Error('Invalid retail fact');
  if(stockEquation(r.beginning,r.receipts,r.returns,r.sold)!==r.closing)throw new Error('Stock equation does not reconcile');
  const net=r.sold-r.returns;
  if(![r.revenue,r.cogs,r.profit].every(Number.isFinite)||Math.abs(r.revenue-net*r.actualPrice)>.011||Math.abs(r.cogs-net*r.cost)>.011||Math.abs(r.profit-(r.revenue-r.cogs))>.011)throw new Error('Retail financial values do not reconcile');
 }
 for(const history of histories.values()){
  history.sort((a,b)=>a.week-b.week);
  for(let i=1;i<history.length;i++)if(history[i].week===history[i-1].week+1&&history[i].beginning!==history[i-1].closing)throw new Error('Consecutive stock snapshots do not reconcile');
 }
}
export const select=(rows:Sale[],f:Filters)=>rows.filter(r=>(f.category==='All'||r.category===f.category)&&(f.sku==='All'||r.sku===f.sku)&&(f.channel==='All'||r.channel===f.channel)&&r.week>=f.from&&r.week<=f.to);
export function metrics(rows:Sale[]){
 validateFacts(rows);
 const units=sum(rows,r=>r.sold-r.returns),revenue=sum(rows,r=>r.revenue),profit=sum(rows,r=>r.profit);
 const groups=new Map<string,Sale[]>();
 for(const r of rows){const key=JSON.stringify([r.sku,r.store,r.channel]);groups.set(key,[...(groups.get(key)||[]),r]);}
 let opening=0,closing=0,openingCost=0,closingCost=0;
 const firstWeek=rows.length?Math.min(...rows.map(r=>r.week)):null,lastWeek=rows.length?Math.max(...rows.map(r=>r.week)):null;
 let complete=true;
 for(const group of groups.values()){
  group.sort((a,b)=>a.week-b.week);const first=group[0],last=group.at(-1)!;
  opening+=first.beginning;closing+=last.closing;openingCost+=first.beginning*first.cost;closingCost+=last.closing*last.cost;
  if(first.week!==firstWeek||last.week!==lastWeek||group.length!==last.week-first.week+1)complete=false;
 }
 const receipts=sum(rows,r=>r.receipts);
 return {units,revenue,profit,margin:ratio(profit,revenue),asp:ratio(revenue,units),
  sellThrough:complete?ratio(units,opening+receipts):null,turn:complete?ratio(sum(rows,r=>r.cogs),(openingCost+closingCost)/2):null,
  wape:wape(rows.map(r=>r.sold-r.returns),rows.map(r=>r.forecast)),variance:units-sum(rows,r=>r.forecast),
  markdown:ratio(sum(rows,r=>r.sold*(r.price-r.actualPrice)),sum(rows,r=>r.sold*r.price)),
  closing,investment:closingCost,opening,receipts,complete};
}
export function validateScenario(s:Scenario){
 for(const [n,min,max]of [[s.uplift,-1,3],[s.promo,0,2],[s.markdown,0,.6],[s.markdownResponse,0,2],[s.leadDelta,-2,6],[s.cover,1,12],[s.safety,0,4]]){
  if(!Number.isFinite(n)||n<min||n>max)throw new Error('Scenario outside supported bounds');
 }
 if(typeof s.incomingWithinHorizon!=='boolean')throw new Error('Receipt availability assumption must be explicit');
}
export function plan(master:SKU[],rows:Sale[],scenario:Scenario=baseScenario){
 validateScenario(scenario);validateFacts(rows);
 if(new Set(master.map(s=>s.sku)).size!==master.length)throw new Error('Duplicate SKU master key');
 if(rows.some(r=>!master.some(s=>s.sku===r.sku)))throw new Error('Unknown SKU master mapping');
 return master.filter(s=>rows.some(r=>r.sku===s.sku)).map(s=>{
  [s.price,s.cost,s.leadTime].forEach(n=>nonnegative(n));
  if(!Number.isInteger(s.pack)||s.pack<1)throw new Error('Pack must be a positive integer');
  const history=rows.filter(r=>r.sku===s.sku),end=Math.max(...history.map(r=>r.week));
  const latest=history.filter(r=>r.week===end),weeks=[...new Set(history.map(r=>r.week))].sort((a,b)=>a-b).slice(-4);
  const locations=new Set(history.map(r=>JSON.stringify([r.store,r.channel])));
  const snapshotComplete=latest.length===locations.size;
  const historyComplete=weeks.every((w,i)=>history.filter(r=>r.week===w).length===locations.size&&(i===0||w===weeks[i-1]+1));
  const baseline=forecast(weeks.map(w=>sum(history.filter(r=>r.week===w),r=>r.sold-r.returns)));
  const demand=baseline*(1+scenario.uplift)*(1+scenario.promo)*(1+scenario.markdown*scenario.markdownResponse);
  const stock=sum(latest,r=>r.closing),incoming=sum(latest,r=>r.onOrder),leadValues=[...new Set(latest.map(r=>r.leadTime))];
  const orderReady=snapshotComplete&&historyComplete&&leadValues.length===1;
  const lead=Math.max(0,Math.max(...leadValues)+scenario.leadDelta),cover=ratio(stock,demand);
  const safetyUnits=demand*scenario.safety,targetUnits=demand*(lead+scenario.cover+scenario.safety),unroundedNeed=Math.max(0,targetUnits-stock-incoming);
  const quantity=orderReady?reorder(demand,stock,incoming,lead,scenario.cover,scenario.safety,s.pack):0;
  const price=s.price*(1-scenario.markdown),expectedUnits=demand*4;
  const minimumFulfilment=Math.min(stock,expectedUnits),maximumFulfilment=Math.min(stock+incoming,expectedUnits);
  const periodUnits=scenario.incomingWithinHorizon?maximumFulfilment:minimumFulfilment;
  const previousWeeks=Array.from({length:4},(_,i)=>end-7+i);
  const comparableHistory=weeks.length===4&&previousWeeks.every(w=>history.filter(r=>r.week===w).length===locations.size);
  const prev=comparableHistory?sum(history.filter(r=>previousWeeks.includes(r.week)),r=>r.sold-r.returns)/4:0;
  const growth=comparableHistory?ratio(baseline-prev,prev):null,recent=history.filter(r=>weeks.includes(r.week));
  const accuracy=wape(recent.map(r=>r.sold-r.returns),recent.map(r=>r.forecast));
  const risk=!orderReady?'Review incomplete data':demand===0?'Review no demand':cover!==null&&cover<lead?'Stockout':cover!==null&&cover>scenario.cover+lead+scenario.safety+4?'Excess':'Balanced';
  const lostUnits=Math.max(0,demand*lead-stock);
  return {...s,baseline,demand,stock,incoming,lead,cover,quantity,price,periodUnits,expectedUnits,minimumFulfilment,maximumFulfilment,
   safetyUnits,targetUnits,unroundedNeed,orderReady,historyWeeks:weeks.length,historyComplete,snapshotComplete,
   projectedSales:periodUnits*price,projectedProfit:periodUnits*(price-s.cost),margin:ratio(price-s.cost,price),growth,accuracy,risk,
   impact:risk==='Stockout'?lostUnits*Math.max(0,price-s.cost):risk==='Excess'?Math.max(0,stock-demand*(scenario.cover+lead+scenario.safety))*s.cost:0,
   confidence:!orderReady?'Incomplete history':weeks.length<4?'Limited history':accuracy===null?'Insufficient history':accuracy<.25?'Higher':'Review forecast',
   urgency:risk==='Stockout'?'Before next receipt':'Next planning review'};
 });
}
export type Plan=ReturnType<typeof plan>[number];
export function commercialSummary(plans:Plan[]){
 const revenue=sum(plans,p=>p.projectedSales),profit=sum(plans,p=>p.projectedProfit);
 return {expected:sum(plans,p=>p.expectedUnits),fulfilled:sum(plans,p=>p.periodUnits),revenue,profit,margin:ratio(profit,revenue),minimum:sum(plans,p=>p.minimumFulfilment),maximum:sum(plans,p=>p.maximumFulfilment)};
}
export function financial(plans:Plan[],horizon=4){
 nonnegative(horizon);
 const opening=sum(plans,p=>p.stock*p.cost),cogs=sum(plans,p=>p.demand*horizon*p.cost),targetClosing=sum(plans,p=>p.demand*4*p.cost),committed=sum(plans,p=>p.incoming*p.cost);
 const cats=[...new Set(plans.map(p=>p.category))];
 const receipts=sum(cats,c=>{const pp=plans.filter(p=>p.category===c);return Math.max(0,sum(pp,p=>p.demand*(horizon+4)*p.cost-p.stock*p.cost));});
 return {opening,cogs,targetClosing,closing:opening+receipts-cogs,committed,receipts,otb:receipts-committed,sales:sum(plans,p=>p.demand*horizon*p.price)};
}
