---
title: "Customer Definition Funnel"
description: "A step-through funnel that narrows Priya's meal-prep market from families who eat dinner down to Dana, one persona, showing each stage's definition, the filter that narrowed it, and a concrete example."
image: /sims/customer-definition-funnel/customer-definition-funnel.png
og:image: /sims/customer-definition-funnel/customer-definition-funnel.png
twitter:image: /sims/customer-definition-funnel/customer-definition-funnel.png
social:
   cards: false
status: built
---

# Customer Definition Funnel

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Customer Definition Funnel MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A customer definition gets precise one cut at a time. This MicroSim draws that narrowing
as a funnel of five bands, widest at the top:

1. **Broad Market**
2. **Market Segment**
3. **Niche Market**
4. **Target Customer**
5. **Ideal Customer Profile / Persona**

The worked example is Priya's meal-prep idea from Chapter 4. Her market starts as
"Families who eat dinner" and ends as Dana, a 34-year-old ER nurse on rotating 12-hour
shifts who values ten minutes saved more than variety. Each band in between adds one
filter: income and household structure, then a shared daily pain, then shift work and
Priya's delivery area.

The selected band turns fox-orange, and the detail panel shows:

- A one-sentence definition of the stage
- **Narrowed by:** the filter that took the group from the band above to this one
- **Priya's example:** her actual description of the customer at this stage
- **One band wider:** the example from the stage above, for a side-by-side comparison
  (shown when the screen has room)

The bottom band combines two tools from the chapter. The ideal customer profile lists the
traits of a best-fit customer, and the persona turns those traits into one named person.
Dana is both.

On a phone-width screen the funnel reflows into a shallow stack of labeled bands with the
detail panel below it.

## How to Use

1. The funnel opens with **Broad Market** selected. Read the panel before moving on.
2. Click **Narrow Next** to move one band down the funnel. Click **Widen Back** to move one
   band up. The arrow keys do the same thing: down or right narrows, up or left widens.
3. Click any band to jump straight to that stage.
4. At each stage, compare Priya's example with the band one level wider and find the words
   that were added. Those words are the filter named in the **Narrowed by** line.
5. The counter at the bottom right turns green when all five stages have been explored.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/customer-definition-funnel/main.html"
        height="542px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Participants will explain how a broad market narrows step by step into a target customer,
an ideal customer profile, and a persona, and locate Priya's concrete example at each
stage, by stepping through the funnel one band at a time.

**Bloom Level:** Understand (L2). **Bloom Verb:** explain.

### Duration

10-15 minutes

### Prerequisites

- Chapter 3 reading on the Customer block of the CO.STARTERS Canvas
- Chapter 4 reading through "From Broad Market to Target Customer"

### Activities

1. **Predict the cut (4 min):** The facilitator shares the screen with Broad Market
   selected. Before each click of **Narrow Next**, participants type in the chat the filter
   they expect Priya to add, then compare with the **Narrowed by** line.
2. **Pair explain (5 min):** In breakout pairs, one partner names a band and the other
   explains what makes it narrower than the band above, using Priya's example as evidence.
   Swap after two bands.
3. **Map Jordan's funnel (4 min):** Each participant places Jordan's three stages from the
   chapter ("dog owners," "dog owners without easy access to a groomer," and "dog owners
   within 5 miles who've expressed frustration with driving to get their dog groomed") on
   the matching bands and says which filter separates each one from the next.

### Assessment

- Given one of Priya's five examples read aloud out of order, can the participant name its
  stage?
- Can the participant explain what separates a niche market from a market segment?
- Can the participant explain why "Families who eat dinner" is not yet a target customer?
- Can the participant explain the difference between a target customer (a group) and a
  persona (one named person)?

## References

1. [Market segmentation](https://en.wikipedia.org/wiki/Market_segmentation) - Wikipedia -
   The bases (demographic, behavioral, geographic) used to split a broad market into
   segments.
2. [Niche market](https://en.wikipedia.org/wiki/Niche_market) - Wikipedia - Why a small,
   well-defined segment can be served better by a small venture than by a large one.
3. [Target market](https://en.wikipedia.org/wiki/Target_market) - Wikipedia - How a venture
   chooses the group it will serve first and aims its offer at them.
4. [Total addressable market](https://en.wikipedia.org/wiki/Total_addressable_market) -
   Wikipedia - The total, serviceable, and obtainable market distinction behind Priya's
   "within her metro delivery area" filter.
5. [Persona (user experience)](https://en.wikipedia.org/wiki/Persona_(user_experience)) -
   Wikipedia - Research-grounded composite characters like Dana, used to make design
   decisions for one realistic person.
