// Assumption Ledger Sorter - p5.js MicroSim
// CANVAS_HEIGHT: 480
// Learners classify six statements from Jordan's dog-grooming-van idea as either an
// Assumption (untested belief) or Validated Learning (tested against real customer
// behavior). Each answer gets immediate feedback: green for correct, amber for
// incorrect, with the right category stamped on the card and a one-sentence reason.
// Cards appear in the listed order on first load and are reshuffled on Try Again.
// Wide screens: card on the left (70%), tally and feedback on the right (30%).
// Narrow screens (< 600px): tally and feedback stack below the card.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 80;   // two rows: answer buttons, then Next Card / Try Again
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Book palette plus feedback colors
const INDIGO = '#3F51B5';        // Assumption stamp
const FOX_ORANGE = '#E8791A';    // current card marker
const DARK_ORANGE = '#B25A10';   // Validated Learning stamp (readable on white)
const AMBER = '#FFB300';         // incorrect-answer flash and border
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // correct-answer flash, border and text

const ASSUMPTION = 'Assumption';
const VALIDATED = 'Validated Learning';

// The six statements, in the order shown on first load
const STATEMENTS = [
  { text: 'Busy dog owners will pay more for convenience.',
    correctAnswer: ASSUMPTION,
    explanation: 'No one has been asked yet. It is a belief about customers, not something anyone observed.' },
  { text: '3 of 5 neighbors said yes to a $40 driveway session this week.',
    correctAnswer: VALIDATED,
    explanation: 'Real behavior was observed: five real neighbors responded to a real offer this week.' },
  { text: 'People who love their dogs will love this business.',
    correctAnswer: ASSUMPTION,
    explanation: 'It is a feeling about customers, not a claim anyone has tested.' },
  { text: '2 of 5 neighbors said the price was too high for a first try.',
    correctAnswer: VALIDATED,
    explanation: 'Real feedback was collected. A "no" from a real customer is still validated learning.' },
  { text: 'A mobile service is obviously more convenient than driving to a groomer.',
    correctAnswer: ASSUMPTION,
    explanation: 'It sounds true, but no customer has been asked whether it is more convenient for them.' },
  { text: 'One neighbor referred a friend after the driveway session.',
    correctAnswer: VALIDATED,
    explanation: 'A referral is an observed real-world action, not a prediction.' }
];

// Quiz state
let order = [0, 1, 2, 3, 4, 5];  // statement indexes in the order they are dealt
let current = 0;                 // position in order (0..5)
let results = [];                // per position: {choice, correct}
let answered = false;
let finished = false;
let score = 0;
let flash = 0;                   // frames left in the green/amber flash

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let cardBox = {}, panelBox = {}, summaryBox = {}, progressBox = {};

let assumptionButton, validatedButton, nextButton, tryAgainButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  assumptionButton = createButton(ASSUMPTION);
  assumptionButton.mousePressed(() => choose(ASSUMPTION));
  validatedButton = createButton(VALIDATED);
  validatedButton.mousePressed(() => choose(VALIDATED));
  nextButton = createButton('Next Card');
  nextButton.mousePressed(nextCard);
  tryAgainButton = createButton('Try Again');
  tryAgainButton.mousePressed(tryAgain);
  // Larger button text so the choices are readable from the back of the room
  for (const b of [assumptionButton, validatedButton, nextButton, tryAgainButton]) {
    b.style('font-size', '16px');
    b.style('padding', '4px 14px');
  }

  computeLayout();
  updateButtons();

  describe('A card-sorting quiz with six statements about a mobile dog-grooming idea. ' +
    'For each card, choose Assumption or Validated Learning. Feedback shows whether the ' +
    'choice was correct, the right category, and a one-sentence explanation. A tally and ' +
    'a progress bar track the score and the current card.');
}

