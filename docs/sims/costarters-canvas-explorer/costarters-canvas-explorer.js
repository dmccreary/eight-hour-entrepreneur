// CO.STARTERS Canvas Explorer - p5.js MicroSim
// CANVAS_HEIGHT: 650
// A clickable map of the 11-block CO.STARTERS Canvas, filled in with Jordan's
// Session 1 draft for a mobile dog-grooming idea. Click any block, or step through
// the blocks in canvas order with Previous / Next (or the arrow keys), to see the
// block's guiding question, a one-sentence definition, Jordan's example answer, and
// the later chapter that covers the block in depth. Show All Answers writes Jordan's
// short answer inside every block, so the whole worked example reads at a glance.
// Nothing animates: the canvas is a fixed page to read, not a process to watch.
// A check mark appears on each block once it has been explored.
// Wide screens (>= 600px): a four-row grid laid out like the canvas sheet
// (2 / 4 / 3 / 2 blocks) with the detail panel below it.
// Narrow screens (< 600px): the blocks reflow into a single column in canvas order,
// with the detail panel below the column.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 600;
let controlHeight = 50;   // one row: Previous, Next, Show All Answers
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const NARROW_BREAK = 600; // below this width the grid becomes a single column

// Book palette
const INDIGO = '#3F51B5';        // every canvas block
const INDIGO_HOVER = '#5C6BC0';  // block under the mouse
const FOX_ORANGE = '#E8791A';    // outline of the selected block and the detail panel
const DARK_ORANGE = '#B25A10';   // headings and chapter references (readable on white)
const AMBER = '#FFB300';         // bar beside Jordan's answer
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // "all 11 explored" message
const CREAM = 'oldlace';         // drawing-area background, from the mascot palette
const QUOTE_FILL = '#FFF8E1';    // pale amber behind Jordan's answer
const CHECK_COLOR = '#C5CAE9';   // light indigo check mark on explored blocks

// The 11 blocks in canvas order. example is Jordan's Session 1 answer from the
// chapter's worked-example table; chapterRef names the chapter that goes deep on it.
const BLOCKS = [
  { label: 'Customer',
    question: 'Who exactly are you serving?',
    definition: 'A specific, falsifiable description of who the venture serves: a defined group, not "everyone with a dog."',
    example: 'Busy dog owners within 5 miles without easy groomer access',
    chapterRef: 'Chapter 4', chapterTitle: 'Customer Discovery & Segmentation' },
  { label: 'Problem',
    question: 'What pain are they feeling?',
    definition: 'The specific pain the customer group feels, stated from their point of view rather than the founder\'s.',
    example: '30+ minute round trips, or skipping grooming altogether',
    chapterRef: 'Chapter 5', chapterTitle: 'Defining the Real Problem' },
  { label: 'Solution',
    question: 'What will you offer?',
    definition: 'What the venture will actually offer to address the problem, kept deliberately small at first.',
    example: 'Grooming that comes to their driveway',
    chapterRef: 'Chapter 6', chapterTitle: 'Designing the Solution & Initial Offer' },
  { label: 'Alternatives',
    question: 'How do they solve this today?',
    definition: 'How the customer solves this problem today without you, including doing nothing at all.',
    example: 'Drive to a booked-solid groomer, or do nothing',
    chapterRef: 'Chapter 7', chapterTitle: 'Alternatives & the Competitive Landscape' },
  { label: 'Benefit',
    question: 'Why do they want it?',
    definition: 'Why the customer wants your solution, described as their own outcome rather than your product\'s features.',
    example: 'No driving, no waiting for a booked calendar slot',
    chapterRef: 'Chapter 8', chapterTitle: 'Value Proposition: Benefit & Advantage' },
  { label: 'Advantage',
    question: 'Why are you the one to deliver it?',
    definition: 'Why you, this particular founder, are positioned to deliver the solution better than anyone else could.',
    example: 'Already trusted by 3 neighbors after driveway sessions',
    chapterRef: 'Chapter 8', chapterTitle: 'Value Proposition: Benefit & Advantage' },
  { label: 'Message',
    question: 'How would you describe it in one line?',
    definition: 'The one-line way you will describe the offer to a stranger.',
    example: '"Dog grooming that comes to your driveway."',
    chapterRef: 'Chapter 12', chapterTitle: 'Messaging & the Value Proposition Statement' },
  { label: 'Distribution',
    question: 'How will they hear about it?',
    definition: 'How customers will actually discover and reach the offer.',
    example: 'Neighborhood app posts, word of mouth',
    chapterRef: 'Chapter 13', chapterTitle: 'Distribution & Go-to-Market Channels' },
  { label: 'Revenue',
    question: 'How will you charge for it?',
    definition: 'How the venture will charge for what it delivers.',
    example: 'Flat $40 per driveway session',
    chapterRef: 'Chapter 14', chapterTitle: 'Revenue Models & Pricing' },
  { label: 'Startup Needs',
    question: 'What do you need once, up front?',
    definition: 'One-time resources needed before the venture can begin at all, such as equipment, a license, or first supplies.',
    example: 'Grooming kit, business cards',
    chapterRef: 'Chapter 15', chapterTitle: 'Startup Needs & Cost Planning' },
  { label: 'Costs',
    question: 'What will it cost to keep running?',
    definition: 'The ongoing expenses the venture carries once it is running, such as materials, gas, or subscriptions.',
    example: 'Supplies, gas, insurance',
    chapterRef: 'Chapter 15', chapterTitle: 'Startup Needs & Cost Planning' }
];

