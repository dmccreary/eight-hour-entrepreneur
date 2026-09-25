---
title: "Break-Even Calculator"
description: "Learners adjust price, cost per sale, and fixed monthly cost sliders to calculate how many sales a lean venture needs to break even, starting from Jordan's $40 dog-grooming session."
image: /sims/break-even-calculator/break-even-calculator.png
og:image: /sims/break-even-calculator/break-even-calculator.png
twitter:image: /sims/break-even-calculator/break-even-calculator.png
social:
   cards: false
status: built
---

# Break-Even Calculator

<iframe src="main.html" height="500px" width="100%" scrolling="no"></iframe>

[Run the Break-Even Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Break-even is the number of sales at which a month's revenue exactly covers the
month's costs. Three numbers decide it:

- **Price per Sale**: what one customer pays
- **Cost per Sale**: what it costs to deliver that one sale
- **Fixed Monthly Costs**: what the venture pays each month no matter how much it sells

Each sale leaves Price minus Cost toward the fixed costs. Dividing the fixed costs by
that amount gives the break-even point:

`Sales needed = Fixed Monthly Costs ÷ (Price per Sale − Cost per Sale)`

Nobody can make three quarters of a sale, so the answer always rounds **up** to the next
whole sale. The sliders start at Jordan's numbers from the chapter: a $40 driveway
session, $8 cost per sale, and $120 in fixed monthly costs.

| Step | Jordan's numbers |
|---|---|
| Each sale leaves | $40 − $8 = $32 |
| Fixed costs ÷ per-sale amount | $120 ÷ $32 = 3.75 |
| Round up to a whole sale | 4 sales |
| Check | 4 × $32 = $128, which covers the $120 |

The result card shows this division with whatever numbers the sliders hold. Below it, a
bar shows **Sales This Month** on a 0-30 scale against an indigo break-even line. The bar
is red below the line and green at or above it, and the line under the bar works out the
month's profit or loss.

If the price is at or below the cost per sale, each sale leaves nothing (or less than
nothing) toward the fixed costs, so no number of sales can break even. The card replaces
the answer with a warning instead of dividing by zero or a negative number.

On a phone-width screen the formula is written with numbers only and the hint beside the
button is hidden.

## How to Use

1. Read the result card. With Jordan's numbers, 4 sales are needed to break even.
2. The bar starts at 0 sales, in red. Drag **Sales This Month** to 3, then 4, and watch
   the bar turn green at the break-even line.
3. Change one number at a time. Raise **Price per Sale**, then lower it; raise **Cost per
   Sale**; raise **Fixed Monthly Costs**. Before each move, predict whether the number of
   sales needed will go up or down.
4. Drag **Cost per Sale** above **Price per Sale** to see the warning.
5. Click **Load Jordan's Numbers** to return to $40, $8 and $120, with 5 sales this month.
6. After you click a slider, the left and right arrow keys move it one step at a time.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/break-even-calculator/main.html"
        height="500px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Participants will calculate how many sales a lean venture needs to break even in a month
by adjusting price, cost per sale, and fixed monthly costs, and explain why the answer
rounds up to a whole sale.

**Bloom Level:** Apply (L3). **Bloom Verb:** calculate.

### Duration

10-15 minutes

### Prerequisites

- Chapter 14 reading through "Projecting Revenue and Finding Break-Even"
- Basic arithmetic: subtraction, division, and rounding

### Activities

1. **Check Jordan's number (3 min):** Before anyone touches a slider, participants work out
   $120 ÷ ($40 − $8) by hand and type their answer in the chat. The facilitator then shares
   the screen and compares the answer with the result card, including why 3.75 becomes 4.
2. **Predict, then move (5 min):** The facilitator calls out a change, such as "Cost per
   Sale goes to $16" or "Fixed Monthly Costs doubles to $240." Participants predict the new
   break-even number in the chat before the slider moves, then compare.
3. **Find the danger zone (2 min):** Each participant drags Cost per Sale up until the
   warning appears and explains in one sentence why no number of sales can fix it.
4. **Run your own numbers (5 min):** Each participant enters a price, cost per sale, and
   fixed monthly costs for their own venture idea, records the break-even number, and
   decides whether that many sales a month is realistic given their lean test results.

### Assessment

- Given a price, cost per sale, and fixed monthly costs, can the participant calculate the
  break-even number by hand, including rounding up?
- Can the participant explain why a break-even of 3.75 means 4 sales, not 3?
- Can the participant predict which way the break-even number moves when each input rises
  or falls?
- Can the participant explain why a price at or below the cost per sale can never break
  even?

## References

1. [Break-even (economics)](https://en.wikipedia.org/wiki/Break-even_(economics)) -
   Wikipedia - The point at which total revenue equals total cost, and the formula this
   calculator uses.
2. [Contribution margin](https://en.wikipedia.org/wiki/Contribution_margin) - Wikipedia -
   The amount each sale leaves toward fixed costs after its own cost is paid, the Price
   minus Cost in the formula.
3. [Fixed cost](https://en.wikipedia.org/wiki/Fixed_cost) - Wikipedia - Costs that stay the
   same regardless of how much a business sells, the bar break-even has to clear.
4. [Variable cost](https://en.wikipedia.org/wiki/Variable_cost) - Wikipedia - Costs that rise
   and fall with each sale, the Cost per Sale slider.
5. [Cost-volume-profit analysis](https://en.wikipedia.org/wiki/Cost%E2%80%93volume%E2%80%93profit_analysis) -
   Wikipedia - The wider method of seeing how price, costs, and sales volume together
   decide profit.
