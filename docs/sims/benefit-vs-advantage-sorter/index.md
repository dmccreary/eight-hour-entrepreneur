---
title: "Benefit vs Advantage Sorter"
description: "Given short value-proposition statements, learners classify each as a customer benefit statement (why the customer wants it) or a founder advantage statement (why this founder can deliver it), applying the chapter's definitions."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Benefit vs Advantage Sorter



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 8: "Value Proposition: Benefit & Advantage"](../../chapters/08-value-proposition-benefit-advantage/index.md).

```text
Type: microsim
**sim-id:** benefit-vs-advantage-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: classify

Learning objective: Given short value-proposition statements, learners classify each as a customer benefit statement (why the customer wants it) or a founder advantage statement (why this founder can deliver it), applying the chapter's definitions.

Canvas layout:

- Left side (70%): a stack of 6 statement cards, one at a time, each with two buttons below it: "Benefit" and "Advantage"
- Right side (30%): a running tally showing "Correct: N / 6" and a small feedback area

Statement cards (in order):

1. "No more forty-minute drives to a booked-solid groomer." (Correct answer: Benefit — describes what the customer gains)
2. "Three years as a veterinary tech means I already know how to handle anxious dogs safely." (Correct answer: Advantage — describes why this founder specifically)
3. "You'll feel like a more attentive pet owner without rearranging your whole week." (Correct answer: Benefit — an emotional and functional outcome for the customer)
4. "I already have the trust of a dozen neighbors after three successful driveway sessions." (Correct answer: Advantage — founder credibility, not customer outcome)
5. "Affordable, convenient grooming that comes to you." (Correct answer: Benefit — despite sounding like a pitch, it describes customer-side value)
6. "I live in the neighborhood, so I can respond same-day when regular groomers are booked out for weeks." (Correct answer: Advantage — a founder-specific circumstance)

Interactive controls:

- Click "Benefit" or "Advantage" under the current card
- Immediate feedback: correct answers flash green with a one-sentence explanation; incorrect answers flash amber with the correct classification and explanation
- "Next Card" button advances; after card 6, show final tally and a "Try Again" button that reshuffles card order

Default parameters: Card order as listed above on first load; shuffled on retry.

Behavior: No time pressure. Score persists only for the current session (no data saved). Progress bar across the top shows card 1 of 6 through 6 of 6.

Implementation notes: Use p5.js. Store the six statements as an array of objects `{text, correctAnswer, explanation}`. Must remain fully readable and clickable on narrow (mobile) viewports — stack the tally below the card stack rather than beside it below 600px width.
```

## Related Resources

- [Chapter 8: "Value Proposition: Benefit & Advantage"](../../chapters/08-value-proposition-benefit-advantage/index.md)
