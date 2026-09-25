// Minimum Testable Iteration Decision Tree - p5.js MicroSim
// CANVAS_HEIGHT: 560
// A vertical decision tree with three yes/no decision diamonds, one per lean-test
// principle: Service Before Product, Manual Before Automated, and Pre-Selling Before
// Building. For the selected venture (Jordan's grooming van or Priya's meal-prep
// subscription) the learner judges each diamond by choosing one of two answers below
// the drawing area. Each answer carries its reasoning: one is sound, the other is a
// common founder objection. A judgment that holds turns the Yes branch green, fills in
// that step's design note, and moves to the next diamond. A judgment that does not
// hold lights the No branch amber with a "Reconsider" note and an explanation, and the
// learner decides again. After the third diamond the card shows the combined minimum
// testable iteration, and the tree keeps the whole path visible as its justification.
// The scenario selector swaps in the other founder's parallel path; Reset returns to
// the first diamond.
// Wide screens (>= 600px): the tree runs down the left, the question card and feedback
// sit on the right.
// Narrow screens (< 600px): the tree becomes a compact vertical trail of rows above
// the card.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 160;  // two stacked answer buttons, then Reset, the scenario selector and status
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 600;   // below this width the tree becomes a trail above the card

// Book palette plus feedback colors
const INDIGO = '#3F51B5';        // answered diamonds, spine between steps, open answer borders
const FOX_ORANGE = '#E8791A';    // current diamond and question card outline
const DARK_ORANGE = '#B25A10';   // "deciding now" text (readable on white)
const AMBER = '#FFB300';         // reconsider branch, flash and border
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // judgments that hold, design notes, final design
const CURRENT_FILL = '#FFF3E0';  // pale orange behind the current diamond
const DEAD_END_FILL = '#FFF8E1'; // pale amber behind a reconsidered No branch

// The three principles, in the order the tree asks about them
const PRINCIPLES = ['Service Before Product', 'Manual Before Automated',
  'Pre-Selling Before Building'];
// Short diamond labels for the tree
const SHORT_Q = ['Service first?', 'By hand?', 'Pay first?'];
// Generic fallback note on each No branch (the same for every venture)
const NO_NOTES = [
  'Reconsider — most early ventures can find a service-first version.',
  'Reconsider — do it by hand until the manual version shows people want it.',
  'Reconsider — a yes that costs the customer nothing proves very little.'
];

