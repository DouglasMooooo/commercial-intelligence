# Validation record

Verified 25 October 2026 (Australia/Sydney). All inputs are generated synthetic demonstration data.

## Passed

- 15 Node domain tests: stock constraints and equations, forecast lag, zero actuals and empty periods, negative input rejection, pack rounding, explicit transaction deduplication, deterministic generation, unique fact grain, flow/snapshot reconciliation, scenario boundaries and sensitivity, markdown margin trade-off, all six reconciliation exception classes, heterogeneous adapters, short period baseline and category receipt floors.
- Strict TypeScript and ESLint: no errors or warnings.
- Next.js production build: successful, statically prerendered application page.
- 1,920 unique SKU/location/week facts, 24 SKUs, 20 weeks, three stores plus online. Every stock equation reconciles and each week's opening agrees with the previous close.
- Native workbook: 9 sheets and 18,042 formulas. All calculated formula values were independently compared against TypeScript-generated expected values with numeric tolerance 0.000001; zero differences. Export reopened with an independent XLSX reader. No cached Excel error values found.
- Workbook data-quality controls: stock equation, duplicate IDs, historical sales tie, historical gross-profit tie and cost inventory bridge all zero; fact count 1,920.
- Workbook scenario recalculation in the authoring engine: lead-time change +2 gives 366 units versus 294 baseline for Orbit Notebook. A 20% markdown gives price $9.60. Demand change −90% remains nonnegative. Assumptions restored before export.
- Rendered and reviewed all nine workbook sheets. Editable assumptions, native formulas, input bounds, filters, frozen header rows, number formats and conditional formatting included.
- Browser: executive charts, SKU filter and stock-history drilldown, lead-time slider, markdown slider, financial-plan output, exception search, source-evidence drilldown and review audit entry. Laptop and narrow responsive layouts reviewed. Guided demo and downloads checked separately in final smoke verification.
- Source and static output inspection: synthetic generator provenance; no employer data imports, credentials or external data dependencies. No upload endpoint, tracking or database.

## Baseline controls

Net sales AUD 601,938.20 (display rounded in application); net units 28,176; closing units 12,174. The workbook's category historical sales and gross-profit totals tie to source facts. Closing inventory investment is approximately AUD 128,998.43. Refer to the workbook for exact stored totals rather than rounding displayed cards.

## Verification limits

Desktop Microsoft Excel was not used for native-application recalculation. Formula evaluation was checked in the authoring engine and saved cached results were inspected independently; open in Excel and recalculate after editing assumptions. No PivotTables or Power Query connections are claimed.

Vercel authentication was not available in the checked CLI locations and no Vercel token was present. No deployment was attempted and no public deployment URL is claimed. The production application was verified locally. Follow README deployment instructions from an authenticated account.

This is a self-contained decision-support demonstration, not a production ERP connector. Review status and audit changes are browser-session local. Financial assumptions, receipt timing and demand response remain explicitly hypothetical.

