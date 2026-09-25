---
title: "Symptom vs Root Cause Drill-Down"
description: 'Given a customer''s first-stated complaint, learners apply a repeated "why" technique, choosing at each step which underlying cause to pursue, to trace the symptom down to its root cause.'
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Symptom vs Root Cause Drill-Down



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: Defining the Real Problem](../../chapters/05-defining-the-real-problem/index.md).

```text
Type: microsim
**sim-id:** symptom-root-cause-drilldown<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: apply

Learning objective: Given a customer's first-stated complaint, learners apply a repeated "why" technique, choosing at each step which underlying cause to pursue, to trace the symptom down to its root cause.

Canvas layout:

- Top: the current complaint text in a card
- Below: 2-3 candidate "why" answers presented as clickable buttons
- A running vertical trail on the left showing each previously selected layer, top (symptom) to bottom (current depth)

Behavior: Start with Priya's complaint: "I don't have time to cook." Present 2 candidate answers to "Why not?": (a) "There aren't enough hours in the day" (a dead-end distractor that loops back to the same complaint if chosen — with feedback: "This restates the symptom rather than explaining it — try the other option"), (b) "My work schedule changes week to week" (correct path, advances). Continue for 2 more rounds along the correct path: "Why does that stop you cooking?" → "I can't commit to a weekly meal plan in advance" (advances) vs. a distractor "I don't like cooking" (feedback: "Priya's interviews didn't support this — stay with what she actually heard"). Final round reveals the root cause: "Rotating shifts make any pre-planned dinner routine unreliable" and labels it "Root Cause Found," contrasting it against the original symptom card still visible at the top.

Interactive controls:

- Click a candidate answer to advance or receive corrective feedback
- "Restart" button resets to the original symptom
- Trail on the left is clickable to jump back to any earlier layer

Default parameters: Starts at the top-level symptom, no layers selected.

Implementation notes: Use p5.js. Store the drill-down as a small tree structure `{text, children: [{text, correct, feedback}]}`. Must remain fully readable on narrow (mobile) viewports — stack the trail above the current card rather than beside it below 600px width.
```

## Related Resources

- [Chapter 5: Defining the Real Problem](../../chapters/05-defining-the-real-problem/index.md)