// Rows of the physical canvas sheet (block indexes) and each row's share of grid height
const ROWS = [[0, 1], [2, 3, 4, 5], [6, 7, 8], [9, 10]];
const ROW_WEIGHTS = [0.23, 0.29, 0.25, 0.23];

// State
let selected = -1;          // index of the selected block, -1 = none
let showAnswers = false;    // Show All Answers toggle
let visited = [];           // visited[i] is true once block i has been explored
let hovered = -1;           // block under the mouse, -1 = none

// Layout, recomputed by computeLayout() on every resize and toggle
let isWide = true;
let blockBoxes = [];        // per block: {x, y, w, h, labelSize, answerSize, answerLines, ...}
let panelBox = {};
let panelCache = null;      // laid-out detail panel text, rebuilt when state changes
let controlsRight = 0;      // x just past the last button

let prevButton, nextButton, answersButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  prevButton = createButton('Previous');
  prevButton.mousePressed(previousBlock);
  nextButton = createButton('Next');
  nextButton.mousePressed(nextBlock);
  answersButton = createButton('Show All Answers');
  answersButton.mousePressed(toggleAnswers);
  // Larger button text so the controls are readable from the back of the room
  for (const b of [prevButton, nextButton, answersButton]) {
    b.style('font-size', '16px');
  }

  computeLayout();
  updateButtons();

  describe('A clickable map of the 11-block CO.STARTERS Canvas, filled in with Jordan\'s ' +
    'Session 1 answers for a mobile dog-grooming idea. The blocks sit in four rows: ' +
    'Customer and Problem; Solution, Alternatives, Benefit and Advantage; Message, ' +
    'Distribution and Revenue; Startup Needs and Costs. Click a block or use Previous and ' +
    'Next to show its guiding question, a one-sentence definition, Jordan\'s answer, and ' +
    'the chapter that covers it in depth. Show All Answers writes Jordan\'s answer inside ' +
    'every block.');
}

function draw() {
  updateCanvasSize();
  if (canvasWidth !== width) {
    // The container changed size without a window resize event
    resizeCanvas(canvasWidth, canvasHeight);
    computeLayout();
  }

  // Drawing region: cream background from the mascot palette
  fill(CREAM);
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  hovered = blockAt(mouseX, mouseY);
  drawBlocks();
  drawPanel();
  drawControlText();
  cursor(hovered >= 0 ? HAND : ARROW);
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= NARROW_BREAK;
  blockBoxes = [];
  if (isWide) {
    layoutGrid();
  } else {
    layoutColumn();
  }
  panelCache = null;
  positionControls();
}

