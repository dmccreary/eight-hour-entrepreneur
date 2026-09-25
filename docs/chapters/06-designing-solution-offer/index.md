---
title: Designing the Solution & Initial Offer
description: Turning a validated problem into a minimum viable offer, iterating on solution scope and clarity before any customer interviews take place.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:31:10
version: 1.10
---

# Designing the Solution & Initial Offer

## Summary

Shows how to turn a validated problem into a minimum viable offer, iterating on solution scope and clarity before any customer interviews take place.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Solution Definition | 2276 |
| Initial Offer | 13 |
| Minimum Viable Offer | 6 |
| Product Offering | 6 |
| Service Offering | 6 |
| What You Offer | 5 |
| Solution Fit | 5 |
| Feature Vs Benefit | 5 |
| Offer Design | 4 |
| Solution Iteration | 4 |
| Solution Scope | 4 |
| Draft Business Idea | 3 |
| Solution Refinement | 3 |
| Core Offering | 3 |
| Value Delivery | 2 |
| Solution Simplicity | 2 |
| Solution Assumption | 2 |
| Offer Clarity | 1 |
| Solution Testing | 1 |
| Solution Pivot | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: The CO.STARTERS Canvas Framework](../03-costarters-canvas-framework/index.md)
- [Chapter 5: Defining the Real Problem](../05-defining-the-real-problem/index.md)

---

## The Third Block: What Will You Actually Offer?

Chapter 5 ended with a validated, root-caused problem statement. This chapter turns that statement into the Solution block — what you will actually build, sell, or deliver. The instinct at this point is to design something impressive. This chapter argues, deliberately, for the opposite instinct: design something small enough to test before your first customer interview, refined only by evidence afterward.

!!! mascot-welcome "Designing Just Enough"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This chapter is going to keep pulling you back toward "smaller" every time your instinct says "more complete." That's not caution for its own sake — it's how you get a real answer from a real customer sooner instead of later. Let's find out for real!

## From Root Cause to Draft Solution

**Solution definition** is the practice of describing, in specific terms, what a venture will actually offer to address a validated problem — the third block on the canvas, and the first one where a founder starts building rather than just researching. A strong solution definition traces directly back to the root cause identified in Chapter 5, not merely to the symptom a customer first mentioned.

The earliest form this takes is a **draft business idea**: a rough, unpolished first pass at what the solution might be, written down specifically so it can be tested and changed rather than kept vague and unfalsifiable. That draft answers **what you offer**: the specific plain-language description of the product or service a customer receives — the CO.STARTERS Canvas's own phrasing for this block's guiding question. Jordan's draft business idea reads: "Mobile dog grooming, delivered at the customer's home, booked by text message, paid at time of service."

## Products, Services, and Your Core Offering

Every draft solution takes one of two basic shapes, or some blend of both. A **product offering** is a solution delivered as a tangible or standardized item the customer owns or consumes, produced once and sold repeatedly with little variation. A **service offering** is a solution delivered as a performed activity, customized in the moment to a specific customer's situation, and consumed as it's delivered rather than owned afterward. Jordan's grooming is a service offering; a bagged batch of pre-made dog treats sold at the same driveway visit would be a product offering.

Most real ventures center on one of these two, called the **core offering**: the single primary product or service a venture is built around, as distinct from any secondary add-ons that might come later. Naming a clear core offering matters because an early-stage venture with three different core offerings usually has zero well-tested offerings — the resources meant to validate one thing get split three ways instead.

## Keeping the First Offer Small

A common early mistake is designing a solution meant to satisfy every version of the problem for every version of the customer at once. The remedy is a **minimum viable offer**: the smallest, simplest version of a solution capable of genuinely solving the core problem for a target customer, containing only what is essential to test whether the underlying idea works — no polish, no edge cases handled, no nice-to-haves. **Solution scope** is the deliberate boundary a founder draws around what the offer will and will not include, and **solution simplicity** is the discipline of keeping that scope as narrow as possible without breaking the offer's ability to actually solve the core problem.

