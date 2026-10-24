import {test} from 'node:test';
import assert from 'node:assert/strict';
import {commercialSummary,metrics,plan,select} from '../lib/engine';
import {master,sales,warehouse} from '../lib/data';
import {baseScenario,defaultFilters,type Scenario} from '../lib/types';
import {reconcile} from '../lib/reconcile';
import {workbookSpec} from '../lib/workbook-spec';

test('zero-demand scenario produces no orders and unavailable fulfilled margin',()=>{
 const pp=plan(master,sales,{...baseScenario,uplift:-1});
 assert.ok(pp.every(p=>p.demand===0&&p.quantity===0&&p.cover===null&&p.periodUnits===0));
 assert.equal(commercialSummary(pp).margin,null);
});
test('configured markdown response changes demand without changing unit economics',()=>{
 const zero=plan(master,sales,{...baseScenario,markdown:.2,markdownResponse:0});
 const high=plan(master,sales,{...baseScenario,markdown:.2,markdownResponse:2});
 assert.ok(high[1].demand>zero[1].demand);assert.equal(high[1].price,zero[1].price);assert.equal(high[1].margin,zero[1].margin);
 const rr=select(sales,{...defaultFilters,category:'Lifestyle'}),base=commercialSummary(plan(master,rr));
 const md=commercialSummary(plan(master,rr,{...baseScenario,markdown:.2}));
 assert.ok(md.fulfilled>base.fulfilled);assert.ok(md.profit<base.profit);assert.ok(md.margin!<base.margin!);
});
test('unconfirmed incoming changes fulfilment bounds, never urgent cover or order',()=>{
 const a=plan(master,sales)[0],b=plan(master,sales,{...baseScenario,incomingWithinHorizon:true})[0];
 assert.equal(a.periodUnits,0);assert.equal(b.periodUnits,24);assert.equal(a.maximumFulfilment,24);
 assert.equal(a.quantity,b.quantity);assert.equal(a.risk,'Stockout');assert.equal(a.cover,b.cover);
 assert.equal(a.projectedProfit,a.periodUnits*(a.price-a.cost));
});
test('all scenario inputs reject negative, nonfinite and out-of-range values',()=>{
 const cases:Partial<Scenario>[]=[{uplift:-1.01},{uplift:NaN},{promo:-1},{promo:Infinity},{markdown:.7},{markdownResponse:-1},{markdownResponse:NaN},{leadDelta:7},{cover:-1},{cover:0},{safety:NaN},{safety:-1}];
 cases.forEach(patch=>assert.throws(()=>plan(master,sales,{...baseScenario,...patch})));
 assert.throws(()=>plan(master,sales,{...baseScenario,incomingWithinHorizon:undefined as unknown as boolean}));
});
test('duplicate retail facts fail before KPI and stock calculation',()=>{
 assert.throws(()=>metrics([sales[0],sales[0]]),/Duplicate/);
 assert.throws(()=>plan(master,[sales[0],{...sales[0],id:'other'}]),/Duplicate/);
 assert.throws(()=>metrics([{...sales[0],revenue:NaN}]),/financial/);
});
test('broken stock continuity, unknown master mappings and invalid packs fail closed',()=>{
 const next={...sales[1],beginning:sales[1].beginning+1,closing:sales[1].closing+1};
 assert.throws(()=>metrics([sales[0],next]),/Consecutive stock/);
 assert.throws(()=>plan(master,[{...sales[0],sku:'UNKNOWN'}]),/Unknown SKU/);
 assert.throws(()=>plan(master.map(s=>({...s,pack:0})),[sales[0]]),/Pack/);
 assert.throws(()=>plan([...master,master[0]],[sales[0]]),/Duplicate SKU/);
});
test('missing recent week and incomplete final stock withhold proposals',()=>{
 const missingWeek=sales.filter(r=>r.sku==='DEMO-102'&&r.week!==19);
 const a=plan(master,missingWeek)[0];assert.equal(a.risk,'Review incomplete data');assert.equal(a.quantity,0);assert.equal(a.orderReady,false);
 const missingSnapshot=sales.filter(r=>r.sku==='DEMO-102'&&!(r.week===20&&r.store==='Online'));
 const b=plan(master,missingSnapshot)[0];assert.equal(b.snapshotComplete,false);assert.equal(b.quantity,0);
 assert.equal(metrics(missingSnapshot).sellThrough,null);assert.equal(metrics(missingSnapshot).turn,null);
});
test('short history never invents a comparable growth period',()=>{
 const pp=plan(master,select(sales,{...defaultFilters,from:18}));assert.ok(pp.every(p=>p.growth===null&&p.confidence==='Limited history'));
 assert.deepEqual(plan(master,[]),[]);assert.equal(commercialSummary([]).margin,null);
});
test('future observations do not affect prior-cutoff baseline',()=>{
 const past=select(sales,{...defaultFilters,to:10});
 const altered=sales.map(r=>r.week>10?{...r,onOrder:999999}:r);
 assert.deepEqual(plan(master,past),plan(master,select(altered,{...defaultFilters,to:10})));
});
test('exact duplicate stocktake is flagged and physical count is counted once',()=>{
 const count=warehouse.records.find(r=>r.source==='Stocktake')!;
 const a=reconcile(warehouse.records),b=reconcile([...warehouse.records,{...count,serial:count.serial.toLowerCase()}]);
 assert.equal(a.physical,b.physical);assert.ok(b.exceptions.some(e=>e.serial===count.serial&&e.kind==='Duplicate record'));
});
test('conflicting duplicate evidence remains visible and count is unresolved',()=>{
 const count=warehouse.records.find(r=>r.source==='Stocktake')!;
 const result=reconcile([...warehouse.records,{...count,quantity:2}]);
 assert.equal(result.ambiguousCounts,1);assert.equal(result.physical,35);
 assert.ok(result.exceptions.some(e=>e.serial===count.serial&&e.kind==='Balance discrepancy'));
});
test('mismatched ERP/WMS references cannot be classified as fully aligned',()=>{
 const rr=warehouse.records.filter(r=>r.serial==='SYN-00001').map(r=>r.source==='WMS'?{...r,reference:'SIM-OTHER'}:r);
 const result=reconcile(rr);assert.equal(result.confirmed,0);assert.ok(result.exceptions.some(e=>e.kind==='Missing movement'));
});
test('status whitespace and casing normalise without false conflicts',()=>{
 const rr=warehouse.records.filter(r=>r.serial==='SYN-00001').map(r=>({...r,status:r.source==='ERP'?' available ':'Available'}));
 assert.equal(reconcile(rr).confirmed,1);
});
test('Excel baseline and scenario assumptions use the same calculation engine',()=>{
 const get=(scenario:Scenario)=>{const spec=workbookSpec(scenario),inventory=spec.find(s=>s.name==='Inventory Planning')!;return {spec,cell:(address:string)=>inventory.formulas.find(f=>f.cell===address)!};};
 const a=get(baseScenario),b=get({...baseScenario,leadDelta:2}),c=get({...baseScenario,markdownResponse:2,markdown:.2}),z=get({...baseScenario,uplift:-1});
 assert.equal(a.cell('K2').cached,294);assert.equal(b.cell('K2').cached,366);assert.equal(a.cell('O2').cached,0);assert.equal(z.cell('J2').cached,'N/A');
 assert.ok(Number(c.cell('H2').cached)>Number(a.cell('H2').cached));
 assert.match(a.cell('H2').formula,/Assumptions!\$B\$9/);assert.match(a.cell('O2').formula,/Assumptions!\$B\$11/);
 assert.ok(a.spec.find(s=>s.name==='Assumptions')!.input!.includes('B11'));
});
