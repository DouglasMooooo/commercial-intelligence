# Commercial Intelligence: methodology

Synthetic Data — Demonstration Only.

Retail case: Independent hypothetical retail planning simulation.
Operations case: Based on professional inventory reconciliation methods; synthetic demonstration data.

## Data and reproducibility

`lib/data.ts` uses a seeded linear congruential generator (seed 24102026). It creates 24 fictional SKUs in Stationery, Gifting, Lifestyle and Accessories, three fictional stores and online, for 20 weeks from 4 May 2026. There are 1,920 weekly SKU/location facts. The Date field is the week-start date, not a claim of daily transactions. All amounts are AUD excluding tax. Source code and outputs contain no employer records. The application has no upload or employer data ingestion path.

Stock is rolled forward for each SKU/location. Sales cannot exceed available stock. Returns are assumed saleable, reverse that week's realised revenue and cost, and increase closing stock. Incoming stock at each cutoff is a snapshot, not a sum across history. Synthetic transaction IDs are unique at the fact grain.

## Financial and stock definitions

- Net units = gross units sold − returns.
- Net sales = net units × actual selling price.
- COGS = net units × unit cost.
- Gross profit = net sales − COGS. This excludes operating expenses and is not net profit.
- Gross margin = gross profit / net sales.
- Average selling price = net sales / net units.
- Closing stock = beginning + receipts + returns − gross units sold.
- Sell-through = period net units / (period beginning stock + period receipts).
- Inventory turnover = period COGS / average opening and closing inventory at cost. The result is for the selected period, not annualised. Two-point average inventory is a simplification.
- Inventory investment = final selected week's closing units × unit cost, summed once per SKU/location.
- Historical markdown rate = sum(gross units × (regular price − actual price)) / sum(gross units × regular price).

Undefined ratios return N/A rather than a misleading zero. Inputs must be finite and nonnegative where appropriate. Scenario demand change is bounded at −100% to +300%; markdown and promotion assumptions are separately bounded.

## Forecast and accuracy

Historical forecast for a SKU/location/week uses only the preceding up to four actual weeks. Week 1 uses a synthetic launch estimate. Forecasts are stored before that week's sale is generated. The forward baseline is the average net unit sales across the last up to four selected weeks. A short selection uses only the available weeks. All charts comparing historical forecast with actual use the same period and grain.

Variance = actual net units − forecast units. Positive means actual sales exceeded forecast; this is not automatically favourable if it caused availability problems. WAPE = sum(abs(actual − forecast)) / sum(actual), calculated at SKU/location/week grain. Zero total actual gives N/A. Aggregating first can hide offsetting errors, so the workbook includes an absolute-error helper at source grain. The Forecast & Variance sheet additionally shows weekly SKU aggregate variance for review. Workbook WAPE is full-period; the application SKU confidence uses the recent four weeks, explicitly labelled.

Observed sales are stockout-censored and can understate latent demand. A low observed forecast after repeated stockouts is not evidence that availability is safe. Validate demand using lost-sales signals, comparable products and store feedback before ordering.

## Replenishment and scenarios

Weekly scenario demand = baseline × (1 + underlying demand change) × (1 + promotional uplift) × (1 + configurable response × markdown).

The markdown demand response is configurable from 0 to 2 (default 0.8), explicitly hypothetical and not empirically measured price elasticity. Zero response produces no additional demand. The commercial comparison separates expected units, fulfilment, revenue, gross profit and gross margin, and warns when extra fulfilled units do not compensate for lost margin. Future price starts at regular price and is multiplied by (1 − scenario markdown). It does not silently compound the historical markdown.

Lead time = max(0, master lead time + scenario lead-time change).
Weeks of cover = latest on-hand / weekly scenario demand.
Order quantity = round up to a pack of 6: max(0, weekly demand × (lead + target cover + safety cover) − on-hand − incoming).

All on-hand is assumed available; reservations and transfer allocations are not modelled. Arrival dates are unknown. Incoming is deducted from the order proposal but not treated as immediately available for a lead-time stockout test. Four-week scenario revenue excludes undated incoming by default. A visible opt-in assumption includes it only for the horizon supply cap. Fulfilment bounds show min(on-hand, expected demand) and min(on-hand + incoming, expected demand); neither assumes an arrival date or receipt before a stockout. Proposed new orders are excluded from that revenue. Replenishment and four-week financial planning have different horizons and should not be treated as identical receipt budgets.

