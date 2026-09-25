// Two-Minute Pitch Structure and Timer - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Jordan's two-minute founder pitch split into four timed sections: Problem (30s),
// Solution (30s), Evidence (40s) and Ask (20s). On wide screens the four section blocks
// form a time bar whose widths match each section's share of the 120 seconds.
// Start Pitch Timer runs a 120-second countdown driven by millis(), so it stays accurate
// even when frames are dropped. Pause / Resume and Reset control the clock. As the clock
// crosses each section boundary (0:30, 1:00, 1:40) the next block flashes and turns
// fox-orange, and the detail panel shows what belongs in that section plus Jordan's
// version of it. The timer stops at 2:00.
// Click a block, or press Previous / Next (or the left and right arrow keys), to study
// any section without running the clock. While the clock runs this previews a section:
// the live section keeps an amber outline, and the panel returns to it at the next
// boundary (or when Resume is pressed).
// Wide screens (>= 600px): blocks in one proportional row; timer card left, panel right.
// Narrow screens (< 600px): blocks in a 2x2 grid above a thin proportional time bar,
// with a one-row timer strip above the panel.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 448;
let controlHeight = 50;   // one row: Start Pitch Timer, Reset ... Previous, Next
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 600;        // below this width the blocks form a 2x2 grid
const PITCH_MS = 120000;       // the whole pitch: 120 seconds
const WORDS_PER_MINUTE = 150;  // relaxed speaking pace used for each section's word budget
const FLASH_MS = 1500;         // how long a block glows after the clock enters it

// Book palette
const INDIGO = '#3F51B5';        // unselected section blocks, elapsed time on the time bar
const INDIGO_HOVER = '#5C6BC0';  // block under the mouse
const FOX_ORANGE = '#E8791A';    // the section shown in the panel, the playhead
const DARK_ORANGE = '#B25A10';   // section name heading, last-seconds warnings
const AMBER = '#FFB300';         // bar beside Jordan's example, live-section outline
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // pitch complete
const QUOTE_FILL = '#FFF8E1';    // pale amber behind Jordan's example
const PROMPT_FILL = 'lavender';  // pale indigo behind "What belongs here"
const TRACK_FILL = '#C5CAE9';    // pale indigo: time not yet used

// The four sections of the pitch. cumulativeEnd is the clock time (seconds) at which
// the section ends; content is Jordan's version from Chapter 17.
const SEGMENTS = [
  { label: 'Problem', seconds: 30, cumulativeEnd: 30,
    prompt: 'Who has the problem, and what does it cost them? One specific, validated pain.',
    content: 'Busy dog owners within 5 miles lose a half-day of income or personal time ' +
      'every grooming trip — the validated problem from Chapter 5.' },
  { label: 'Solution', seconds: 30, cumulativeEnd: 60,
    prompt: 'What do you offer? Your minimum viable offer, in the words a customer would use.',
    content: 'Grooming that comes to their driveway — the minimum viable offer from Chapter 6.' },
  { label: 'Evidence', seconds: 40, cumulativeEnd: 100,
    prompt: 'What did real customers do? Numbers from your tests, not opinions.',
    content: '3 of 5 driveway sessions converted to paying customers; $40 price point ' +
      'validated in Chapter 14\'s price testing.' },
  { label: 'Ask', seconds: 20, cumulativeEnd: 120,
    prompt: 'What do you need from the cohort? One or two specific requests they can act on.',
    content: 'Looking for 2 more referrals this month, and feedback on expanding to ' +
      'weekend availability.' }
];

// State
let selected = -1;          // section shown in the panel; -1 = the overview
let running = false;
let finished = false;       // true once the clock reaches 2:00
let accumulatedMs = 0;      // elapsed time banked before the current run
let runStartMs = 0;         // millis() when the current run started
let liveSeg = -1;           // section the clock is in; -1 before the first start
let flashStart = -100000;   // millis() when the clock last entered a section
let hovered = -1;           // block under the mouse, -1 = none

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let blocks = [];            // per section: {x, y, w, h}
let track = {};             // thin proportional time bar
let timerBox = {}, panelBox = {};
let titleText = '', titleSize = 24;
let blockNameSize = 18, blockBudgetSize = 14, budgetFormat = 1;
let panelCache = null;      // laid-out panel text, rebuilt when the state changes
let leftControlsEnd = 0;    // x just past the Reset button
let prevButtonX = 0;        // x of the Previous button