function draw() {
  updateCanvasSize();

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawProgress();
  if (finished) {
    drawSummary();
  } else {
    drawCard();
    drawPanel();
  }
  drawControlText();
  if (flash > 0) flash--;
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= 600;
  const top = 78;
  progressBox = { x: margin, y: 44, w: canvasWidth - 2 * margin, h: 22 };
  if (isWide) {
    const split = canvasWidth * 0.7;
    cardBox = { x: margin, y: top, w: split - margin - 8, h: drawHeight - top - 14 };
    panelBox = { x: split + 4, y: top, w: canvasWidth - margin - split - 4, h: drawHeight - top - 14 };
  } else {
    cardBox = { x: 10, y: top, w: canvasWidth - 20, h: 158 };
    const py = cardBox.y + cardBox.h + 10;
    panelBox = { x: 10, y: py, w: canvasWidth - 20, h: drawHeight - 10 - py };
  }
  summaryBox = { x: cardBox.x, y: top, w: canvasWidth - 2 * cardBox.x, h: drawHeight - top - 14 };
  positionControls();
}

function positionControls() {
  assumptionButton.position(10, drawHeight + 8);
  validatedButton.position(10 + assumptionButton.elt.offsetWidth + 10, drawHeight + 8);
  nextButton.position(10, drawHeight + 44);
  tryAgainButton.position(10, drawHeight + 44);
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('Assumption Ledger Sorter', canvasWidth / 2, 10);
}

// "Card N of 6" followed by six segments colored by result
function drawProgress() {
  const p = progressBox;
  const shown = finished ? STATEMENTS.length : current + 1;
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(16);
  const label = finished ? 'Done: 6 of 6' : 'Card ' + shown + ' of 6';
  text(label, p.x, p.y + p.h / 2);
  textStyle(NORMAL);
  const labelW = 110;
  const segGap = 6;
  const segW = (p.w - labelW - 5 * segGap) / 6;
  for (let i = 0; i < 6; i++) {
    const x = p.x + labelW + i * (segW + segGap);
    const r = results[i];
    if (r) {
      fill(r.correct ? CORRECT_GREEN : AMBER);
      noStroke();
    } else if (i === current && !finished) {
      fill('white');
      stroke(FOX_ORANGE);
      strokeWeight(2);
    } else {
      fill('gainsboro');
      noStroke();
    }
    rect(x, p.y + 4, segW, p.h - 8, 7);
  }
  strokeWeight(1);
}

function drawCard() {
  const c = cardBox;
  const s = STATEMENTS[order[current]];
  const r = results[current];

  // Shadow, then the card; after answering, the card keeps a light tint of its result
  noStroke();
  fill(0, 0, 0, 25);
  rect(c.x + 3, c.y + 4, c.w, c.h, 12);
  if (answered) {
    fill(r.correct ? 'honeydew' : '#FFF8E1');
    stroke(r.correct ? CORRECT_GREEN : AMBER);
    strokeWeight(3);
  } else {
    fill('white');
    stroke('silver');
    strokeWeight(1);
  }
  rect(c.x, c.y, c.w, c.h, 12);

  // Faint ledger rules
  stroke(210, 222, 240);
  strokeWeight(1);
  for (let y = c.y + 64; y < c.y + c.h - 12; y += 28) {
    line(c.x + 14, y, c.x + c.w - 14, y);
  }

  // Short flash of green or amber right after an answer
  if (answered && flash > 0) {
    noStroke();
    const a = map(flash, 0, 40, 0, 110);
    if (r.correct) fill(46, 125, 50, a);
    else fill(255, 179, 0, a);
    rect(c.x, c.y, c.w, c.h, 12);
  }

  // Header
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);
  text('JORDAN\'S LEDGER  ·  STATEMENT ' + (current + 1), c.x + 18, c.y + 14);

  // Statement text, vertically centered in the space above the stamp
  const size = isWide ? 22 : 18;
  textStyle(NORMAL);
  textSize(size);
  const lines = wrapText('"' + s.text + '"', c.w - 40);
  const lead = size * 1.35;
  const areaTop = c.y + 40;
  const areaBottom = c.y + c.h - (answered ? 48 : 14);
  // Never let a long statement rise into the header
  let y = max(areaTop, (areaTop + areaBottom) / 2 - (lines.length * lead) / 2);
  fill('black');
  for (const ln of lines) {
    text(ln, c.x + 20, y);
    y += lead;
  }

  if (answered) drawStamp(s.correctAnswer);
}

