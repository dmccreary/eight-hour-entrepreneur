---
title: "Minimum Testable Iteration Decision Tree"
description: "Given a venture scenario, learners evaluate which lean-test principles (service before product, manual before automated, pre-selling before building) apply, and justify a resulting minimum testable iteration design."
status: scaffold
library: p5.js
bloom_level: Evaluate (L5)
---

# Minimum Testable Iteration Decision Tree



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 10: Lean Testing Fundamentals](../../chapters/10-lean-testing-fundamentals/index.md).

```text
Type: microsim
**sim-id:** minimum-testable-iteration-decision-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: Given a venture scenario, learners evaluate which lean-test principles (service before product, manual before automated, pre-selling before building) apply, and justify a resulting minimum testable iteration design.

Canvas layout:

- A vertical decision tree with 3 yes/no decision diamonds in sequence, each followed by a resulting design note
- A scenario selector at the top: "Jordan's grooming van" or "Priya's meal-prep subscription" (default: Jordan)

Decision sequence (for Jordan's scenario):

  Question 1: "Can this be delivered as a hands-on service before it's a packaged product?" → Yes selected: note reads "Apply Service Before Product: offer driveway grooming sessions yourself, not a grooming-van business plan." → No path shows generic fallback note: "Reconsider — most early ventures can find a service-first version."
  Question 2: "Can this be delivered by hand, without new software or equipment?" → Yes selected: note reads "Apply Manual Before Automated: book by text message, track appointments on paper."
  Question 3: "Can a customer pay something before the full offer exists?" → Yes selected: note reads "Apply Pre-Selling Before Building: collect a $10 deposit to hold a driveway slot this week."

Final panel: Combines all three selected notes into one sentence: "Jordan's minimum testable iteration: a manually booked, pre-paid, single driveway grooming session — no van, no app, no inventory."

Interactive controls:

- Click "Yes" or "No" at each decision diamond to advance and reveal that step's design note
- Scenario selector swaps in Priya's parallel decision path and final note: "A manually booked, pre-paid single meal delivered to one household this week — no kitchen lease, no subscription app."
- "Reset" button returns to the first question

Default parameters: Jordan's scenario selected; no decisions made yet.

Implementation notes: Use p5.js. Store each scenario's decision tree as an array of `{question, yesNote, noNote}` objects, indexed by scenario. Must reflow to a single-column vertical layout on narrow (mobile) viewports, which the tree shape already suits well.
```

## Related Resources

- [Chapter 10: Lean Testing Fundamentals](../../chapters/10-lean-testing-fundamentals/index.md)