// Each scenario's decision tree: an array of {question, yesNote, noNote} objects, plus
// the reasoning shown on each answer (yesReason / noReason), the feedback explaining
// why each judgment holds or not (yesWhy / noWhy), and a short note for the tree.
const SCENARIOS = [
  {
    label: 'Jordan\'s grooming van',
    name: 'Jordan',
    header: 'JORDAN\'S GROOMING VAN',
    idea: 'Jordan\'s idea is a mobile dog-grooming van that comes to customers\' homes.',
    finalLabel: 'JORDAN\'S MINIMUM TESTABLE ITERATION',
    finalText: 'A manually booked, pre-paid, single driveway grooming session — no van, ' +
      'no app, no inventory.',
    tree: [
      { question: 'Can this be delivered as a hands-on service before it\'s a packaged product?',
        yesReason: 'Jordan can groom one dog in a customer\'s driveway this week.',
        noReason: 'Mobile grooming can\'t start until the van is bought and fitted out.',
        yesWhy: 'The van is only how Jordan might package the service later. The grooming ' +
          'itself can be done by hand this week.',
        noWhy: 'The van is a delivery vehicle, not what customers pay for. A driveway ' +
          'session tests the same demand without it.',
        yesNote: 'Apply Service Before Product: offer driveway grooming sessions yourself, ' +
          'not a grooming-van business plan.',
        noNote: NO_NOTES[0],
        shortNote: 'Driveway sessions, done by Jordan' },
      { question: 'Can this be delivered by hand, without new software or equipment?',
        yesReason: 'Bookings can come in by text and fit on one sheet of paper.',
        noReason: 'Without a booking app, appointments will get lost.',
        yesWhy: 'A first test has a handful of bookings at most. Text messages and a paper ' +
          'list handle that easily.',
        noWhy: 'A handful of test bookings won\'t get lost on paper. An app would spend ' +
          'weeks automating demand nobody has shown yet.',
        yesNote: 'Apply Manual Before Automated: book by text message, track appointments ' +
          'on paper.',
        noNote: NO_NOTES[1],
        shortNote: 'Booked by text, tracked on paper' },
      { question: 'Can a customer pay something before the full offer exists?',
        yesReason: 'A neighbor can put down a deposit to hold a slot this week.',
        noReason: 'It isn\'t fair to ask for money before the van service exists.',
        yesWhy: 'A deposit costs the customer something real, so it separates real demand ' +
          'from polite interest.',
        noWhy: 'The deposit holds a real session this week, not a van that doesn\'t exist. ' +
          'Asking is how Jordan learns whether the interest is real.',
        yesNote: 'Apply Pre-Selling Before Building: collect a $10 deposit to hold a ' +
          'driveway slot this week.',
        noNote: NO_NOTES[2],
        shortNote: '$10 deposit holds a driveway slot' }
    ]
  },
  {
    label: 'Priya\'s meal-prep subscription',
    name: 'Priya',
    header: 'PRIYA\'S MEAL-PREP SUBSCRIPTION',
    idea: 'Priya\'s idea is a weekly meal-prep subscription for busy dual-income families.',
    finalLabel: 'PRIYA\'S MINIMUM TESTABLE ITERATION',
    finalText: 'A manually booked, pre-paid single meal delivered to one household this ' +
      'week — no kitchen lease, no subscription app.',
    tree: [
      { question: 'Can this be delivered as a hands-on service before it\'s a packaged product?',
        yesReason: 'Priya can cook one family\'s dinner and drop it off this week.',
        noReason: 'Meal prep needs a leased kitchen and a subscription plan first.',
        yesWhy: 'The subscription is the package. Underneath it is one cooked meal for one ' +
          'tired family, and that can happen this week.',
        noWhy: 'A kitchen lease and a subscription plan are the product wrapper. One ' +
          'delivered meal tests whether a family wants dinner handled at all.',
        yesNote: 'Apply Service Before Product: cook and deliver one family\'s meal ' +
          'yourself, not a subscription business plan.',
        noNote: NO_NOTES[0],
        shortNote: 'One meal, cooked and dropped off' },
      { question: 'Can this be delivered by hand, without new software or equipment?',
        yesReason: 'Orders can come in by text and fit on a handwritten list.',
        noReason: 'Families expect an ordering app before they\'ll place an order.',
        yesWhy: 'One household\'s order fits in a text message. An ordering app matters ' +
          'only once more families order than a list can hold.',
        noWhy: 'For one test household, an app adds weeks of building and tells Priya ' +
          'nothing new about whether families want the meal.',
        yesNote: 'Apply Manual Before Automated: take orders by text message, track ' +
          'deliveries on a paper list.',
        noNote: NO_NOTES[1],
        shortNote: 'Ordered by text, listed on paper' },
      { question: 'Can a customer pay something before the full offer exists?',
        yesReason: 'A family can pay for this week\'s meal when they book it.',
        noReason: 'Families won\'t pay before tasting, so the first meals must be free.',
        yesWhy: 'Paying for one meal in advance is a small, real commitment, the signal ' +
          'that separates real demand from polite interest.',
        noWhy: 'A free meal shows whether families like the food, not whether they\'ll ' +
          'pay for it. Payment up front is the signal Priya needs.',
        yesNote: 'Apply Pre-Selling Before Building: take payment for this week\'s meal ' +
          'when the family books it.',
        noNote: NO_NOTES[2],
        shortNote: 'Paid for when the family books' }
    ]
  }
];
const STEPS = 3;
const PREFIX = { open: '', tried: '✗ ', chosen: '✓ ', locked: '' };

// Decision state
let scen = 0;             // index into SCENARIOS; Jordan on load
let depth = 0;            // 0-2 = the diamond being judged, 3 = all three judged
let tries = [0, 0, 0];    // No judgments reconsidered at each diamond
let reconsidered = 0;     // total No judgments since the last Reset
let lastPick = null;      // {kind: 'holds' | 'reconsider', step}
let flash = 0;            // frames left in the green/amber flash

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let diamonds = [], notes = [], noBoxes = [];  // wide tree parts
let trailRows = [];                            // narrow trail rows
let cardQ = {}, feedbackQ = {};                // while judging
let cardF = {}, feedbackF = {};                // after all three judgments
let controlRowY = 0, controlRowH = 30;
let feedbackCache = null;

let answerButtons = [];
let resetButton, scenarioSelect;

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
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetPath);
  resetButton.style('font-size', '16px');
  resetButton.style('padding', '4px 14px');
  scenarioSelect = createSelect();
  for (const s of SCENARIOS) scenarioSelect.option(s.label);
  scenarioSelect.selected(SCENARIOS[0].label);
  scenarioSelect.changed(changeScenario);
  scenarioSelect.style('font-size', '16px');
  scenarioSelect.style('padding', '2px 4px');

  computeLayout();

  describe('A vertical decision tree with three yes-or-no diamonds for a venture scenario, ' +
    'Jordan\'s grooming van or Priya\'s meal-prep subscription. Each diamond asks whether ' +
    'one lean-test principle applies: service before product, manual before automated, and ' +
    'pre-selling before building. Choose the answer whose reasoning holds; feedback explains ' +
    'whether your judgment holds, and each judgment that holds adds a design note to the ' +
    'tree. After all three, the card shows the combined minimum testable iteration.');
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
  if (isWide) drawTreeWide();
  else drawTrailNarrow();
  if (depth >= STEPS) drawFinalCard();
  else drawCard();
  drawFeedback();
  drawControlText();
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
  feedbackCache = null;
  sizeControls();
  updateButtons();
}