let startButton, resetButton, prevButton, nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  startButton = createButton('Start Pitch Timer');
  startButton.mousePressed(toggleTimer);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetTimer);
  prevButton = createButton('◀ Previous');
  prevButton.mousePressed(previousSection);
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(nextSection);
  // Larger button text so the controls are readable from the back of the room.
  // A fixed line height keeps the arrow glyphs from making Previous / Next taller.
  for (const b of [startButton, resetButton, prevButton, nextButton]) {
    b.style('font-size', '16px');
    b.style('line-height', '20px');
  }

  computeLayout();

  describe('Jordan\'s two-minute pitch shown as four section blocks on a time bar: ' +
    'Problem, 30 seconds; Solution, 30 seconds; Evidence, 40 seconds; Ask, 20 seconds. ' +
    'Start Pitch Timer runs a 120-second countdown. As the clock reaches 0:30, 1:00 and ' +
    '1:40 the next block turns orange and a panel shows what belongs in that section and ' +
    'Jordan\'s version of it. Pause, Resume and Reset control the clock. Click a block or ' +
    'use Previous and Next to study any section without running the clock.');
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

  updateClock();
  drawTitle();
  hovered = blockAt(mouseX, mouseY);
  drawBlocks();
  drawTrack();
  if (isWide) drawTimerCard();
  else drawTimerStrip();
  drawPanel();
  drawControlText();
  cursor(hovered >= 0 ? HAND : ARROW);
}

// ---------- Clock model ----------

// Elapsed pitch time in milliseconds, from millis() so it is independent of frame rate
function elapsedMs() {
  const e = accumulatedMs + (running ? millis() - runStartMs : 0);
  return min(e, PITCH_MS);
}

function hasStarted() {
  return running || finished || accumulatedMs > 0;
}

// Index of the section that contains clock time ms
function segmentAt(ms) {
  for (let i = 0; i < SEGMENTS.length; i++) {
    if (ms < SEGMENTS[i].cumulativeEnd * 1000) return i;
  }
  return SEGMENTS.length - 1;
}

function segStart(i) {
  return SEGMENTS[i].cumulativeEnd - SEGMENTS[i].seconds;
}

// Stop at 2:00, and move the panel to each new section as the clock crosses a boundary
function updateClock() {
  if (running && accumulatedMs + millis() - runStartMs >= PITCH_MS) {
    accumulatedMs = PITCH_MS;
    running = false;
    finished = true;
    panelCache = null;
    updateButtons();
  }
  if (!hasStarted()) return;
  const live = segmentAt(elapsedMs());
  if (running && live !== liveSeg) {
    selected = live;
    flashStart = millis();
    panelCache = null;
    updateButtons();
  }
  liveSeg = live;
}

// Seconds as m:ss
function clock(sec) {
  const s = max(0, Math.round(sec));
  return floor(s / 60) + ':' + nf(s % 60, 2);
}

// Countdown display: shows 2:00 until a full second has passed, 0:00 only at the end
function remainingText() {
  return clock(Math.ceil((PITCH_MS - elapsedMs()) / 1000));
}

function sectionLeftSec() {
  return Math.ceil((SEGMENTS[liveSeg].cumulativeEnd * 1000 - elapsedMs()) / 1000);
}

function wordBudget(s) {
  return Math.round(s.seconds * WORDS_PER_MINUTE / 60);
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  fitTitle();
  if (isWide) {
    layoutWide();
  } else {
    layoutNarrow();
  }
  fitBlockLabels();
  panelCache = null;
  sizeStartButton();
  updateButtons();
}

// x position of clock time sec on the time bar
function timeX(sec) {
  return track.x + track.w * sec / 120;
}

// Wide: the blocks are the time bar, each as wide as its share of the 120 seconds
function layoutWide() {
  track = { x: margin, y: 120, w: canvasWidth - 2 * margin, h: 12 };
  blocks = SEGMENTS.map((s, i) => {
    const x0 = timeX(segStart(i)) + (i > 0 ? 3 : 0);
    const x1 = timeX(s.cumulativeEnd) - (i < SEGMENTS.length - 1 ? 3 : 0);
    return { x: x0, y: 46, w: x1 - x0, h: 62 };
  });
  const top = 160;
  const bottom = drawHeight - 12;
  const tw = Math.round(constrain(canvasWidth * 0.3, 214, 260));
  timerBox = { x: margin, y: top, w: tw, h: bottom - top };
  const px = margin + tw + 14;
  panelBox = { x: px, y: top, w: canvasWidth - margin - px, h: bottom - top };
}

