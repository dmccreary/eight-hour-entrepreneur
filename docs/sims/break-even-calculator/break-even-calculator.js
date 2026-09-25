// Break-Even Calculator - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Learners drag four sliders (Price per Sale $10-$100, Cost per Sale $0-$50, Fixed
// Monthly Costs $0-$500, Sales This Month 0-30). On every frame the sim recalculates
// how many sales are needed to break even:
//   sales needed = ceil(Fixed Monthly Costs / (Price per Sale - Cost per Sale))
// The result card shows that division with the current numbers and, when the answer is
// not a whole number, why it rounds up. Below it, a bar shows Sales This Month on a 0-30
// scale against an indigo break-even line: red while below the line, green at or above
// it, with the month's profit or loss written underneath. When Price per Sale is at or
// below Cost per Sale the division is skipped and the card shows a warning instead of
// Infinity, NaN or a negative count.
// The sliders start at Jordan's chapter numbers ($40 price, $8 cost per sale, $120 fixed)
// with 0 sales, so the bar starts red. Load Jordan's Numbers restores them with 5 sales.
// Wide screens (>= 600px): the number box spans the result card and the formula is
// written out in words. Narrow screens (< 600px): smaller type, the number box sits
// beside the headline only, shorter wording, and the hint beside the button is hidden.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 330;
let controlHeight = 168;  // four slider rows 32px apart, then the Load Jordan's Numbers button
let canvasHeight = drawHeight + controlHeight;
let margin = 22;           // right margin of the sliders; 16 on narrow screens
let sliderLeftMargin = 240;  // recomputed from the label widths in positionControls()
let defaultTextSize = 16;
const WIDE_BREAK = 600;   // below this width the layout switches to its narrow form

// Book palette
const INDIGO = '#3F51B5';        // break-even number box, break-even line, rounding note
const FOX_ORANGE = '#E8791A';    // slider accent color
const CORRECT_GREEN = '#2E7D32'; // bar, status and profit at or above break-even
const LOSS_RED = 'firebrick';    // bar, status and loss below break-even; the warning
const LOSS_TINT = '#FFEBEE';     // pale red: the part of the scale below break-even
const PROFIT_TINT = '#E8F5E9';   // pale green: the part of the scale at or above break-even

// Jordan's numbers from Chapter 14: a $40 driveway session, $8 cost per sale and $120
// in fixed monthly costs. 120 / (40 - 8) = 3.75, so Jordan needs 4 sales.
const JORDAN = { price: 40, cost: 8, fixed: 120, sales: 5 };
const SALES_MAX = 30;

// Vertical centers of the four slider rows, measured down from drawHeight
const ROW_Y = [18, 50, 82, 114];
const BUTTON_Y = 132;      // top of the Load Jordan's Numbers button, below drawHeight

let priceSlider, costSlider, fixedSlider, salesSlider, jordanButton;
let sliderRows = [];       // {slider, label, widest, fmt} in top-to-bottom order
let controlTextSize = 16;  // shrinks on narrow screens so the sliders keep usable width
let valueRight = 0;        // x where the right-aligned slider values end

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let resultBox = {}, panelBox = {};
let resultCache = null;    // laid-out result card text, rebuilt when the inputs change

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  priceSlider = createSlider(10, 100, JORDAN.price, 1);
  costSlider = createSlider(0, 50, JORDAN.cost, 1);
  fixedSlider = createSlider(0, 500, JORDAN.fixed, 5);
  salesSlider = createSlider(0, SALES_MAX, 0, 1);
  jordanButton = createButton('Load Jordan\'s Numbers');
  jordanButton.mousePressed(loadJordan);
  // Larger button text so the control is readable from the back of the room
  jordanButton.style('font-size', '16px');
  jordanButton.style('padding', '4px 12px');

  sliderRows = [
    { slider: priceSlider, label: 'Price per Sale:', widest: '$100', fmt: v => money(v) },
    { slider: costSlider, label: 'Cost per Sale:', widest: '$50', fmt: v => money(v) },
    { slider: fixedSlider, label: 'Fixed Monthly Costs:', widest: '$500', fmt: v => money(v) },
    { slider: salesSlider, label: 'Sales This Month:', widest: '30', fmt: v => String(v) }
  ];
  for (const r of sliderRows) r.slider.style('accent-color', FOX_ORANGE);

  computeLayout();

  describe('A break-even calculator for a lean venture. Four sliders set Price per Sale ' +
    '(10 to 100 dollars), Cost per Sale (0 to 50 dollars), Fixed Monthly Costs (0 to 500 ' +
    'dollars) and Sales This Month (0 to 30). A result card shows Sales Needed to Break ' +
    'Even This Month, calculated as fixed monthly costs divided by price minus cost per ' +
    'sale and rounded up to a whole sale. With Jordan\'s numbers, 120 divided by 32 is ' +
    '3.75, so 4 sales are needed. A horizontal bar shows sales this month against a ' +
    'break-even line; it is red below break-even and green at or above it, and the ' +
    'month\'s profit or loss is written below the bar. If the price is at or below the ' +
    'cost per sale, a warning says the venture can never break even.');
}

