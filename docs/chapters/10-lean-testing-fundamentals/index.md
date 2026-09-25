---
title: Lean Testing Fundamentals
description: The core lean-validation moves — service before product, manual before automated, pre-selling before building — and how to design a minimum testable iteration.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:36:54
version: 1.10
---

# Lean Testing Fundamentals

## Summary

Introduces the core lean-validation moves — service before product, manual before automated, pre-selling before building — and how to design a minimum testable iteration.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Lean Validation | 571 |
| Lean Test | 33 |
| Minimum Testable Iteration | 8 |
| Service Before Product | 8 |
| Manual Before Automated | 17 |
| Pre-Selling Before Building | 7 |
| Pre-Sale Offer | 7 |
| Manual Service Delivery | 16 |
| Direct Post Test | 6 |
| Validation Test Design | 6 |
| Test Result | 15 |
| Test Result Debrief | 5 |
| Kill Decision | 5 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Entrepreneurship, Lean Thinking & the Idea Trap](../01-entrepreneurship-lean-thinking/index.md)
- [Chapter 4: Customer Discovery & Segmentation](../04-customer-discovery-segmentation/index.md)
- [Chapter 6: Designing the Solution & Initial Offer](../06-designing-solution-offer/index.md)
- [Chapter 9: Discovery Interviews & the Reality Check](../09-discovery-interviews-reality-check/index.md)

---

## From Talking to Testing

Chapter 9's discovery interviews told you what people say. This chapter is about what people actually do — because talk is informative but action, especially action involving someone's own money or time, is the strongest evidence a founder can gather before launch. Everything here builds directly on the lean startup philosophy from Chapter 1, now turned into a concrete, repeatable design process.

!!! mascot-welcome "From What They Say to What They Do"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Interviews tell you what people think. This chapter is about designing a small, real test that tells you what people actually do — which is the evidence that matters most. Let's find out for real!

## Lean Validation: Testing Before Building

**Lean validation** is the overall practice of testing a venture's key assumptions through small, fast, low-cost real-world experiments before committing significant time or money to building anything at full scale — the direct, hands-on expression of the lean startup philosophy Chapter 1 introduced. Each individual experiment within that practice is a **lean test**: one specific, bounded real-world trial designed to produce evidence about a single assumption, run cheaply enough that a "no" result doesn't hurt.

The concrete unit a founder actually builds and offers is a **minimum testable iteration**: the smallest possible version of an offer capable of producing a real yes-or-no signal from a real customer — narrower even than the minimum viable offer from Chapter 6, since it's scoped specifically around what one test needs to learn rather than around a general first offering.

## Three Rules for a Lean Test

Three linked principles keep a lean test small, fast, and honest. **Service before product** means testing an idea by delivering it as a hands-on, personally performed service first, even if the eventual vision is a packaged product — because a service can be offered tomorrow, while a product usually requires weeks or months of building first. **Manual before automated** means doing the work by hand — a spreadsheet instead of software, a text message instead of an app — rather than building automation before you know the underlying idea works at all. **Pre-selling before building** means asking someone to actually pay, even a deposit, before the offer fully exists, because a stated interest costs a customer nothing while a real payment costs them something real.

!!! mascot-thinking "Constraints Force Honesty"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice why all three rules point the same direction: each one removes a way to hide from the truth. Building a slick product or automating delivery both feel like progress, but they quietly delay the one question that actually matters — will a real person pay for this, today, in its current rough form?

Before exploring the decision tree below, notice that these three principles aren't independent choices — they compound. Jordan's grooming test is a service (not a product), delivered manually (not through an app), sold with a deposit collected in advance (not built first and hoped for later). The tool below walks through how a founder decides which principles apply to a given venture scenario.

#### Diagram: Minimum Testable Iteration Decision Tree

<iframe src="../../sims/minimum-testable-iteration-decision-tree/main.html" width="100%" height="562px" scrolling="no"></iframe>

<details markdown="1">
<summary>Minimum Testable Iteration Decision Tree</summary>
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
</details>

## Turning Principles Into a Test

Applying those three principles produces a specific test format. A **pre-sale offer** is a lean test in which a founder asks a customer to pay — in full or as a deposit — for an offer before it's fully built or delivered, directly operationalizing pre-selling before building. **Manual service delivery** is a lean test in which the founder personally performs the service by hand for a real customer, directly operationalizing both service before product and manual before automated at once — Jordan's driveway sessions are manual service delivery in its purest form. A **direct post test** is a lower-commitment lean test in which a founder posts the offer directly to a real audience — a neighborhood app, a community group — and measures genuine responses (messages, sign-ups, or questions) without any one-on-one outreach, useful for testing message and demand before investing in individual conversations.

!!! mascot-tip "Match the Test to What You're Actually Unsure Of"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for choosing a format: unsure if anyone wants this at all? Run a direct post test first — it's cheap and fast. Fairly confident in demand but unsure about price or delivery? Go straight to manual service delivery or a pre-sale offer, where the stakes of a real transaction sharpen the answer.

## Designing and Reading the Test

Before running any test, **validation test design** is the deliberate planning of exactly what a lean test will measure, what would count as a "yes," and what would count as a "no" — decided in advance, so the result can't be reinterpreted after the fact to match what the founder hoped to see. Once the test runs, a **test result** is the actual, factual outcome it produced — how many people said yes, how many paid, how many ignored it entirely — kept separate from any interpretation of what that outcome means.

!!! mascot-warning "Define 'Success' Before You Run the Test, Not After"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is running a test with no pre-set bar for success, then quietly deciding afterward that whatever happened counts as a win. The fix: write down your yes/no threshold — "at least 2 of 5 people pay a deposit" — before you post, call, or ask anyone.

A **test result debrief** is the structured reflection, much like the interview debrief from Chapter 9, where a founder reviews the test result against the threshold set during validation test design and decides what it means for the canvas.

## The Kill Decision

Every lean test eventually produces a moment covered by this course's own learning outcomes: judging whether to persevere, pivot, or kill. A **kill decision** is the deliberate choice to stop pursuing a specific venture idea — or a specific version of it — because accumulated test results consistently fail to clear the threshold set in advance, and continuing would mean ignoring the evidence rather than acting on it. A kill decision is not a personal failure; it is validated learning, exactly as Chapter 1 defined it, arriving through the cheapest and fastest path this course could design.

## Key Takeaways

Before Chapter 11 interprets validation evidence in full, hold onto how a lean test gets built:

- **Lean validation** breaks down into individual **lean tests**, each built around a **minimum testable iteration**.
- **Service before product**, **manual before automated**, and **pre-selling before building** are the three rules that keep a test small, fast, and honest.
- A **pre-sale offer**, **manual service delivery**, or a **direct post test** turns those rules into an actual test format.
- **Validation test design** sets the success threshold in advance; the **test result** and its **test result debrief** measure against it — sometimes leading directly to a **kill decision**.

!!! mascot-celebration "You Just Designed a Real Lean Test"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to turn an assumption into a small, honest, real-world test — and how to read the result without fooling yourself. That's lean validation in practice. Let's find out for real, starting with interpreting your evidence in Chapter 11.
