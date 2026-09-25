---
title: "Competitive Landscape Map"
description: "Learners differentiate existing alternatives to a venture as the do-nothing alternative, a current workaround, an indirect competitor or substitute, or a direct competitor, by their directness in solving the same problem."
status: scaffold
library: p5.js
bloom_level: Analyze (L4)
---

# Competitive Landscape Map



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: Alternatives & the Competitive Landscape](../../chapters/07-alternatives-competitive-landscape/index.md).

```text
Type: diagram
**sim-id:** competitive-landscape-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: Learners differentiate existing alternatives to a venture as the do-nothing alternative, a current workaround, an indirect competitor or substitute, or a direct competitor, by their directness in solving the same problem.

Canvas layout:

- A horizontal spectrum line labeled "How directly does this solve the same problem?" running from "Costs nothing to keep choosing" (left) to "Looks just like your offer" (right)
- 5 nodes placed along the line, left to right: "Do-Nothing Alternative," "Current Workaround," "Substitute Solution," "Indirect Competitor," "Direct Competitor"
- A detail panel below showing the selected node's definition and Jordan's real example

Data Visibility Requirements:

  Do-Nothing Alternative selected: "Tolerating the problem unsolved. Jordan's example: the dog just doesn't get groomed this month."
  Current Workaround selected: "An informal, imperfect fix. Jordan's example: dry shampoo and at-home brushing."
  Substitute Solution selected: "Solves the underlying need differently. Jordan's example: a self-service dog wash station at the pet store."
  Indirect Competitor selected: "Solves the same problem, different approach. Jordan's example: a traditional storefront groomer requiring drop-off."
  Direct Competitor selected: "Same problem, same approach. Jordan's example: another mobile dog-grooming service in the area."

Interactive controls:

- Click any node to select it and update the detail panel (default: no node selected, prompt reads "Click a node to explore Jordan's competitive landscape")
- Selected node highlighted in fox-orange (#E8791A); others in indigo (#3F51B5)

Visual style: Simple horizontal spectrum line with 5 evenly spaced circular nodes; labels above each node, connecting line beneath.

Default parameters: No node selected on load.

Implementation notes: Use p5.js. Store the 5 nodes as an array of objects `{label, definition, example}` with fixed x-positions along the spectrum. Must reflow to a vertical spectrum (top to bottom) on narrow (mobile) viewports.
```

## Related Resources

- [Chapter 7: Alternatives & the Competitive Landscape](../../chapters/07-alternatives-competitive-landscape/index.md)
