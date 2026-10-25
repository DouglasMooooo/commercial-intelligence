import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Commercial Intelligence | Retail Planning Snapshot',description:'A three-product visual companion to the Google Sheets planning model. Synthetic Data — Demonstration Only.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
