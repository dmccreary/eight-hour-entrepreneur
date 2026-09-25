// Symptom vs Root Cause Drill-Down - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Learners practice the repeated "why" technique on the first complaint Priya heard in
// her interviews: "I don't have time to cook." At each layer Priya asks why, and the
// learner picks one of two candidate answers (the buttons below the drawing area).
// An answer that explains the layer moves one layer deeper and is added to the why
// trail. A dead-end answer (one that restates the symptom, that Priya never heard, or
// that jumps to a solution) loops back to the same layer with amber feedback and a
// dead-end badge on that layer. Three whys down, the root cause is revealed, stamped
// "Root Cause Found," and shown under the original symptom card for contrast.
// Click any earlier layer in the trail to jump back to it; Restart returns to the symptom.
// Wide screens (>= 600px): the why trail runs down the left, the current card and
// feedback sit on the right.
// Narrow screens (< 600px): the trail becomes a compact staircase of rows above the card.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 342;
let controlHeight = 156;  // two stacked answer buttons, then Restart and the status line
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 600;   // below this width the trail stacks above the card

// Book palette plus feedback colors
const INDIGO = '#3F51B5';        // why layers, answered connectors, open answer borders
const FOX_ORANGE = '#E8791A';    // current layer outline and pointer
const DARK_ORANGE = '#B25A10';   // "Priya asks" question text (readable on white)
const AMBER = '#FFB300';         // dead-end flash and border
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // advance and root-cause flash, border and text
const CURRENT_FILL = '#FFF3E0';  // pale orange behind the current layer in the trail
const DEAD_END_FILL = '#FFF8E1'; // pale amber behind a tried dead end

// The drill-down tree: {text, children: [{text, correct, feedback}]}.
// Only the correct child of each layer has children of its own, so the correct path
// is a single chain: symptom -> why 1 -> why 2 -> root cause.
// short is the compact label used in the narrow-screen trail; question is what Priya
// asks about that layer.
const DRILL = {
  text: 'I don\'t have time to cook',
  short: 'No time to cook',
  question: 'Why not?',
  children: [
    { text: 'There aren\'t enough hours in the day', correct: false,
      feedback: 'This restates the symptom rather than explaining it — try the other option.' },
    { text: 'My work schedule changes week to week', correct: true,
      feedback: 'That explains the complaint instead of repeating it. Now ask why a changing schedule gets in the way of cooking.',
      short: 'Schedule changes weekly',
      question: 'Why does that stop you cooking?',
      children: [
        { text: 'I can\'t commit to a weekly meal plan in advance', correct: true,
          feedback: 'That names what the changing schedule actually breaks: planning dinner ahead. Ask why one more time.',
          short: 'Can\'t plan meals ahead',
          question: 'Why can\'t you commit to a plan?',
          children: [
            { text: 'Busy parents just need a better app for organizing weekly meal plans', correct: false,
              feedback: 'That jumps to a solution before the cause is clear. Any planning app still needs a plan these customers can\'t keep.' },
            { text: 'Rotating shifts make any pre-planned dinner routine unreliable', correct: true,
              feedback: 'Ask why again and the answer stops changing. That is the sign you have reached the root cause.',
              short: 'Rotating shifts break plans',
              children: [] }
          ] },
        { text: 'I don\'t like cooking', correct: false,
          feedback: 'Priya\'s interviews didn\'t support this — stay with what she actually heard.' }
      ] }
  ]
};

// The correct path, symptom first
const CHAIN = [];
for (let n = DRILL; n; n = (n.children || []).find(c => c.correct)) CHAIN.push(n);
const MAX_DEPTH = CHAIN.length - 1;   // 3: the root cause

const WIDE_LABELS = ['SYMPTOM', 'WHY 1', 'WHY 2', 'WHY 3 · ROOT CAUSE'];
const NARROW_LABELS = ['SYMPTOM', 'WHY 1', 'WHY 2', 'ROOT'];
const CARD_HEADERS = ['WHAT PRIYA HEARD FIRST · THE SYMPTOM', 'ONE LAYER DOWN · WHY 1',
  'TWO LAYERS DOWN · WHY 2'];
const TAKEAWAY = 'The problem was never too few hours. It was an unpredictable schedule, ' +
  'so a meal kit that needs advance planning would treat the symptom and miss the cause.';
const PREFIX = { open: '', tried: '✗ ', chosen: '✓ ', locked: '' };

