---
title: "The Field Discovery Window Rhythm"
description: "Learners can explain what happens during each live session and each Field Discovery Window across the four-week course, and describe the relationship between the two (live instruction versus real-world testing)."
status: scaffold
library: vis-timeline
bloom_level: Understand (L2)
---

# The Field Discovery Window Rhythm



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Founder Mindset & the Cohort Learning Experience](../../chapters/02-founder-mindset-cohort/index.md).

```text
Type: timeline
**sim-id:** field-discovery-window-rhythm<br/>
**Library:** vis-timeline<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain

Learning objective: Learners can explain what happens during each live session and each Field Discovery Window across the four-week course, and describe the relationship between the two (live instruction versus real-world testing).

Instructional Rationale: This is an Understand-level objective, so the timeline uses click-to-reveal concrete detail panels rather than an animated countdown. A learner needs to see exactly what task belongs to each session and each window, not just watch time pass.

Time period covered: The 4-week, 8-hour course arc (Week 1 through Week 4)

Orientation: Horizontal timeline with 7 alternating entries: Session 1, FDW 1, Session 2, FDW 2, Session 3, FDW 3, Session 4

Data Visibility Requirements (shown in a detail panel when an entry is clicked):

  Session 1 (Week 1, live, 2 hrs): "Clarity: define your Customer and Problem canvas blocks."
  FDW 1 (Days 1-7): "Conduct at least 3 real customer discovery interviews."
  Session 2 (Week 2, live, 2 hrs): "Define Solution, Alternatives, and Benefit canvas blocks using interview findings."
  FDW 2 (Days 8-14): "Design and run one lean validation test (e.g., a pre-sale offer or manual service delivery)."
  Session 3 (Week 3, live, 2 hrs): "Define Advantage, Message, Distribution, and Revenue canvas blocks using test results."
  FDW 3 (Days 15-21): "Run a second, sharper validation test based on Session 3 feedback."
  Session 4 (Week 4, live, 2 hrs): "Mini Pitch + Commitments: present canvas, 30-day launch plan, and 2-minute pitch."

Visual style: Horizontal timeline with live sessions drawn as solid indigo blocks and Field Discovery Windows drawn as dashed, wider fox-orange segments (each window spans 7 days, visually longer than each 2-hour session block) so the reader can see at a glance that most of the course's real work happens between sessions, not during them.

Interactive features: Click any session or window entry to open a detail panel below the timeline showing that entry's concrete assignment (from the Data Visibility Requirements above). Hovering an entry shows a one-line tooltip preview before clicking.

Color coding: Indigo (#3F51B5) for live sessions, fox-orange (#E8791A) for Field Discovery Windows.

Implementation notes: Use the vis-timeline library. Represent each entry as a vis-timeline item with a `start`/`end` range so window widths render proportionally to their 7-day span versus each session's 2-hour span. Must remain readable on narrow (mobile) viewports — allow horizontal scroll with a visible scrollbar rather than compressing labels to illegibility.
```

## Related Resources

- [Chapter 2: Founder Mindset & the Cohort Learning Experience](../../chapters/02-founder-mindset-cohort/index.md)