function draw() {
  updateCanvasSize();
  if (canvasWidth !== width) {
    // The container changed size without a window resize event
    resizeCanvas(canvasWidth, canvasHeight);
    computeLayout();
  }

  // Drawing region: aliceblue with a silver border
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Recompute break-even from the current slider values on every frame
  const m = computeBreakEven();

  drawTitle();
  drawResultCard(m);
  drawSalesPanel(m);
  drawControlText();
}

// ---------- Break-even model ----------

function computeBreakEven() {
  const price = Number(priceSlider.value());
  const cost = Number(costSlider.value());
  const fixed = Number(fixedSlider.value());
  const sales = Number(salesSlider.value());
  const perSale = price - cost;      // what each sale leaves over to pay the fixed costs
  const possible = perSale > 0;      // guard: never divide when price <= cost per sale
  let needed = null;
  let exact = true;
  if (possible) {
    // ceil(fixed / perSale) in whole-number arithmetic, so 120 / 30 is exactly 4
    const rem = fixed % perSale;
    needed = (fixed - rem) / perSale + (rem > 0 ? 1 : 0);
    exact = rem === 0;
  }
  const profit = sales * perSale - fixed;
  const reached = possible && sales >= needed;
  return { price, cost, fixed, sales, perSale, possible, needed, exact, profit, reached };
}

// Whole-dollar amounts with a true minus sign for negatives: $40, -$5, $2,500
function money(v) {
  return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US');
}

// "= 3.75", "= 4" or "≈ 17.14" for Fixed Monthly Costs / (Price - Cost)
function quotientText(m) {
  const q = m.fixed / m.perSale;
  if (m.exact) return '= ' + q;
  const s = q.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return (Math.abs(Number(s) - q) < 1e-9 ? '= ' : '≈ ') + s;
}