// Drill-down state
let depth = 0;          // 0 = symptom ... MAX_DEPTH = root cause found
let triedAt = [[]];     // triedAt[layer] = option indexes already tried as dead ends
let deadEnds = 0;       // total dead ends since the last Restart
let lastPick = null;    // {kind: 'advance' | 'deadend' | 'jump', option, layer}
let flash = 0;          // frames left in the green/amber flash
let hovered = -1;       // trail layer under the mouse, -1 = none

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let trailNodes = [];    // per layer: {x, y, w, h, lines, size, lead}
let trailGap = 16;
let cardBox = {}, feedbackBox = {}, finalBox = {};
let restartRowY = 0, restartRowH = 30;

let answerButtons = [];
let restartButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  for (let i = 0; i < 2; i++) {
    const b = createButton('');
    b.mousePressed(() => choose(i));
    // Answer buttons read as full-width choices: left-aligned text that wraps
    b.style('box-sizing', 'border-box');
    b.style('text-align', 'left');
    b.style('white-space', 'normal');
    b.style('line-height', '1.2');
    b.style('padding', '4px 12px');
    b.style('border-radius', '8px');
    b.style('font-family', 'Arial, Helvetica, sans-serif');
    b.mouseOver(() => { if (!b.elt.disabled) b.style('background-color', 'lavender'); });
    b.mouseOut(() => { if (!b.elt.disabled) b.style('background-color', 'white'); });
    answerButtons.push(b);
  }
  restartButton = createButton('Restart');
  restartButton.mousePressed(restart);
  restartButton.style('font-size', '16px');
  restartButton.style('padding', '4px 14px');

  computeLayout();

  describe('A drill-down practice on the complaint "I don\'t have time to cook." ' +
    'At each layer, choose which of two answers explains the layer above. A correct choice ' +
    'adds a layer to the why trail; a dead end loops back with feedback. After three whys ' +
    'the root cause, "Rotating shifts make any pre-planned dinner routine unreliable," is ' +
    'labeled Root Cause Found beneath the original symptom. Click a trail layer to jump back.');
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

  drawTitle();
  hovered = trailIndexAt(mouseX, mouseY);
  drawTrail();
  if (depth >= MAX_DEPTH) {
    drawFinal();
  } else {
    drawCard();
    drawFeedback();
  }
  drawControlText();
  cursor(hovered >= 0 && hovered < depth ? HAND : ARROW);
  if (flash > 0) flash--;
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  if (isWide) {
    layoutWide();
  } else {
    layoutNarrow();
  }
  sizeControls();
  updateButtons();
}

// Wide: the trail down the left, the current card and feedback on the right
function layoutWide() {
  const top = 46;
  const bottom = drawHeight - 10;
  const tw = Math.round(constrain(canvasWidth * 0.38, 230, 340));
  layoutTrailWide({ x: margin, y: top, w: tw, h: bottom - top });
  const rx = margin + tw + 18;   // room for the pointer on the current layer
  const rw = canvasWidth - margin - rx;
  cardBox = { x: rx, y: top, w: rw, h: 140 };
  const fy = top + 140 + 10;
  feedbackBox = { x: rx, y: fy, w: rw, h: bottom - fy };
  finalBox = { x: rx, y: top, w: rw, h: bottom - top };
}

// Every slot is sized for its layer's full text, so the trail never jumps as it fills.
// One text size is used for all four slots: the largest that fits the trail's height.
function layoutTrailWide(b) {
  const padX = 10, padT = 7, padB = 8, headLead = 17, minGap = 14, maxGap = 30;
  let size, all;
  for (size = 15; size >= 11; size--) {
    textStyle(NORMAL);
    textSize(size);
    all = CHAIN.map(n => wrapText(sentence(n.text), b.w - 2 * padX));
    const lead = size * 1.25;
    const total = all.reduce((sum, lines) => sum + padT + headLead + lines.length * lead + padB, 0);
    if (total + 3 * minGap <= b.h) break;
  }
  size = max(size, 11);
  const lead = size * 1.25;
  const heights = all.map(lines => padT + headLead + lines.length * lead + padB);
  const sumH = heights.reduce((a, c) => a + c, 0);
  trailGap = constrain((b.h - sumH) / 3, minGap, maxGap);
  let y = b.y;
  trailNodes = CHAIN.map((n, i) => {
    const node = { x: b.x, y: y, w: b.w, h: heights[i], lines: all[i], size: size, lead: lead,
      padX: padX, padT: padT };
    y += heights[i] + trailGap;
    return node;
  });
}