// Wide: the tree down the left, the question card and feedback on the right
function layoutWide() {
  const top = 46;
  const bottom = drawHeight - 10;
  const tw = Math.round(constrain(canvasWidth * 0.42, 250, 340));
  layoutTreeWide({ x: margin, y: top, w: tw, h: bottom - top });
  const rx = margin + tw + 20;
  const rw = canvasWidth - margin - rx;
  cardQ = { x: rx, y: top, w: rw, h: 118 };
  feedbackQ = { x: rx, y: top + 128, w: rw, h: bottom - top - 128 };
  cardF = { x: rx, y: top, w: rw, h: 150 };
  feedbackF = { x: rx, y: top + 160, w: rw, h: bottom - top - 160 };
}

// Three diamonds, each with a Yes connector down to its design note and a No connector
// right to its Reconsider box. The spare height is shared out between the connectors.
function layoutTreeWide(b) {
  const dw = Math.round(constrain(b.w * 0.5, 140, 168));
  const dh = 40;
  const nh = 44;
  const noGap = 30;
  const gap = constrain((b.h - STEPS * (dh + nh)) / (2 * STEPS - 1), 12, 30);
  let y = b.y;
  diamonds = [];
  notes = [];
  noBoxes = [];
  for (let i = 0; i < STEPS; i++) {
    diamonds.push({ x: b.x, y: y, w: dw, h: dh });
    noBoxes.push({ x: b.x + dw + noGap, y: y + 5, w: b.w - dw - noGap, h: dh - 10 });
    y += dh + gap;
    notes.push({ x: b.x, y: y, w: b.w, h: nh });
    y += nh + gap;
  }
}

// Narrow: a trail of one row per diamond, with the card and feedback stacked below it
function layoutNarrow() {
  const top = 32, rowH = 36, gap = 3;
  trailRows = [];
  for (let i = 0; i < STEPS; i++) {
    trailRows.push({ x: 6, y: top + i * (rowH + gap), w: canvasWidth - 12, h: rowH });
  }
  const cy = top + STEPS * rowH + (STEPS - 1) * gap + 6;
  const bottom = drawHeight - 8;
  cardQ = { x: 10, y: cy, w: canvasWidth - 20, h: 84 };
  feedbackQ = { x: 10, y: cy + 90, w: canvasWidth - 20, h: bottom - cy - 90 };
  cardF = { x: 10, y: cy, w: canvasWidth - 20, h: 108 };
  feedbackF = { x: 10, y: cy + 114, w: canvasWidth - 20, h: bottom - cy - 114 };
}

// Size the answer buttons for the longest answer in either scenario, so they keep the
// same height (and Reset keeps the same place) at every diamond. The font steps down
// from 16px until both answers and the Reset row fit in the control area.
function sizeControls() {
  const w = canvasWidth - 20;
  const texts = [];
  for (const s of SCENARIOS) {
    for (const n of s.tree) {
      texts.push(PREFIX.chosen + answerHtml('yes', n));
      texts.push(PREFIX.tried + answerHtml('no', n));
    }
  }
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
    resetButton.style('font-size', fs + 'px');
    scenarioSelect.style('font-size', fs + 'px');
    rH = max(resetButton.elt.offsetHeight, scenarioSelect.elt.offsetHeight);
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
  controlRowY = ay + 2 * slotH + gapAB + gapBR;
  controlRowH = rH;
  resetButton.position(10, controlRowY + (rH - resetButton.elt.offsetHeight) / 2);
  const sx = 10 + resetButton.elt.offsetWidth + 10;
  scenarioSelect.position(sx, controlRowY + (rH - scenarioSelect.elt.offsetHeight) / 2);
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  const title = 'Minimum Testable Iteration Decision Tree';
  let s = isWide ? 24 : 20;
  textSize(s);
  while (s > 14 && textWidth(title) > canvasWidth - 20) textSize(--s);
  text(title, canvasWidth / 2, isWide ? 10 : 8);
}

