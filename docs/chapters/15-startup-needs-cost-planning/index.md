---
title: Startup Needs & Cost Planning
description: Separating one-time startup needs from ongoing costs and building basic financial-planning literacy — budget, cash flow awareness, and cost tracking — for a lean venture.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:51:29
version: 1.10
---

# Startup Needs & Cost Planning

## Summary

Separates one-time startup needs from ongoing costs and builds basic financial-planning literacy — budget, cash flow awareness, and cost tracking — for a lean venture.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Startup Needs | 480 |
| One-Time Needs | 16 |
| Ongoing Costs | 6 |
| Fixed Costs | 8 |
| Variable Costs | 7 |
| Bootstrapped Funding | 5 |
| Startup Budget | 5 |
| Resource Needs | 4 |
| People Resource Needs | 4 |
| Technology Resource Needs | 4 |
| Activity Resource Needs | 3 |
| Cost Structure | 3 |
| Cost Estimation | 3 |
| Financial Baseline | 2 |
| Minimal Viable Budget | 2 |
| Cash Flow Awareness | 2 |
| Startup Capital | 1 |
| Cost Tracking | 1 |
| Needs Vs Wants Assessment | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: The CO.STARTERS Canvas Framework](../03-costarters-canvas-framework/index.md)
- [Chapter 14: Revenue Models & Pricing](../14-revenue-models-pricing/index.md)

---

## The Last Two Blocks: What Does This Actually Cost?

Chapter 14 settled how money comes in. This chapter fills in the canvas's final two blocks — Startup Needs and Costs — settling what money has to go out, and when. Getting this right is what keeps a validated, well-messaged, well-distributed venture from running out of cash before it has a chance to prove itself.

!!! mascot-welcome "What This Actually Costs to Begin and Keep Running"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A great venture can still fail from a boring cause: running out of cash. This chapter builds the financial literacy to make sure that doesn't happen to you. Let's find out for real!

## Startup Needs vs Ongoing Costs

**Startup needs** are the one-time resources a venture must acquire before it can begin operating at all — equipment, a license, an initial batch of supplies — the canvas's second-to-last block. The specific items within that block are **one-time needs**: individual resources purchased or acquired once, with no expectation of repeating that expense regularly. **Ongoing costs** are the different category entirely: expenses that recur regularly for as long as the venture keeps operating — the final canvas block, covered together with startup needs because the two are so often confused with each other. Jordan's grooming kit is a one-time need; the shampoo it uses up every session is an ongoing cost.

## Fixed and Variable Costs

Ongoing costs themselves split into two behaviors. **Fixed costs** stay the same regardless of how much the venture sells — insurance, a phone plan, a storage unit rental. **Variable costs** rise and fall directly with sales volume — grooming supplies used per session, gas per driveway visit. Knowing which is which matters directly for the break-even thinking from Chapter 14: fixed costs set the bar a venture has to clear every period, while variable costs shrink or grow with each individual sale.

## Three Kinds of Resource Needs

Startup needs themselves break down further by what kind of resource they actually are. **Resource needs** is the umbrella term for anything a venture requires to operate, of three specific kinds. **People resource needs** covers any labor, skill, or assistance required beyond the founder alone — even an occasional helper for a busy Saturday. **Technology resource needs** covers any tools, software, or equipment required — a booking app, a set of clippers. **Activity resource needs** covers any action or process that has to happen before launch, distinct from a physical item — getting a local business license approved, completing a pet-first-aid certification.

!!! mascot-thinking "Every 'Need' Started Life as a Want"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that almost everything on a founder's first resource list started out as a want that got relabeled a need under pressure. The discipline this chapter teaches is catching that relabeling before it happens, not after the money's already spent.

## Needs vs Wants: The Sorter

That discipline has a name: **needs vs. wants assessment** is the deliberate practice of examining every item on a founder's resource list and asking whether the venture can actually launch and run its first lean test without it — separating genuine startup needs from wants that only feel urgent. Before trying the sorter below, notice the test each item has to pass: could this specific lean test happen without it? If yes, it's a want for now.

#### Diagram: Startup Needs Sorter

<iframe src="../../sims/startup-needs-sorter/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Startup Needs Sorter</summary>
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
</details>

!!! mascot-tip "Ask 'Could I Borrow or Rent This First?'"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for trimming your startup needs list: for anything over $50, ask whether you could borrow, rent, or share it for your very first lean test instead of buying it outright. Jordan borrowed a friend's car for the first driveway sessions in Chapter 1 — no van purchase required to test the idea.

## Estimating and Structuring Your Costs

With a trimmed list in hand, a founder builds a **cost structure**: the organized breakdown of all of a venture's costs, grouped by category — startup needs, fixed costs, variable costs — so the full financial picture can be seen at once rather than scattered across memory and receipts. Producing real numbers for that structure requires **cost estimation**: researching or calculating a realistic dollar figure for each item, using actual prices rather than rough guesses.

## Funding It Without Debt

Most ventures at this stage rely on **bootstrapped funding**: financing a venture's startup needs using the founder's own resources — savings, existing equipment, personal effort — rather than outside investment or loans. The actual money a founder has available to bootstrap with is their **startup capital**: whatever funds a founder can access to cover startup needs before the venture generates its own revenue. This course, per its own stated scope from the very first chapter, deliberately doesn't cover fundraising or investment pitching — bootstrapped funding, kept small through everything this chapter teaches, is the default path.

## Building Your Startup Budget

Bringing cost structure and startup capital together produces a **startup budget**: the complete financial plan listing every startup need and its estimated cost, checked against available startup capital. The leanest possible version of that plan is a **minimal viable budget**: the smallest budget that still covers every genuine need identified through the needs-vs-wants assessment — no padding, no "just in case" purchases. Together, cost estimation and a minimal viable budget establish a venture's **financial baseline**: the starting financial position a founder can measure every future month against.

!!! mascot-warning "Profitable on Paper Doesn't Mean Cash in the Bank"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is assuming that because revenue technically exceeds costs, the venture is financially safe. It isn't, if a big expense lands before a big payment arrives. The fix: track when money actually moves, not just whether the totals eventually balance.

## Staying on Top of It

The warning above points to the final two concepts. **Cash flow awareness** is understanding not just how much money comes in and goes out, but exactly *when* — since a venture can be profitable on paper and still run out of cash if expenses land before revenue does. **Cost tracking** is the ongoing habit of recording actual spending against the startup budget as it happens, so surprises get caught in week one instead of month three.

## Key Takeaways

Before Chapter 16 pulls every canvas block into a single launch plan, hold onto how the money side gets planned:

- **Startup needs**, made of **one-time needs**, are different from **ongoing costs**, which split into **fixed costs** and **variable costs**.
- **Resource needs** — **people**, **technology**, and **activity resource needs** — get filtered through honest **needs vs. wants assessment**.
- A clear **cost structure**, built from real **cost estimation**, feeds a lean **startup budget** funded by **bootstrapped funding** and available **startup capital**.
- A **minimal viable budget** sets your **financial baseline**; ongoing **cash flow awareness** and **cost tracking** keep it honest month to month.

!!! mascot-celebration "You Just Built Your Financial Foundation"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know exactly what this venture needs to begin and what it costs to keep running — a lean, honest budget instead of a guess. Let's find out for real, starting with your 30-day launch plan in Chapter 16.