// Narrow: the trail is a staircase of one-line rows, each indented one step deeper,
// with the card, feedback and final view stacked below it
function layoutNarrow() {
  const top = 34, rowH = 20, gap = 2, indent = 8;
  trailNodes = CHAIN.map((n, i) => ({
    x: 10 + i * indent, y: top + i * (rowH + gap), w: canvasWidth - 20 - i * indent, h: rowH
  }));
  const trailBottom = top + CHAIN.length * rowH + (CHAIN.length - 1) * gap;
  const cy = trailBottom + 7;
  cardBox = { x: 10, y: cy, w: canvasWidth - 20, h: 104 };
  const fy = cy + 104 + 6;
  feedbackBox = { x: 10, y: fy, w: canvasWidth - 20, h: drawHeight - 8 - fy };
  finalBox = { x: 10, y: cy, w: canvasWidth - 20, h: drawHeight - 8 - cy };
}

// Size the answer buttons for the longest answer in the whole tree so they keep the
// same height (and Restart keeps the same place) on every layer. The font steps down
// from 16px until both answers and Restart fit in the control area.
function sizeControls() {
  const w = canvasWidth - 20;
  const texts = [];
  for (const n of CHAIN) for (const c of (n.children || [])) texts.push(PREFIX.chosen + c.text);
  let slotH = 0, rH = 0;
  for (let fs = 16; fs >= 13; fs--) {
    for (const b of answerButtons) {
      b.style('font-size', fs + 'px');
      b.style('width', w + 'px');
      b.style('height', 'auto');
    }
    slotH = 0;
    for (const t of texts) {
      answerButtons[0].html(t);
      slotH = max(slotH, answerButtons[0].elt.offsetHeight);
    }
    restartButton.style('font-size', fs + 'px');
    rH = restartButton.elt.offsetHeight;
    if (2 * slotH + rH + 28 <= controlHeight) break;
  }
  slotH = max(slotH, 36);   // comfortable click target on wide screens
  for (const b of answerButtons) b.style('height', slotH + 'px');

  // Spread any spare height: a little between the two answers, the rest above and below
  const free = controlHeight - (2 * slotH + rH);
  const gapAB = constrain(free * 0.1, 5, 10);
  const rest = free - gapAB;
  const topPad = rest * 0.34;
  const gapBR = rest * 0.36;
  const ay = drawHeight + topPad;
  answerButtons[0].position(10, ay);
  answerButtons[1].position(10, ay + slotH + gapAB);
  restartRowY = ay + 2 * slotH + gapAB + gapBR;
  restartRowH = rH;
  restartButton.position(10, restartRowY);
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  const title = 'Symptom vs Root Cause Drill-Down';
  let s = isWide ? 24 : 20;
  textSize(s);
  while (s > 14 && textWidth(title) > canvasWidth - 20) textSize(--s);
  text(title, canvasWidth / 2, isWide ? 10 : 8);
}

function drawTrail() {
  for (let i = 0; i < CHAIN.length; i++) {
    if (isWide) drawTrailNodeWide(i);
    else drawTrailRowNarrow(i);
  }
  textStyle(NORMAL);
}

// Box colors for a trail layer: placeholder, reached, hovered, current, or root cause
function trailColors(i) {
  if (i > depth) return { fill: 'rgba(255,255,255,0.5)', stroke: 'silver', weight: 1, dashed: true };
  if (i === MAX_DEPTH) return { fill: 'honeydew', stroke: CORRECT_GREEN, weight: 3 };
  if (i === depth) return { fill: CURRENT_FILL, stroke: FOX_ORANGE, weight: 3 };
  return { fill: i === hovered ? 'lavender' : 'white', stroke: INDIGO, weight: 1 };
}

function labelColor(i) {
  if (i > depth) return 'gray';
  if (i === MAX_DEPTH) return CORRECT_GREEN;
  return i === 0 ? 'dimgray' : INDIGO;
}

function drawBox(n, c, r) {
  fill(c.fill);
  stroke(c.stroke);
  strokeWeight(c.weight);
  if (c.dashed) drawingContext.setLineDash([5, 4]);
  rect(n.x, n.y, n.w, n.h, r);
  drawingContext.setLineDash([]);
  strokeWeight(1);
}

