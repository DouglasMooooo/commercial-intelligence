import type {WarehouseRecord,Exception,ExceptionKind} from './types';
// Generic heterogeneous source adapters. No external or employer file ingestion.
export const normaliseERP=(r:{item_code:string;serial_no:string;doc_no:string;state:string;qty:number;updated_at:string}):WarehouseRecord=>({source:'ERP',sku:r.item_code.trim().toUpperCase(),serial:r.serial_no.trim().toUpperCase(),reference:r.doc_no.trim().toUpperCase(),status:r.state.trim(),quantity:r.qty,timestamp:r.updated_at});
export const normaliseWMS=(r:{item:string;serial:string;ref:string;status:string;units:number;at:string}):WarehouseRecord=>({source:'WMS',sku:r.item.trim().toUpperCase(),serial:r.serial.trim().toUpperCase(),reference:r.ref.trim().toUpperCase(),status:r.status.trim(),quantity:r.units,timestamp:r.at});
export const normaliseCount=(r:{sku:string;tag:string;count_ref:string;count:number;at:string}):WarehouseRecord=>({source:'Stocktake',sku:r.sku.trim().toUpperCase(),serial:r.tag.trim().toUpperCase(),reference:r.count_ref.trim().toUpperCase(),status:'Available',quantity:r.count,timestamp:r.at});
export function reconcile(input:WarehouseRecord[]){
 const groups=new Map<string,WarehouseRecord[]>();
 for(const raw of input){
  if(!['ERP','WMS','Stocktake'].includes(raw.source)||!raw.serial.trim()||!raw.sku.trim()||!raw.reference.trim()||!raw.status.trim()||!Number.isFinite(raw.quantity)||raw.quantity<0||!Number.isFinite(Date.parse(raw.timestamp)))throw new Error('Invalid source record');
  const r={...raw,serial:raw.serial.trim().toUpperCase(),sku:raw.sku.trim().toUpperCase(),reference:raw.reference.trim().toUpperCase(),status:raw.status.trim()};
  groups.set(r.serial,[...(groups.get(r.serial)||[]),r]);
 }
 const exceptions:Exception[]=[];let confirmed=0,physical=0,ambiguousCounts=0;
 for(const [serial,all]of groups){
  const first=all[0];let hasIssue=false;
  const add=(kind:ExceptionKind,cause:string,action:string,owner:string,pending=false)=>{
   hasIssue=true;exceptions.push({id:`${serial}-${kind}`,serial,sku:first.sku,kind,cause,action,owner,classification:pending?'Pending system update':'Unresolved exception',evidence:all});
  };
  // All evidence is kept. A serialised snapshot must have one unambiguous row per source.
  const repeatedSource=['ERP','WMS','Stocktake'].some(source=>all.filter(r=>r.source===source).length>1);
  if(repeatedSource)add('Duplicate record','Repeated serial snapshot within a source; values may conflict','Validate row identity and snapshot scope before removing or selecting records','Data quality');
  const counts=all.filter(r=>r.source==='Stocktake');
  const countValues=new Set(counts.map(r=>r.quantity));
  if(countValues.size===1)physical+=counts[0].quantity;
  else if(countValues.size>1)ambiguousCounts++;
  if(new Set(all.map(r=>r.source)).size<3)add('Missing movement','A source has no matching serial record','Trace receipt and posting reference; confirm cutoff','Inventory control');
  else {
   const erp=new Set(all.filter(r=>r.source==='ERP').map(r=>r.reference));
   const wms=new Set(all.filter(r=>r.source==='WMS').map(r=>r.reference));
   if(erp.size!==wms.size||[...erp].some(ref=>!wms.has(ref)))add('Missing movement','ERP and WMS transaction references do not match','Trace posting references; a stocktake reference is independently scoped','Inventory control');
  }
  if(new Set(all.map(r=>r.sku)).size>1)add('Item mapping','One serial maps to multiple item codes','Validate item master and quarantine mapping for review','Master data');
  if(new Set(all.map(r=>r.status.toLowerCase())).size>1)add('Status conflict','Availability states disagree','Verify receipt status and posting queue','Operations',true);
  if(new Set(all.map(r=>r.quantity)).size>1)add('Balance discrepancy','Recorded quantities disagree with count or duplicate evidence','Recount and review transaction sequence; do not assume loss','Inventory control');
  const times=all.map(r=>Date.parse(r.timestamp));
  if(Math.max(...times)-Math.min(...times)>8*3600000)add('Timing discrepancy','Source snapshots are more than eight hours apart','Align reporting cutoff and rerun comparison','Systems support',true);
  if(!hasIssue)confirmed+=counts[0]?.quantity??0;
 }
 return {exceptions,confirmed,physical,ambiguousCounts,
  pending:new Set(exceptions.filter(e=>e.classification==='Pending system update').map(e=>e.serial)).size,
  unresolved:new Set(exceptions.filter(e=>e.classification==='Unresolved exception').map(e=>e.serial)).size};
}
