# Interview speaking notes

Synthetic Data — Demonstration Only.
Retail: Independent hypothetical retail planning simulation.
Operations: Based on professional methods; synthetic demonstration data.

## 30-second introduction

My background combines business analytics, financial accounting and hands-on inventory operations. I have put together a short, independent retail planning simulation using entirely synthetic data. It shows how I would investigate sales and stock, challenge a forecast and turn the evidence into a commercial recommendation. Would you like me to walk you through it? It takes about three minutes.

## Three-minute walkthrough

### 0:00–0:30 — Business problem / Executive Overview

This independent simulation asks a commercial question: where should a planner invest limited stock budget? I built twenty weeks of synthetic sales for twenty-four products across stores and online. The focus is balancing availability, inventory exposure and gross margin. These are demonstration figures, not results from an employer or an official company project.

### 0:30–1:05 — Evidence / SKU performance

The action centre highlights a fast-selling notebook with cover below its supplier lead time. Lifestyle has weaker underlying demand and accumulating stock. The gifting spike is a temporary promotion, so I would not extrapolate it indefinitely. Here I can inspect the product's weekly sales, forecast error and stock equation. The notebook's observed sales are constrained by stock, so I would challenge the demand baseline before ordering.

### 1:05–1:40 — Analysis / Scenario & replenishment

My baseline is a four-week rolling average. Historical forecasts use only earlier observations. Replenishment covers lead time, target cover and safety stock, deducts on-hand and incoming stock, and rounds to a supplier pack. Adding two weeks of lead time increases the proposed order. I would confirm receipt timing and demand with the team because a mathematically correct order is only useful when its assumptions are credible.

### 1:40–2:10 — Financial implications / Financial plan

A markdown can accelerate demand but reduces unit margin. The response here is a hypothetical assumption, not a measured causal effect. Open-to-buy is on a cost basis: planned cost of sales plus target closing stock, less opening stock and committed orders. A negative value signals overcommitment for review. Excess stock remains visible when projected closing is above target.

### 2:10–2:40 — Reconciliation / Inventory Reconciliation

My warehouse experience taught me that a system difference is not proof of physical loss. This case normalises ERP, WMS and count records, matches serials and references, and surfaces duplicates, mappings and cutoff differences. Each exception retains source evidence, an investigation owner and a review trail. Corrections need verification before an exception is closed.

### 2:40–3:00 — Recommendation / Excel Model

I would validate incoming receipts, protect the bestseller, pause unnecessary Lifestyle orders and test a targeted markdown against margin. I would monitor forecast error and verify corrections. The Excel model makes my assumptions and calculations easy to review. I am keen to learn your planning systems, trading calendar and category context.

## Follow-up answers

1. **What business problem does the model address?** It allocates inventory investment between protecting availability and reducing excess, while showing gross-margin trade-offs. It supports review and prioritisation; purchase approvals remain a business decision.
2. **How did you clean and reconcile the data?** I validate identifiers, numeric quantities and dates, normalise field names and key casing, identify duplicate source/serial/reference combinations and compare SKU, status, quantity and snapshot cutoff evidence. I retain exceptions rather than silently overwriting them.
3. **How do you calculate Weeks of Cover and replenishment?** Cover is on-hand divided by forecast weekly demand. Orders fund lead time plus target and safety cover, deduct available and incoming stock, and round to packs. Zero demand produces N/A cover. Receipt dates, reserved stock and stockout-censored demand require review.
4. **How do forecast variance and margin influence recommendations?** Historical variance and WAPE compare matching forecast and actual periods. High error reduces confidence. Monetary exposure and urgency drive review priority; contribution margin helps decide whether a markdown or larger order is commercially justified.
5. **Why build this when applying for an entry-level role?** It demonstrates how I structure a problem and makes my reasoning easy to challenge. I expect to learn the team's systems, category context and processes. The model supports that learning and does not replace commercial experience.
6. **How does your warehouse experience transfer?** At FoxESS Australia I work with warehouse operations, ERP/WMS reconciliation, stocktakes, serial traceability and data quality. These methods help establish trustworthy stock positions. My BF Suma background adds accounting, purchasing coordination and cross-functional context. Retail adds customer demand, assortment and margin decisions that I am motivated to learn.

## Background and integrity

Master's in Business Analytics. Bachelor's in Management specialising in Financial Accounting. BF Suma Kenya: accounting, finance, commercial operations, purchasing coordination and cross-functional projects. FoxESS Australia: warehouse operations and inventory data quality methods. Experience with Excel, Power Query, Power BI, SQL, Python, ERP/WMS, process mapping and analytical modelling; designed a lightweight WMS prototype with validation, exceptions and audit trails. No measurable result is attributed to an actual employer. This is not a university assignment, an official Typo project or an implementation for Cotton On Group.