function drawTrailNodeWide(i) {
  const n = trailNodes[i];
  drawBox(n, trailColors(i), 8);

  // Header: layer label on the left, dead-end count on the right
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(12);
  fill(labelColor(i));
  text(WIDE_LABELS[i], n.x + n.padX, n.y + n.padT);
  const tries = triedAt[i] ? triedAt[i].length : 0;
  if (i <= depth && tries > 0) {
    const badge = tries + ' dead end' + (tries === 1 ? '' : 's');
    const bx = n.x + n.w - n.padX;
    fill(AMBER_TEXT);
    textAlign(RIGHT, TOP);
    text(badge, bx, n.y + n.padT);
    drawLoopIcon(bx - textWidth(badge) - 9, n.y + n.padT + 7, 5, AMBER_TEXT);
  }

  // Body: the layer's text once reached, a question mark until then
  if (i <= depth) {
    textAlign(LEFT, TOP);
    textStyle(i === MAX_DEPTH ? BOLD : NORMAL);
    textSize(n.size);
    fill('black');
    let y = n.y + n.padT + 17;
    for (const ln of n.lines) {
      text(ln, n.x + n.padX, y);
      y += n.lead;
    }
  } else {
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(18);
    fill('silver');
    text('?', n.x + n.w / 2, n.y + (n.h + 17) / 2);
  }

  // Pointer from the current layer toward the card on the right
  if (i === depth) {
    noStroke();
    fill(i === MAX_DEPTH ? CORRECT_GREEN : FOX_ORANGE);
    const cy = n.y + n.h / 2;
    triangle(n.x + n.w + 4, cy - 7, n.x + n.w + 4, cy + 7, n.x + n.w + 13, cy);
  }

  // Connector down to the next layer, labeled with the question Priya asks here
  if (i < MAX_DEPTH) {
    const x = n.x + 24;
    const y1 = n.y + n.h + 2;
    const y2 = trailNodes[i + 1].y - 2;
    const col = i < depth ? INDIGO : (i === depth ? FOX_ORANGE : 'silver');
    stroke(col);
    strokeWeight(2);
    line(x, y1, x, y2 - 5);
    noStroke();
    fill(col);
    triangle(x - 5, y2 - 6, x + 5, y2 - 6, x, y2);
    strokeWeight(1);
    // The label may run into the gutter beside the trail, and shrinks one step if needed
    textAlign(LEFT, CENTER);
    textStyle(i <= depth ? BOLDITALIC : ITALIC);
    textSize(12);
    fill(i < depth ? 'dimgray' : (i === depth ? DARK_ORANGE : 'gray'));
    const q = i <= depth ? CHAIN[i].question : 'why?';
    const room = n.w - 24;
    if (textWidth(q) > room) textSize(11);
    if (textWidth(q) <= room) text(q, x + 12, (y1 + y2) / 2);
  }
}

function drawTrailRowNarrow(i) {
  const n = trailNodes[i];
  drawBox(n, trailColors(i), 5);
  const cy = n.y + n.h / 2;
  noStroke();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(11);
  fill(labelColor(i));
  text(NARROW_LABELS[i], n.x + 8, cy + 1);

  // Dead-end badge on the right
  let right = n.x + n.w - 8;
  const tries = triedAt[i] ? triedAt[i].length : 0;
  if (i <= depth && tries > 0) {
    textSize(12);
    fill(AMBER_TEXT);
    textAlign(RIGHT, CENTER);
    const badge = String(tries);
    text(badge, right, cy + 1);
    drawLoopIcon(right - textWidth(badge) - 9, cy, 5, AMBER_TEXT);
    right -= textWidth(badge) + 24;
  }

  const tx = n.x + 70;
  textAlign(LEFT, CENTER);
  if (i <= depth) {
    textStyle(i === MAX_DEPTH ? BOLD : NORMAL);
    let s = 14;
    textSize(s);
    while (s > 10 && textWidth(CHAIN[i].short) > right - tx) textSize(--s);
    fill('black');
    text(CHAIN[i].short, tx, cy + 1);
  } else {
    textStyle(BOLD);
    textSize(14);
    fill('silver');
    text('?', tx, cy + 1);
  }
}

