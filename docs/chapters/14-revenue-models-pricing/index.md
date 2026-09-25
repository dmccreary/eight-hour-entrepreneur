---
title: Revenue Models & Pricing
description: How ventures make money, from choosing and validating a pricing model to testing willingness to pay and projecting early revenue.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:50:29
version: 1.10
---

# Revenue Models & Pricing

## Summary

Covers how ventures make money, from choosing and validating a pricing model to testing willingness to pay and projecting early revenue.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Revenue Model | 962 |
| Pricing Model | 16 |
| Pricing Strategy | 6 |
| Subscription Pricing | 6 |
| One-Time Pricing | 6 |
| Tiered Pricing | 5 |
| Value-Based Pricing | 5 |
| Cost-Plus Pricing | 5 |
| Revenue Stream | 4 |
| Recurring Revenue | 4 |
| Transaction Revenue | 4 |
| Pricing Validation | 3 |
| Willingness To Pay | 3 |
| Price Point Testing | 3 |
| Revenue Projection | 2 |
| Sales Conversion | 2 |
| Revenue Assumption | 2 |
| Pricing Communication | 1 |
| Freemium Model | 1 |
| Break-Even Thinking | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: The CO.STARTERS Canvas Framework](../03-costarters-canvas-framework/index.md)
- [Chapter 6: Designing the Solution & Initial Offer](../06-designing-solution-offer/index.md)

---

## Now That They Can Find You, How Do You Charge Them?

Chapter 13 got your message and offer in front of real customers. This chapter fills in the Revenue block: exactly how the venture turns that attention into actual money — not just how much to charge, but how the charging itself is structured.

!!! mascot-welcome "Turning Attention Into Income"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A customer finding you is only useful if it eventually turns into money you can count on. This chapter is about designing exactly how that happens. Let's find out for real!

## What Is a Revenue Model

A **revenue model** is the overall structure describing how a venture generates income from its offer — not a specific dollar amount, but the pattern by which money flows in at all. A revenue model is built from one or more **revenue streams**: distinct sources of income within the venture, which may come from different offers, different customer segments, or different pricing arrangements for the same core offer.

Every revenue stream takes one of two basic shapes. **Recurring revenue** is income collected repeatedly from the same customer on an ongoing basis — a subscription renewing every month. **Transaction revenue** is income collected once per discrete purchase, with no ongoing commitment from the customer — Jordan's $40-per-session model is transaction revenue; a hypothetical monthly grooming plan would be recurring revenue instead.

## Choosing a Pricing Model

With a revenue stream shape chosen, a founder selects a **pricing model**: the specific structure by which a price is set and charged to the customer, distinct from the revenue model's broader income pattern. That choice is guided by a **pricing strategy**: the reasoning behind why a particular pricing model was chosen, tied back to the target customer, the value proposition, and the competitive landscape from earlier chapters.

| Pricing Model | How It Works | Best Fit |
|-----------------|---------------|-----------|
| Subscription Pricing | Customer pays a fixed amount on a recurring schedule | Ongoing needs, recurring revenue |
| One-Time Pricing | Customer pays once for a single transaction | Occasional needs, transaction revenue |
| Tiered Pricing | Customer chooses among several price/feature levels | Customers with different needs or budgets |
| Freemium Model | A basic version is free; paid tiers unlock more | Digital offers where free access can build a paying base |

**Subscription pricing** charges the customer a fixed amount on a recurring schedule in exchange for ongoing access. **One-time pricing** charges the customer a single amount for a single transaction, with no ongoing commitment on either side. **Tiered pricing** offers the same core solution at multiple price and feature levels, letting customers self-select based on their own needs and budget. A **freemium model** offers a basic version of a solution for free, while charging for a premium tier with additional features — a structure best suited to digital or software offers where serving a free user costs the venture very little.

!!! mascot-thinking "The Pricing Model Shapes Behavior, Not Just Revenue"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that the pricing model isn't just about how much money arrives — it shapes how customers behave. Subscription pricing rewards a founder for keeping customers happy every single month. One-time pricing rewards a founder for making each individual transaction excellent. Choosing a model means choosing which behavior you want to be rewarded for.

## Two Ways to Set a Price

Once a model is chosen, an actual number still has to be set. **Value-based pricing** sets the price according to how much value the customer believes they're receiving — grounded in the benefit articulated back in Chapter 8 — rather than in what the offer costs to deliver. **Cost-plus pricing** sets the price by starting from what the offer costs to deliver and adding a fixed margin on top, guaranteeing profitability on paper but ignoring what the customer would actually be willing to pay. Jordan's $40 driveway price emerged from value-based thinking — anchored to what customers said driving to a groomer already cost them in lost time — rather than from simply totaling up supply costs and adding a margin.

