'use client';

import Link from 'next/link';
import {ArrowUpRight,FileSpreadsheet,Layers3,ShieldCheck} from 'lucide-react';
import {CartesianGrid,Line,LineChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {SHEETS_MODEL_URL,type InterviewSnapshot} from '@/lib/interview-snapshot';
import styles from './PlanningSnapshot.module.css';

const integer=(n:number)=>new Intl.NumberFormat('en-AU',{maximumFractionDigits:0}).format(n);
const money=(n:number)=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(n);
const colors=['#21776b','#577eae','#ab7b35'];
const patterns=[undefined,'7 3','2 3'];

export default function PlanningSnapshot({snapshot}:{snapshot:InterviewSnapshot}){
 const [notebook,,cup]=snapshot.inventory;
 return <div className={styles.shell}>
  <div className={styles.disclaimer}><ShieldCheck size={14}/><strong>Synthetic Data — Demonstration Only</strong><span>Independent hypothetical retail planning simulation.</span></div>
  <main className={styles.page}>
   <header className={styles.header}><div className={styles.identity}><span className={styles.brand}><Layers3 size={21}/></span><div><p className={styles.eyebrow}>COMMERCIAL INTELLIGENCE</p><h1>Retail planning snapshot</h1><p className={styles.subtitle}>A visual companion to my Google Sheets analysis.</p></div></div><a className={styles.sheetsLink} href={SHEETS_MODEL_URL} target="_blank" rel="noopener noreferrer"><FileSpreadsheet size={18}/><span>View Google Sheets Planning Model</span><ArrowUpRight size={17}/></a></header>
   <div className={styles.scope}><span>WEEKS 1–20</span><span>3 SELECTED SKUS</span><span>ALL 4 LOCATIONS, INCLUDING ONLINE</span><span>AUD · EXCLUDING TAX</span><span>BASELINE · NOT LIVE-SYNCHRONISED</span></div>
   <div className={styles.problem}><p><span className={styles.stockoutDot}/><b>{notebook.product}</b> {notebook.stock===0?'is out of stock.':`has ${integer(notebook.stock)} units on hand.`}</p><p><span className={styles.excessDot}/><b>{cup.product}</b> has {cup.cover?.toFixed(1)??'N/A'} weeks of cover.</p></div>
   <section className={styles.kpis} aria-label="Selected-SKU performance">
    <div className={styles.kpi}><h2>Net Sales</h2><strong>{money(snapshot.sales)}</strong><p>20 weeks · three selected products</p></div>
    <div className={styles.kpi}><h2>Gross Margin</h2><strong>{snapshot.margin===null?'N/A':`${(snapshot.margin*100).toFixed(1)}%`}</strong><p>Gross profit {money(snapshot.profit)}</p></div>
    <div className={styles.kpi}><h2>SKUs at Risk</h2><strong>{snapshot.atRisk}<small> / {snapshot.inventory.length}</small></strong><p>{snapshot.inventory.filter(p=>p.risk==='Stockout risk').length} stockout risk · {snapshot.inventory.filter(p=>p.risk==='Excess').length} excess stock</p></div>
   </section>
   <section className={styles.panel} aria-labelledby="weekly-sales-title"><div className={styles.panelHeader}><div><h2 id="weekly-sales-title">Weekly sales by SKU</h2><p>Net units sold · units sold less returns · all locations</p></div><div className={styles.legend}>{snapshot.inventory.map((p,i)=><span key={p.sku}><i style={{borderColor:colors[i],borderTopStyle:i===0?'solid':i===1?'dashed':'dotted'}}/>{p.product}</span>)}</div></div>
    <div className={styles.chart}><ResponsiveContainer width="100%" height="100%" minWidth={0}><LineChart data={snapshot.weekly} margin={{top:8,right:20,bottom:0,left:0}} accessibilityLayer><CartesianGrid stroke="#e8eeea" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="week" tickFormatter={v=>`W${v}`} axisLine={false} tickLine={false} tick={{fontSize:11}} minTickGap={22}/><YAxis axisLine={false} tickLine={false} width={42} tick={{fontSize:11}}/><Tooltip labelFormatter={v=>`Week ${v}`} formatter={(v)=>`${integer(Number(v))} net units`} contentStyle={{fontSize:12,borderRadius:6,borderColor:'#dce5df'}}/>{snapshot.inventory.map((p,i)=><Line key={p.sku} dataKey={p.sku} name={p.product} type="linear" stroke={colors[i]} strokeDasharray={patterns[i]} strokeWidth={2.5} dot={false} activeDot={{r:4}} isAnimationActive={false}/>)}</LineChart></ResponsiveContainer></div>
   </section>
   <section className={styles.panel} aria-labelledby="inventory-title"><div className={styles.panelHeader}><div><h2 id="inventory-title">Inventory overview</h2><p>Week 20 closing stock · recent four-week demand · baseline proposals</p></div><span className={styles.tableNote}>Review calculations in Google Sheets</span></div>
    <div className={styles.tableWrap}><table className={styles.inventory}><thead><tr><th>Product</th><th>Week 20 stock</th><th>Demand / week</th><th>Weeks of cover</th><th>Inventory risk</th><th>Existing on-order</th><th>Replenishment proposal</th></tr></thead><tbody>{snapshot.inventory.map(p=><tr key={p.sku}><td><b>{p.product}</b><small>{p.sku}</small></td><td>{integer(p.stock)}<small>units</small></td><td>{p.demand.toFixed(2)}<small>net units</small></td><td>{p.cover===null?'N/A':p.cover.toFixed(1)}</td><td><span className={`${styles.risk} ${p.risk==='Stockout risk'?styles.stockout:p.risk==='Excess'?styles.excess:styles.balanced}`}>{p.risk}</span></td><td>{integer(p.onOrder)}<small>open PO units</small></td><td><strong className={styles.proposal}>{integer(p.proposal)}</strong><small>proposed units</small></td></tr>)}</tbody></table></div>
    <p className={styles.inventoryNote}>Open orders already exist. Replenishment proposals are additional units to review, not existing purchase orders. Incoming delivery dates are unconfirmed.</p>
   </section>
   <div className={styles.footnotes}><p><b>Google Sheets is the primary interview model.</b> This page shares its synthetic dataset and agreed baseline; it is not live-synchronised. Change assumptions in the spreadsheet.</p><details className={styles.basis}><summary>Calculation basis</summary><p>Net sales and gross profit use the full 20 weeks for these three SKUs across all four locations. Gross margin = gross profit / net sales. Current stock and existing on-order units use Week 20 only.</p><p>Recent sales velocity = each store’s net units in Weeks 17–20 / 4, summed to SKU level. The historical store forecast is a separate prior-period forecast; it is not used as recent velocity. Cover = current stock / aggregated weekly demand.</p><p>Baseline: demand uplift 0%, target cover 4 weeks, safety cover 1 week. Replenishment = max(0, weekly demand × (supplier lead + target + safety) − current stock − existing on-order), rounded up to supplier packs of 6. Stockout risk means cover below supplier lead time. Excess means cover above lead + target + safety + 4 review weeks, matching the spreadsheet policy.</p><p>Baseline and source rows verified against the Google Sheets model on 26 October 2026. The spreadsheet is maintained separately; this page does not read subsequent spreadsheet edits.</p></details><Link className={styles.advancedLink} href="/advanced">Extended portfolio — optional</Link></div>
  </main>
 </div>;
}
