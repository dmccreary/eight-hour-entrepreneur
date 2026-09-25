---
title: "Startup Needs Sorter"
description: "Given a list of items a founder is considering purchasing, learners classify each as a genuine one-time need or a want that can wait, applying the needs-vs-wants assessment to a concrete example."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Startup Needs Sorter



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 15: Startup Needs & Cost Planning](../../chapters/15-startup-needs-cost-planning/index.md).

```text
Type: microsim
**sim-id:** startup-needs-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: classify

Learning objective: Given a list of items a founder is considering purchasing, learners classify each as a genuine one-time need or a want that can wait, applying the needs-vs-wants assessment to a concrete example.

Canvas layout:

- Left side (70%): a stack of 6 item cards, one at a time, each with two buttons below it: "Genuine Need" and "Can Wait (Want)"
- Right side (30%): a running tally showing "Correct: N / 6" and a small feedback area

Item cards (Jordan's grooming-van scenario, in order):

1. "A basic grooming kit (clippers, brush, shampoo)." (Correct answer: Genuine Need — required to deliver even one driveway session)
2. "A custom-branded van wrap." (Correct answer: Want — the lean test doesn't require a van at all yet)
3. "Liability insurance covering in-home pet services." (Correct answer: Genuine Need — required before working in a stranger's driveway)
4. "A professional booking website with online payments." (Correct answer: Want — text-message booking from Chapter 6 works for the lean test)
5. "A local business license, if required in this area." (Correct answer: Genuine Need — an activity resource need required to operate legally)
6. "A second, backup set of premium clippers." (Correct answer: Want — one working set is enough to run the current lean test)

Interactive controls:

- Click "Genuine Need" or "Can Wait (Want)" under the current card
- Immediate feedback: correct answers flash green with a one-sentence explanation; incorrect answers flash amber with the correct classification and explanation
- "Next Card" button advances; after card 6, show final tally and a "Try Again" button that reshuffles card order

Default parameters: Card order as listed above on first load; shuffled on retry.

Behavior: No time pressure. Score persists only for the current session (no data saved). Progress bar across the top shows card 1 of 6 through 6 of 6.

Implementation notes: Use p5.js. Store the six items as an array of objects `{text, correctAnswer, explanation}`. Must remain fully readable and clickable on narrow (mobile) viewports — stack the tally below the card stack rather than beside it below 600px width.
```

## Related Resources

- [Chapter 15: Startup Needs & Cost Planning](../../chapters/15-startup-needs-cost-planning/index.md)