// Diamond colors: answered, current, or not reached yet
function diamondColors(i) {
  if (i < depth) return { fill: 'white', stroke: INDIGO, weight: 1.5, text: 'black' };
  if (i === depth) return { fill: CURRENT_FILL, stroke: FOX_ORANGE, weight: 3, text: 'black' };
  return { fill: 'rgba(255,255,255,0.5)', stroke: 'silver', weight: 1, text: 'gray',
    dashed: true };
}

function drawDiamondShape(cx, cy, w, h, c) {
  fill(c.fill);
  stroke(c.stroke);
  strokeWeight(c.weight);
  if (c.dashed) drawingContext.setLineDash([5, 4]);
  quad(cx, cy - h / 2, cx + w / 2, cy, cx, cy + h / 2, cx - w / 2, cy);
  drawingContext.setLineDash([]);
  strokeWeight(1);
}

function drawBox(bx, c, r) {
  fill(c.fill);
  stroke(c.stroke);
  strokeWeight(c.weight);
  if (c.dashed) drawingContext.setLineDash([5, 4]);
  rect(bx.x, bx.y, bx.w, bx.h, r);
  drawingContext.setLineDash([]);
  strokeWeight(1);
}

const PLACEHOLDER = { fill: 'rgba(255,255,255,0.5)', stroke: 'silver', weight: 1, dashed: true };

function drawTreeWide() {
  for (let i = 0; i < STEPS; i++) {
    const d = diamonds[i], nt = notes[i], nb = noBoxes[i];
    const cx = d.x + d.w / 2, cy = d.y + d.h / 2;
    const current = i === depth;

    // Yes connector: diamond down to its design note
    arrowDown(cx, d.y + d.h, nt.y, i < depth ? CORRECT_GREEN : 'silver');
    noStroke();
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(12);
    fill(i < depth ? CORRECT_GREEN : (current ? DARK_ORANGE : 'gray'));
    text('Yes', cx + 8, (d.y + d.h + nt.y) / 2);

    // Connector from this design note to the next diamond
    if (i < STEPS - 1) arrowDown(cx, nt.y + nt.h, diamonds[i + 1].y, i < depth ? INDIGO : 'silver');

    // No connector: diamond right to its Reconsider box
    const tried = tries[i] > 0;
    arrowRight(d.x + d.w, cy, nb.x, tried ? AMBER : 'silver');
    noStroke();
    textAlign(CENTER, BOTTOM);
    textStyle(BOLD);
    textSize(12);
    fill(tried ? AMBER_TEXT : (current ? DARK_ORANGE : 'gray'));
    text('No', (d.x + d.w + nb.x) / 2, cy - 3);

    // Diamond with its short question
    const c = diamondColors(i);
    drawDiamondShape(cx, cy, d.w, d.h, c);
    drawDiamondLabel(SHORT_Q[i], cx, cy, d.w, d.h, c.text);

    drawNoBox(nb, i);
    drawNoteWide(nt, i);
  }
  textStyle(NORMAL);
}

// Largest bold size (14 down to 10) at which the label fits inside the diamond
function drawDiamondLabel(label, cx, cy, w, h, col) {
  textStyle(BOLD);
  let s = 14;
  for (; s > 10; s--) {
    textSize(s);
    const room = w * (1 - (s * 0.45) / (h / 2)) - 6;   // width at the text's top and bottom
    if (textWidth(label) <= room) break;
  }
  textSize(s);
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  text(label, cx, cy + 1);
  textStyle(NORMAL);
}

// The No branch: a "?" until tried, then an amber Reconsider box with a count badge
function drawNoBox(nb, i) {
  const n = tries[i];
  if (n === 0) {
    drawBox(nb, PLACEHOLDER, 6);
    noStroke();
    fill('silver');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(15);
    text('?', nb.x + nb.w / 2, nb.y + nb.h / 2 + 1);
    textStyle(NORMAL);
    return;
  }
  drawBox(nb, { fill: DEAD_END_FILL, stroke: AMBER, weight: 1.5 }, 6);
  if (flash > 0 && lastPick && lastPick.kind === 'reconsider' && lastPick.step === i) {
    noStroke();
    fill(255, 179, 0, map(flash, 0, 40, 0, 110));
    rect(nb.x, nb.y, nb.w, nb.h, 6);
  }
  noStroke();
  fill(AMBER_TEXT);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  let s = 13;
  textSize(s);
  while (s > 10 && textWidth('Reconsider') > nb.w - 12) textSize(--s);
  text('Reconsider', nb.x + nb.w / 2, nb.y + nb.h / 2 + 1);
  // Count badge on the top-right corner
  const bx = nb.x + nb.w - 2, by = nb.y + 1;
  fill(AMBER);
  circle(bx, by, 17);
  fill('black');
  textSize(11);
  text(String(n), bx, by + 1);
  textStyle(NORMAL);
}

