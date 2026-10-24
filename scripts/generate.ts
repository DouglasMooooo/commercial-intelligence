import fs from 'node:fs';
import {master,sales,warehouse,SEED} from '../lib/data';
fs.mkdirSync('public/data',{recursive:true});
fs.writeFileSync('public/data/retail.json',JSON.stringify({seed:SEED,master,sales}));
fs.writeFileSync('public/data/warehouse.json',JSON.stringify(warehouse));
const fields=Object.keys(sales[0]) as (keyof typeof sales[number])[];
fs.writeFileSync('public/data/synthetic-sales.csv',[fields.join(','),...sales.map(r=>fields.map(k=>JSON.stringify(r[k])).join(','))].join('\n'));
console.log(`Generated ${sales.length} unique weekly SKU/location facts, 24 SKUs, 20 weeks. Seed ${SEED}.`);