// The current layer: header, the statement Priya heard, and the why she asks next
function drawCard() {
  const c = cardBox;
  noStroke();
  fill(0, 0, 0, 18);
  rect(c.x + 2, c.y + 3, c.w, c.h, 12);
  fill('white');
  stroke(FOX_ORANGE);
  strokeWeight(2);
  rect(c.x, c.y, c.w, c.h, 12);
  strokeWeight(1);

  // Green flash right after moving one layer deeper
  if (flash > 0 && lastPick && lastPick.kind === 'advance') {
    noStroke();
    fill(46, 125, 50, map(flash, 0, 40, 0, 90));
    rect(c.x, c.y, c.w, c.h, 12);
  }

  const pad = isWide ? 14 : 10;
  const innerW = c.w - 2 * pad;

  // Header, shortened when the long form will not fit
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(isWide ? 13 : 12);
  let header = CARD_HEADERS[depth];
  if (textWidth(header) > innerW) header = NARROW_LABELS[depth];
  text(header, c.x + pad, c.y + pad - 2);
  const headBottom = c.y + pad - 2 + (isWide ? 18 : 16);

  // Question row along the bottom of the card
  const qBase = isWide ? 18 : 16;
  const qTop = c.y + c.h - pad - qBase * 1.2;
  drawQuestion(c.x + pad, qTop, innerW, qBase);

  // The statement, as large as fits between the header and the question
  const areaTop = headBottom + 2;
  const areaBottom = qTop - 4;
  const fit = fitText('“' + sentence(CHAIN[depth].text) + '”', innerW, areaBottom - areaTop,
    isWide ? 22 : 18, 13, NORMAL);
  textStyle(NORMAL);
  textSize(fit.size);
  fill('black');
  textAlign(LEFT, TOP);
  let y = max(areaTop, (areaTop + areaBottom) / 2 - (fit.lines.length * fit.lead) / 2);
  for (const ln of fit.lines) {
    text(ln, c.x + pad, y);
    y += fit.lead;
  }
}

// "Priya asks: “Why not?”" on one line, shrinking before it drops the prefix
function drawQuestion(x, y, maxW, base) {
  const q = '“' + CHAIN[depth].question + '”';
  let prefix = 'Priya asks: ';
  textStyle(BOLD);
  let s = base;
  textSize(s);
  while (s > 13 && textWidth(prefix + q) > maxW) textSize(--s);
  if (textWidth(prefix + q) > maxW) prefix = '';
  noStroke();
  textAlign(LEFT, TOP);
  fill(DARK_ORANGE);
  text(prefix, x, y);
  fill('black');
  text(q, x + textWidth(prefix), y);
  textStyle(NORMAL);
}

// Feedback on the last pick, or how to drill down before the first one
function drawFeedback() {
  const p = feedbackBox;
  const kind = lastPick ? lastPick.kind : 'start';
  fill('white');
  if (kind === 'deadend') stroke(AMBER);
  else if (kind === 'advance') stroke(CORRECT_GREEN);
  else stroke('silver');
  strokeWeight(kind === 'deadend' || kind === 'advance' ? 2 : 1);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  // Amber flash right after a dead end
  if (flash > 0 && kind === 'deadend') {
    noStroke();
    fill(255, 179, 0, map(flash, 0, 40, 0, 110));
    rect(p.x, p.y, p.w, p.h, 10);
  }

  let items;
  if (kind === 'advance') {
    items = [
      { kind: 'result', text: '✓ One layer deeper', color: CORRECT_GREEN },
      { kind: 'body', text: lastPick.option.feedback },
      { kind: 'hint', text: 'Click any layer in the trail to jump back to it.', drop: 1 }
    ];
  } else if (kind === 'deadend') {
    items = [
      { kind: 'result', text: isWide ? 'Dead end: back to the same layer' : 'Dead end',
        color: AMBER_TEXT, icon: true },
      { kind: 'quote', text: '“' + lastPick.option.text + '”', drop: 1 },
      { kind: 'body', text: lastPick.option.feedback }
    ];
  } else if (kind === 'jump') {
    const name = NARROW_LABELS[lastPick.layer];
    items = [
      { kind: 'result', text: 'Back at ' + name.charAt(0) + name.slice(1).toLowerCase(),
        color: INDIGO },
      { kind: 'body', text: 'The layers below were cleared. Ask why again from here.' }
    ];
  } else {
    items = [
      { kind: 'label', text: 'HOW TO DRILL DOWN' },
      { kind: 'body', text: 'Pick the answer that explains this layer instead of repeating it, ' +
        'and stay with what Priya actually heard. Each answer you pick becomes the next layer down.' }
    ];
  }
  const inner = { x: p.x + 14, y: p.y + 10, w: p.w - 28, h: p.h - 18 };
  const col = fitColumn(items, inner.w, inner.h);
  renderBlocks(col, inner.x, inner.y);
}

