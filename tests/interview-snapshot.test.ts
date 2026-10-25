import {test} from 'node:test';
import assert from 'node:assert/strict';
import {master,sales} from '../lib/data';
import {interviewSnapshot,INTERVIEW_SKUS,SHEETS_MODEL_URL} from '../lib/interview-snapshot';

const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} != ${expected}`);
test('selected-SKU baseline independently ties to Google Sheets at 26 October 2026',()=>{
 const s=interviewSnapshot(sales,master);
 close(s.sales,61540.2);close(s.profit,38953.08);close(s.margin!,38953.08/61540.2);assert.equal(s.atRisk,2);
 assert.deepEqual(s.inventory.map(p=>p.sku),[...INTERVIEW_SKUS]);
 assert.deepEqual(s.inventory.map(p=>p.stock),[0,234,1124]);
 assert.deepEqual(s.inventory.map(p=>p.onOrder),[24,72,96]);
 assert.deepEqual(s.inventory.map(p=>p.proposal),[294,48,0]);
 assert.deepEqual(s.inventory.map(p=>p.demand),[35,50.25,30.25]);
 close(s.inventory[1].cover!,234/50.25);close(s.inventory[2].cover!,1124/30.25);
 assert.deepEqual(s.inventory.map(p=>p.risk),['Stockout risk','Balanced','Excess']);
});
test('recent SKU demand sums the four store-level rolling averages, including Online',()=>{
 const s=interviewSnapshot(sales,master);
 assert.deepEqual(s.inventory[1].storeVelocity.map(p=>p.unitsPerWeek),[10.75,11,18.25,10.25]);
 for(const p of s.inventory){close(p.demand,p.storeVelocity.reduce((a,r)=>a+r.unitsPerWeek,0));assert.equal(p.storeVelocity.length,4);}
});
test('all 20 chart points have exactly three actual net-unit series and reconcile to source',()=>{
 const s=interviewSnapshot(sales,master);assert.equal(s.weekly.length,20);
 for(const point of s.weekly){assert.deepEqual(Object.keys(point),['week',...INTERVIEW_SKUS]);for(const sku of INTERVIEW_SKUS){const expected=sales.filter(r=>r.sku===sku&&r.week===point.week).reduce((a,r)=>a+r.sold-r.returns,0);assert.equal(point[sku],expected);}}
 assert.equal(s.weekly.reduce((a,r)=>a+r['DEMO-101'],0),1940);
 assert.equal(s.weekly.reduce((a,r)=>a+r['DEMO-201'],0),1211);
 assert.equal(s.weekly.reduce((a,r)=>a+r['DEMO-301'],0),736);
});
test('historical forecasts and unselected products do not influence the companion baseline',()=>{
 const before=interviewSnapshot(sales,master);
 assert.deepEqual(interviewSnapshot(sales.map(r=>({...r,forecast:999999})),master),before);
 assert.deepEqual(interviewSnapshot(sales.filter(r=>INTERVIEW_SKUS.some(sku=>sku===r.sku)),master),before);
 assert.equal(SHEETS_MODEL_URL,'https://docs.google.com/spreadsheets/d/10MVAME7TsKFh4tENS7ADAFivd3vb1zxxKWNXR0iFw1g/edit');
});
test('incomplete or duplicate selected source facts cannot publish plausible KPI totals',()=>{
 assert.throws(()=>interviewSnapshot(sales.filter(r=>r.id!=='DEMO-101-0-20'),master),/Incomplete/);
 assert.throws(()=>interviewSnapshot([...sales,sales[0]],master),/Duplicate/);
});