// Narrow: a 2x2 grid of blocks, then the time bar, the timer strip and the panel
function layoutNarrow() {
  const x = 10;
  const w = canvasWidth - 20;
  const top = 34;
  const gap = 6;
  const bh = 44;
  const bw = (w - gap) / 2;
  blocks = SEGMENTS.map((s, i) => ({
    x: x + (i % 2) * (bw + gap), y: top + Math.floor(i / 2) * (bh + gap), w: bw, h: bh
  }));
  const gridBottom = top + 2 * bh + gap;
  track = { x: x, y: gridBottom + 10, w: w, h: 10 };
  timerBox = { x: x, y: track.y + track.h + 24, w: w, h: 46 };
  const py = timerBox.y + timerBox.h + 8;
  panelBox = { x: x, y: py, w: w, h: drawHeight - 8 - py };
}

function fitTitle() {
  const room = canvasWidth - 20;
  textStyle(NORMAL);
  titleText = 'Two-Minute Pitch Structure and Timer';
  for (titleSize = isWide ? 24 : 20; titleSize > 17; titleSize--) {
    textSize(titleSize);
    if (textWidth(titleText) <= room) return;
  }
  titleText = 'Two-Minute Pitch Timer';
  titleSize = 20;
}

// Second line of a block: the time budget, with its clock range when there is room
function budgetText(i, fmt) {
  const s = SEGMENTS[i];
  if (fmt === 0) return s.seconds + ' seconds · ' + clock(segStart(i)) + '–' + clock(s.cumulativeEnd);
  if (fmt === 1) return s.seconds + ' seconds';
  return s.seconds + 's';
}

// One name size and one budget format for all four blocks, so they read as a set.
// Wide blocks skip the clock range because the tick labels under the bar show it.
function fitBlockLabels() {
  const maxName = isWide ? 18 : 17;
  blockBudgetSize = isWide ? 14 : 13;
  const fitsAll = (fn) => blocks.every((b, i) => fn(i) <= b.w - 14);
  textStyle(BOLD);
  for (blockNameSize = maxName; blockNameSize > 12; blockNameSize--) {
    textSize(blockNameSize);
    if (fitsAll(i => textWidth(SEGMENTS[i].label))) break;
  }
  textStyle(NORMAL);
  textSize(blockBudgetSize);
  budgetFormat = 2;
  for (let fmt = isWide ? 1 : 0; fmt <= 2; fmt++) {
    if (fitsAll(i => textWidth(budgetText(i, fmt)))) {
      budgetFormat = fmt;
      break;
    }
  }
}

// Give the Start button the width of its widest label so Reset never shifts under
// the mouse when the label changes between Start, Pause and Resume
function sizeStartButton() {
  const pad = canvasWidth < 420 ? '4px 8px' : '4px 12px';
  for (const b of [startButton, resetButton, prevButton, nextButton]) b.style('padding', pad);
  startButton.style('min-width', '0px');
  let w = 0;
  for (const label of [startIdleLabel(), 'Pause', 'Resume']) {
    startButton.html(label);
    w = max(w, startButton.elt.offsetWidth);
  }
  startButton.style('min-width', w + 'px');
}

function startIdleLabel() {
  return canvasWidth < 520 ? 'Start' : 'Start Pitch Timer';
}

function positionControls() {
  const y = drawHeight + 10;
  let x = 10;
  startButton.position(x, y);
  x += startButton.elt.offsetWidth + 8;
  resetButton.position(x, y);
  leftControlsEnd = x + resetButton.elt.offsetWidth;
  const nextX = canvasWidth - 10 - nextButton.elt.offsetWidth;
  nextButton.position(nextX, y);
  prevButtonX = nextX - 8 - prevButton.elt.offsetWidth;
  prevButton.position(prevButtonX, y);
}

// Button labels and enabled states follow the clock and the selected section
function updateButtons() {
  let label = startIdleLabel();
  if (running) label = 'Pause';
  else if (accumulatedMs > 0 && !finished) label = 'Resume';
  startButton.html(label);
  prevButton.html(canvasWidth < 520 ? '◀ Prev' : '◀ Previous');
  setEnabled(prevButton, selected > 0);
  setEnabled(nextButton, selected < SEGMENTS.length - 1);
  setEnabled(resetButton, hasStarted() || selected >= 0);
  positionControls();
}