// Root cause found: the original symptom on top, the root cause stamped beneath it
function drawFinal() {
  const b = finalBox;
  let plan = null;
  for (const withTake of [true, false]) {
    for (let s = 1.0; s >= 0.75; s -= 0.05) {
      const p = planFinal(b.w, s, withTake);
      if (p.h <= b.h) { plan = p; break; }
    }
    if (plan) break;
  }
  if (!plan) plan = planFinal(b.w, 0.75, false);

  let y = b.y;
  const pad = plan.pad;

  // Symptom card
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(b.x, y, b.w, plan.symH, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(plan.labelSize);
  fill('dimgray');
  text(plan.symLabel, b.x + pad, y + pad);
  let ty = y + pad + plan.labelSize * 1.3 + 3;
  textStyle(NORMAL);
  textSize(plan.symSize);
  fill('dimgray');
  for (const ln of plan.symLines) {
    text(ln, b.x + pad, ty);
    ty += plan.symSize * 1.3;
  }
  y += plan.symH;

  // Arrow: three whys deeper
  const ax = b.x + 26;
  stroke(INDIGO);
  strokeWeight(2);
  line(ax, y + 3, ax, y + plan.arrowH - 8);
  noStroke();
  fill(INDIGO);
  triangle(ax - 6, y + plan.arrowH - 9, ax + 6, y + plan.arrowH - 9, ax, y + plan.arrowH - 2);
  strokeWeight(1);
  textAlign(LEFT, CENTER);
  textStyle(ITALIC);
  textSize(plan.arrowSize);
  fill('dimgray');
  text(plan.arrowText, ax + 14, y + plan.arrowH / 2);
  y += plan.arrowH;

  // Root cause card with the stamp
  fill('honeydew');
  stroke(CORRECT_GREEN);
  strokeWeight(3);
  rect(b.x, y, b.w, plan.rootH, 10);
  strokeWeight(1);
  if (flash > 0) {
    noStroke();
    fill(46, 125, 50, map(flash, 0, 40, 0, 90));
    rect(b.x, y, b.w, plan.rootH, 10);
  }
  drawStamp(b.x + pad, y + pad, plan.stampSize);
  ty = y + pad + plan.stampH + 6;
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(plan.rootSize);
  fill('black');
  for (const ln of plan.rootLines) {
    text(ln, b.x + pad, ty);
    ty += plan.rootSize * 1.3;
  }
  y += plan.rootH;

  // Takeaway, when there is room
  if (plan.takeLines) {
    y += plan.takeGap;
    textStyle(NORMAL);
    textSize(plan.takeSize);
    fill('black');
    for (const ln of plan.takeLines) {
      text(ln, b.x + 4, y);
      y += plan.takeSize * 1.3;
    }
  }
  textStyle(NORMAL);
}

// Measure the final view at scale s; returns every size, line list and height
function planFinal(w, s, withTake) {
  const p = {};
  p.pad = (isWide ? 12 : 9) * s;
  const innerW = w - 2 * p.pad;
  p.labelSize = (isWide ? 13 : 12) * s;
  textStyle(BOLD);
  textSize(p.labelSize);
  p.symLabel = 'SYMPTOM · WHAT PRIYA HEARD FIRST';
  if (textWidth(p.symLabel) > innerW) p.symLabel = 'SYMPTOM';
  p.symSize = (isWide ? 19 : 16) * s;
  textStyle(NORMAL);
  textSize(p.symSize);
  p.symLines = wrapText('“' + sentence(CHAIN[0].text) + '”', innerW);
  p.symH = 2 * p.pad + p.labelSize * 1.3 + 3 + p.symLines.length * p.symSize * 1.3;

  p.arrowH = (isWide ? 34 : 26) * s;
  p.arrowSize = (isWide ? 14 : 13) * s;
  textStyle(ITALIC);
  textSize(p.arrowSize);
  const ends = deadEnds === 0 ? 'no dead ends' :
    deadEnds + ' dead end' + (deadEnds === 1 ? '' : 's') + ' on the way';
  p.arrowText = MAX_DEPTH + ' whys deeper · ' + ends;
  if (textWidth(p.arrowText) > w - 44) p.arrowText = MAX_DEPTH + ' whys deeper';

  p.stampSize = (isWide ? 15 : 13) * s;
  p.stampH = p.stampSize * 1.9;
  p.rootSize = (isWide ? 20 : 17) * s;
  textStyle(BOLD);
  textSize(p.rootSize);
  p.rootLines = wrapText(sentence(CHAIN[MAX_DEPTH].text), innerW);
  p.rootH = 2 * p.pad + p.stampH + 6 + p.rootLines.length * p.rootSize * 1.3;

  p.h = p.symH + p.arrowH + p.rootH;
  p.takeLines = null;
  if (withTake) {
    p.takeSize = (isWide ? 16 : 14) * s;
    p.takeGap = 8 * s;
    textStyle(NORMAL);
    textSize(p.takeSize);
    p.takeLines = wrapText(TAKEAWAY, w - 8);
    p.h += p.takeGap + p.takeLines.length * p.takeSize * 1.3;
  }
  textStyle(NORMAL);
  return p;
}

// "ROOT CAUSE FOUND" rubber stamp, tilted slightly
function drawStamp(x, y, size) {
  const label = '✓ ROOT CAUSE FOUND';
  textStyle(BOLD);
  textSize(size);
  const w = textWidth(label) + size * 1.4;
  const h = size * 1.9;
  push();
  translate(x + w / 2, y + h / 2);
  rotate(-0.03);
  noFill();
  stroke(CORRECT_GREEN);
  strokeWeight(2.5);
  rect(-w / 2, -h / 2, w, h, 6);
  noStroke();
  fill(CORRECT_GREEN);
  textAlign(CENTER, CENTER);
  text(label, 0, 1);
  pop();
  textStyle(NORMAL);
  strokeWeight(1);
}

// Progress and dead-end count to the right of Restart, shortened to fit
function drawControlText() {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(16);
  const x = 10 + restartButton.elt.offsetWidth + 14;
  const room = canvasWidth - x - 10;
  const y = restartRowY + restartRowH / 2;
  let options;
  if (depth >= MAX_DEPTH) {
    textStyle(BOLD);
    fill(CORRECT_GREEN);
    options = deadEnds === 0 ?
      ['Root cause found with no dead ends!', 'Root cause found!', 'Found!'] :
      ['Root cause found · Dead ends: ' + deadEnds, 'Root cause found', 'Found!'];
  } else {
    textStyle(NORMAL);
    fill('dimgray');
    options = ['Why ' + (depth + 1) + ' of ' + MAX_DEPTH + '  ·  Dead ends: ' + deadEnds,
      'Why ' + (depth + 1) + '/' + MAX_DEPTH + ' · Dead ends ' + deadEnds,
      'Why ' + (depth + 1) + '/' + MAX_DEPTH];
  }
  const msg = options.find(m => textWidth(m) <= room);
  if (msg) text(msg, x, y);
  textStyle(NORMAL);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of feedback item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:  { size: 14, style: 'bold',   color: 'dimgray', before: 0 },
  result: { size: 19, style: 'bold',   color: 'black',   before: 0 },
  quote:  { size: 16, style: 'italic', color: 'dimgray', before: 6 },
  body:   { size: 16, style: 'normal', color: 'black',   before: 6 },
  hint:   { size: 14, style: 'normal', color: 'dimgray', before: 10 }
};
const MIN_SCALE = 0.8;  // never shrink feedback text below 80% of its base size

// Fit the items to the box. Droppable items go first (highest drop first), before any
// text is shrunk; then the largest scale that fits is used.
function fitColumn(items, w, h) {
  let list = items.slice();
  for (;;) {
    const laid = layoutItems(list, w, 1.0);
    if (laid.height <= h) return laid;
    let worst = -1;
    list.forEach((it, idx) => {
      if (it.drop && (worst < 0 || it.drop > list[worst].drop)) worst = idx;
    });
    if (worst < 0) break;
    list = list.filter((_, idx) => idx !== worst);
  }
  for (let s = 0.95; s >= MIN_SCALE - 0.001; s -= 0.05) {
    const laid = layoutItems(list, w, s);
    if (laid.height <= h) return laid;
  }
  return layoutItems(list, w, MIN_SCALE);
}

function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    textSize(size);
    textStyle(st.style);
    const indent = it.icon ? size * 1.3 : 0;   // hanging indent beside the loop icon
    const lines = wrapText(it.text, maxW - indent);
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    blocks.push({ lines: lines, size: size, style: st.style, color: it.color || st.color,
      lead: lead, before: before, icon: it.icon, indent: indent });
    height += before + lines.length * lead;
  }
  textStyle(NORMAL);
  blocks.height = height;
  return blocks;
}

