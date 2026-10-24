export const categories = ['Stationery','Gifting','Lifestyle','Accessories'] as const;
export type Category = typeof categories[number];
export interface SKU { sku:string; product:string; category:Category; price:number; cost:number; leadTime:number; pack:number; }
export interface Sale { id:string; date:string; week:number; sku:string; product:string; category:Category; channel:string; store:string; sold:number; returns:number; price:number; actualPrice:number; cost:number; revenue:number; cogs:number; profit:number; beginning:number; receipts:number; closing:number; onOrder:number; leadTime:number; forecast:number; promotion:boolean; markdown:boolean; }
export interface Scenario { uplift:number; promo:number; markdown:number; markdownResponse:number; incomingWithinHorizon:boolean; leadDelta:number; cover:number; safety:number; }
export const baseScenario:Scenario = {uplift:0,promo:0,markdown:0,markdownResponse:.8,incomingWithinHorizon:false,leadDelta:0,cover:4,safety:1};
export interface Filters {category:string; sku:string; channel:string; from:number; to:number;}
export const defaultFilters:Filters = {category:'All',sku:'All',channel:'All',from:1,to:20};
export interface WarehouseRecord { source:'ERP'|'WMS'|'Stocktake'; sku:string; serial:string; reference:string; status:string; quantity:number; timestamp:string; }
export interface Movement { serial:string; reference:string; date:string; event:string; quantity:number; }
export type ExceptionKind = 'Duplicate record'|'Missing movement'|'Item mapping'|'Status conflict'|'Balance discrepancy'|'Timing discrepancy';
export interface Exception { id:string; serial:string; sku:string; kind:ExceptionKind; cause:string; action:string; owner:string; classification:'Unresolved exception'|'Pending system update'; evidence:WarehouseRecord[]; }