// Wide: the four rows of the canvas sheet, detail panel below
function layoutGrid() {
  const top = 46;
  const gap = 8;
  const panelH = 170;
  const panelY = drawHeight - 10 - panelH;
  const gridH = panelY - 10 - top - gap * (ROWS.length - 1);
  let y = top;
  ROWS.forEach((row, r) => {
    const h = Math.round(gridH * ROW_WEIGHTS[r]);
    const w = (canvasWidth - 2 * margin - gap * (row.length - 1)) / row.length;
    row.forEach((idx, c) => {
      blockBoxes[idx] = { x: margin + c * (w + gap), y: y, w: w, h: h };
    });
    y += h + gap;
  });
  panelBox = { x: margin, y: panelY, w: canvasWidth - 2 * margin, h: panelH };

  // Fit each block's label and (when shown) Jordan's answer inside the block
  for (let i = 0; i < BLOCKS.length; i++) {
    const b = blockBoxes[i];
    textStyle(BOLD);
    let ls = showAnswers ? 16 : 18;
    textSize(ls);
    while (ls > 12 && textWidth(BLOCKS[i].label) > b.w - 36) {
      ls--;
      textSize(ls);
    }
    b.labelSize = ls;
    if (showAnswers) {
      const areaW = b.w - 20;
      const areaH = b.h - (ls + 22);
      textStyle(NORMAL);
      for (let s = 15; s >= 11; s--) {
        textSize(s);
        b.answerSize = s;
        b.answerLead = s * 1.25;
        b.answerLines = wrapText(BLOCKS[i].example, areaW);
        if (b.answerLines.length * b.answerLead <= areaH) break;
      }
    }
  }
  textStyle(NORMAL);
}

// Narrow: one full-width row per block, in canvas order, detail panel below
function layoutColumn() {
  const top = 36;
  const gap = showAnswers ? 2 : 4;  // answer rows are taller, so they sit closer together
  const x = 10;
  const w = canvasWidth - 20;
  // Width of the label column when answers are shown beside the labels
  textStyle(BOLD);
  textSize(14);
  let labelW = 0;
  for (const blk of BLOCKS) labelW = max(labelW, textWidth(blk.label));
  labelW += 18;

  let y = top;
  for (let i = 0; i < BLOCKS.length; i++) {
    const b = { x: x, y: y, w: w, h: 25, labelSize: 15, labelW: labelW };
    if (showAnswers) {
      b.labelSize = 14;
      const areaW = w - labelW - 26;  // room on the right for the explored check mark
      textStyle(NORMAL);
      for (let s = 13; s >= 12; s--) {
        textSize(s);
        b.answerSize = s;
        b.answerLead = s * 1.2;
        b.answerLines = wrapText(BLOCKS[i].example, areaW);
        if (b.answerLines.length <= 2) break;
      }
      b.h = max(25, b.answerLines.length * b.answerLead + 8);
    }
    blockBoxes[i] = b;
    y += b.h + gap;
  }
  const py = y - gap + 8;
  panelBox = { x: 10, y: py, w: canvasWidth - 20, h: drawHeight - 8 - py };
  textStyle(NORMAL);
}

function positionControls() {
  const pad = canvasWidth < 420 ? '4px 8px' : '4px 12px';
  for (const b of [prevButton, nextButton, answersButton]) b.style('padding', pad);
  const y = drawHeight + 10;
  let x = 10;
  prevButton.position(x, y);
  x += prevButton.elt.offsetWidth + 8;
  nextButton.position(x, y);
  x += nextButton.elt.offsetWidth + 14;
  answersButton.position(x, y);
  controlsRight = x + answersButton.elt.offsetWidth;
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('CO.STARTERS Canvas Explorer', canvasWidth / 2, isWide ? 10 : 8);
}

function drawBlocks() {
  const r = isWide ? 10 : 7;
  for (let i = 0; i < BLOCKS.length; i++) {
    const b = blockBoxes[i];
    const isSel = i === selected;
    noStroke();
    fill(i === hovered && !isSel ? INDIGO_HOVER : INDIGO);
    rect(b.x, b.y, b.w, b.h, r);
    if (isSel) {
      // Thick fox-orange outline, drawn inset so it never touches a neighbor
      noFill();
      stroke(FOX_ORANGE);
      strokeWeight(4);
      rect(b.x + 2, b.y + 2, b.w - 4, b.h - 4, r - 1);
      strokeWeight(1);
    }
    if (isWide) drawGridBlockText(i, b);
    else drawRowBlockText(i, b);
  }
}

