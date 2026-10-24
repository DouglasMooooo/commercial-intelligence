# Analytical engine audit

Audit scope: existing engine, reconciliation, fixed-seed generator, nine-sheet workbook and interview flows. No new application or external business data was introduced.

## Defects fixed

| Finding | Correction | Verification |
| --- | --- | --- |
| Repeated stocktake rows inflated the physical-count total | Group by normalised serial. Count an unambiguous quantity once; exclude conflicting count values and retain an ambiguity count | Exact and conflicting duplicate regression tests |
| Duplicate comparison kept only the first row and could conceal conflicting evidence | Compare all retained rows; duplicate findings do not suppress quantity, SKU or status findings | Conflicting duplicate regression test |
| ERP/WMS transaction references could disagree while the serial was considered aligned | Compare ERP/WMS reference sets; stocktake references remain independently scoped | Reference mismatch regression test |
| Raw status whitespace could create a false conflict | Trim statuses before case-insensitive comparison | Status normalisation regression test |
| KPI and planner entry points could double-count duplicate facts | Validate unique transaction IDs and SKU/location/channel/week grain and reject conflicting facts | Duplicate input tests |
| Nonfinite financial values could propagate plausible-looking outputs | Validate input quantities and financial identities before aggregation | Invalid financial-value regression test |
| Individually balanced rows could still break the next week's opening stock | Validate consecutive SKU/location snapshots at the calculation boundary; add a native Excel continuity check | Stock continuity regression test and workbook zero-difference control |
| Unknown SKU mappings or invalid packs could be silently excluded from a proposal | Reject unknown master mappings, duplicate master keys and nonpositive or fractional packs | Master and pack boundary regression test |
| Missing recent weeks or final-location snapshots could support a misleading order | Label incomplete data; withhold order proposals and lower confidence | Missing-week and snapshot regression tests |
| Less than eight weeks could produce an apparently comparable growth rate | Require two complete four-week windows; otherwise show N/A | Short-history regression test |
| Fewer than four recent weeks could still receive Higher confidence | Explicit Limited history state, irrespective of a small observed WAPE | Short-history regression test |
| Web scenario bounds differed from the documented workbook controls | Align demand, promotion, markdown, response, lead, target and safety bounds; allow demand to reach zero | Bounds and zero-demand tests |
| UI methodology described forward demand as a sum rather than an average | Correct the explanation to average weekly aggregated demand | Methodology review |

## Modelling simplifications, not reported as measured defects

- Four-week rolling average, launch estimate and two-point inventory average are transparent baselines. Historical forecasts are generated before their matching actuals; no future-data leakage was found.
- Sales are observed, not unconstrained demand. Stockouts censor demand; a positive safety-stock policy does not correct that bias.
- Returns reverse same-week revenue/COGS and become saleable stock. This is a stated simulation convention, not an employer accounting policy.
- Sell-through is net units / (period opening + receipts). Turnover is period COGS / average opening and closing inventory at cost, not annualised. Stock snapshots are taken once per SKU/location, not summed across time. Incomplete observations make the period ratios unavailable.
- Cost-based OTB sums category-level receipt floors. Projected closing retains excess stock. Committed orders reduce available purchase budget; they are not silently added to opening stock.
- Incoming receipt timing was previously assumed within the four-week sales horizon. It is now an explicit opt-in assumption, with a conservative default and visible fulfilment bounds. Longer-term proposals still credit the open-order quantity and therefore require receipt-date validation.
- Markdown response was fixed at 0.8 and disclosed as hypothetical. It is now configurable, retains the same default response, and is explicitly not measured elasticity. The commercial comparison warns when additional fulfilled units do not restore gross profit.
- Application risk confidence uses recent WAPE; workbook WAPE uses the full twenty-week history. Both use source-grain absolute errors; the distinction is labelled and documented.
- Reconciliation compares synthetic snapshots with a short transaction history. It is not a full event-sourced ledger, automated correction tool or proof of stock loss. Review states and audit notes remain session-local.

## Interview usability

Existing navigation and visual design are retained. Added a global Reset Demo, two direct scenario shortcuts, actual-number replenishment explanations, a baseline/scenario commercial table, receipt uncertainty, Excel skills and a six-step retail-first walkthrough. The reconciliation case remains available as an optional supporting example.

See VALIDATION.md for actual test results and deployment status. See docs/interview-demo.md for the English support pack.