## Testing Your Price Like Everything Else

A price, like every other canvas block, starts as a **revenue assumption**: an unverified belief about what a customer will pay and how often, which needs the same field-tested treatment as every assumption since Chapter 1. That belief centers on **willingness to pay**: the actual maximum amount a specific customer would pay for a specific offer, which can only be discovered through real behavior, not guessed from a survey question. **Price point testing** is the lean test, following the same principles from Chapter 10, of offering the same or similar offer at different prices to different customers to observe how willingness to pay actually changes. **Pricing validation** is confirming, through real transactions rather than opinions, that a chosen price point produces enough paying customers to sustain the venture.

!!! mascot-tip "Test Two Prices at Once, on Different People"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for price point testing: offer $35 to one group of prospective customers and $45 to another, at the same time. Comparing how many say yes at each price tells you far more about willingness to pay than asking anyone directly what they'd be willing to spend.

## Projecting Revenue and Finding Break-Even

With a validated price in hand, a founder can start doing real math. A **revenue projection** is an estimate of future income, built from real evidence — actual price points, actual test results — rather than optimistic guessing. Central to that estimate is **sales conversion**: the rate at which people who show interest actually become paying customers, measured directly from field test results like the ones from Chapter 10. **Break-even thinking** is the discipline of calculating the point at which total revenue exactly covers total costs, so a founder knows precisely how many sales are needed before the venture stops losing money on each period.

Before trying the calculator below, notice that break-even depends on three numbers working together: price, cost per sale, and fixed monthly costs — change any one, and the number of sales needed to break even shifts too.

#### Diagram: Break-Even Calculator

<iframe src="../../sims/break-even-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Break-Even Calculator</summary>
Type: microsim
**sim-id:** break-even-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate

Learning objective: Learners adjust price, per-sale cost, and fixed monthly cost sliders and calculate how many sales are needed to reach break-even for a lean venture.

Canvas layout:

- Three sliders, top to bottom: "Price per Sale" ($10-$100), "Cost per Sale" ($0-$50), "Fixed Monthly Costs" ($0-$500)
- Below: a live-updating result reading "Sales Needed to Break Even This Month: N"
- A simple bar showing current monthly sales (a 4th slider, "Sales This Month," 0-30) against the break-even line

Behavior: Break-even sales = Fixed Monthly Costs / (Price per Sale − Cost per Sale). Recalculate and redraw on every slider change. If Price per Sale ≤ Cost per Sale, display a warning message: "At this price, you can never break even — raise the price or lower the cost." The bar chart shows a red bar if "Sales This Month" is below the break-even number, green if at or above it.

Interactive controls:

- Drag any of the 4 sliders; all outputs update live
- "Load Jordan's Numbers" button sets Price=$40, Cost per Sale=$8, Fixed Monthly Costs=$120, Sales This Month=5

Default parameters: Price=$40, Cost per Sale=$8, Fixed Monthly Costs=$120, Sales This Month=0 (so the bar starts red, prompting exploration).

Implementation notes: Use p5.js. Recompute break-even on every `draw()` call from current slider values; guard the division against Price equal to Cost per Sale. Must remain fully usable on narrow (mobile) viewports — stack sliders vertically with the result and bar chart below.
</details>

!!! mascot-warning "Don't Build a Revenue Projection on Hope"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is projecting revenue from an imagined future conversion rate instead of a measured one. The fix: use the actual sales conversion rate from your Chapter 10 lean tests, even if it's a small, humble number — a revenue projection built on real evidence is worth far more than an optimistic guess, even a modest one.

## Communicating Your Price

The final piece connects straight back to Chapter 12. **Pricing communication** is how a price gets presented to the customer — clearly, honestly, and without hidden terms — using the same message clarity and simplicity principles that govern every other piece of customer-facing language.

## Key Takeaways

Before Chapter 15 turns to what the venture needs to spend, hold onto how money comes in:

- A **revenue model** is built from one or more **revenue streams**, shaped as **recurring revenue** or **transaction revenue**.
- A **pricing model** — **subscription**, **one-time**, **tiered pricing**, or a **freemium model** — is chosen according to a deliberate **pricing strategy**, then priced using **value-based pricing** or **cost-plus pricing**.
- Every price starts as a **revenue assumption** about **willingness to pay**, tested through **price point testing** and confirmed by **pricing validation**.
- A real **revenue projection**, grounded in measured **sales conversion**, supports honest **break-even thinking** — and the final price reaches the customer through clear **pricing communication**.

!!! mascot-celebration "You Just Designed How Money Actually Flows In"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now have a revenue model and a validated price — grounded in real willingness to pay, not a guess. Let's find out for real, starting with what the venture needs to spend in Chapter 15.

[See Annotated References](./references.md)