// The result card's text. Each part lists its wordings longest first; the layout uses
// the first one that fits on a single line and wraps the last one if none does.
function resultContent(m) {
  const sub = money(m.fixed) + ' ÷ (' + money(m.price) + ' − ' + money(m.cost) + ')';
  if (m.possible) {
    const q = quotientText(m);
    const qNum = q.slice(2);
    const rest = sub + ' = ' + money(m.fixed) + ' ÷ ' + money(m.perSale) + ' ' + q;
    const math = ['Fixed ÷ (Price − Cost) = ' + rest, rest];
    let note;
    if (m.fixed === 0) {
      note = ['No fixed costs to cover, so every sale is profit from the first one.',
        'No fixed costs, so every sale is profit.'];
    } else if (m.exact) {
      note = ['No rounding needed: ' + m.needed + ' × ' + money(m.perSale) + ' = ' +
        money(m.fixed) + ', exactly the fixed costs.',
        'No rounding needed: ' + m.needed + ' × ' + money(m.perSale) + ' = ' + money(m.fixed) + '.'];
    } else {
      note = [qNum + ' is not a whole sale, so round up: ' + m.needed + ' × ' +
        money(m.perSale) + ' = ' + money(m.needed * m.perSale) + ' covers the ' + money(m.fixed) + '.',
        qNum + ' is not a whole sale, so round up to ' + m.needed + '.'];
    }
    return { box: true, head: ['Sales Needed to Break Even This Month:'], headColor: 'black',
      math: math, note: note };
  }

  // Price is at or below cost per sale: no division, a warning instead
  const each = 'Each sale: ' + money(m.price) + ' − ' + money(m.cost) + ' = ' + money(m.perSale);
  let head, math, note;
  if (m.fixed > 0) {
    head = 'At this price, you can never break even — raise the price or lower the cost.';
    math = m.perSale < 0 ? each + ', so every sale loses money.' :
      each + ', so no sale pays toward the fixed costs.';
    note = m.perSale < 0 ? 'Selling more makes the monthly loss bigger, not smaller.' :
      'The ' + money(m.fixed) + ' in fixed costs stays uncovered no matter how much you sell.';
  } else {
    // With no fixed costs, 0 sales breaks even, but no sale can ever earn a profit
    head = 'At this price, you can never make a profit — raise the price or lower the cost.';
    math = m.perSale < 0 ? each + ', so every sale loses money.' :
      each + ', so no sale earns anything.';
    note = m.perSale < 0 ? 'With no fixed costs, 0 sales breaks even, but each sale adds a ' +
      money(-m.perSale) + ' loss.' : 'You break even at any number of sales but never earn a profit.';
  }
  return { box: false, head: [head], headColor: LOSS_RED, math: [math], note: [note] };
}

// The month's profit or loss, longest wording first
function profitContent(m) {
  const s = m.sales + (m.sales === 1 ? ' sale' : ' sales');
  const per = money(m.perSale);
  let result;
  if (m.profit > 0) result = money(m.profit) + ' profit';
  else if (m.profit < 0) result = money(-m.profit) + ' loss';
  else result = '$0, exactly break-even';
  return [
    'This month: ' + s + ' × ' + per + ' each − ' + money(m.fixed) + ' fixed = ' + result,
    s + ' × ' + per + ' − ' + money(m.fixed) + ' fixed = ' + result,
    m.sales + ' × ' + per + ' − ' + money(m.fixed) + ' = ' + result
  ];
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  const pad = isWide ? 16 : 10;
  if (isWide) {
    resultBox = { x: pad, y: 46, w: canvasWidth - 2 * pad, h: 112 };
  } else {
    resultBox = { x: pad, y: 34, w: canvasWidth - 2 * pad, h: 124 };
  }
  const py = resultBox.y + resultBox.h + 8;
  panelBox = { x: pad, y: py, w: canvasWidth - 2 * pad, h: drawHeight - 8 - py };
  resultCache = null;
  positionControls();
}

function positionControls() {
  // Largest label size that still leaves the sliders at least 150px wide
  margin = isWide ? 22 : 16;   // white space right of the slider tracks
  textStyle(BOLD);
  for (const s of [16, 15, 14]) {
    controlTextSize = s;
    textSize(s);
    let labelW = 0;
    let valueW = 0;
    for (const r of sliderRows) {
      labelW = max(labelW, textWidth(r.label));
      valueW = max(valueW, textWidth(r.widest));
    }
    valueRight = Math.ceil(10 + labelW + 8 + valueW);
    sliderLeftMargin = valueRight + 12;
    if (canvasWidth - sliderLeftMargin - margin >= 150) break;
  }
  textStyle(NORMAL);
  for (let i = 0; i < sliderRows.length; i++) {
    sliderRows[i].slider.position(sliderLeftMargin, drawHeight + ROW_Y[i] - 10);
    sliderRows[i].slider.size(canvasWidth - sliderLeftMargin - margin);
  }
  jordanButton.position(10, drawHeight + BUTTON_Y);
}