function setEnabled(button, on) {
  if (on) button.removeAttribute('disabled');
  else button.attribute('disabled', '');
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(titleSize);
  text(titleText, canvasWidth / 2, isWide ? 10 : 7);
}

function drawBlocks() {
  const since = millis() - flashStart;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const b = blocks[i];
    const isSel = i === selected;
    const isLive = hasStarted() && !finished && i === liveSeg;

    // A fading amber glow around the block the clock just entered
    if (running && i === liveSeg && since < FLASH_MS) {
      noFill();
      stroke(255, 179, 0, 255 * (1 - since / FLASH_MS));
      strokeWeight(6);
      rect(b.x - 3, b.y - 3, b.w + 6, b.h + 6, 11);
    }

    noStroke();
    if (isSel) fill(FOX_ORANGE);
    else fill(i === hovered ? INDIGO_HOVER : INDIGO);
    rect(b.x, b.y, b.w, b.h, 8);

    // Amber outline on the clock's live section while the panel previews another one
    if (isLive && !isSel) {
      noFill();
      stroke(AMBER);
      strokeWeight(4);
      rect(b.x + 2, b.y + 2, b.w - 4, b.h - 4, 7);
    }
    strokeWeight(1);

    // Name and time budget: black on orange (white on orange is too low-contrast),
    // white on indigo
    const cx = b.x + b.w / 2;
    const midY = b.y + b.h / 2;
    const half = isWide ? 10 : 9;
    noStroke();
    fill(isSel ? 'black' : 'white');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(blockNameSize);
    text(SEGMENTS[i].label, cx, midY - half);
    textStyle(NORMAL);
    textSize(blockBudgetSize);
    text(budgetText(i, budgetFormat), cx, midY + half);
  }
}

// The time bar: elapsed time in indigo, section boundaries in white, a fox-orange
// playhead at the current clock time, and m:ss tick labels at each boundary
function drawTrack() {
  const t = track;
  const e = elapsedMs() / 1000;
  const r = t.h / 2;
  noStroke();
  fill(TRACK_FILL);
  rect(t.x, t.y, t.w, t.h, r);
  const ex = timeX(e);
  if (ex > t.x) {
    fill(INDIGO);
    const right = ex >= t.x + t.w - r ? r : 0;
    rect(t.x, t.y, ex - t.x, t.h, r, right, right, r);
  }
  stroke('white');
  strokeWeight(2);
  for (let i = 0; i < SEGMENTS.length - 1; i++) {
    const bx = timeX(SEGMENTS[i].cumulativeEnd);
    line(bx, t.y, bx, t.y + t.h);
  }

  // Playhead
  stroke(FOX_ORANGE);
  strokeWeight(3);
  line(ex, t.y - 1, ex, t.y + t.h + 1);
  strokeWeight(1);
  noStroke();
  fill(FOX_ORANGE);
  triangle(ex - 7, t.y - 9, ex + 7, t.y - 9, ex, t.y - 1);

  // Tick labels
  textStyle(NORMAL);
  textSize(isWide ? 14 : 13);
  fill('dimgray');
  textAlign(CENTER, TOP);
  const ticks = [0].concat(SEGMENTS.map(s => s.cumulativeEnd));
  for (const sec of ticks) {
    const lbl = clock(sec);
    const hw = textWidth(lbl) / 2;
    text(lbl, constrain(timeX(sec), t.x + hw, t.x + t.w - hw), t.y + t.h + 4);
  }
}

function countdownColor() {
  if (finished) return CORRECT_GREEN;
  if (hasStarted() && PITCH_MS - elapsedMs() <= 10000) return DARK_ORANGE;
  return 'black';
}

