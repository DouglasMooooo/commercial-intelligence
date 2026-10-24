import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Commercial Intelligence | Retail Planning & Inventory Analytics',description:'Independent retail planning simulation and inventory reconciliation portfolio. Synthetic Data — Demonstration Only.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
