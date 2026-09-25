---
title: "Minimum Viable Offer Slider"
description: "Learners adjust an offer's scope using a slider and observe which features of a draft business idea are essential to the core offering versus removable, applying the concept of a minimum viable offer to a concrete example."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Minimum Viable Offer Slider



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 6: Designing the Solution & Initial Offer](../../chapters/06-designing-solution-offer/index.md).

```text
Type: microsim
**sim-id:** minimum-viable-offer-slider<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: apply

Learning objective: Learners adjust an offer's scope using a slider and observe which features of a draft business idea are essential to the core offering versus removable, applying the concept of a minimum viable offer to a concrete example.

Canvas layout:

- Top: a slider labeled "Offer Scope" ranging from 0 (bare minimum) to 100 (full imagined business)
- Below: a card showing Jordan's full imagined offer as a checklist of 8 features, each with a threshold value at which it appears/disappears as the slider moves
- Side panel: a running label reading "Minimum Viable Offer" (0-25), "Initial Offer" (26-50), "Established Offering" (51-100)

Feature list with scope thresholds (features become visible above their threshold):

- "Basic wash and brush-out" — threshold 0 (always visible, the essential core)
- "At the customer's home" — threshold 0 (always visible, the essential core)
- "Text-message booking" — threshold 10
- "Nail trim add-on" — threshold 30
- "Multiple dog breeds/sizes supported" — threshold 40
- "Online booking calendar" — threshold 55
- "Flea/tick treatment option" — threshold 65
- "Branded van and uniform" — threshold 85

Interactive controls:

- Drag the slider; features above the current threshold appear checked, features below fade to gray
- At scope values 0-25, panel displays: "This is a Minimum Viable Offer — just enough to test the core problem"
- Reset button returns slider to 0

Default parameters: Slider starts at 15 (showing "Basic wash and brush-out," "At the customer's home," and "Text-message booking" — Jordan's actual initial offer).

Implementation notes: Use p5.js. Store features as an array of objects `{label, threshold}`; render checklist by comparing each threshold to the current slider value. Must remain fully readable on narrow (mobile) viewports — stack the checklist below the slider.
```

## Related Resources

- [Chapter 6: Designing the Solution & Initial Offer](../../chapters/06-designing-solution-offer/index.md)