function renderBlocks(blocks, x, y) {
  noStroke();
  textAlign(LEFT, TOP);
  for (const b of blocks) {
    y += b.before;
    if (b.icon) drawLoopIcon(x + b.size * 0.45, y + b.size * 0.58, b.size * 0.36, b.color);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(b.size);
    textStyle(b.style);
    fill(b.color);
    for (const ln of b.lines) {
      text(ln, x + b.indent, y);
      y += b.lead;
    }
  }
  textStyle(NORMAL);
}

// A small loop arrow centered at (cx, cy): the dead-end mark. Drawn rather than typed
// because the loop glyph renders tiny or not at all in some fonts.
function drawLoopIcon(cx, cy, r, col) {
  const a0 = radians(-40);
  const a1 = radians(235);
  push();
  noFill();
  stroke(col);
  strokeWeight(max(1.5, r * 0.36));
  strokeCap(ROUND);
  arc(cx, cy, 2 * r, 2 * r, a0, a1);
  // Arrowhead at the end of the arc, pointing along the direction of travel
  const px = cx + r * cos(a1), py = cy + r * sin(a1);
  const dx = -sin(a1), dy = cos(a1);   // tangent (clockwise)
  const nx = cos(a1), ny = sin(a1);    // outward normal
  const h = r * 0.9, w = r * 0.6;
  noStroke();
  fill(col);
  triangle(px + dx * h, py + dy * h, px + nx * w, py + ny * w, px - nx * w, py - ny * w);
  pop();
}