// The design note under a diamond: the principle and a short note once the judgment holds
function drawNoteWide(nt, i) {
  if (i >= depth) {
    drawBox(nt, PLACEHOLDER, 8);
    noStroke();
    fill('silver');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(16);
    text('?', nt.x + nt.w / 2, nt.y + nt.h / 2 + 1);
    textStyle(NORMAL);
    return;
  }
  drawBox(nt, { fill: 'honeydew', stroke: CORRECT_GREEN, weight: 1.5 }, 8);
  if (flash > 0 && lastPick && lastPick.kind === 'holds' && lastPick.step === i) {
    noStroke();
    fill(46, 125, 50, map(flash, 0, 40, 0, 90));
    rect(nt.x, nt.y, nt.w, nt.h, 8);
  }
  const pad = 10;
  noStroke();
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  fitOneLine('✓ ' + PRINCIPLES[i].toUpperCase(), nt.w - 2 * pad, 12, 9);
  fill(CORRECT_GREEN);
  text('✓ ' + PRINCIPLES[i].toUpperCase(), nt.x + pad, nt.y + 7);
  textStyle(NORMAL);
  fitOneLine(SCENARIOS[scen].tree[i].shortNote, nt.w - 2 * pad, 15, 11);
  fill('black');
  text(SCENARIOS[scen].tree[i].shortNote, nt.x + pad, nt.y + 23);
}

// Narrow: one row per diamond, joined by a vertical spine through the mini diamonds
function drawTrailNarrow() {
  const dw = 26, dh = 26;
  const centers = trailRows.map(r => ({ x: r.x + 18, y: r.y + r.h / 2 }));

  // Row backgrounds: current row pale orange, answered rows white
  for (let i = 0; i < STEPS; i++) {
    const r = trailRows[i];
    if (i === depth) drawBox(r, { fill: CURRENT_FILL, stroke: FOX_ORANGE, weight: 1.5 }, 6);
    else if (i < depth) drawBox(r, { fill: 'white', stroke: 'silver', weight: 1 }, 6);
  }
  // Spine between the diamonds
  for (let i = 0; i < STEPS - 1; i++) {
    stroke(i < depth ? CORRECT_GREEN : 'silver');
    strokeWeight(2);
    line(centers[i].x, centers[i].y + dh / 2, centers[i + 1].x, centers[i + 1].y - dh / 2);
  }
  strokeWeight(1);

  for (let i = 0; i < STEPS; i++) {
    const r = trailRows[i];
    const c = diamondColors(i);
    drawDiamondShape(centers[i].x, centers[i].y, dw, dh, c);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12);
    fill(i < depth ? CORRECT_GREEN : c.text);
    text(i < depth ? '✓' : String(i + 1), centers[i].x, centers[i].y + 1);

    // Reconsider count on the right
    let right = r.x + r.w - 8;
    if (tries[i] > 0) {
      textAlign(RIGHT, CENTER);
      textSize(12);
      fill(AMBER_TEXT);
      const badge = String(tries[i]);
      text(badge, right, r.y + r.h / 2 + 1);
      drawLoopIcon(right - textWidth(badge) - 9, r.y + r.h / 2, 5, AMBER_TEXT);
      right -= textWidth(badge) + 24;
    }

    const tx = r.x + 38;
    const room = right - tx;
    noStroke();
    textAlign(LEFT, TOP);
    if (i < depth) {
      // Line 1: the principle that applies. Line 2: the short design note.
      textStyle(BOLD);
      fitOneLine('Yes: ' + PRINCIPLES[i], room, 13, 10);
      fill(CORRECT_GREEN);
      text('Yes: ' + PRINCIPLES[i], tx, r.y + 4);
      textStyle(NORMAL);
      fitOneLine(SCENARIOS[scen].tree[i].shortNote, room, 13, 10);
      fill('black');
      text(SCENARIOS[scen].tree[i].shortNote, tx, r.y + 21);
    } else {
      textStyle(BOLD);
      textSize(14);
      fill(i === depth ? 'black' : 'gray');
      text(SHORT_Q[i], tx, r.y + 4);
      if (i === depth) {
        textStyle(ITALIC);
        textSize(13);
        fill(DARK_ORANGE);
        text('Deciding now: judge it below', tx, r.y + 21);
      }
    }
  }
  textStyle(NORMAL);
}

