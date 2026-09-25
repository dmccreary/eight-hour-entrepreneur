---
title: "Two-Minute Pitch Structure and Timer"
description: "Learners apply a four-part structure to organize and time a two-minute founder pitch, using Jordan's example to see what content belongs in each segment."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Two-Minute Pitch Structure and Timer



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 17: "Pitching, Accountability & What Comes Next"](../../chapters/17-pitching-accountability-next-steps/index.md).

```text
Type: microsim
**sim-id:** two-minute-pitch-structure-timer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: apply

Learning objective: Learners apply a four-part structure to organize and time a two-minute founder pitch, using Jordan's example to see what content belongs in each segment.

Canvas layout:

- Top: four segment blocks in a row, each labeled with its name and time budget: "Problem (30s)," "Solution (30s)," "Evidence (40s)," "Ask (20s)"
- Below: a large countdown timer and a "Start Pitch Timer" button
- A detail panel showing the currently highlighted segment's content

Data Visibility Requirements:

  Problem segment: "Busy dog owners within 5 miles lose a half-day of income or personal time every grooming trip — the validated problem from Chapter 5."
  Solution segment: "Grooming that comes to their driveway — the minimum viable offer from Chapter 6."
  Evidence segment: "3 of 5 driveway sessions converted to paying customers; $40 price point validated in Chapter 14's price testing."
  Ask segment: "Looking for 2 more referrals this month, and feedback on expanding to weekend availability."

Behavior: Clicking "Start Pitch Timer" begins a 120-second countdown. As the timer crosses each segment's cumulative time boundary (30s, 60s, 100s, 120s), the corresponding segment block highlights in fox-orange and its content appears in the detail panel automatically, simulating the pacing of an actual two-minute pitch. Segments can also be clicked directly at any time, timer running or not, to preview their content.

Interactive controls:

- "Start Pitch Timer" / "Reset" buttons
- Each of the 4 segment blocks is clickable at any time to show its content in the detail panel
- "Load Jordan's Pitch" is the default and only scenario loaded (single worked example, kept focused)

Default parameters: Timer at 0:00, not running; no segment selected.

Implementation notes: Use p5.js with `millis()` to drive the countdown. Store segments as an array of `{label, seconds, cumulativeEnd, content}` objects. Must remain fully usable on narrow (mobile) viewports — stack the 4 segment blocks in a 2x2 grid rather than a single row below 600px width.
```

## Related Resources

- [Chapter 17: "Pitching, Accountability & What Comes Next"](../../chapters/17-pitching-accountability-next-steps/index.md)
