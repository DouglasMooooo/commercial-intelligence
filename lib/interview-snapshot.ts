import {metrics,ratio,reorder,sum,validateFacts} from './engine';
import type {Sale,SKU} from './types';

export const SHEETS_MODEL_URL='https://docs.google.com/spreadsheets/d/10MVAME7TsKFh4tENS7ADAFivd3vb1zxxKWNXR0iFw1g/edit';
export const INTERVIEW_SKUS=['DEMO-101','DEMO-201','DEMO-301'] as const;
export type InterviewSKU=typeof INTERVIEW_SKUS[number];
// Read-only baseline checked against Google Sheets ASSUMPTIONS on 26 October 2026.
// These are model inputs, not target KPI outputs. Google Sheets is maintained separately.
export const SHEETS_BASELINE={endWeek:20,rollingWeeks:4,uplift:0,targetCover:4,safetyCover:1} as const;
const locations=['Central Market','North Arcade','Online','Riverside'] as const;
export type WeeklyUnits={week:number}&Record<InterviewSKU,number>;

export function interviewSnapshot(source:Sale[],catalogue:SKU[]){
 const basis=SHEETS_BASELINE;
 const rows=source.filter(r=>INTERVIEW_SKUS.some(sku=>sku===r.sku)&&r.week>=1&&r.week<=basis.endWeek);
 validateFacts(rows);
 // Fail visibly if the fixed interview snapshot loses a location, week or selected SKU.
 if(rows.length!==INTERVIEW_SKUS.length*locations.length*basis.endWeek||rows.some(r=>!locations.some(store=>store===r.store)))throw new Error('Incomplete selected-SKU interview dataset');
 const totals=metrics(rows);
 const inventory=INTERVIEW_SKUS.map(sku=>{
  const master=catalogue.find(s=>s.sku===sku);
  if(!master)throw new Error(`Missing SKU master: ${sku}`);
  const facts=rows.filter(r=>r.sku===sku);
  // STORE FORECAST C/D: recent actual net units / four weeks, separately per store.
  // Historical facts.forecast is a different, prior-period forecast and is not used here.
  const storeVelocity=locations.map(store=>({store,unitsPerWeek:sum(facts.filter(r=>r.store===store&&r.week>basis.endWeek-basis.rollingWeeks),r=>r.sold-r.returns)/basis.rollingWeeks}));
  const demand=sum(storeVelocity,s=>s.unitsPerWeek)*(1+basis.uplift);
  const latest=facts.filter(r=>r.week===basis.endWeek);
  const stock=sum(latest,r=>r.closing);
  const onOrder=sum(latest,r=>r.onOrder); // Existing open PO quantities, not new proposals.
  const cover=ratio(stock,demand);
  const proposal=reorder(demand,stock,onOrder,master.leadTime,basis.targetCover,basis.safetyCover,master.pack);
  // Same SKU PLANNING Q baseline policy as Sheets. No independent trading conclusion.
  const risk=demand===0?'No demand':cover!==null&&cover<master.leadTime?'Stockout risk':cover!==null&&cover>master.leadTime+basis.targetCover+basis.safetyCover+4?'Excess':'Balanced';
  return {sku,product:master.product,stock,onOrder,demand,cover,proposal,risk,lead:master.leadTime,pack:master.pack,storeVelocity};
 });
 const weekly:WeeklyUnits[]=Array.from({length:basis.endWeek},(_,i)=>{
  const week=i+1;
  return {week,'DEMO-101':sum(rows.filter(r=>r.sku==='DEMO-101'&&r.week===week),r=>r.sold-r.returns),'DEMO-201':sum(rows.filter(r=>r.sku==='DEMO-201'&&r.week===week),r=>r.sold-r.returns),'DEMO-301':sum(rows.filter(r=>r.sku==='DEMO-301'&&r.week===week),r=>r.sold-r.returns)};
 });
 return {sales:totals.revenue,profit:totals.profit,margin:totals.margin,atRisk:inventory.filter(p=>p.risk==='Stockout risk'||p.risk==='Excess').length,inventory,weekly};
}
export type InterviewSnapshot=ReturnType<typeof interviewSnapshot>;
