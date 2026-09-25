// Leading vs Open-Ended Question Sorter - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Learners classify six discovery-interview questions from Jordan's dog-grooming
// script as Open-Ended (the customer supplies the content) or Leading (the question
// supplies the content and asks for agreement). Each answer gets immediate feedback:
// green for correct, amber for incorrect, with the right category stamped on the card
// and a one-sentence reason. After a Leading card is answered, the card also shows an
// open-ended rewrite of the same question. Cards appear in the listed order on first
// load and are reshuffled on Try Again. The cards not yet dealt sit in a small stack
// behind the current card.
// Wide screens: card stack on the left (70%), tally and feedback on the right (30%).
// Narrow screens (< 600px): tally and feedback stack below the card.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 418;
let controlHeight = 80;   // two rows: answer buttons, then Next Card / Try Again
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;
const STACK_STEP = 3;     // offset of each undealt card peeking out behind the current one

// Book palette plus feedback colors
const INDIGO = '#3F51B5';        // Open-Ended stamp and rewrite box
const INDIGO_TINT = '#E8EAF6';   // background of the open-ended rewrite
const FOX_ORANGE = '#E8791A';    // current card marker
const DARK_ORANGE = '#B25A10';   // Leading stamp (readable on white)
const AMBER = '#FFB300';         // incorrect-answer flash and border
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // correct-answer flash, border and text

const OPEN = 'Open-Ended';
const LEADING = 'Leading';

// The six interview questions, in the order shown on first load.
// label is a short name used in the end-of-session review list.
// rewrite (Leading cards only) is an open-ended version of the same question.
const STATEMENTS = [
  { text: 'Tell me about the last time getting your dog groomed was a hassle.',
    label: 'The last time grooming was a hassle',
    correctAnswer: OPEN,
    explanation: 'It invites a real story in the customer\'s own words, and they choose every detail of it.' },
  { text: 'Wouldn\'t you love it if grooming just came to your house?',
    label: 'Wouldn\'t you love it if...?',
    correctAnswer: LEADING,
    explanation: '"Wouldn\'t you love" signals the answer it wants, so a polite stranger says yes whatever they really think.',
    rewrite: 'How does your dog get groomed today?' },
  { text: 'Walk me through what you currently do when your dog needs a bath.',
    label: 'Walk me through bath time',
    correctAnswer: OPEN,
    explanation: 'It asks for their actual process, step by step, so you hear what they really do today.' },
  { text: 'Don\'t you think $40 is a fair price for a driveway grooming session?',
    label: 'Don\'t you think $40 is fair?',
    correctAnswer: LEADING,
    explanation: 'It asks the customer to agree with a price Jordan already picked instead of sharing what they pay now.',
    rewrite: 'What do you pay for grooming now, and how do you feel about that?' },
  { text: 'What\'s the most frustrating part of your current routine, if anything?',
    label: 'Most frustrating part, if anything',
    correctAnswer: OPEN,
    explanation: 'The words "if anything" leave room for a "nothing" answer, so no one is pushed to invent a pain.' },
  { text: 'This would save you so much time, right?',
    label: 'Save you so much time, right?',
    correctAnswer: LEADING,
    explanation: 'It assumes the time savings before the customer has said time is a problem, then adds "right?" to collect a yes.',
    rewrite: 'How long does getting your dog groomed take you right now?' }
];

const HINT = 'Who supplies the content? An open-ended question asks the customer to fill it in. ' +
  'A leading question fills it in for them and asks for a yes.';

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

