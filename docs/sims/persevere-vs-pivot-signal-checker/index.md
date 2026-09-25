---
title: "Persevere vs Pivot Signal Checker"
description: "Given a set of validation evidence signals for a venture scenario, learners evaluate the pattern and justify whether it supports a persevere decision, a pivot decision, or a kill decision (from Chapter 10)."
status: scaffold
library: p5.js
bloom_level: Evaluate (L5)
---

# Persevere vs Pivot Signal Checker



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 11: Interpreting Validation Evidence](../../chapters/11-interpreting-validation-evidence/index.md).

```text
Type: microsim
**sim-id:** persevere-vs-pivot-signal-checker<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: Given a set of validation evidence signals for a venture scenario, learners evaluate the pattern and justify whether it supports a persevere decision, a pivot decision, or a kill decision (from Chapter 10).

Canvas layout:

- Three toggle switches, each labeled with a signal: "Problem Validated?", "Solution Got Payment Signals?", "Customer Definition Confirmed?"
- A result panel below that updates live as toggles change

Behavior (decision logic driving the result panel):

  All three toggles ON: "Persevere — evidence supports the concept largely as designed."
  Problem ON, Solution OFF, Customer ON: "Pivot the Solution — keep the validated problem and customer, redesign the offer." (Priya's actual scenario)
  Problem OFF, others any state: "Pivot the Problem — the customer may be real, but this isn't their priority pain. Revisit Chapter 5."
  All three toggles OFF: "Kill Decision — see Chapter 10. No part of the current concept has evidence behind it yet."
  Problem ON, Solution ON, Customer OFF: "Pivot the Customer — the offer works for somebody, but maybe not this target customer. Revisit Chapter 4."

Interactive controls:

- Click each toggle to switch it on/off independently
- Result panel text and color update immediately (green for persevere, fox-orange for pivot, gray for kill)
- "Load Priya's Evidence" button sets toggles to her actual scenario as a worked example

Default parameters: All toggles off on load, prompting "Set your evidence signals above."

Implementation notes: Use p5.js. Store the decision logic as a lookup based on the 3 boolean toggle states. Must remain fully readable and usable on narrow (mobile) viewports — stack toggles vertically above the result panel.
```

## Related Resources

- [Chapter 11: Interpreting Validation Evidence](../../chapters/11-interpreting-validation-evidence/index.md)