function drawGridBlockText(i, b) {
  noStroke();
  fill('white');
  textStyle(BOLD);
  textSize(b.labelSize);
  if (!showAnswers) {
    textAlign(CENTER, CENTER);
    text(BLOCKS[i].label, b.x + b.w / 2, b.y + b.h / 2);
  } else {
    textAlign(LEFT, TOP);
    text(BLOCKS[i].label, b.x + 10, b.y + 9);
    textStyle(NORMAL);
    textSize(b.answerSize);
    let y = b.y + b.labelSize + 17;
    for (const ln of b.answerLines) {
      text(ln, b.x + 10, y);
      y += b.answerLead;
    }
  }
  textStyle(NORMAL);
  if (visited[i]) {
    noStroke();
    fill(CHECK_COLOR);
    textAlign(RIGHT, TOP);
    textSize(15);
    text('✓', b.x + b.w - 9, b.y + 8);
  }
}

function drawRowBlockText(i, b) {
  noStroke();
  fill('white');
  textStyle(BOLD);
  textSize(b.labelSize);
  textAlign(LEFT, CENTER);
  text(BLOCKS[i].label, b.x + 10, b.y + b.h / 2);
  if (showAnswers) {
    textStyle(NORMAL);
    textSize(b.answerSize);
    textAlign(LEFT, TOP);
    let y = b.y + (b.h - b.answerLines.length * b.answerLead) / 2 + 1;
    for (const ln of b.answerLines) {
      text(ln, b.x + b.labelW, y);
      y += b.answerLead;
    }
  }
  textStyle(NORMAL);
  if (visited[i]) {
    noStroke();
    fill(CHECK_COLOR);
    textAlign(RIGHT, CENTER);
    textSize(15);
    text('✓', b.x + b.w - 10, b.y + b.h / 2);
  }
}

// Detail panel: the selected block's question, definition, Jordan's answer and chapter
function drawPanel() {
  const p = panelBox;
  fill('white');
  if (selected >= 0) {
    stroke(FOX_ORANGE);
    strokeWeight(2);
  } else {
    stroke('silver');
    strokeWeight(1);
  }
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  const key = selected + '|' + showAnswers + '|' + canvasWidth;
  if (!panelCache || panelCache.key !== key) panelCache = { key: key, columns: buildPanel() };

  for (const col of panelCache.columns) renderBlocks(col.blocks, col.x, col.y, col.w);
  if (panelCache.columns.length === 2) {
    // Thin divider between the two columns
    const c = panelCache.columns[1];
    stroke('gainsboro');
    strokeWeight(1);
    line(c.x - 12, p.y + 14, c.x - 12, p.y + p.h - 14);
  }
}

// Build the panel's text columns and fit them to the panel.
// Items marked with drop are removed (highest drop first) if the text will not fit.
function buildPanel() {
  const p = panelBox;
  const inner = { x: p.x + 16, y: p.y + 12, w: p.w - 32, h: p.h - 22 };

  if (selected < 0) {
    const items = [
      { kind: 'heading', text: 'Click any block to explore it' },
      { kind: 'body', text: showAnswers ?
        'Every block now shows Jordan\'s Session 1 answer. Click a block, or press Next, to see the question that answer responds to.' :
        'Each block answers one plain-language question about a venture. Click a block, or press Next to step through all 11 in canvas order.' },
      { kind: 'body', color: 'dimgray', drop: 1, text: 'You will see the block\'s guiding question, a one-sentence definition, ' +
        'Jordan\'s answer for the mobile dog-grooming idea, and the chapter that covers the block in depth.' }
    ];
    return fitColumns([{ items: items, x: inner.x, y: inner.y, w: inner.w, h: inner.h }]);
  }

  const blk = BLOCKS[selected];
  const header = { kind: 'label', drop: 3,
    text: 'BLOCK ' + (selected + 1) + ' OF 11  ·  ' + blk.label.toUpperCase() };
  const question = { kind: 'question', text: blk.question };
  const definition = { kind: 'body', text: blk.definition, drop: 1 };

  if (inner.w >= 600) {
    // Two columns: the block itself on the left, Jordan's example on the right
    const gutter = 24;
    const cw = (inner.w - gutter) / 2;
    const left = [header, question, definition];
    const right = [
      { kind: 'label', text: 'JORDAN\'S SESSION 1 ANSWER' },
      { kind: 'quote', text: blk.example },
      { kind: 'ref', text: 'Explored in depth in ' + blk.chapterRef + ': ' + blk.chapterTitle }
    ];
    return fitColumns([
      { items: left, x: inner.x, y: inner.y, w: cw, h: inner.h },
      { items: right, x: inner.x + cw + gutter, y: inner.y, w: cw, h: inner.h }
    ]);
  }

  // One column. On a narrow screen with answers shown, Jordan's answer is already
  // visible in the block's row, so it is the first thing dropped if space runs out.
  const items = [
    header,
    question,
    definition,
    { kind: 'quote', text: 'Jordan: ' + blk.example, drop: (showAnswers && !isWide) ? 4 : 0 },
    { kind: 'ref', text: 'Explored in depth in ' + blk.chapterRef +
      (inner.w >= 480 ? ': ' + blk.chapterTitle : '') }
  ];
  return fitColumns([{ items: items, x: inner.x, y: inner.y, w: inner.w, h: inner.h }]);
}