// Rubber stamp with the correct category in the card's lower right corner
function drawStamp(category) {
  const c = cardBox;
  const col = category === ASSUMPTION ? INDIGO : DARK_ORANGE;
  textStyle(BOLD);
  textSize(16);
  const label = category.toUpperCase();
  const w = textWidth(label) + 24;
  push();
  translate(c.x + c.w - w / 2 - 18, c.y + c.h - 28);
  rotate(-0.06);
  noFill();
  stroke(col);
  strokeWeight(3);
  rect(-w / 2, -15, w, 30, 6);
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  text(label, 0, 1);
  pop();
  textStyle(NORMAL);
}

// Tally plus feedback: text scales down in small steps until it fits
function drawPanel() {
  const p = panelBox;
  const r = results[current];
  fill('white');
  if (answered) stroke(r.correct ? CORRECT_GREEN : AMBER);
  else stroke('silver');
  strokeWeight(answered ? 2 : 1);
  rect(p.x, p.y, p.w, p.h, 10);

  const items = [{ kind: 'score', text: 'Correct: ' + score + ' / 6' }];
  if (!answered) {
    items.push({ kind: 'label', text: 'HOW TO DECIDE' });
    items.push({ kind: 'body', text: 'Did a real customer actually say or do this? If it only sounds true, it is still an assumption.' });
  } else {
    const s = STATEMENTS[order[current]];
    if (r.correct) {
      items.push({ kind: 'result', text: '✓ Correct!', color: CORRECT_GREEN });
      items.push({ kind: 'body', text: 'It is ' + article(s.correctAnswer) + '.', style: 'bold' });
    } else {
      items.push({ kind: 'result', text: '✗ Not quite', color: AMBER_TEXT });
      items.push({ kind: 'body', text: 'You chose ' + r.choice + ', but it is ' + article(s.correctAnswer) + '.', style: 'bold' });
    }
    items.push({ kind: 'body', text: s.explanation });
  }
  fitAndRender(items, p, 1.0);
}

// End screen: score, message, and a review of any missed cards
function drawSummary() {
  const b = summaryBox;
  fill('white');
  stroke(FOX_ORANGE);
  strokeWeight(2);
  rect(b.x, b.y, b.w, b.h, 12);

  let heading, sub;
  if (score === 6) {
    heading = 'Perfect ledger!';
    sub = 'You can tell a tested fact from a belief that only sounds true.';
  } else if (score >= 4) {
    heading = 'Nice sorting!';
    sub = 'Look at the ones you missed: what made them sound tested?';
  } else {
    heading = 'Keep practicing!';
    sub = 'Look for evidence words: who said it, how many, and when?';
  }
  const items = [
    { kind: 'label', text: 'LEDGER COMPLETE' },
    { kind: 'heading', text: heading },
    { kind: 'body', text: 'You classified ' + score + ' of 6 statements correctly. ' + sub }
  ];
  const missed = [];
  results.forEach((r, i) => { if (!r.correct) missed.push(STATEMENTS[order[i]]); });
  if (missed.length) {
    items.push({ kind: 'label', text: 'REVIEW THE ONES YOU MISSED' });
    for (const s of missed) {
      items.push({ kind: 'quote', text: '"' + s.text + '"  →  ' + s.correctAnswer });
    }
  } else {
    items.push({ kind: 'label', text: 'THE RULE OF THUMB' });
    items.push({ kind: 'body', text: 'Ask "how do I know this?" If the answer is something a real customer said or did, it is validated learning. Otherwise it is still an assumption.' });
  }
  items.push({ kind: 'body', text: 'Click Try Again to sort the cards in a new order.', color: 'dimgray' });
  fitAndRender(items, b, 1.0);
}

