---
title: "30-Day Launch Roadmap Timeline"
description: "Learners can explain what each week of a 30-day launch roadmap accomplishes and how weekly milestones build toward launch readiness, using Jordan's plan as a concrete worked example."
status: scaffold
library: vis-timeline
bloom_level: Understand (L2)
---

# 30-Day Launch Roadmap Timeline



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 16: Building the 30-Day Launch Plan](../../chapters/16-thirty-day-launch-plan/index.md).

```text
Type: timeline
**sim-id:** thirty-day-launch-roadmap-timeline<br/>
**Library:** vis-timeline<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Learners can explain what each week of a 30-day launch roadmap accomplishes and how weekly milestones build toward launch readiness, using Jordan's plan as a concrete worked example.

Instructional Rationale: Understand-level objective, so the timeline uses click-to-reveal concrete detail panels rather than animation — the learner needs to see exactly what each week's milestone and target are, not watch time pass abstractly.

Time period covered: 30 days (4 weeks) immediately following course completion

Orientation: Horizontal timeline with 4 week-blocks

Data Visibility Requirements (shown in a detail panel when a week is clicked):

  Week 1: "What to sell: single wash-and-brush driveway session ($40). Who to sell to: 10 households within 5 miles. How to reach them: neighborhood app post plus word-of-mouth from 3 existing customers. Weekly Milestone: first 5 bookings confirmed. Weekly Target: 5 sessions completed."
  Week 2: "Add nail-trim add-on based on Chapter 6 offer design. Launch referral channel from Chapter 13. Weekly Milestone: first referred customer booked. Weekly Target: 8 sessions completed."
  Week 3: "Run price point test from Chapter 14 ($40 vs $45 groups). Weekly Milestone: price test evidence collected. Weekly Target: 10 sessions completed."
  Week 4: "Review cash flow awareness from Chapter 15 against startup budget. Weekly Milestone: launch readiness check passed. Weekly Target: 12 sessions completed."

Interactive controls: Click any week block to open its detail panel below the timeline. Hovering a week shows a one-line tooltip preview before clicking.

Visual style: Horizontal timeline with 4 equal-width week blocks in indigo (#3F51B5), each showing its weekly target number directly on the block; selected block outlined in fox-orange (#E8791A).

Color coding: Indigo blocks for all weeks; fox-orange outline for the currently selected week.

Implementation notes: Use the vis-timeline library with 4 equal-duration range items. Must remain readable on narrow (mobile) viewports — allow horizontal scroll with a visible scrollbar rather than compressing week labels to illegibility.
```

## Related Resources

- [Chapter 16: Building the 30-Day Launch Plan](../../chapters/16-thirty-day-launch-plan/index.md)