Stockout risk: on-hand cover < lead time. Excess risk: cover > target + lead + safety + 4 weeks. These are policy review triggers. Zero demand returns unavailable cover and needs a manual no-demand review.

## Open-to-buy

For each category, planned COGS = four-week unconstrained demand × cost. Target closing inventory = four weeks' demand × cost. Planned receipts = max(0, planned COGS + target closing − opening stock cost). OTB = planned receipts − committed incoming cost. All stock values and OTB are at cost; retail sales remain separately labelled. Negative OTB flags overcommitment for review, not automatic cancellation.

Projected closing = opening + planned receipts − planned COGS. When a category has excess opening stock and receipts floor at zero, projected closing remains above target. Category totals sum the category-level receipts floors, preserving the inventory bridge. There is no fictional write-off to force stock to target.

## Action centre and judgement

Urgent stockouts appear first, then estimated monetary exposure. Stockout exposure = max(0, demand × lead − on-hand) × positive unit contribution. This is a gross-profit exposure estimate assuming no timely incoming, not a promise of recoverable sales. Excess exposure = max(0, on-hand − demand × (target + lead + safety)) × cost, triggered only above the policy excess threshold. Higher confidence requires four complete recent weeks and WAPE below 25%; short history is labelled Limited history, and incomplete recent history, mismatched lead times or missing final snapshots withhold the order. A growth comparison requires two complete four-week windows; otherwise it is N/A. Retail calculation boundaries reject duplicate facts and invalid financial values. Incomplete period ratios are unavailable; confidence is diagnostic, not a calibrated probability. Inspect margin and evidence before acting.

The synthetic story includes declining underlying Lifestyle demand and accumulating receipts, a notebook constrained by stock and a supplier lead change at W17, a Gifting promotion in W12–14, and Lifestyle markdowns in W17–20. Rules derive recommendations from the facts and active scenario. No real employer results are claimed.

## Inventory reconciliation

Generic adapters normalise heterogeneous ERP, WMS and stocktake fields. Keys are trimmed and uppercased; invalid quantities, dates and missing identifiers fail validation. The workflow is Validate → Match → Investigate → Classify → Escalate / Correct → Verify.

Records are grouped by serial and compared using SKU and transaction reference. Repeated source/serial snapshots are duplicate findings; all evidence is retained and compared so conflicting duplicates cannot be hidden. ERP/WMS transaction-reference sets must agree; physical stocktake references are independently scoped. Exact duplicate counts are counted once; conflicting count quantities are excluded from the physical total and require investigation. Status whitespace and case are normalised. Rules identify missing source records, item-code disagreements, status conflicts, quantity discrepancies and snapshot gaps above eight hours. Transaction history provides investigation evidence rather than claiming a full event-sourced stock ledger.

Physical count establishes observed stock at its timestamp. ERP represents financial records; WMS represents operational availability. No source is universally authoritative. Fully aligned stock excludes every serial with any finding. Pending and unresolved counts are distinct serial counts and may overlap; do not add them. Review states and timestamped audit notes are local to the browser session, with no writeback or false verified closure. A system mismatch is never automatically a physical loss.

## Excel

Nine requested sheets include typed numbers, native formulas, SUMIFS, SUMIF, INDEX/MATCH lookups, IFERROR, conditional logic, pack rounding, filters, freeze panes and input/exception formatting. INDEX/MATCH is used for broad desktop Excel compatibility. No PivotTables or Power Query connections are claimed. Assumptions are editable in B2:B9 and B11; cutoff B10 is fixed at W20. B9 controls the assumed markdown response. B11 defaults to 0 (exclude undated incoming); 1 explicitly assumes arrival within the four-week fulfilment horizon. Recalculate in desktop Excel after editing. Source facts remain unchanged. The application uses interactive scenario state; workbook scenarios are independently editable and do not inherit browser filters or sliders.

The authored workbook is generated and recalculated using the bundled Artifact Tool. `scripts/workbook.ts` provides portable ExcelJS regeneration with native formulas and cached baseline outputs, and requests full recalculation on open. No external runtime or paid service is required to run the app. Formula values are checked against the TypeScript domain engine. Desktop Excel recalculation is a separate final user check when Excel is available.