function drawControlText() {
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  textSize(16);
  let msg = '';
  if (finished) msg = 'New order each time.';
  else if (!answered) msg = 'Choose a category above.';
  else msg = current === STATEMENTS.length - 1 ? 'That was the last card.' : 'Ready for the next card?';
  const x = 10 + (finished ? tryAgainButton : nextButton).elt.offsetWidth + 14;
  if (textWidth(msg) < canvasWidth - x - 10) text(msg, x, drawHeight + 60);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  score:   { size: 20, style: 'bold',   color: 'black',   before: 0 },
  heading: { size: 26, style: 'bold',   color: DARK_ORANGE, before: 2 },
  label:   { size: 14, style: 'bold',   color: 'dimgray', before: 10 },
  result:  { size: 20, style: 'bold',   color: 'black',   before: 8 },
  body:    { size: 17, style: 'normal', color: 'black',   before: 6 },
  quote:   { size: 16, style: 'italic', color: 'black',   before: 6 }
};

function fitAndRender(items, box, base) {
  let blocks = null;
  for (let s = base; s >= 0.7; s -= 0.04) {
    blocks = layoutItems(items, box.w - 32, s);
    if (blocks.height <= box.h - 24) break;
  }
  renderBlocks(blocks, box.x + 16, box.y + 12, box.w - 32);
}

function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    const style = it.style || st.style;
    const indent = it.kind === 'quote' ? 14 : 0;
    textStyle(style);
    textSize(size);
    const lines = wrapText(it.text, maxW - 2 * indent);
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    const pad = it.kind === 'quote' ? 5 : 0;
    blocks.push({ kind: it.kind, lines, size, style, color: it.color || st.color, lead, before, indent, pad });
    height += before + lines.length * lead + 2 * pad;
  }
  blocks.height = height;
  return blocks;
}

function renderBlocks(blocks, x, y, w) {
  textAlign(LEFT, TOP);
  for (const b of blocks) {
    y += b.before;
    if (b.kind === 'quote') {
      const h = b.lines.length * b.lead + 2 * b.pad;
      noStroke();
      fill('#FFF8E1');
      rect(x, y, w, h, 6);
      fill(AMBER);
      rect(x, y, 5, h, 3);
    }
    noStroke();
    fill(b.color);
    textStyle(b.style);
    textSize(b.size);
    y += b.pad;
    for (const ln of b.lines) {
      text(ln, x + b.indent, y);
      y += b.lead;
    }
    y += b.pad;
  }
  textStyle(NORMAL);
}

// ---------- Quiz logic ----------

function choose(choice) {
  if (answered || finished) return;
  const s = STATEMENTS[order[current]];
  const correct = choice === s.correctAnswer;
  results[current] = { choice, correct };
  if (correct) score++;
  answered = true;
  flash = 40;
  updateButtons();
}

function nextCard() {
  if (!answered) return;
  if (current === STATEMENTS.length - 1) {
    finished = true;
  } else {
    current++;
    answered = false;
  }
  updateButtons();
}

function tryAgain() {
  order = shuffle([0, 1, 2, 3, 4, 5]);
  current = 0;
  results = [];
  answered = false;
  finished = false;
  score = 0;
  flash = 0;
  updateButtons();
}

// Enable, disable, show and relabel buttons to match the quiz state
function updateButtons() {
  for (const b of [assumptionButton, validatedButton]) {
    if (answered || finished) b.attribute('disabled', '');
    else b.removeAttribute('disabled');
  }
  if (finished) {
    nextButton.hide();
    tryAgainButton.show();
  } else {
    tryAgainButton.hide();
    nextButton.show();
    nextButton.html(current === STATEMENTS.length - 1 ? 'See Results' : 'Next Card');
    if (answered) nextButton.removeAttribute('disabled');
    else nextButton.attribute('disabled', '');
  }
}

// ---------- Helpers ----------

function article(category) {
  return category === ASSUMPTION ? 'an Assumption' : 'Validated Learning';
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