// Wide: a card with the countdown, elapsed time, the live section's own clock,
// and a one-line status
function drawTimerCard() {
  const b = timerBox;
  const e = elapsedMs();
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 10);

  const cx = b.x + b.w / 2;
  const innerW = b.w - 28;
  let y = b.y + 14;
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(14);
  fill('dimgray');
  text('TIME LEFT', cx, y);
  y += 20;

  // Big countdown, sized to the card
  let big = 64;
  textSize(big);
  while (big > 36 && textWidth('0:00') > innerW) textSize(--big);
  fill(countdownColor());
  text(remainingText(), cx, y);
  y += big + 4;

  textStyle(NORMAL);
  textSize(16);
  fill('dimgray');
  text(clock(floor(e / 1000)) + ' elapsed of 2:00', cx, y);
  y += 30;

  stroke('gainsboro');
  line(b.x + 14, y, b.x + b.w - 14, y);
  y += 12;

  // The live section's own clock
  let heading, line1, color1 = 'black', frac = 0, barColor = FOX_ORANGE;
  if (finished) {
    heading = 'PITCH COMPLETE';
    line1 = 'All 4 sections done';
    color1 = CORRECT_GREEN;
    frac = 1;
    barColor = CORRECT_GREEN;
  } else if (hasStarted()) {
    const s = SEGMENTS[liveSeg];
    const left = sectionLeftSec();
    heading = running ? 'NOW SPEAKING' : 'PAUSED IN';
    line1 = s.label + ' · ' + clock(left) + ' left';
    if (running && left <= 5) color1 = DARK_ORANGE;
    frac = 1 - (s.cumulativeEnd * 1000 - e) / (s.seconds * 1000);
  } else {
    heading = 'FIRST UP';
    line1 = 'Problem · 0:30';
  }
  noStroke();
  textStyle(BOLD);
  textSize(14);
  fill('dimgray');
  text(heading, cx, y);
  y += 20;
  let s1 = 18;
  textSize(s1);
  while (s1 > 14 && textWidth(line1) > innerW) textSize(--s1);
  fill(color1);
  text(line1, cx, y);
  y += 26;

  // Section progress bar
  const barX = b.x + 16;
  const barW = b.w - 32;
  fill(TRACK_FILL);
  rect(barX, y, barW, 8, 4);
  if (frac > 0) {
    fill(barColor);
    rect(barX, y, barW * constrain(frac, 0, 1), 8, 4);
  }
  y += 20;

  // Status, wrapped inside the rest of the card
  textStyle(NORMAL);
  textSize(15);
  fill('black');
  textAlign(CENTER, TOP);
  textLeading(19);
  text(statusText(), b.x + 12, y, b.w - 24, b.y + b.h - y - 6);
}

function statusText() {
  if (finished) return 'Time\'s up. Press ' + startIdleLabel() + ' to run it again.';
  if (running) {
    if (liveSeg < SEGMENTS.length - 1) {
      return SEGMENTS[liveSeg + 1].label + ' starts at ' +
        clock(SEGMENTS[liveSeg].cumulativeEnd) + '.';
    }
    return 'Finish your Ask by 2:00.';
  }
  if (hasStarted()) return 'Paused at ' + clock(floor(elapsedMs() / 1000)) + '. Press Resume to continue.';
  return 'Press ' + startIdleLabel() + ', then say your own pitch out loud.';
}

// Narrow: one row with the countdown on the left and two short status lines on the right
function drawTimerStrip() {
  const b = timerBox;
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(b.x, b.y, b.w, b.h, 8);

  const midY = b.y + b.h / 2;
  const cd = remainingText();
  noStroke();
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(30);
  fill(countdownColor());
  text(cd, b.x + 12, midY + 1);
  let x = b.x + 12 + textWidth(cd) + 6;
  textStyle(NORMAL);
  textSize(14);
  fill('dimgray');
  text('left', x, midY + 5);
  x += textWidth('left') + 12;

  let line1, line2, color1 = 'black';
  if (finished) {
    line1 = 'Time\'s up!';
    line2 = 'All 4 sections done';
    color1 = CORRECT_GREEN;
  } else if (hasStarted()) {
    const s = SEGMENTS[liveSeg];
    const left = sectionLeftSec();
    line1 = s.label + ': ' + clock(left) + ' left';
    if (running && left <= 5) color1 = DARK_ORANGE;
    if (!running) line2 = 'Paused at ' + clock(floor(elapsedMs() / 1000));
    else if (liveSeg < SEGMENTS.length - 1) line2 = 'Next section at ' + clock(s.cumulativeEnd);
    else line2 = 'Finish by 2:00';
  } else {
    line1 = 'First up: Problem';
    line2 = 'Press Start to practice';
  }
  const room = b.x + b.w - 12 - x;
  const rx = b.x + b.w - 12;
  textAlign(RIGHT, CENTER);
  textStyle(BOLD);
  fitText(line1, 15, 12, room);
  fill(color1);
  text(line1, rx, midY - 9);
  textStyle(NORMAL);
  fitText(line2, 14, 12, room);
  fill('dimgray');
  if (textWidth(line2) <= room) text(line2, rx, midY + 10);
}

