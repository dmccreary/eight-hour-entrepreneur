---
title: "Customer Definition Funnel"
description: "Learners can explain how a broad market narrows step by step into a target customer, ideal customer profile, and persona, and can locate a concrete example at each stage."
status: scaffold
library: p5.js
bloom_level: Understand (L2)
---

# Customer Definition Funnel



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: Customer Discovery & Segmentation](../../chapters/04-customer-discovery-segmentation/index.md).

```text
Type: diagram
**sim-id:** customer-definition-funnel<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Learners can explain how a broad market narrows step by step into a target customer, ideal customer profile, and persona, and can locate a concrete example at each stage.

Instructional Rationale: Understand-level objective, so the sim uses a step-through funnel with concrete worked data (Priya's narrowing) rather than continuous animation, letting the learner pause at each stage and read real values before advancing.

Canvas layout:

- A vertical funnel shape narrowing top to bottom, with 5 horizontal bands: "Broad Market" (widest, top), "Market Segment," "Niche Market," "Target Customer," "Ideal Customer Profile / Persona" (narrowest, bottom)
- A detail panel to the right (or below, on narrow viewports) showing the selected band's definition and Priya's example

Data Visibility Requirements:

  Broad Market selected: "Families who eat dinner."
  Market Segment selected: "Dual-income households with children under 10."
  Niche Market selected: "Dual-income households with children under 10 and unpredictable evening schedules."
  Target Customer selected: "Dual-income parents of children under 10, on rotating or unpredictable shift schedules, within Priya's metro delivery area."
  Ideal Customer Profile / Persona selected: "Dana, 34, ER nurse working rotating 12-hour shifts, two kids under 8, values 10 minutes saved more than variety."

Interactive controls:

- Click any band to select it and update the detail panel (default: "Broad Market" selected)
- "Narrow Next" and "Widen Back" buttons step through the funnel in order
- Selected band highlighted in fox-orange (#E8791A); other bands in indigo (#3F51B5)

Visual style: Clean funnel/trapezoid shape built from 5 stacked horizontal trapezoids, each narrower than the one above it, labeled inside each band.

Default parameters: "Broad Market" selected on load.

Implementation notes: Use p5.js. Store the 5 stages as an array of objects `{label, definition, example}`; render by index. Must reflow to a vertical stack of labeled stages with the detail panel below (not beside) on narrow (mobile) viewports.
```

## Related Resources

- [Chapter 4: Customer Discovery & Segmentation](../../chapters/04-customer-discovery-segmentation/index.md)
