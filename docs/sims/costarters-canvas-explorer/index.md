---
title: "CO.STARTERS Canvas Explorer"
description: "Learners can explain the guiding question each of the 11 CO.STARTERS Canvas blocks answers, and locate an example answer for each, by clicking through the full canvas layout."
status: scaffold
library: p5.js
bloom_level: Understand (L2)
---

# CO.STARTERS Canvas Explorer



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 3: The CO.STARTERS Canvas Framework](../../chapters/03-costarters-canvas-framework/index.md).

```text
Type: infographic
**sim-id:** costarters-canvas-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Learners can explain the guiding question each of the 11 CO.STARTERS Canvas blocks answers, and locate an example answer for each, by clicking through the full canvas layout.

Instructional Rationale: Understand-level objective, so the sim uses a static, clickable layout with a concrete worked example (Jordan's canvas) rather than animation — the learner needs to see the fixed structure of the page and read real data in each block, not watch motion.

Canvas layout:

- Full-width grid mimicking the physical CO.STARTERS Canvas sheet: top row "Customer" and "Problem" (wide); second row "Solution," "Alternatives," "Benefit," "Advantage" (four even columns); third row "Message," "Distribution," "Revenue" (three even columns); bottom row "Startup Needs" and "Costs" (two even columns)
- Each of the 11 blocks rendered as a labeled rounded rectangle in the mascot's indigo accent color
- A detail panel below the grid that updates when a block is clicked

Data Visibility Requirements:

  Each block, when clicked, shows in the detail panel: (1) the block's guiding question, (2) a one-sentence definition, (3) Jordan's example answer from the chapter's worked-example table, (4) which later chapter covers this block in depth (e.g., "Explored in depth in Chapter 4")

Interactive controls:

- Click any of the 11 blocks to select it (default: no block selected, panel reads "Click any block to explore it")
- Selected block is outlined in fox-orange (#E8791A); all others remain indigo
- "Show All Answers" toggle button that, when on, displays Jordan's short answer directly inside each block on the grid itself (a compact view of the full worked-example table overlaid on the canvas shape)

Visual style: Flat, clean rectangles with rounded corners matching the physical canvas layout proportions; generous spacing so block labels remain legible on narrow viewports.

Color scheme: Indigo (#3F51B5) for unselected blocks, fox-orange (#E8791A) outline for the selected block, cream background consistent with the book's mascot palette.

Default parameters: No block selected on load; "Show All Answers" toggle off by default.

Implementation notes: Use p5.js. Store the 11 blocks as an array of objects `{label, question, definition, example, chapterRef}`. Must reflow to a single scrollable column of blocks (in canvas order) on narrow (mobile) viewports rather than compressing the grid to illegibility.
```

## Related Resources

- [Chapter 3: The CO.STARTERS Canvas Framework](../../chapters/03-costarters-canvas-framework/index.md)
