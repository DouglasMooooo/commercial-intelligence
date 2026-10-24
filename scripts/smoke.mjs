import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
const base=process.argv[2]??'http://localhost:3000';
for(const path of ['/','/commercial-planning.xlsx','/data/retail.json','/data/warehouse.json','/data/synthetic-sales.csv','/methodology.md','/interview-script.md']){
 const r=await fetch(base+path);assert.equal(r.status,200,path);const bytes=Buffer.from(await r.arrayBuffer());assert.ok(bytes.length>100,path);if(path==='/commercial-planning.xlsx'){assert.equal(bytes.subarray(0,2).toString(),'PK');const saved=await fs.readFile('public/commercial-planning.xlsx');assert.equal(createHash('sha256').update(bytes).digest('hex'),createHash('sha256').update(saved).digest('hex'));}console.log('PASS',path,bytes.length,'bytes');
}