// Largest text size (down to minSize) at which str fits maxW by maxH
function fitText(str, maxW, maxH, base, minSize, style) {
  let lines = [], lead = 0, size;
  for (size = base; size >= minSize; size--) {
    textStyle(style);
    textSize(size);
    lines = wrapText(str, maxW);
    lead = size * 1.3;
    if (lines.length * lead <= maxH) break;
  }
  size = max(size, minSize);
  return { lines: lines, lead: lead, size: size };
}

// ---------- Drill-down logic ----------

function choose(i) {
  if (depth >= MAX_DEPTH) return;
  const opt = CHAIN[depth].children[i];
  if (!opt || triedAt[depth].includes(i)) return;
  if (opt.correct) {
    depth++;
    triedAt[depth] = [];
    lastPick = { kind: 'advance', option: opt, layer: depth };
  } else {
    triedAt[depth].push(i);
    deadEnds++;
    lastPick = { kind: 'deadend', option: opt, layer: depth };
  }
  flash = 40;
  updateButtons();
}

// Jump back to an earlier layer: the layers below it are cleared and its answers reopen
function jumpTo(i) {
  if (i < 0 || i >= depth) return;
  depth = i;
  triedAt = triedAt.slice(0, i);
  triedAt[i] = [];
  lastPick = { kind: 'jump', layer: i };
  flash = 0;
  updateButtons();
}

function restart() {
  depth = 0;
  triedAt = [[]];
  deadEnds = 0;
  lastPick = null;
  flash = 0;
  updateButtons();
}

// Show the current layer's answers. After the root cause is found, the last layer's
// answers stay visible but locked, with the root cause checked.
function updateButtons() {
  const done = depth >= MAX_DEPTH;
  const layer = done ? MAX_DEPTH - 1 : depth;
  const opts = CHAIN[layer].children;
  const tried = triedAt[layer] || [];
  answerButtons.forEach((b, i) => {
    const opt = opts[i];
    if (!opt) {
      b.hide();
      return;
    }
    b.show();
    let state = 'open';
    if (done) state = opt.correct ? 'chosen' : (tried.includes(i) ? 'tried' : 'locked');
    else if (tried.includes(i)) state = 'tried';
    b.html(PREFIX[state] + opt.text);
    setAnswerStyle(b, state);
    if (state === 'open') b.removeAttribute('disabled');
    else b.attribute('disabled', '');
  });
}

function setAnswerStyle(b, state) {
  const looks = {
    open:   { bg: 'white',       border: INDIGO,        color: 'black' },
    tried:  { bg: DEAD_END_FILL, border: AMBER,         color: AMBER_TEXT },
    chosen: { bg: 'honeydew',    border: CORRECT_GREEN, color: 'black' },
    locked: { bg: 'whitesmoke',  border: 'silver',      color: 'gray' }
  };
  const l = looks[state];
  b.style('background-color', l.bg);
  b.style('border', '2px solid ' + l.border);
  b.style('color', l.color);
  b.style('cursor', state === 'open' ? 'pointer' : 'default');
}

// ---------- Interaction ----------

// Index of the trail layer under (mx, my), or -1
function trailIndexAt(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return -1;
  for (let i = 0; i < trailNodes.length; i++) {
    const n = trailNodes[i];
    if (mx >= n.x && mx <= n.x + n.w && my >= n.y && my <= n.y + n.h) return i;
  }
  return -1;
}

function mousePressed() {
  const i = trailIndexAt(mouseX, mouseY);
  if (i >= 0 && i < depth) jumpTo(i);
}

// ---------- Helpers ----------

// Add a period unless the text already ends with one
function sentence(t) {
  return /[.!?]$/.test(t) ? t : t + '.';
}

// Split a string into lines no wider than maxW at the current text size and style
function wrapText(str, maxW) {
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
