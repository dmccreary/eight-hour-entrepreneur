---
title: "Distribution Channel Map"
description: "Learners compare distribution channels by plotting channel cost against channel reach, analyzing the tradeoff to judge which channels best fit an early-stage venture with limited resources."
status: scaffold
library: Chart.js
bloom_level: Analyze (L4)
---

# Distribution Channel Map



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 13: Distribution & Go-to-Market Channels](../../chapters/13-distribution-go-to-market/index.md).

```text
Type: chart
**sim-id:** distribution-channel-map<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: compare

Learning objective: Learners compare distribution channels by plotting channel cost against channel reach, analyzing the tradeoff to judge which channels best fit an early-stage venture with limited resources.

Chart type: Scatter plot

Purpose: Show the cost-versus-reach tradeoff across the 7 distribution channels introduced in this chapter, so learners can visually compare options rather than just reading a list.

X-axis: Channel Cost (relative scale, 1 = very low cost, 10 = high cost)
Y-axis: Channel Reach (relative scale, 1 = very narrow reach, 10 = very wide reach)

Data points (channel: cost, reach):

- Word of Mouth: (1, 3)
- Referral Channel: (2, 4)
- Direct Sales Channel: (3, 2)
- In-Person Distribution: (3, 2)
- Partnership Channel: (3, 5)
- Social Media Channel: (2, 6)
- Online Distribution: (5, 7)
- Marketplace Channel: (6, 8)

Title: "Distribution Channels: Cost vs. Reach"
Legend: none needed (single series, labeled points)

Interactivity (REQUIRED — minimum bar):

- Hovering any point shows a tooltip with the channel name, its one-sentence definition from this chapter, and its (cost, reach) values
- Clicking a point highlights it and displays a short "best for" note beneath the chart (e.g., Word of Mouth: "Best for an early-stage venture with a small, tight-knit target customer group")

Annotations: A shaded lower-left quadrant labeled "Best fit for early-stage, low-capital ventures" (low cost, moderate reach)

Color scheme: Indigo (#3F51B5) points, fox-orange (#E8791A) highlight on click, cream background consistent with the book's palette.

Implementation notes: Use Chart.js scatter chart type with a custom tooltip callback pulling from a data array of `{channel, cost, reach, definition, bestFor}` objects. Must remain fully readable and interactive on narrow (mobile) viewports — enable pinch/scroll or provide a "tap for details" fallback since hover doesn't exist on touch.
```

## Related Resources

- [Chapter 13: Distribution & Go-to-Market Channels](../../chapters/13-distribution-go-to-market/index.md)