let openButton, leadingButton, nextButton, tryAgainButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  openButton = createButton(OPEN);
  openButton.mousePressed(() => choose(OPEN));
  leadingButton = createButton(LEADING);
  leadingButton.mousePressed(() => choose(LEADING));
  nextButton = createButton('Next Card');
  nextButton.mousePressed(nextCard);
  tryAgainButton = createButton('Try Again');
  tryAgainButton.mousePressed(tryAgain);
  // Larger button text so the choices are readable from the back of the room
  for (const b of [openButton, leadingButton, nextButton, tryAgainButton]) {
    b.style('font-size', '16px');
    b.style('padding', '4px 14px');
  }

  computeLayout();
  updateButtons();

  describe('A card-sorting quiz with six discovery-interview questions about a mobile ' +
    'dog-grooming idea. For each card, choose Open-Ended or Leading. Feedback shows whether ' +
    'the choice was correct, the right category, a one-sentence explanation, and for leading ' +
    'questions an open-ended rewrite. A tally and a progress bar track the score and the ' +
    'current card.');
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
  const stack = 5 * STACK_STEP;  // room for up to five undealt cards behind the top card
  progressBox = { x: margin, y: 44, w: canvasWidth - 2 * margin, h: 22 };
  let area;
  if (isWide) {
    const split = canvasWidth * 0.7;
    area = { x: margin, y: top, w: split - margin - 8, h: drawHeight - top - 14 };
    panelBox = { x: split + 4, y: top, w: canvasWidth - margin - split - 4, h: drawHeight - top - 14 };
  } else {
    // The card gets the extra height it needs to show a question plus its rewrite
    area = { x: 10, y: top, w: canvasWidth - 20, h: 186 };
    const py = area.y + area.h + 8;
    panelBox = { x: 10, y: py, w: canvasWidth - 20, h: drawHeight - 8 - py };
  }
  cardBox = { x: area.x, y: area.y, w: area.w - stack, h: area.h - stack };
  summaryBox = { x: area.x, y: top, w: canvasWidth - 2 * area.x, h: drawHeight - top - 14 };
  positionControls();
}

