# Validation record

Updated 26 October 2026, Australia/Sydney. All business data is synthetic and reproducible. The homepage is now a three-SKU visual companion; the prior extended application remains at `/advanced`.

## Selected-SKU companion verification

- Read the primary Google Sheets model without editing it. All 240 selected source facts match the existing repository generator across 5,760 fields, including Online and all returns.
- Read `ASSUMPTIONS`, `STORE FORECAST`, `SKU PLANNING`, `PO REGISTER`, `DASHBOARD` and `AUDIT CHECKS`, including the live formula basis. Baseline: uplift 0%, target cover 4 weeks, safety 1 week, four-week window ending Week 20.
- Independently computed net sales AUD 61,540.20, GP AUD 38,953.08, GM 63.29696686% and 2 SKUs at risk. Stock = 0 / 234 / 1,124; existing on-order = 24 / 72 / 96; replenishment proposals = 294 / 48 / 0. Cover = 0 / 4.65671642 / 37.15702479 weeks.
- Five added regression tests verify the totals, store-level demand aggregation, every point in the 20-week three-series net-units chart, separation from historical forecasts, exact Sheets link and rejection of incomplete/duplicate selected facts. All 34 tests pass.
- Local browser checks passed at 1366 × 900 and 390 × 844: visible disclaimer, KPI values, three distinguishable line series, all three inventory rows, correct primary Sheets link and contained horizontal inventory scrolling on mobile. No live-sync claim or spreadsheet write was introduced.
- The existing Vercel project and production alias are reused. This section records source alignment and local verification; verify the actual production URL after deploying the homepage.
- Production homepage verified anonymously on 26 October 2026 at https://commercial-intelligence-tau.vercel.app/: selected KPI values, all inventory rows, correct Sheets link, three named line series with 20 points each, and `/advanced` returning the original application. Existing downloads also pass the HTTP smoke check. Chart tooltips retain product names as well as net-unit values.

The checks below also cover the retained extended application, existing workbook and unchanged synthetic generator.

## Automated and workbook results

| Check | Actual result |
| --- | --- |
| Unit/regression tests | PASS — 34 tests, 0 failed |
| TypeScript `tsc --noEmit` | PASS — strict checking, no errors |
| ESLint | PASS — no errors or warnings |
| Next.js production build | PASS — compiled and statically prerendered `/` |
| Data generation | PASS — fixed seed 24102026, 1,920 unique weekly SKU/location facts, 24 SKUs, 20 weeks, 3 stores and online |
| XLSX generation | PASS — 9 requested sheets, 20,059 genuine native formulas |
| Saved XLSX verification | PASS — every formula retained and every cached result agrees with TypeScript expectations, tolerance 0.000001; no error cells |
| Recalculation in authoring engine | PASS — lead time, target cover, zero demand, markdown response and receipt assumption all recalculated |
| Portable ExcelJS regeneration | PASS — 0 numerical differences versus the recalculated shipped workbook |
| Workbook presentation | PASS — all nine sheet opening ranges rendered and reviewed; added assumption and fulfilment ranges separately reviewed and fitted |
| Native features | PASS — input validation, highlighted assumptions, numeric/date formats, filters, frozen headings and conditional formatting retained |
| HTTP/download smoke test | PASS — page, XLSX, retail JSON, warehouse JSON, CSV, methodology and interview notes all return 200 |
| Excel download byte verification | PASS — served XLSX SHA-256 equals the saved workbook |

The final code passed test, typecheck, lint and production build. Workbook verification was repeated after the final formatting update. `scripts/verify-workbook.py` checks the actual exported package using only the Python standard library; it does not perform formula recalculation.

### Tested boundaries and analytical corrections

Tests cover zero demand, zero actual denominator, empty selection, missing history, invalid and nonfinite inputs, negative quantities, duplicate transactions, duplicate master keys, unknown SKU mapping, stock equations, consecutive weekly stock continuity, snapshot/flow aggregation, deterministic generation, forecast lag, future-cutoff isolation, WAPE, cost-basis financial bridges, pack rounding, markdown sensitivity, margin trade-offs and supplier lead changes.

Reconciliation tests cover all six exception classes, heterogeneous adapters, exact duplicate stocktakes, conflicting duplicate evidence, ambiguous count totals, mismatched ERP/WMS references and trimmed case-insensitive status matching. No mismatch is automatically classified as physical loss.

Short history gets Limited history confidence. Missing recent observations or final stock snapshots withhold order proposals. Incomplete periods do not return plausible sell-through or turnover. `docs/engine-audit.md` distinguishes actual defects from modelling simplifications.

### Recalculated Excel controls

