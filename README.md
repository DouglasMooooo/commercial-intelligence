# Commercial Intelligence | Retail Planning & Inventory Analytics

## One-minute interview homepage

The [production homepage](https://commercial-intelligence-tau.vercel.app/) is a read-only visual companion to the [primary Google Sheets planning model](https://docs.google.com/spreadsheets/d/10MVAME7TsKFh4tENS7ADAFivd3vb1zxxKWNXR0iFw1g/edit). It shows only DEMO-101, DEMO-201 and DEMO-301: 20 weeks across all four locations, including Online, with Week 20 stock snapshots. It shares the same synthetic source and agreed baseline; it is **not live-synchronised**. Change assumptions in Google Sheets.

Verified on 26 October 2026: all 240 Sheets source rows (5,760 fields) match the existing generator. Calculated net sales are AUD 61,540.20, gross profit AUD 38,953.08 and gross margin 63.297%. Replenishment proposals are 294 / 48 / 0 units. Demand sums store-level Weeks 17–20 net-unit averages; it does not substitute historical store forecasts. Existing on-order quantities are 24 / 72 / 96, separate from proposals. The generator, source exports and original planning engine are unchanged.

10–15-second introduction: “This is a visual companion to my Google Sheets model. It highlights the same three products: one with a stockout risk, one balanced and one carrying excess stock.”

The original application remains at `/advanced`. The longer walkthrough, advanced scenarios, reconciliation and downloadable Excel described below belong to that optional extended portfolio; they are not the primary one-minute interview model.

**Synthetic Data — Demonstration Only.** English-only independent analytics portfolio for a retail planning interview. Retail case: **Independent hypothetical retail planning simulation.** Operations case: **Based on professional inventory reconciliation methods; synthetic demonstration data.** No employer inputs, records, credentials or internal code were used. No employer results are claimed. This is not an official Typo or Cotton On Group project.

## Run locally

Requires Node.js 20.9+ and pnpm. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm generate
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

Open http://localhost:3000. For development, use `pnpm dev`. A ready-to-use workbook and datasets are committed in `public/`; no database, environment variables, external APIs or paid services are needed. Use the lockfile for reproducible dependency versions. `pnpm workbook` rebuilds the Excel model with ExcelJS. Workbook scripts use the same spec and synthetic dataset as the app. Excel recalculates after assumption edits; browser scenario state is independent.

## Deploy to Vercel

Import this directory as the project root (or set it as Root Directory if importing the containing repository). Select Next.js, install with `pnpm install --frozen-lockfile`, build with `pnpm build`, and use the framework's default output settings. No environment variables are required. Alternatively, use these commands from the existing checkout:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm dlx vercel login
pnpm dlx vercel link
pnpm dlx vercel --prod
```

In the dashboard, import the existing GitHub repository `DouglasMooooo/commercial-intelligence`. For CLI linking, choose the correct personal Vercel scope and an existing Vercel project, or create a hosting project for this same repository. Use Next.js and root directory `./`. No secrets or environment variables are required. After the CLI reports success, verify the literal returned production URL with `node scripts/smoke.mjs https://YOUR-ACTUAL-DEPLOYMENT-URL` and browser-test Reset Demo, both scenario shortcuts, SKU filters, receipt assumptions, reconciliation drilldown and Excel download. Do not assume a deployment succeeded without a real URL and verification.

The existing Vercel production project is `douglas-mos-projects/commercial-intelligence`, linked locally through the ignored `.vercel/project.json`. Its production alias is https://commercial-intelligence-tau.vercel.app/. Deploy to this existing project; do not create a second hosting project. Verify the actual production page after every deployment. The application needs no environment variables or paid services.

## Included workflows

- Executive Overview: net sales, GP, margin, sell-through, turnover, investment, forecast comparison, category contribution and computed risks.
- Retail Planning Simulator: category/product/channel/week filters, SKU stock and forecast drilldown, demand/lead/markdown/cover/safety scenarios, pack-rounded replenishment, financial plan and evidence-linked actions.
- Inventory Reconciliation: searchable exception queue, six detection types, retained source evidence, serial transaction history, owners and session-local review/audit states. No mismatch is labelled a physical loss.
- Excel Model & Methodology: nine-sheet downloadable formula model, source CSV/JSON and explicit calculation assumptions.
- Guided Interview Walkthrough: six retail-first steps over three minutes, a 20-second introduction, direct scenario presets, Reset Demo and the English support pack in `docs/interview-demo.md`.

## Interview starting points

Use **Reset Demo** for a known baseline. **Bestseller · lead +2 weeks** selects Orbit Notebook and increases lead time from 4 to 6 weeks: 294 → 366 proposed units (72 additional units, AUD 311.04 additional order cost). Expand **How was this calculated?** for the actual demand, available stock, on-order quantity, lead, target, safety and pack arithmetic.

**Lifestyle · markdown comparison** selects the excess-stock category and a 20% markdown with assumed response 0.8. At the fixed baseline, forecast fulfilled units rise from 860 to 997.6, but GP falls from AUD 14,275.15 to AUD 10,775.41. The warning prompts comparison, not automatic discounting. Demand response is hypothetical and editable; no causal elasticity or measured employer result is claimed.

## Excel skills and verification

The workbook retains native SUMIFS/SUMIF, INDEX/MATCH, IF/IFERROR, ROUNDUP, rolling-demand and stock formulas. Editable assumptions B2:B9 and B11 are blue on amber; cutoff B10 is fixed. Numeric formats, filters, frozen headings and conditional formatting are included. No native PivotTables or Power Query connections are claimed.

In desktop Excel, use **Formulas → Calculation Options → Automatic**, then **Calculate Now** after editing. Keep the fixed Week 20 cutoff. Verify these independent changes, restoring each before the next:

| Assumption | Expected result |
| --- | --- |
| B5 lead-time change: 0 → 2 | Inventory Planning K2 order: 294 → 366 |
| B6 target cover: 4 → 6 | Inventory Planning K2 order: 294 → 366 |
| B2 demand change: 0 → −100% | Demand and orders zero; cover N/A |
| B4 markdown 20%, B9 response 2 | Notebook demand H2 = 49, price M2 = AUD 9.60 |
| B11 incoming: 0 → 1 | Notebook fulfilled units O2: 0 → 24; stockout classification remains |

Data Quality Checks must show zero differences (fact count is 1,920). Web scenario results agree with the workbook at default full-period filters; Excel WAPE is full-period while web SKU confidence uses recent history. Workbook scenario controls are independent of browser controls.

Reproduce and inspect the saved workbook, using Python 3 for the standard-library verification script:

```sh
pnpm workbook
pnpm exec tsx scripts/workbook-input.ts .verification/workbook-spec.json
python scripts/verify-workbook.py
```

This verifies actual exported formulas, cached values, input validation, filters and frozen headings. It does not itself recalculate formulas. The shipped workbook was additionally recalculated under several input changes in the authoring engine; native desktop Excel verification remains a documented limit. `pnpm workbook` provides portable ExcelJS regeneration and requests a full recalculation on open.

`docs/engine-audit.md` separates fixed defects from modelling simplifications. `docs/interview-demo.md` contains the three-minute speaking script and five Category Planner follow-up answers.

## Architecture

```text
app/                         Next.js App Router shell and responsive Tailwind/CSS styling
components/Portfolio.tsx      Client UI, filters, charts and session-local reviews
lib/types.ts                 Strictly typed entities and scenario bounds
lib/engine.ts                Pure calculations, aggregation, planning and cost-based OTB
lib/data.ts                  Fixed-seed synthetic retail and warehouse generators
lib/reconcile.ts             Generic source adapters, validation and exception detection
lib/workbook-spec.ts          Shared Excel sheet and formula specification
scripts/generate.ts          Reproduce JSON and CSV files
scripts/workbook.ts          Portable ExcelJS workbook regeneration
tests/                       Node test runner domain and workbook checks
public/                      Workbook, datasets, methodology and speaking notes
```

Next.js App Router, strict TypeScript, React, Tailwind CSS, Recharts and ExcelJS. Calculations run locally. No network data calls, analytics trackers, login, external database or upload ingestion. All warehouse serial and transaction identifiers are explicitly synthetic (`SYN-`, `SIM-`). The build can be hosted on the free Vercel tier subject to its account terms.

## Accuracy and limitations

The data grain is weekly SKU/location, not daily transactions. Snapshot inventory is never summed across time. Forecasts use earlier observations; no future actuals feed historical forecasts. Undefined ratios show N/A. Returns reverse revenue/COGS and return saleable stock. Planned financial receipts floor at zero by category; projected closing retains excess stock rather than forcing it to target. Cost and retail valuations are separate.

Observed sales can be stockout-censored; lead-time arrival dates, demand elasticity, allocation, tax, operating expenses and cash-flow timing are simplified. Undated incoming is excluded from four-week fulfilled sales by default. A clearly labelled opt-in assumption includes it; neither mode assumes arrival before an immediate stockout. Longer-term order proposals still credit open orders and require arrival-date validation. Orders are proposals requiring validation. Reconciliation is an investigation demonstration, not a production ERP integration; audit notes are session-local and no corrections are written to source systems.

Workbook uses native SUMIFS/SUMIF, INDEX/MATCH, IFERROR, conditional logic, stock and cover formulas, pack rounding, filters, freeze panes and conditional formatting. PivotTables and Power Query are deliberately not claimed. Formula validation and remaining native Excel verification limits are recorded in `VALIDATION.md`.

Read `public/methodology.md` for all definitions and `public/interview-script.md` for the presentation. The interface also explains the specialist metrics via labels and tooltips.