// The current question: header and the full question text
function drawCard() {
  const c = cardQ;
  noStroke();
  fill(0, 0, 0, 18);
  rect(c.x + 2, c.y + 3, c.w, c.h, 12);
  fill('white');
  stroke(FOX_ORANGE);
  strokeWeight(2);
  rect(c.x, c.y, c.w, c.h, 12);
  strokeWeight(1);

  const pad = isWide ? 14 : 10;
  const innerW = c.w - 2 * pad;
  const sc = SCENARIOS[scen];

  // Header, shortened when the long form will not fit
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(isWide ? 13 : 12);
  const step = 'DECISION ' + (depth + 1) + ' OF ' + STEPS;
  let header = sc.header + ' · ' + step;
  if (textWidth(header) > innerW) header = step;
  text(header, c.x + pad, c.y + pad - 2);
  const areaTop = c.y + pad - 2 + (isWide ? 20 : 18);
  const areaBottom = c.y + c.h - pad + 2;

  // The question, as large as fits under the header
  const fit = fitText(sc.tree[depth].question, innerW, areaBottom - areaTop,
    isWide ? 21 : 17, 13, BOLD);
  textStyle(BOLD);
  textSize(fit.size);
  fill('black');
  let y = max(areaTop, (areaTop + areaBottom) / 2 - (fit.lines.length * fit.lead) / 2);
  for (const ln of fit.lines) {
    text(ln, c.x + pad, y);
    y += fit.lead;
  }
  textStyle(NORMAL);
}

// All three judged: the combined minimum testable iteration
function drawFinalCard() {
  const c = cardF;
  noStroke();
  fill(0, 0, 0, 18);
  rect(c.x + 2, c.y + 3, c.w, c.h, 12);
  fill('honeydew');
  stroke(CORRECT_GREEN);
  strokeWeight(3);
  rect(c.x, c.y, c.w, c.h, 12);
  strokeWeight(1);
  if (flash > 0) {
    noStroke();
    fill(46, 125, 50, map(flash, 0, 40, 0, 90));
    rect(c.x, c.y, c.w, c.h, 12);
  }

  const pad = isWide ? 14 : 10;
  const innerW = c.w - 2 * pad;
  const sc = SCENARIOS[scen];
  noStroke();
  fill(CORRECT_GREEN);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(isWide ? 13 : 12);
  const header = ['✓ ' + sc.finalLabel, '✓ MINIMUM TESTABLE ITERATION', '✓ YOUR DESIGN']
    .find(h => textWidth(h) <= innerW) || '✓ DESIGN';
  text(header, c.x + pad, c.y + pad - 2);
  const areaTop = c.y + pad - 2 + (isWide ? 22 : 19);
  const areaBottom = c.y + c.h - pad + 2;
  const fit = fitText(sc.finalText, innerW, areaBottom - areaTop, isWide ? 20 : 17, 12, BOLD);
  textStyle(BOLD);
  textSize(fit.size);
  fill('black');
  let y = max(areaTop, (areaTop + areaBottom) / 2 - (fit.lines.length * fit.lead) / 2);
  for (const ln of fit.lines) {
    text(ln, c.x + pad, y);
    y += fit.lead;
  }
  textStyle(NORMAL);
}

// Feedback on the last judgment, or how to judge before the first one
function drawFeedback() {
  const done = depth >= STEPS;
  const p = done ? feedbackF : feedbackQ;
  const kind = lastPick ? lastPick.kind : 'start';
  fill('white');
  if (kind === 'reconsider') stroke(AMBER);
  else if (kind === 'holds') stroke(CORRECT_GREEN);
  else stroke('silver');
  strokeWeight(kind === 'start' ? 1 : 2);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  // Amber flash right after a judgment that does not hold
  if (flash > 0 && kind === 'reconsider') {
    noStroke();
    fill(255, 179, 0, map(flash, 0, 40, 0, 110));
    rect(p.x, p.y, p.w, p.h, 10);
  }

  const key = [scen, depth, kind, lastPick ? lastPick.step : -1, canvasWidth].join('|');
  if (!feedbackCache || feedbackCache.key !== key) {
    const inner = { x: p.x + 14, y: p.y + 10, w: p.w - 28, h: p.h - 18 };
    feedbackCache = { key: key, x: inner.x, y: inner.y, w: inner.w,
      blocks: fitColumn(feedbackItems(kind, done), inner.w, inner.h) };
  }
  renderBlocks(feedbackCache.blocks, feedbackCache.x, feedbackCache.y, feedbackCache.w);
}