function drawControlText() {
  let n = 0;
  for (let i = 0; i < BLOCKS.length; i++) if (visited[i]) n++;
  noStroke();
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, CENTER);
  fill(n === BLOCKS.length ? CORRECT_GREEN : 'dimgray');
  let msg = n === BLOCKS.length ? 'All 11 blocks explored' : 'Explored: ' + n + ' of 11';
  const room = canvasWidth - controlsRight - 22;
  if (textWidth(msg) > room) msg = n + ' / 11';
  if (textWidth(msg) <= room) text(msg, canvasWidth - 12, drawHeight + 25);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  heading:  { size: 22, style: 'bold',   color: DARK_ORANGE, before: 0 },
  label:    { size: 14, style: 'bold',   color: 'dimgray',   before: 10 },
  question: { size: 20, style: 'bold',   color: INDIGO,      before: 4 },
  body:     { size: 16, style: 'normal', color: 'black',     before: 6 },
  quote:    { size: 16, style: 'italic', color: 'black',     before: 8 },
  ref:      { size: 15, style: 'bold',   color: DARK_ORANGE, before: 8 }
};
const MIN_SCALE = 0.85;  // never shrink panel text below 85% of its base size

// Find the largest common scale at which every column fits its box; if none does,
// drop the most expendable item and try again.
function fitColumns(columns) {
  for (;;) {
    for (let s = 1.0; s >= MIN_SCALE - 0.001; s -= 0.05) {
      const laid = columns.map(c => layoutItems(c.items, c.w, s));
      if (laid.every((l, k) => l.height <= columns[k].h)) {
        return columns.map((c, k) => ({ blocks: laid[k], x: c.x, y: c.y, w: c.w }));
      }
    }
    let worst = null;
    columns.forEach(c => c.items.forEach((it, idx) => {
      if (it.drop && (!worst || it.drop > worst.item.drop)) worst = { col: c, idx: idx, item: it };
    }));
    if (!worst) {
      return columns.map(c => ({ blocks: layoutItems(c.items, c.w, MIN_SCALE), x: c.x, y: c.y, w: c.w }));
    }
    worst.col.items = worst.col.items.filter((_, idx) => idx !== worst.idx);
  }
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
  textStyle(NORMAL);
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
      fill(QUOTE_FILL);
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

// ---------- Interaction ----------

// Index of the block under (mx, my), or -1
function blockAt(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return -1;
  for (let i = 0; i < blockBoxes.length; i++) {
    const b = blockBoxes[i];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
  }
  return -1;
}

function mousePressed() {
  const i = blockAt(mouseX, mouseY);
  if (i >= 0) selectBlock(i);
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) nextBlock();
  else if (keyCode === LEFT_ARROW) previousBlock();
}

function selectBlock(i) {
  selected = i;
  visited[i] = true;
  panelCache = null;
  updateButtons();
}

function nextBlock() {
  if (selected < BLOCKS.length - 1) selectBlock(selected + 1);
}

function previousBlock() {
  if (selected > 0) selectBlock(selected - 1);
}

function toggleAnswers() {
  showAnswers = !showAnswers;
  answersButton.html(showAnswers ? 'Hide All Answers' : 'Show All Answers');
  computeLayout();
}

// Previous is off with nothing selected or at the first block; Next is off at the last
function updateButtons() {
  if (selected <= 0) prevButton.attribute('disabled', '');
  else prevButton.removeAttribute('disabled');
  if (selected >= BLOCKS.length - 1) nextButton.attribute('disabled', '');
  else nextButton.removeAttribute('disabled');
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