// Lay out one text part: the first wording that fits on one line, otherwise the last
// wording wrapped to width w
function fitText(variants, w, size, style) {
  textStyle(style);
  textSize(size);
  let lines = null;
  for (const v of variants) {
    if (textWidth(v) <= w) {
      lines = [v];
      break;
    }
  }
  if (!lines) lines = wrapWords(variants[variants.length - 1], w);
  textStyle(NORMAL);
  const lead = size * 1.3;
  return { lines: lines, size: size, style: style, lead: lead, h: lines.length * lead };
}

// Greedy word wrap at the current text size and style
function wrapWords(str, maxW) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (line && textWidth(test) > maxW) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Fit the result card's headline, math line and rounding note inside the card, trying a
// few type scales and dropping the note only if nothing else fits
function layoutResult(m) {
  const c = resultBox;
  const padX = isWide ? 16 : 10;
  const padY = isWide ? 10 : 8;
  const inner = { x: c.x + padX, y: c.y + padY, w: c.w - 2 * padX, h: c.h - 2 * padY };
  const content = resultContent(m);
  const boxW = content.box ? (isWide ? 120 : 80) : 0;
  const colW = content.box ? inner.w - boxW - 12 : inner.w;
  // Wide: the number box spans the card, so all text shares the column beside it.
  // Narrow: the number box sits beside the headline and the rest runs full width.
  const bodyW = content.box && !isWide ? inner.w : colW;
  const headSize = isWide ? 19 : 17;
  const bodySize = isWide ? 16 : 15;
  const boxMinH = content.box && !isWide ? 54 : 0;
  let lay = null;
  for (const withNote of [true, false]) {
    for (const s of [1, 0.94, 0.88]) {
      const head = fitText(content.head, colW, headSize * s, BOLD);
      const math = fitText(content.math, bodyW, bodySize * s, NORMAL);
      const note = withNote ? fitText(content.note, bodyW, bodySize * s, NORMAL) : null;
      const topH = max(head.h, boxMinH);
      const gap = 8 * s;
      const h = topH + gap + math.h + (note ? 4 * s + note.h : 0);
      lay = { inner, content, boxW, colW, head, math, note, topH, gap, h, s };
      if (h <= inner.h) return lay;
    }
  }
  return lay;
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('Break-Even Calculator', canvasWidth / 2, isWide ? 10 : 6);
}

// Result card: the break-even count, the division that produced it and the rounding step,
// or the warning when price is at or below cost per sale
function drawResultCard(m) {
  const c = resultBox;
  const key = [m.price, m.cost, m.fixed, canvasWidth].join('|');
  if (!resultCache || resultCache.key !== key) resultCache = { key: key, lay: layoutResult(m) };
  const L = resultCache.lay;

  // Shadow, then the card, outlined indigo (or red for the warning)
  noStroke();
  fill(0, 0, 0, 25);
  rect(c.x + 3, c.y + 4, c.w, c.h, 12);
  fill('white');
  stroke(m.possible ? INDIGO : LOSS_RED);
  strokeWeight(2);
  rect(c.x, c.y, c.w, c.h, 12);
  strokeWeight(1);

  const inner = L.inner;
  const top = inner.y + max(0, (inner.h - L.h) / 2);

  // Number box: the whole number of sales needed
  if (L.content.box) {
    const bx = inner.x + inner.w - L.boxW;
    const by = isWide ? inner.y : top;
    const bh = isWide ? inner.h : L.topH;
    noStroke();
    fill(INDIGO);
    rect(bx, by, L.boxW, bh, 8);
    const numSize = isWide ? 46 : 32;
    const capSize = isWide ? 15 : 13;
    const total = numSize + 2 + capSize;
    const ty = by + (bh - total) / 2;
    fill('white');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(numSize);
    text(String(m.needed), bx + L.boxW / 2, ty);
    textStyle(NORMAL);
    textSize(capSize);
    text(m.needed === 1 ? 'sale' : 'sales', bx + L.boxW / 2, ty + numSize + 2);
  }

  // Headline, vertically centered beside the number box on narrow screens
  let y = top + (L.topH - L.head.h) / 2;
  drawLines(L.head, inner.x, y, L.content.headColor);
  y = top + L.topH + L.gap;
  drawLines(L.math, inner.x, y, 'black');
  y += L.math.h;
  if (L.note) {
    y += 4 * L.s;
    drawLines(L.note, inner.x, y, m.possible ? INDIGO : 'dimgray');
  }
}