function feedbackItems(kind, done) {
  const sc = SCENARIOS[scen];
  if (kind === 'holds') {
    const k = lastPick.step;
    const n = sc.tree[k];
    const cut = n.yesNote.indexOf(':') + 1;
    // The note is dropped only as a last resort: its short form is already in the tree
    const items = [
      { kind: 'result', text: '✓ Decision ' + (k + 1) + ' holds', color: CORRECT_GREEN },
      { kind: 'body', text: n.yesWhy },
      { kind: 'note', lastDrop: true, runs: [
        { text: n.yesNote.slice(0, cut), style: 'bold', color: CORRECT_GREEN },
        { text: n.yesNote.slice(cut).trim() }
      ] }
    ];
    items.push({ kind: 'hint', drop: 1, text: done ?
      'Each design note in the tree is one reason this design holds.' :
      'Decision ' + (k + 2) + ' is now in the card above.' });
    return items;
  }
  if (kind === 'reconsider') {
    const k = lastPick.step;
    const n = sc.tree[k];
    return [
      { kind: 'result', text: 'Doesn\'t hold for ' + sc.name, color: AMBER_TEXT, icon: true },
      { kind: 'quote', drop: 1, text: '“No — ' + n.noReason + '”' },
      { kind: 'body', text: n.noWhy },
      { kind: 'fallback', text: n.noNote }
    ];
  }
  return [
    { kind: 'label', text: 'HOW TO JUDGE' },
    { kind: 'body', text: sc.idea },
    { kind: 'body', text: 'At each diamond, choose the answer below whose reasoning holds for ' +
      sc.name + '. Each judgment that holds adds a design note to the tree.' }
  ];
}

// Progress and reconsider count to the right of the scenario selector, shortened to fit
function drawControlText() {
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(16);
  const x = scenarioSelect.elt.offsetLeft + scenarioSelect.elt.offsetWidth + 14;
  const room = canvasWidth - x - 10;
  const y = controlRowY + controlRowH / 2;
  let options;
  if (depth >= STEPS) {
    textStyle(BOLD);
    fill(CORRECT_GREEN);
    options = reconsidered === 0 ?
      ['All three judgments held first time', 'Design complete', 'Done'] :
      ['Design complete · Reconsidered: ' + reconsidered, 'Design complete', 'Done'];
  } else {
    textStyle(NORMAL);
    fill('dimgray');
    options = ['Decision ' + (depth + 1) + ' of ' + STEPS + '  ·  Reconsidered: ' + reconsidered,
      'Decision ' + (depth + 1) + '/' + STEPS, (depth + 1) + '/' + STEPS];
  }
  const msg = options.find(m => textWidth(m) <= room);
  if (msg) text(msg, x, y);
  textStyle(NORMAL);
}

// Arrow straight down from y1 to y2 (arrowhead at y2)
function arrowDown(x, y1, y2, col) {
  stroke(col);
  strokeWeight(2);
  line(x, y1 + 1, x, y2 - 5);
  noStroke();
  fill(col);
  triangle(x - 5, y2 - 6, x + 5, y2 - 6, x, y2);
  strokeWeight(1);
}

// Arrow straight right from x1 to x2 (arrowhead at x2)
function arrowRight(x1, y, x2, col) {
  stroke(col);
  strokeWeight(2);
  line(x1 + 1, y, x2 - 5, y);
  noStroke();
  fill(col);
  triangle(x2 - 6, y - 5, x2 - 6, y + 5, x2, y);
  strokeWeight(1);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of feedback item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:    { size: 14, style: 'bold',   color: 'dimgray',  before: 0 },
  result:   { size: 18, style: 'bold',   color: 'black',    before: 0 },
  quote:    { size: 14, style: 'italic', color: 'dimgray',  before: 4 },
  body:     { size: 16, style: 'normal', color: 'black',    before: 6 },
  note:     { size: 15, style: 'normal', color: 'black',    before: 8 },
  fallback: { size: 15, style: 'italic', color: AMBER_TEXT, before: 8 },
  hint:     { size: 14, style: 'normal', color: 'dimgray',  before: 8 }
};
// Boxed items get a tinted background and a colored bar on the left
const BOXED = {
  note: { fill: 'honeydew', bar: CORRECT_GREEN },
  fallback: { fill: DEAD_END_FILL, bar: AMBER }
};
const MIN_SCALE = 0.8;  // never shrink feedback text below 80% of its base size

// Fit the items to the box. Droppable items go first (highest drop first), before any
// text is shrunk; then the largest scale that fits is used. Items marked lastDrop are
// removed only if the text still does not fit at the smallest scale.
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
  for (let pass = 0; pass < 2; pass++) {
    for (let s = 1.0; s >= MIN_SCALE - 0.001; s -= 0.05) {
      const laid = layoutItems(list, w, s);
      if (laid.height <= h) return laid;
    }
    if (!list.some(it => it.lastDrop)) break;
    list = list.filter(it => !it.lastDrop);
  }
  return layoutItems(list, w, MIN_SCALE);
}