That narrowed, testable version becomes the **initial offer**: the specific, concrete version of the minimum viable offer that a founder actually presents to real customers during the very first round of field testing. For the initial offer to do its job, it also needs **offer clarity**: the property of being stated so plainly and specifically that a customer immediately understands what they'd be getting and for how much, with no follow-up questions required just to understand the pitch. Jordan's initial offer: "A single dog wash and brush-out, at your home, for $40, this week." Not the full grooming menu — one clear, bookable thing.

!!! mascot-thinking "The Goal Isn't the Best Offer — It's the Fastest Honest Answer"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the shift in what "good" means here. A minimum viable offer isn't a lesser version of the real business — it's a deliberately incomplete tool whose entire purpose is producing a fast, honest yes-or-no from a real customer. Completeness is a later problem, once you know the core idea works.

Before trying the slider below, notice what happens to an offer as scope shrinks: some features disappear entirely, others turn out to have been essential all along. The interactive tool below lets you adjust Jordan's offer's scope and see which pieces survive.

#### Diagram: Minimum Viable Offer Slider

<iframe src="../../sims/minimum-viable-offer-slider/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Minimum Viable Offer Slider</summary>
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
</details>

!!! mascot-tip "When in Doubt, Cut It in Half Again"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut: whatever offer you've drafted, ask "what would this look like with half the features?" Then ask again. Most founders land on a genuinely minimum offer only after cutting twice past the point that first felt uncomfortably small.

## Feature vs Benefit, and Delivering Real Value

As you decide what stays in scope, it helps to separate two different things people often blur together. **Feature vs. benefit** is the distinction between what a solution technically does or includes (a feature) and what positive outcome the customer actually experiences as a result (a benefit) — "text-message booking" is a feature; "no phone tag, no waiting on hold" is the benefit it produces. **Offer design** is the overall process of shaping which features, format, and terms make up a solution, guided by which benefits actually matter to the target customer rather than which features are easiest or most interesting to build. **Value delivery** is the mechanism by which a customer actually receives that benefit — not just what's promised, but how and when it's concretely handed over. Finally, **solution fit** measures how well the designed offer actually matches the validated problem and target customer from the two previous chapters, rather than matching what a founder personally finds exciting to build.

## Every Solution Starts as an Assumption

Just as Chapter 4 established that a customer definition begins as a customer assumption, a draft solution carries its own version. A **solution assumption** is an unverified belief that a specific offer will actually solve the customer's validated problem well enough that they'll choose it — true by hope, not yet by evidence. **Solution testing** is the process, covered in full in Chapter 10, of exposing that assumption to real customer behavior to find out whether it holds.

!!! mascot-warning "Testing It In Your Head Doesn't Count"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is "testing" a solution assumption by imagining how customers would react, rather than actually offering it to one. The fix: treat every solution assumption as untested until a real person has said yes or no to the real initial offer — not a description of it.

## Refining, Iterating, or Pivoting

A first initial offer is rarely the last version. **Solution iteration** is the repeated cycle of adjusting an offer based on field evidence, then testing the adjusted version again — the same evidence-based-decision-making habit from Chapter 1, applied specifically to the Solution block. **Solution refinement** describes the smaller, incremental adjustments within that cycle — tightening scope, clarifying the offer, adding one validated feature back in. A **solution pivot** is the larger move: abandoning the current solution approach entirely in favor of a substantially different one, made when evidence shows the current direction can't be refined into something that works, only replaced.

## Key Takeaways

Before Chapter 7 looks at what customers use instead of you, hold onto how an offer gets built:

- **Solution definition** turns a validated problem into a **draft business idea** answering **what you offer**, expressed as a **product offering**, a **service offering**, or both, centered on one clear **core offering**.
- A **minimum viable offer**, bounded by deliberate **solution scope** and **solution simplicity**, becomes the actual **initial offer** — made testable by real **offer clarity**.
- **Feature vs. benefit** thinking, sound **offer design**, and genuine **value delivery** determine **solution fit** with your validated customer and problem.
- Every offer starts as a **solution assumption**, resolved only through real **solution testing** — after which **solution iteration**, **solution refinement**, or a full **solution pivot** takes it forward.

!!! mascot-celebration "You Just Designed a Testable Offer"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now have an offer small enough to test honestly and clear enough that a stranger would understand it in one sentence — that's exactly the bar this chapter set out to clear. Let's find out for real, starting with what customers use instead of you in Chapter 7.
