---
title: "Minimum Viable Offer Slider"
description: "Learners drag an Offer Scope slider to shrink or grow Jordan's mobile dog-grooming offer and see which features are the essential core and which are removable add-ons."
image: /sims/minimum-viable-offer-slider/minimum-viable-offer-slider.png
og:image: /sims/minimum-viable-offer-slider/minimum-viable-offer-slider.png
twitter:image: /sims/minimum-viable-offer-slider/minimum-viable-offer-slider.png
social:
   cards: false
status: built
---

# Minimum Viable Offer Slider

<iframe src="main.html" height="500px" width="100%" scrolling="no"></iframe>

[Run the Minimum Viable Offer Slider MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Jordan's full imagined mobile dog-grooming business has eight features. A minimum viable
offer keeps only the ones the offer cannot work without. This MicroSim puts all eight on
one checklist and sets the offer's scope with a single slider, from 0 (the bare minimum)
to 100 (the full imagined business).

Each feature has a scope threshold. When the slider is at or above a feature's threshold,
the feature is checked and in the offer. Below it, the feature fades to gray.

| Feature | Joins the offer at scope |
|---|---|
| Basic wash and brush-out | 0 (core) |
| At the customer's home | 0 (core) |
| Text-message booking | 10 |
| Nail trim add-on | 30 |
| Multiple dog breeds/sizes supported | 40 |
| Online booking calendar | 55 |
| Flea/tick treatment option | 65 |
| Branded van and uniform | 85 |

Two features never leave: the wash and brush-out, and the visit to the customer's home.
Take either one away and there is no mobile grooming offer left to test, so they are
the essential core. The other six are removable add-ons.

The panel names the tier the current scope falls in:

- **Minimum Viable Offer** (0-25): just enough to test the core problem
- **Initial Offer** (26-50): still testable, but every add-on is one more assumption
- **Established Offering** (51-100): the full imagined business, not a first test

A three-zone meter marks where the scope sits. On wider screens the panel also states
Jordan's offer in one sentence, with a word count. The sentence grows from 8 words at
the core to 32 words at full scope, so you can see each feature cost the offer some
clarity.

The slider starts at 15: a wash and brush-out at the customer's home, booked by text.
That is Jordan's actual initial offer from the chapter.

On a phone-width screen the panel stacks above the checklist and the one-sentence offer
is hidden.

## How to Use

1. Read the checklist at the starting scope of 15. The three checked features are Jordan's
   actual initial offer.
2. Click **Reset to 0**. Only the two core features remain. Decide whether either one
   could be cut.
3. Drag the **Offer Scope** slider to the right. Watch each add-on join the offer at its
   threshold, and note where the tier changes at 26 and 51.
4. On a wide screen, compare the one-sentence offer at 15 with the one at 100.
5. After you click the slider, the left and right arrow keys move it one step at a time.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/minimum-viable-offer-slider/main.html"
        height="500px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Participants will apply the concept of a minimum viable offer to Jordan's draft business
idea by adjusting the offer's scope and identifying which features are essential to the
core offering and which are removable.

**Bloom Level:** Apply (L3). **Bloom Verb:** apply.

### Duration

10-15 minutes

### Prerequisites

- Chapter 5: Defining the Real Problem
- Chapter 6 reading through "Keeping the First Offer Small"

### Activities

1. **Find the core (3 min):** The facilitator shares the screen and clicks **Reset to 0**.
   Participants type in the chat why neither remaining feature can be removed without
   breaking the offer.
2. **Defend or cut (5 min):** In breakout pairs, one partner picks an add-on and argues it
   belongs in Jordan's first offer. The other asks, "Would the first customer miss it?"
   Pairs agree on a scope value and report it back with the matching one-sentence offer.
3. **Slide your own offer (5 min):** Each participant lists six to eight features of their
   own draft business idea, gives each one a scope threshold from 0 to 100, and marks
   the features at threshold 0. They then write their minimum viable offer in one
   sentence of 15 words or fewer.

### Assessment

- Can the participant name Jordan's two core features and explain why each is essential?
- Given a scope value such as 45, can the participant predict which features are in the
  offer and which tier it falls in before moving the slider?
- Can the participant explain why a branded van belongs in an established offering but
  not in a first test?
- Does the participant's own minimum viable offer contain only features the offer cannot
  work without?

## References

1. [Minimum viable product](https://en.wikipedia.org/wiki/Minimum_viable_product) -
   Wikipedia - The smallest version of a product that can test a business hypothesis with
   real customers, the product-development idea behind a minimum viable offer.
2. [Lean startup](https://en.wikipedia.org/wiki/Lean_startup) - Wikipedia - The
   build-measure-learn loop that treats each offer as an experiment to be tested and
   refined.
3. [Scope creep](https://en.wikipedia.org/wiki/Scope_creep) - Wikipedia - How a project's
   scope grows one reasonable-sounding addition at a time, the pressure this slider makes
   visible.
4. [MoSCoW method](https://en.wikipedia.org/wiki/MoSCoW_method) - Wikipedia - A
   prioritization technique that sorts features into must have, should have, could have,
   and won't have, a close cousin of core versus add-on.
5. *The Lean Startup* by Eric Ries (2011) - The book that popularized the minimum viable
   product and validated learning for early-stage founders.