// Lay out each item as wrapped lines of styled words at scale s
function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    const box = BOXED[it.kind];
    const iconW = it.icon ? size * 1.3 : 0;      // hanging indent beside the loop icon
    const indent = box ? 13 : iconW;
    const padY = box ? 5 : 0;
    const runs = it.runs || [{ text: it.text }];
    const tokens = [];
    for (const r of runs) {
      for (const word of r.text.split(' ')) {
        if (word) tokens.push({ w: word, style: r.style || st.style, color: r.color || it.color || st.color });
      }
    }
    textSize(size);
    const lines = wrapTokens(tokens, maxW - indent - (box ? 8 : 0));
    textStyle(NORMAL);
    const spaceW = textWidth(' ');
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    blocks.push({ lines, size, lead, before, indent, padY, spaceW, box, icon: it.icon,
      iconColor: it.color || st.color });
    height += before + lines.length * lead + 2 * padY;
  }
  textStyle(NORMAL);
  blocks.height = height;
  return blocks;
}

// Greedy word wrap over tokens that may differ in style; measures at the current size
function wrapTokens(tokens, maxW) {
  textStyle(NORMAL);
  const spaceW = textWidth(' ');
  const lines = [];
  let line = [];
  let lineW = 0;
  for (const t of tokens) {
    textStyle(t.style);
    t.width = textWidth(t.w);
    const add = line.length ? spaceW + t.width : t.width;
    if (line.length && lineW + add > maxW) {
      lines.push(line);
      line = [t];
      lineW = t.width;
    } else {
      line.push(t);
      lineW += add;
    }
  }
  if (line.length) lines.push(line);
  textStyle(NORMAL);
  return lines;
}

function renderBlocks(blocks, x, y, w) {
  textAlign(LEFT, TOP);
  for (const b of blocks) {
    y += b.before;
    if (b.box) {
      const h = b.lines.length * b.lead + 2 * b.padY;
      noStroke();
      fill(b.box.fill);
      rect(x, y, w, h, 6);
      fill(b.box.bar);
      rect(x, y, 5, h, 3);
    }
    if (b.icon) drawLoopIcon(x + b.size * 0.45, y + b.size * 0.58, b.size * 0.36, b.iconColor);
    textSize(b.size);
    y += b.padY;
    for (const ln of b.lines) {
      let tx = x + b.indent;
      for (const t of ln) {
        noStroke();
        fill(t.color);
        textStyle(t.style);
        text(t.w, tx, y);
        tx += t.width + b.spaceW;
      }
      y += b.lead;
    }
    y += b.padY;
  }
  textStyle(NORMAL);
}

// A small loop arrow centered at (cx, cy): the reconsider mark. Drawn rather than typed
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
    lead = size * 1.25;
    if (lines.length * lead <= maxH) break;
  }
  size = max(size, minSize);
  return { lines: lines, lead: lead, size: size };
}

// Set the largest text size (base down to minSize) at which str fits on one line
function fitOneLine(str, maxW, base, minSize) {
  let s = base;
  textSize(s);
  while (s > minSize && textWidth(str) > maxW) textSize(--s);
}

// ---------- Decision logic ----------

// Which answer sits in button slot i at step k. The order alternates from step to step
// (and between scenarios) so the right answer is never simply "the top button."
function answerAt(k, slot) {
  const yesFirst = (scen + k) % 2 === 0;
  return (slot === 0) === yesFirst ? 'yes' : 'no';
}

function answerHtml(which, n) {
  return which === 'yes' ? '<b>Yes</b> — ' + n.yesReason : '<b>No</b> — ' + n.noReason;
}

function choose(slot) {
  if (depth >= STEPS) return;
  const which = answerAt(depth, slot);
  if (which === 'no' && tries[depth] > 0) return;
  if (which === 'yes') {
    lastPick = { kind: 'holds', step: depth };
    depth++;
  } else {
    tries[depth]++;
    reconsidered++;
    lastPick = { kind: 'reconsider', step: depth };
  }
  flash = 40;
  updateButtons();
}

function resetPath() {
  depth = 0;
  tries = [0, 0, 0];
  reconsidered = 0;
  lastPick = null;
  flash = 0;
  updateButtons();
}

function changeScenario() {
  const i = SCENARIOS.findIndex(s => s.label === scenarioSelect.value());
  scen = i >= 0 ? i : 0;
  resetPath();
}

// Show the current diamond's two answers. After all three are judged, the last
// diamond's answers stay visible but locked, with the Yes answer checked.
function updateButtons() {
  const done = depth >= STEPS;
  const k = done ? STEPS - 1 : depth;
  const n = SCENARIOS[scen].tree[k];
  answerButtons.forEach((b, slot) => {
    const which = answerAt(k, slot);
    let state = 'open';
    if (done) state = which === 'yes' ? 'chosen' : (tries[k] > 0 ? 'tried' : 'locked');
    else if (which === 'no' && tries[k] > 0) state = 'tried';
    b.html(PREFIX[state] + answerHtml(which, n));
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

// ---------- Helpers ----------

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