function positionControls() {
  openButton.position(10, drawHeight + 8);
  leadingButton.position(10 + openButton.elt.offsetWidth + 10, drawHeight + 8);
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
  text(isWide ? 'Leading vs Open-Ended Question Sorter' : 'Leading vs Open-Ended Sorter',
    canvasWidth / 2, 10);
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

// The undealt cards peek out behind the current card, so the stack shrinks as you go
function drawStack() {
  const c = cardBox;
  const remaining = STATEMENTS.length - 1 - current;
  fill('white');
  stroke('silver');
  strokeWeight(1);
  for (let k = remaining; k >= 1; k--) {
    rect(c.x + k * STACK_STEP, c.y + k * STACK_STEP, c.w, c.h, 12);
  }
}

function drawCard() {
  const c = cardBox;
  const s = STATEMENTS[order[current]];
  const r = results[current];

  drawStack();

  // Shadow, then the card; after answering, the card keeps a light tint of its result
  noStroke();
  fill(0, 0, 0, 20);
  rect(c.x + 2, c.y + 3, c.w, c.h, 12);
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

  // Short flash of green or amber right after an answer
  if (answered && flash > 0) {
    noStroke();
    const a = map(flash, 0, 40, 0, 110);
    if (r.correct) fill(46, 125, 50, a);
    else fill(255, 179, 0, a);
    rect(c.x, c.y, c.w, c.h, 12);
  }

  // Header: the long form only when it fits beside the widest stamp
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(14);
  const longHeader = 'JORDAN\'S INTERVIEW SCRIPT  ·  QUESTION ' + (current + 1);
  const header = 18 + textWidth(longHeader) + 20 + stampWidth(OPEN) + 14 <= c.w
    ? longHeader : 'QUESTION ' + (current + 1);
  text(header, c.x + 18, c.y + 14);

  // Question text, plus the open-ended rewrite once a Leading card is answered.
  // Everything shrinks together in small steps until it fits, then centers vertically.
  const areaTop = c.y + 46;
  const areaBottom = c.y + c.h - 12;
  const rewrite = answered && s.rewrite ? s.rewrite : null;
  const fit = fitCardText('"' + s.text + '"', rewrite, c.w - 40, areaBottom - areaTop,
    isWide ? 24 : 18);
  let y = max(areaTop, (areaTop + areaBottom) / 2 - fit.height / 2);
  const x = c.x + 20;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  textSize(fit.size);
  for (const ln of fit.lines) {
    text(ln, x, y);
    y += fit.lead;
  }
  if (rewrite) {
    y += fit.gap;
    fill(INDIGO);
    textStyle(BOLD);
    textSize(fit.labelSize);
    text('OPEN-ENDED REWRITE', x, y);
    y += fit.labelLead;
    const boxH = fit.rLines.length * fit.rLead + 2 * fit.rPad;
    fill(INDIGO_TINT);
    rect(x, y, c.w - 40, boxH, 6);
    fill(INDIGO);
    rect(x, y, 5, boxH, 3);
    fill('black');
    textStyle(ITALIC);
    textSize(fit.rSize);
    let ry = y + fit.rPad;
    for (const ln of fit.rLines) {
      text(ln, x + 14, ry);
      ry += fit.rLead;
    }
    textStyle(NORMAL);
  }

  if (answered) drawStamp(s.correctAnswer);
}

// Largest text size (down to 12px) at which the question, and its rewrite if shown,
// fit the card's text area. Returns wrapped lines and spacing for both blocks.
function fitCardText(question, rewrite, maxW, maxH, base) {
  let f = null;
  for (let size = base; size >= 12; size--) {
    f = { size, lead: size * 1.35 };
    textStyle(NORMAL);
    textSize(size);
    f.lines = wrapText(question, maxW);
    f.height = f.lines.length * f.lead;
    if (rewrite) {
      f.gap = size * 0.6;
      f.labelSize = max(11, round(size * 0.6));
      f.labelLead = f.labelSize * 1.5;
      f.rSize = max(12, size - 4);
      f.rLead = f.rSize * 1.3;
      f.rPad = 6;
      textStyle(ITALIC);
      textSize(f.rSize);
      f.rLines = wrapText(rewrite, maxW - 24);
      f.height += f.gap + f.labelLead + f.rLines.length * f.rLead + 2 * f.rPad;
    }
    if (f.height <= maxH) break;
  }
  textStyle(NORMAL);
  return f;
}

function stampWidth(category) {
  textStyle(BOLD);
  textSize(16);
  return textWidth(category.toUpperCase()) + 24;
}

// Rubber stamp with the correct category in the card's upper right corner
function drawStamp(category) {
  const c = cardBox;
  const col = category === OPEN ? INDIGO : DARK_ORANGE;
  const w = stampWidth(category);
  const label = category.toUpperCase();
  push();
  translate(c.x + c.w - w / 2 - 14, c.y + 24);
  rotate(-0.05);
  noFill();
  stroke(col);
  strokeWeight(3);
  rect(-w / 2, -14, w, 28, 6);
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  text(label, 0, 1);
  pop();
  textStyle(NORMAL);
}

// Tally plus feedback: text scales down in small steps until it fits.
// On narrow screens the tally shares the first row with the result to save height.
function drawPanel() {
  const p = panelBox;
  const r = results[current];
  fill('white');
  if (answered) stroke(r.correct ? CORRECT_GREEN : AMBER);
  else stroke('silver');
  strokeWeight(answered ? 2 : 1);
  rect(p.x, p.y, p.w, p.h, 10);

  const tally = 'Correct: ' + score + ' / 6';
  const items = [];
  if (isWide) items.push({ kind: 'score', text: tally });
  if (!answered) {
    if (isWide) items.push({ kind: 'label', text: 'HOW TO DECIDE' });
    else items.push({ kind: 'result', text: 'How to decide', color: 'dimgray', right: tally });
    items.push({ kind: 'body', text: HINT });
  } else {
    const s = STATEMENTS[order[current]];
    const right = isWide ? null : tally;
    if (r.correct) {
      items.push({ kind: 'result', text: '✓ Correct!', color: CORRECT_GREEN, right });
      items.push({ kind: 'body', text: 'It is ' + phrase(s.correctAnswer) + '.', style: 'bold' });
    } else {
      items.push({ kind: 'result', text: '✗ Not quite', color: AMBER_TEXT, right });
      items.push({ kind: 'body', text: 'You chose ' + r.choice + ', but it is ' +
        phrase(s.correctAnswer) + '.', style: 'bold' });
    }
    items.push({ kind: 'body', text: s.explanation });
  }
  fitAndRender(items, p, 1.0);
}

// End screen: score, message, and a review row for every card in the order dealt
function drawSummary() {
  const b = summaryBox;
  fill('white');
  stroke(FOX_ORANGE);
  strokeWeight(2);
  rect(b.x, b.y, b.w, b.h, 12);

  let heading, sub;
  if (score === 6) {
    heading = 'No leading question got past you!';
    sub = 'You can tell a question that asks from one that sells.';
  } else if (score >= 4) {
    heading = 'Nice sorting!';
    sub = 'For each miss, ask who supplies the content: the customer or the question?';
  } else {
    heading = 'Keep practicing!';
    sub = 'Try the stranger test: could someone answer "no" without feeling awkward?';
  }
  const items = [
    { kind: 'label', text: 'SCRIPT REVIEW COMPLETE' },
    { kind: 'heading', text: heading },
    { kind: 'body', text: 'You sorted ' + score + ' of 6 interview questions correctly. ' + sub },
    { kind: 'label', text: 'ALL SIX QUESTIONS', right: 'ANSWER', rightColor: 'dimgray' }
  ];
  results.forEach((r, i) => {
    const s = STATEMENTS[order[i]];
    items.push({
      kind: 'review',
      mark: r.correct ? '✓' : '✗',
      markColor: r.correct ? CORRECT_GREEN : AMBER_TEXT,
      bg: r.correct ? 'honeydew' : '#FFF8E1',
      text: s.label,
      right: s.correctAnswer,
      rightColor: s.correctAnswer === OPEN ? INDIGO : DARK_ORANGE
    });
  });
  fitAndRender(items, b, 1.0);
}

function drawControlText() {
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  textSize(16);
  let msg = '';
  if (finished) msg = 'Same six cards, new order.';
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
  score:   { size: 20, style: 'bold',   color: 'black',     before: 0 },
  heading: { size: 26, style: 'bold',   color: DARK_ORANGE, before: 2 },
  label:   { size: 14, style: 'bold',   color: 'dimgray',   before: 10 },
  result:  { size: 20, style: 'bold',   color: 'black',     before: 8 },
  body:    { size: 17, style: 'normal', color: 'black',     before: 6 },
  review:  { size: 16, style: 'normal', color: 'black',     before: 4 }
};

function fitAndRender(items, box, base) {
  let blocks = null;
  for (let s = base; s >= 0.7; s -= 0.04) {
    blocks = layoutItems(items, box.w - 32, s);
    if (blocks.height <= box.h - 24) break;
  }
  renderBlocks(blocks, box.x + 16, box.y + 12, box.w - 32);
}

// Wrap each item to the available width. An item may carry a mark on its left,
// bold right-aligned text on its first line, and a tinted background.
function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    const style = it.style || st.style;
    textSize(size);
    textStyle(BOLD);
    const rightW = it.right ? textWidth(it.right) + 12 : 0;
    const markW = it.mark ? size * 1.5 : 0;
    const padX = it.bg ? 8 : 0;
    textStyle(style);
    const lines = wrapText(it.text, maxW - rightW - markW - 2 * padX);
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    const pad = it.bg ? 3 : 0;
    blocks.push({ item: it, lines, size, style, color: it.color || st.color, lead, before,
      rightW, markW, padX, pad });
    height += before + lines.length * lead + 2 * pad;
  }
  blocks.height = height;
  return blocks;
}

function renderBlocks(blocks, x, y, w) {
  for (const b of blocks) {
    const it = b.item;
    y += b.before;
    const h = b.lines.length * b.lead + 2 * b.pad;
    if (it.bg) {
      noStroke();
      fill(it.bg);
      rect(x, y, w, h, 6);
    }
    noStroke();
    textSize(b.size);
    y += b.pad;
    if (it.mark) {
      textStyle(BOLD);
      fill(it.markColor);
      textAlign(LEFT, TOP);
      text(it.mark, x + b.padX, y);
    }
    if (it.right) {
      textStyle(BOLD);
      fill(it.rightColor || 'black');
      textAlign(RIGHT, TOP);
      text(it.right, x + w - b.padX, y);
    }
    textAlign(LEFT, TOP);
    textStyle(b.style);
    fill(b.color);
    for (const ln of b.lines) {
      text(ln, x + b.padX + b.markW, y);
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
  for (const b of [openButton, leadingButton]) {
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

function phrase(category) {
  return category === OPEN ? 'an open-ended question' : 'a leading question';
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