// Set the largest text size from maxS down to minS at which str fits in room
function fitText(str, maxS, minS, room) {
  let s = maxS;
  textSize(s);
  while (s > minS && textWidth(str) > room) textSize(--s);
}

// Detail panel: the selected section's slot, what belongs in it, and Jordan's version
function drawPanel() {
  const p = panelBox;
  fill('white');
  stroke(selected >= 0 ? FOX_ORANGE : 'silver');
  strokeWeight(2);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  const preview = isPreview();
  const key = [selected, liveSeg, running, finished, preview, canvasWidth].join('|');
  if (!panelCache || panelCache.key !== key) panelCache = { key: key, col: buildPanel(preview) };
  const col = panelCache.col;
  renderBlocks(col.blocks, col.x, col.y, col.w);
}

// True when the panel shows a section other than the one the clock is in
function isPreview() {
  return hasStarted() && !finished && selected >= 0 && selected !== liveSeg;
}

// Build the panel's items and fit them to the panel.
// Items marked with drop are removed (highest drop first) if the text will not fit.
function buildPanel(preview) {
  const p = panelBox;
  const inner = { x: p.x + 16, y: p.y + 14, w: p.w - 32, h: p.h - 24 };
  let items;
  if (selected < 0) {
    items = [
      { kind: 'label', text: 'JORDAN\'S TWO-MINUTE PITCH' },
      { kind: 'name', text: 'Four sections, 120 seconds' },
      { kind: 'body', text: 'Problem 30s, Solution 30s, Evidence 40s, Ask 20s.' },
      { kind: 'body', text: 'Click a section, or press Next, to study what belongs in it ' +
        'and read Jordan\'s version.' },
      { kind: 'pace', drop: 1, text: 'Press ' + startIdleLabel() + ' to rehearse at full ' +
        'pace. Each section turns orange when the clock reaches it.' }
    ];
  } else {
    const s = SEGMENTS[selected];
    const range = clock(segStart(selected)) + '–' + clock(s.cumulativeEnd);
    const tag = preview ? ' · PREVIEW' : '';
    items = [];
    if (isWide) {
      items.push({ kind: 'label', text: 'SECTION ' + (selected + 1) + ' OF 4 · ' + range + tag });
      items.push({ kind: 'name', text: s.label + ' (' + s.seconds + ' seconds)' });
    } else {
      // The orange block above already names the section, so it rides on the label line
      items.push({ kind: 'label', text: s.label.toUpperCase() + ' (' + s.seconds + 's) · ' +
        range + tag });
    }
    items.push({ kind: 'prompt', runs: [
      { text: 'What belongs here:', style: 'bold', color: INDIGO },
      { text: s.prompt }
    ] });
    items.push({ kind: 'quote', runs: [
      { text: 'Jordan\'s pitch:', style: 'bold', color: AMBER_TEXT },
      { text: s.content }
    ] });
    if (preview) {
      const live = SEGMENTS[liveSeg];
      items.push({ kind: 'note', drop: 1, text: running ?
        'The clock is still in ' + live.label + '. This panel returns to it at ' +
          clock(live.cumulativeEnd) + '.' :
        'The clock is paused in ' + live.label + '. Resume returns this panel to it.' });
    }
    items.push({ kind: 'pace', drop: 2, text: 'Word budget: about ' + wordBudget(s) +
      ' spoken words at ' + WORDS_PER_MINUTE + ' words per minute.' });
  }
  return fitColumn({ items: items, x: inner.x, y: inner.y, w: inner.w, h: inner.h });
}

// Control area text: a label for the study buttons, when there is room for it
function drawControlText() {
  noStroke();
  textStyle(NORMAL);
  textSize(16);
  fill('dimgray');
  textAlign(RIGHT, CENTER);
  const room = prevButtonX - 12 - (leftControlsEnd + 16);
  for (const msg of ['Study each section:', 'Sections:']) {
    if (textWidth(msg) <= room) {
      text(msg, prevButtonX - 12, drawHeight + 25);
      break;
    }
  }
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:  { size: 14, style: 'bold',   color: 'dimgray',   before: 0 },
  name:   { size: 22, style: 'bold',   color: DARK_ORANGE, before: 2 },
  body:   { size: 16, style: 'normal', color: 'black',     before: 8 },
  prompt: { size: 16, style: 'normal', color: 'black',     before: 10 },
  quote:  { size: 16, style: 'italic', color: 'black',     before: 10 },
  note:   { size: 15, style: 'bold',   color: DARK_ORANGE, before: 10 },
  pace:   { size: 15, style: 'normal', color: 'dimgray',   before: 10 }
};
const BOXED = { prompt: { fill: PROMPT_FILL, bar: INDIGO }, quote: { fill: QUOTE_FILL, bar: AMBER } };
const MIN_SCALE = 0.85;  // never shrink panel text below 85% of its base size

