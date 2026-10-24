# Commercial Intelligence | Retail Planning & Inventory Analytics

**Synthetic Data — Demonstration Only.** English-only independent analytics portfolio for a retail planning interview. Retail case: **Independent hypothetical retail planning simulation.** Operations case: **Based on professional methods; synthetic demonstration data.** No employer inputs, records, credentials or internal code were used. No employer results are claimed. This is not an official Typo or Cotton On Group project.

## Run locally

Requires Node.js 20.9+ and pnpm. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm generate
pnpm test
pnpm lint
pnpm build
pnpm start
```

Open http://localhost:3000. For development, use `pnpm dev`. A ready-to-use workbook and datasets are committed in `public/`; no database, environment variables, external APIs or paid services are needed. Use the lockfile for reproducible dependency versions. `pnpm workbook` rebuilds the Excel model with ExcelJS. Workbook scripts use the same spec and synthetic dataset as the app. Excel recalculates after assumption edits; browser scenario state is independent.

## Deploy to Vercel

Import this directory as the project root (or set it as Root Directory if importing the containing repository). Select Next.js, install with `pnpm install --frozen-lockfile`, build with `pnpm build`, and use the framework's default output settings. No environment variables are required. Alternatively, from an authenticated CLI run `vercel --prod` and verify the returned URL, workbook download, filters, scenario sliders and exception search. Do not assume a deployment succeeded without a real URL and verification.

No authenticated Vercel CLI environment was present during this build; no live Vercel URL is claimed. The application is production-built and can be run locally.

## Included workflows

- Executive Overview: net sales, GP, margin, sell-through, turnover, investment, forecast comparison, category contribution and computed risks.
- Retail Planning Simulator: category/product/channel/week filters, SKU stock and forecast drilldown, demand/lead/markdown/cover/safety scenarios, pack-rounded replenishment, financial plan and evidence-linked actions.
- Inventory Reconciliation: searchable exception queue, six detection types, retained source evidence, serial transaction history, owners and session-local review/audit states. No mismatch is labelled a physical loss.
- Excel Model & Methodology: nine-sheet downloadable formula model, source CSV/JSON and explicit calculation assumptions.
- Guided Interview Walkthrough: six linear steps over three minutes, speaking notes, introduction and six follow-up answers.

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

Observed sales can be stockout-censored; lead-time arrival dates, demand elasticity, allocation, tax, operating expenses and cash-flow timing are simplified. Incoming is assumed to arrive during the four-week revenue scenario but is not assumed to prevent an immediate stockout. Orders are proposals requiring validation. Reconciliation is an investigation demonstration, not a production ERP integration; audit notes are session-local and no corrections are written to source systems.

Workbook uses native SUMIFS/SUMIF, INDEX/MATCH, IFERROR, conditional logic, stock and cover formulas, pack rounding, filters, freeze panes and conditional formatting. PivotTables and Power Query are deliberately not claimed. Formula validation and remaining native Excel verification limits are recorded in `VALIDATION.md`.

Read `public/methodology.md` for all definitions and `public/interview-script.md` for the presentation. The interface also explains the specialist metrics via labels and tooltips.
