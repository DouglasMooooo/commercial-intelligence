# Interview demonstration notes

27 October 2026. Prepared for a Planning Analyst interview with Amy Terry and Tara Bartlett, Category Planners. This is an independent portfolio, not a commissioned or official Cotton On Group project.

**Synthetic Data — Demonstration Only**

Retail: Independent hypothetical retail planning simulation.
Reconciliation: Based on professional inventory reconciliation methods; synthetic demonstration data.

## Natural 20-second introduction

“I have built a short retail planning simulation using entirely synthetic data. It connects sales evidence, stock availability and Excel modelling to a commercial decision. Would you like to see a three-minute example of how I would review a replenishment and markdown decision?”

## Three-minute walkthrough

Use **Reset Demo**, then **Start 3-minute walkthrough**. Next step navigates directly to the relevant product and scenario. The times below allow brief clicks and pauses. The sidebar retains the reconciliation case for optional follow-up.

### 0:00–0:25 — Business problem

“The question is where to invest stock budget. I want to protect sales without tying up too much inventory or sacrificing margin. This simulation has twenty weeks, twenty-four fictional products, three stores and online. The overview separates net sales, gross profit and inventory investment.”

### 0:25–0:55 — Sales and inventory evidence

“Orbit Notebook has been selling successfully but now has no stock. Its recent forecast error is high. Observed sales are constrained by availability, so I would not treat the rolling average as unconstrained customer demand. Lifestyle has the opposite issue: stock has accumulated while sales have declined.”

### 0:55–1:30 — Forecast and replenishment logic

“The baseline averages the last four observed weeks. Historical forecasts use earlier weeks only. Here weekly demand is thirty-five units, incoming is twenty-four, target cover is four weeks and safety is one week. Increasing supplier lead time from four to six weeks changes the pack-rounded order from 294 to 366 units. I can expand the actual calculation. These are proposals: I still need to validate demand and delivery dates.”

### 1:30–2:05 — Commercial implications

“For Lifestyle, a hypothetical twenty-percent markdown increases forecast fulfilled units from 860 to about 998 at the default response assumption. But gross profit falls from about $14,275 to $10,775. The extra units do not compensate for lower contribution. I can change the assumed response; this is not measured price elasticity. I would compare receipt pauses, transfers and a smaller targeted markdown before deciding.”

### 2:05–2:30 — Recommendation

“My recommendation is to verify the notebook's incoming orders and stockout-censored demand, then protect availability. For Lifestyle, pause unnecessary receipts and test a targeted option against margin. The financial plan uses cost-based open-to-buy, and keeps excess closing stock visible. Undated receipts are excluded from projected sales by default.”

### 2:30–3:00 — Excel validation

“The Excel model makes the reasoning reviewable. It has native SUMIFS, INDEX/MATCH, IFERROR and pack-rounded replenishment formulas. Change lead time, demand or target cover and recalculate; source totals and stock checks must still tie. My finance and inventory background helps me validate the inputs. I am keen to learn your category context, trading calendar and planning processes.”

## Five likely Category Planner follow-up questions

1. **How would you decide whether to place the order?** Validate available stock, reservations, incoming arrival dates and supplier constraints. Check demand lost during stockouts and compare transfers or expediting. The proposal is a review starting point, not an automatic purchase approval.
2. **How do forecasting, cover and safety stock work here?** Historical forecasts use up to four earlier weeks; the forward baseline averages up to four selected weeks. Cover is on-hand divided by weekly demand. Orders cover lead time plus target and safety weeks, less available and incoming stock, rounded up to packs. Zero demand gives N/A cover and zero orders; incomplete recent history withholds the proposal.
3. **What evidence supports the markdown uplift?** None beyond the explicit hypothetical assumption. Response 0.8 and markdown 20% imply demand uplift 16%. I would validate this with comparable promotions, availability, customer response, channel mix and incrementality. Higher unit sales alone are insufficient if gross profit falls.
4. **Which Excel skills can you demonstrate rather than simply list?** SUMIFS and SUMIF at a defined grain; INDEX/MATCH master-data lookups; rolling-demand calculations; IF/IFERROR for unavailable ratios and risk conditions; ROUNDUP for supplier packs; stock equations, WAPE, duplicate checks and cost-based financial bridges. I can change an assumption, trace dependent formulas and reconcile outputs. I have not claimed native PivotTables or Power Query connections in this file.
5. **How does your experience transfer, and why build this for an entry-level role?** My BF Suma work connects accounting, commercial operations and purchasing coordination. At FoxESS Australia I work with inventory records, ERP/WMS reconciliation, stocktakes, serial traceability and process improvement. These methods support reliable planning inputs. The portfolio makes my reasoning easy to challenge; I expect to learn retail assortment, seasonality and the team's planning systems rather than claim existing category-planning expertise.

## Excel skills and a short live verification

- Open the nine-sheet workbook and retain the default fixed cutoff, Week 20.
- Change **Assumptions B5** from 0 to 2. **Inventory Planning K2** changes from 294 to 366 units.
- Reset B5 to 0. Change **B6** from 4 to 6. K2 again becomes 366, because target cover adds two weeks of demand.
- Reset B6 to 4. Change **B2** to −100%. Demand and orders become zero; cover is N/A.
- Reset B2 to 0. Set **B4** to 20% and **B9** to 2. Notebook weekly demand becomes 49; price becomes $9.60. Restore B4 to 0 and B9 to 0.8.
- **B11** defaults to 0: exclude undated incoming from four-week fulfilled sales. Set to 1 to test the explicit all-arrives assumption. Notebook fulfilled units then rise from 0 to 24; urgent stockout classification does not disappear.
- Recalculate using Excel's Formulas → Calculate Now. Confirm the Data Quality Checks are zero (fact count is 1,920). Restore assumptions after demonstrating.

## Assumptions and limitations

All facts are deterministic synthetic data. Forecasts are a transparent baseline, not a sophisticated demand model. Sales may be stockout-censored, and promotions can distort recent averages. Markdown response is hypothetical and configurable from 0 to 2. Forecast quantities can be fractional; supplier orders are rounded to packs of six.

All on-hand is assumed saleable and available. There are no reservation, dated purchase-order or inter-store allocation records. Unconfirmed incoming is credited in longer-term order proposals but excluded from four-week sales by default. Supply bounds show the consequence of assuming none versus all arrives; neither promises arrival before a stockout.

Sales are at retail selling price; inventory, receipts and OTB are at cost. Gross profit excludes operating expenses and is not net profit. OTB is a simplified category plan, not cash flow or a purchase approval. Financial-plan sales are unconstrained; scenario fulfilled sales are supply-constrained. These are deliberately different outputs.

The reconciliation workflow retains evidence and separates physical observations, pending updates and unresolved exceptions. A system mismatch is never automatically a physical loss. Review notes are session-local and do not write to employer systems. No employer data, source code or measured business outcomes are included.

The application and Excel agree on baseline assumptions where comparable. Excel WAPE is full-period; application SKU confidence is recent-period and requires sufficient history. Formula-engine verification is documented in VALIDATION.md; native desktop Excel recalculation must not be claimed unless actually performed.