function drawLines(block, x, y, col) {
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textStyle(block.style);
  textSize(block.size);
  for (const ln of block.lines) {
    text(ln, x, y);
    y += block.lead;
  }
  textStyle(NORMAL);
}

// Sales panel: status, a 0-30 bar of Sales This Month against the break-even line, the
// axis, and the month's profit or loss
function drawSalesPanel(m) {
  const p = panelBox;
  const padX = isWide ? 16 : 10;
  const padY = isWide ? 12 : 8;
  const innerX = p.x + padX;
  const innerW = p.w - 2 * padX;

  noStroke();
  fill(0, 0, 0, 25);
  rect(p.x + 3, p.y + 4, p.w, p.h, 12);
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(p.x, p.y, p.w, p.h, 12);

  const statusColor = m.reached ? CORRECT_GREEN : LOSS_RED;

  // Header: panel title on the left, status pill on the right
  const headerY = p.y + padY;
  let status;
  if (!m.possible) status = m.fixed > 0 ? 'No break-even' : 'No profit possible';
  else status = m.reached ? 'Break-even reached' : 'Below break-even';
  textStyle(BOLD);
  textSize(14);
  const pillW = textWidth(status) + 18;
  const pillH = 22;
  const titleRoom = innerW - pillW - 10;
  let title = 'SALES THIS MONTH VS. BREAK-EVEN';
  if (textWidth(title) > titleRoom) title = 'SALES VS. BREAK-EVEN';
  if (textWidth(title) > titleRoom) title = '';
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  text(title, innerX, headerY + pillH / 2 + 1);
  fill(statusColor);
  rect(innerX + innerW - pillW, headerY, pillW, pillH, pillH / 2);
  fill('white');
  textAlign(CENTER, CENTER);
  text(status, innerX + innerW - pillW / 2, headerY + pillH / 2 + 1);

  // Bar geometry. The scale is inset by the knob radius so the knob never leaves the panel.
  const labelY = headerY + pillH + 4;
  const trackY = labelY + 20;
  const trackH = isWide ? 30 : 26;
  const r = trackH / 2 + 2;
  const x0 = innerX + r;
  const x1 = innerX + innerW - r;
  const xAt = v => x0 + (x1 - x0) * v / SALES_MAX;

  // Scale zones: pale red below break-even, pale green at or above it
  noStroke();
  if (m.possible && m.needed <= SALES_MAX) {
    const bx = xAt(m.needed);
    fill(LOSS_TINT);
    rect(x0, trackY, bx - x0, trackH, 6, 0, 0, 6);
    fill(PROFIT_TINT);
    rect(bx, trackY, x1 - bx, trackH, 0, 6, 6, 0);
  } else {
    fill(LOSS_TINT);
    rect(x0, trackY, x1 - x0, trackH, 6);
  }
  noFill();
  stroke('silver');
  rect(x0, trackY, x1 - x0, trackH, 6);

  // The bar itself: Sales This Month, red below break-even, green at or above
  const sx = xAt(m.sales);
  noStroke();
  fill(statusColor);
  if (m.sales > 0) rect(x0, trackY + 6, sx - x0, trackH - 12, 4);

  // Break-even line and its label
  textStyle(BOLD);
  textSize(14);
  if (m.possible && m.needed <= SALES_MAX) {
    const bx = xAt(m.needed);
    stroke(INDIGO);
    strokeWeight(3);
    line(bx, trackY - 5, bx, trackY + trackH + 6);
    strokeWeight(1);
    const lbl = 'Break-even: ' + m.needed;
    const half = textWidth(lbl) / 2;
    noStroke();
    fill(INDIGO);
    textAlign(CENTER, TOP);
    text(lbl, constrain(bx, innerX + half, innerX + innerW - half), labelY);
  } else if (m.possible) {
    // Break-even is past the end of the 0-30 scale
    let lbl = 'Break-even: ' + m.needed + ' sales, past the end of this scale →';
    if (textWidth(lbl) > innerW) lbl = 'Break-even: ' + m.needed + ', off the scale →';
    noStroke();
    fill(INDIGO);
    textAlign(RIGHT, TOP);
    text(lbl, innerX + innerW, labelY);
  } else {
    let lbl = 'No break-even line: price must be above cost per sale';
    if (textWidth(lbl) > innerW) lbl = 'No break-even line at this price';
    noStroke();
    fill(LOSS_RED);
    textAlign(LEFT, TOP);
    text(lbl, innerX, labelY);
  }

  // Knob at the end of the bar, with the sales count inside
  stroke('white');
  strokeWeight(2);
  fill(statusColor);
  circle(sx, trackY + trackH / 2, 2 * r - 2);
  strokeWeight(1);
  noStroke();
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(isWide ? 15 : 14);
  text(String(m.sales), sx, trackY + trackH / 2 + 1);

  // Axis: a small tick for every sale, a longer one every 5, labels every 5 (or 10 if tight)
  const tickTop = trackY + trackH + 2;
  const unit = (x1 - x0) / SALES_MAX;
  const labelStep = unit * 5 >= 34 ? 5 : 10;
  stroke('gray');
  for (let v = 0; v <= SALES_MAX; v++) {
    const x = xAt(v);
    if (v % 5 === 0) line(x, tickTop, x, tickTop + 7);
    else if (unit >= 6) line(x, tickTop, x, tickTop + 4);
  }
  noStroke();
  fill('dimgray');
  textStyle(NORMAL);
  textSize(14);
  textAlign(CENTER, TOP);
  for (let v = 0; v <= SALES_MAX; v += labelStep) text(String(v), xAt(v), tickTop + 9);

  // The month's profit or loss
  const profitY = tickTop + 9 + 18 + (isWide ? 8 : 6);
  let profitColor = INDIGO;
  if (m.profit > 0) profitColor = CORRECT_GREEN;
  if (m.profit < 0) profitColor = LOSS_RED;
  const block = fitText(profitContent(m), innerW, isWide ? 17 : 15, BOLD);
  drawLines(block, innerX, profitY, profitColor);
}