Each test started from the documented baseline unless the row specifies combined inputs. All changes were restored before saving the deliverable.

| Changed assumption | Observed dependent result |
| --- | --- |
| Lead-time change B5 = 2 | Notebook K2 order = 366 vs baseline 294 |
| Target cover B6 = 6 | Notebook K2 order = 366 vs baseline 294 |
| Demand change B2 = −100% | Demand and orders zero; cover N/A |
| Markdown B4 = 20% | Notebook M2 selling price = AUD 9.60 |
| Markdown B4 = 20%, response B9 = 2 | Notebook H2 weekly demand = 49 |
| Incoming assumption B11 = 1 | Notebook O2 fulfilled units = 24 vs baseline 0 |

The baseline Data Quality Checks are all zero differences: stock equations, duplicate transaction IDs, historical sales tie, historical GP tie, cost inventory bridge and consecutive stock continuity. Fact count is 1,920.

## Browser interaction results

Verified using the in-app browser, including a 1366 × 900 laptop viewport and the narrow responsive layout.

| Interaction | Observed result |
| --- | --- |
| Bestseller shortcut | Selects Orbit Notebook, lead +2 weeks and scenario tab directly |
| Calculation explanation | Displays 35 units/week × (6 + 4 + 1) − 0 on-hand − 24 incoming = 361 net need; rounds to pack 6 → 366 |
| Decision summary | Shows 294 → 366 units, lead 4 → 6 weeks, additional order cost about AUD 311, and undated incoming warning above the detailed planner |
| Receipt checkbox | Notebook fulfilment changes from 0 to 24; urgent cover and order proposal remain independent of the receipt horizon assumption |
| Demand −100% | Zero units and orders; N/A cover and fulfilled gross margin; Review no demand status |
| Lifestyle shortcut | Category Lifestyle, markdown 20%, response 0.8; fulfilled units 860 → 997.6, GP AUD 14,275.15 → AUD 10,775.41 |
| Markdown response | Setting response to zero removes the unit uplift; lower GP warning remains |
| Category/channel/week filters | Lifestyle + Online + W17–20 gives 24 facts and 309 net units |
| Product drilldown | Notebook selection shows the weekly sales/stock/forecast facts |
| Reconciliation search | SYN-00013 narrows to one finding and drilldown retains WMS quantity 2 against ERP/count quantity 1 |
| Review status | Investigating adds a timestamped audit entry |
| Reset Demo | Restores executive baseline, filters, scenarios, guide, queue search, selected exception, reviews and audit notes; queue returns to 21 findings and Open status |
| Guided walkthrough | All six stages navigate in the requested order and finish successfully in the production build |

The exhaustive interaction checks ran against the local application; the final production build was also browser-tested for its guide, filters, scenario summary and reset. Download smoke tests ran against the production server at localhost:3001.

## Baseline historical controls

Net sales: AUD 601,938.20. Gross profit: AUD 340,290.43. Net units: 28,176. Closing units: 12,174. Closing inventory investment: AUD 128,998.43. All are synthetic. Web cards round display values; Excel retains the underlying values.

Retail history has not been changed to manufacture improved outcomes. The scenario default now excludes undated incoming from four-week sales; this is an explicit conservative assumption change, separate from historical actuals. Financial-plan sales are unconstrained and are deliberately not equated with fulfilled scenario sales.

## Privacy and publication

No employer files or proprietary code were read or imported. Only the existing synthetic repository and development/runtime files were used. Retail and warehouse source downloads are generated from the fixed-seed synthetic definitions. The application has no upload path, employer connection, external database or telemetry.

Repository source and browser static bundles were checked for common secret patterns; no application secrets were found. Development dependencies and generated framework documentation are excluded from the source scan. No force push or unrelated work discard is used.

## Remaining limitations and deployment state

**Desktop Excel recalculation was not performed.** Formula recalculation was tested in the authoring engine and exported results were independently inspected. Open in desktop Excel, select automatic calculation and recalculate after editing; the exact checks are in README and docs/interview-demo.md. No native PivotTables or Power Query connections are claimed.

**Existing Vercel production project:** `douglas-mos-projects/commercial-intelligence`, alias https://commercial-intelligence-tau.vercel.app/. Vercel sign-in and the original production deployment succeeded on 25 October 2026. Reuse its linked project ID for the simplified homepage. Authentication and the actual deployed page must be rechecked when deploying; an existing alias alone does not prove a new version is live.

Observed sales may be stockout-censored, the markdown response is hypothetical, receipt dates are unknown and on-hand is assumed saleable. No expenses, taxes, cash-flow timing or inter-store allocations are modelled. The order is a review proposal, not a purchase approval. Reconciliation review/audit data is session-local and performs no external corrections.