// Fit the column to its box. Droppable items are removed (highest drop first) before
// any text is shrunk; then the largest scale that fits is used.
function fitColumn(col) {
  let items = col.items.slice();
  for (;;) {
    const laid = layoutItems(items, col.w, 1.0);
    if (laid.height <= col.h) return { blocks: laid, x: col.x, y: col.y, w: col.w, scale: 1.0 };
    let worst = -1;
    items.forEach((it, idx) => {
      if (it.drop && (worst < 0 || it.drop > items[worst].drop)) worst = idx;
    });
    if (worst < 0) break;
    items = items.filter((_, idx) => idx !== worst);
  }
  for (let s = 0.95; s >= MIN_SCALE - 0.001; s -= 0.05) {
    const laid = layoutItems(items, col.w, s);
    if (laid.height <= col.h) return { blocks: laid, x: col.x, y: col.y, w: col.w, scale: s };
  }
  return { blocks: layoutItems(items, col.w, MIN_SCALE), x: col.x, y: col.y, w: col.w, scale: MIN_SCALE };
}

// Lay out each item as wrapped lines of styled words at scale s
function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    const box = BOXED[it.kind];
    const indent = box ? 14 : 0;
    const pad = box ? 5 : 0;
    const runs = it.runs || [{ text: it.text }];
    const tokens = [];
    for (const r of runs) {
      for (const w of r.text.split(' ')) {
        if (w) tokens.push({ w: w, style: r.style || st.style, color: r.color || st.color });
      }
    }
    textSize(size);
    const lines = wrapTokens(tokens, maxW - indent - (box ? 8 : 0));
    textStyle(NORMAL);
    const spaceW = textWidth(' ');
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    blocks.push({ kind: it.kind, lines, size, lead, before, indent, pad, spaceW, box });
    height += before + lines.length * lead + 2 * pad;
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
      const h = b.lines.length * b.lead + 2 * b.pad;
      noStroke();
      fill(b.box.fill);
      rect(x, y, w, h, 6);
      fill(b.box.bar);
      rect(x, y, 5, h, 3);
    }
    textSize(b.size);
    y += b.pad;
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
    y += b.pad;
  }
  textStyle(NORMAL);
}

// ---------- Interaction ----------

// Start, Pause, or Resume. Starting after 2:00 runs the pitch again from 0:00.
function toggleTimer() {
  if (running) {
    accumulatedMs += millis() - runStartMs;
    running = false;
  } else {
    if (finished) {
      accumulatedMs = 0;
      finished = false;
      liveSeg = -1;
    }
    runStartMs = millis();
    running = true;
    // The panel jumps to (or returns to) the section the clock is in
    const live = segmentAt(accumulatedMs);
    if (live !== liveSeg) flashStart = millis();
    liveSeg = live;
    selected = live;
  }
  panelCache = null;
  updateButtons();
}

// Back to the starting state: 0:00, not running, no section selected
function resetTimer() {
  running = false;
  finished = false;
  accumulatedMs = 0;
  liveSeg = -1;
  selected = -1;
  panelCache = null;
  updateButtons();
}

// Show a section in the panel without touching the clock
function selectSection(i) {
  selected = i;
  panelCache = null;
  updateButtons();
}

function nextSection() {
  if (selected < SEGMENTS.length - 1) selectSection(selected + 1);
}

function previousSection() {
  if (selected > 0) selectSection(selected - 1);
}

// Index of the block under (mx, my), or -1
function blockAt(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return -1;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
  }
  return -1;
}

function mousePressed() {
  const i = blockAt(mouseX, mouseY);
  if (i >= 0) selectSection(i);
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    nextSection();
    return false;  // keep the arrow key from scrolling the page
  }
  if (keyCode === LEFT_ARROW) {
    previousSection();
    return false;
  }
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