function drawControlText() {
  // Slider labels on the left, current values right-aligned just before each slider
  noStroke();
  textStyle(BOLD);
  textSize(controlTextSize);
  for (let i = 0; i < sliderRows.length; i++) {
    const r = sliderRows[i];
    const y = drawHeight + ROW_Y[i];
    fill('black');
    textAlign(LEFT, CENTER);
    text(r.label, 10, y);
    textAlign(RIGHT, CENTER);
    text(r.fmt(Number(r.slider.value())), valueRight, y);
  }

  // What the button loads, beside the button (hidden when there is no room)
  textStyle(NORMAL);
  fill('dimgray');
  textAlign(LEFT, CENTER);
  const x = 10 + jordanButton.elt.offsetWidth + 14;
  const y = drawHeight + BUTTON_Y + jordanButton.elt.offsetHeight / 2;
  const room = canvasWidth - x - 10;
  const hints = ['$40 price, $8 cost per sale, $120 fixed costs, 5 sales',
    '$40, $8, $120 and 5 sales'];
  textSize(15);
  for (const h of hints) {
    if (textWidth(h) <= room) {
      text(h, x, y);
      break;
    }
  }
}

// ---------- Interaction ----------

// Jordan's chapter numbers, with 5 sales this month
function loadJordan() {
  priceSlider.value(JORDAN.price);
  costSlider.value(JORDAN.cost);
  fixedSlider.value(JORDAN.fixed);
  salesSlider.value(JORDAN.sales);
}

// ---------- Helpers ----------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
