---
title: "Break-Even Calculator"
description: "Learners adjust price, per-sale cost, and fixed monthly cost sliders and calculate how many sales are needed to reach break-even for a lean venture."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Break-Even Calculator



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 14: Revenue Models & Pricing](../../chapters/14-revenue-models-pricing/index.md).

```text
Type: microsim
**sim-id:** break-even-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning objective: Learners adjust price, per-sale cost, and fixed monthly cost sliders and calculate how many sales are needed to reach break-even for a lean venture.

Canvas layout:

- Three sliders, top to bottom: "Price per Sale" ($10-$100), "Cost per Sale" ($0-$50), "Fixed Monthly Costs" ($0-$500)
- Below: a live-updating result reading "Sales Needed to Break Even This Month: N"
- A simple bar showing current monthly sales (a 4th slider, "Sales This Month," 0-30) against the break-even line

Behavior: Break-even sales = Fixed Monthly Costs / (Price per Sale − Cost per Sale). Recalculate and redraw on every slider change. If Price per Sale ≤ Cost per Sale, display a warning message: "At this price, you can never break even — raise the price or lower the cost." The bar chart shows a red bar if "Sales This Month" is below the break-even number, green if at or above it.

Interactive controls:

- Drag any of the 4 sliders; all outputs update live
- "Load Jordan's Numbers" button sets Price=$40, Cost per Sale=$8, Fixed Monthly Costs=$120, Sales This Month=5

Default parameters: Price=$40, Cost per Sale=$8, Fixed Monthly Costs=$120, Sales This Month=0 (so the bar starts red, prompting exploration).

Implementation notes: Use p5.js. Recompute break-even on every `draw()` call from current slider values; guard the division against Price equal to Cost per Sale. Must remain fully usable on narrow (mobile) viewports — stack sliders vertically with the result and bar chart below.
```

## Related Resources

- [Chapter 14: Revenue Models & Pricing](../../chapters/14-revenue-models-pricing/index.md)
