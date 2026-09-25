// Customer Definition Funnel - p5.js MicroSim
// CANVAS_HEIGHT: 540
// A five-band funnel showing how Priya's meal-prep idea narrows from a broad market
// ("Families who eat dinner") through a market segment, a niche market, and a target
// customer down to an ideal customer profile / persona ("Dana, 34, ER nurse...").
// Click any band, or step through the bands in order with Narrow Next / Widen Back
// (or the arrow keys). The selected band turns fox-orange and the detail panel shows
// the stage's definition, what narrowed the group at this step, and Priya's example.
// Nothing animates: each stage is a fixed step to read before moving on.
// Wide screens (>= 640px): the funnel sits on the left, the detail panel on the right,
// joined by a fox-orange connector line.
// Narrow screens (< 640px): the funnel reflows into a shallow vertical stack of
// labeled stages, with the detail panel below it.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 490;
let controlHeight = 50;   // one row: Widen Back, Narrow Next, explored counter
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 640;   // below this width the panel moves under the funnel

// Book palette
const INDIGO = '#3F51B5';        // every unselected band
const INDIGO_HOVER = '#5C6BC0';  // band under the mouse
const FOX_ORANGE = '#E8791A';    // selected band, connector and panel outline
const DARK_ORANGE = '#B25A10';   // stage name heading (readable on white)
const AMBER = '#FFB300';         // bar beside Priya's example
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // "all 5 explored" message
const QUOTE_FILL = '#FFF8E1';    // pale amber behind Priya's example
const FILTER_FILL = 'lavender';  // pale indigo behind "Narrowed by"

// The five stages, widest first. example is Priya's worked example from Chapter 4;
// narrowedBy names the filter that took the group from the stage above to this one.
const STAGES = [
  { label: 'Broad Market',
    definition: 'Everyone who could conceivably use a solution like yours, described in the widest possible terms.',
    narrowedBy: 'nothing yet. This is the starting point.',
    example: 'Families who eat dinner.' },
  { label: 'Market Segment',
    definition: 'A subgroup that shares traits such as income, household type, or need, so its members respond to a similar offer in a similar way.',
    narrowedBy: 'income and household structure: two earners, children under 10.',
    example: 'Dual-income households with children under 10.' },
  { label: 'Niche Market',
    definition: 'A segment small and specific enough that one small venture could become the obvious choice for everyone in it.',
    narrowedBy: 'a shared daily pain: unpredictable evening schedules.',
    example: 'Dual-income households with children under 10 and unpredictable evening schedules.' },
  { label: 'Target Customer',
    definition: 'The group a venture deliberately chooses to serve first, described precisely enough to guide every other decision.',
    narrowedBy: 'rotating shift work, plus the area Priya can actually deliver to.',
    example: 'Dual-income parents of children under 10, on rotating or unpredictable shift schedules, within Priya\'s metro delivery area.' },
  { label: 'Ideal Customer Profile / Persona',
    twoLines: ['Ideal Customer', 'Profile / Persona'],  // used when one line will not fit
    short: 'ICP / Persona',                              // last resort on very narrow screens
    definition: 'The traits of a best-fit customer, turned into one named, research-grounded person the founder can design for.',
    narrowedBy: 'one named person, so Priya can ask "Would Dana want this?"',
    example: 'Dana, 34, ER nurse working rotating 12-hour shifts, two kids under 8, values 10 minutes saved more than variety.' }
];

// State
let selected = 0;           // Broad Market is selected on load
let visited = [true];       // visited[i] is true once stage i has been explored
let hovered = -1;           // band under the mouse, -1 = none

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let bands = [];             // per band: {cx, y, h, topW, botW, lines, labelSize}
let panelBox = {};
let panelCache = null;      // laid-out detail panel text, rebuilt when state changes
let controlsRight = 0;      // x just past the last button

let backButton, nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  backButton = createButton('▲ Widen Back');
  backButton.mousePressed(widenBack);
  nextButton = createButton('Narrow Next ▼');
  nextButton.mousePressed(narrowNext);
  // Larger button text so the controls are readable from the back of the room
  for (const b of [backButton, nextButton]) {
    b.style('font-size', '16px');
  }

  computeLayout();
  updateButtons();

  describe('A funnel of five stacked bands that narrows from top to bottom: Broad Market, ' +
    'Market Segment, Niche Market, Target Customer, and Ideal Customer Profile / Persona. ' +
    'Click a band or use Narrow Next and Widen Back to select a stage. The selected band ' +
    'turns orange and a panel shows the stage definition, what narrowed the group at that ' +
    'step, and Priya\'s meal-prep example, from "Families who eat dinner" down to Dana, ' +
    'a 34-year-old ER nurse on rotating 12-hour shifts.');
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
  hovered = bandAt(mouseX, mouseY);
  drawConnector();
  drawBands();
  drawPanel();
  drawControlText();
  cursor(hovered >= 0 ? HAND : ARROW);
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  if (isWide) {
    layoutWide();
  } else {
    layoutNarrow();
  }
  panelCache = null;
  positionControls();
}

// Build the five bands between top and bottom. The funnel's width shrinks linearly
// with height (gaps included), so the slanted sides of the bands line up.
function buildBands(cx, fullW, top, bandH, gap, taper) {
  const n = STAGES.length;
  const total = n * bandH + (n - 1) * gap;
  const widthAt = y => fullW * (1 - taper * (y - top) / total);
  bands = [];
  for (let i = 0; i < n; i++) {
    const y = top + i * (bandH + gap);
    bands.push({ cx: cx, y: y, h: bandH, topW: widthAt(y), botW: widthAt(y + bandH) });
  }
  return top + total;
}

// Wide: the funnel on the left, the detail panel on the right
function layoutWide() {
  const top = 48;
  const bottom = drawHeight - 14;
  const gap = 6;
  const funnelRight = Math.round(Math.min(canvasWidth * 0.48, 560));
  const fullW = funnelRight - margin;
  const bandH = (bottom - top - gap * (STAGES.length - 1)) / STAGES.length;
  buildBands(margin + fullW / 2, fullW, top, bandH, gap, 0.58);
  fitBandLabels(19, 13, true);
  const px = funnelRight + 26;  // room for the connector line
  panelBox = { x: px, y: top, w: canvasWidth - margin - px, h: bottom - top };
}

// Narrow: a shallow stack of labeled stages, detail panel below
function layoutNarrow() {
  const top = 36;
  const end = buildBands(canvasWidth / 2, canvasWidth - 20, top, 26, 3, 0.30);
  fitBandLabels(16, 12, false);
  const py = end + 8;
  panelBox = { x: 10, y: py, w: canvasWidth - 20, h: drawHeight - 8 - py };
}

// Width of band b at height y (the sides slant, so it shrinks toward the bottom)
function bandWidthAt(b, y) {
  return b.topW + (b.botW - b.topW) * (y - b.y) / b.h;
}

// Fit each band's label inside the band, checking each line against the band's width
// at the line's lower edge. Order of preference: one line at a comfortable size, the
// two-line version (wide only), one line at a smaller size, then the short label.
function fitBandLabels(maxSize, minSize, allowTwoLines) {
  const pad = 10;
  const comfortable = maxSize - 3;
  textStyle(BOLD);
  // True when lines at size s, centered vertically in band b, all fit
  const fits = (b, lines, s) => {
    const lead = s * 1.2;
    if (lines.length * lead > b.h - 6) return false;
    let ty = b.y + b.h / 2 - (lines.length - 1) * lead / 2;
    textSize(s);
    for (const ln of lines) {
      if (textWidth(ln) > bandWidthAt(b, ty + s / 2) - 2 * pad) return false;
      ty += lead;
    }
    return true;
  };
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const st = STAGES[i];
    const tries = [];
    for (let s = maxSize; s >= comfortable; s--) tries.push([[st.label], s]);
    if (allowTwoLines && st.twoLines) {
      for (let s = maxSize - 1; s >= minSize; s--) tries.push([st.twoLines, s]);
    }
    for (let s = comfortable - 1; s >= minSize; s--) tries.push([[st.label], s]);
    b.lines = null;
    for (const [lines, s] of tries) {
      if (fits(b, lines, s)) {
        b.lines = lines;
        b.labelSize = s;
        break;
      }
    }
    if (!b.lines) {
      // Last resort: the short label, shrunk until it fits
      const label = [st.short || st.label];
      let s = maxSize;
      while (s > 10 && !fits(b, label, s)) s--;
      b.lines = label;
      b.labelSize = s;
    }
  }
  textStyle(NORMAL);
}

function positionControls() {
  const pad = canvasWidth < 420 ? '4px 8px' : '4px 12px';
  for (const b of [backButton, nextButton]) b.style('padding', pad);
  const y = drawHeight + 10;
  let x = 10;
  backButton.position(x, y);
  x += backButton.elt.offsetWidth + 8;
  nextButton.position(x, y);
  controlsRight = x + nextButton.elt.offsetWidth;
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('Customer Definition Funnel', canvasWidth / 2, isWide ? 10 : 8);
}

function drawBands() {
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    const isSel = i === selected;
    noStroke();
    if (isSel) fill(FOX_ORANGE);
    else fill(i === hovered ? INDIGO_HOVER : INDIGO);
    quad(b.cx - b.topW / 2, b.y, b.cx + b.topW / 2, b.y,
      b.cx + b.botW / 2, b.y + b.h, b.cx - b.botW / 2, b.y + b.h);

    // Label: black on the orange band (white on orange is too low-contrast),
    // white on the indigo bands
    noStroke();
    fill(isSel ? 'black' : 'white');
    textStyle(BOLD);
    textSize(b.labelSize);
    textAlign(CENTER, CENTER);
    const lead = b.labelSize * 1.2;
    let ty = b.y + b.h / 2 - (b.lines.length - 1) * lead / 2;
    for (const ln of b.lines) {
      text(ln, b.cx, ty);
      ty += lead;
    }
  }
  textStyle(NORMAL);
}

// Wide only: a fox-orange line from the selected band's right edge to the panel
function drawConnector() {
  if (!isWide) return;
  const b = bands[selected];
  const midY = b.y + b.h / 2;
  const edgeX = b.cx + (b.topW + b.botW) / 4;
  stroke(FOX_ORANGE);
  strokeWeight(2);
  line(edgeX + 4, midY, panelBox.x, midY);
  noStroke();
  fill(FOX_ORANGE);
  circle(edgeX + 6, midY, 9);
  strokeWeight(1);
}

// Detail panel: stage number, name, definition, what narrowed it, and Priya's example
function drawPanel() {
  const p = panelBox;
  fill('white');
  stroke(FOX_ORANGE);
  strokeWeight(2);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  const key = selected + '|' + canvasWidth;
  if (!panelCache || panelCache.key !== key) panelCache = { key: key, col: buildPanel() };
  renderBlocks(panelCache.col.blocks, panelCache.col.x, panelCache.col.y, panelCache.col.w);
}

// Build the panel's items and fit them to the panel.
// Items marked with drop are removed (highest drop first) if the text will not fit.
function buildPanel() {
  const p = panelBox;
  const inner = { x: p.x + 16, y: p.y + 14, w: p.w - 32, h: p.h - 24 };
  const st = STAGES[selected];
  const stageNum = 'STAGE ' + (selected + 1) + ' OF ' + STAGES.length;
  const filter = { kind: 'filter', runs: [
    { text: 'Narrowed by:', style: 'bold', color: INDIGO },
    { text: st.narrowedBy }
  ] };
  const example = { kind: 'quote', runs: [
    { text: 'Priya\'s example:', style: 'bold', color: AMBER_TEXT },
    { text: st.example }
  ] };

  // One band wider: the previous stage's example, so the cut can be seen side by side.
  // Shown only when there is room; it is dropped before any text is shrunk.
  const compare = selected > 0 ?
    { kind: 'compare', drop: 1, runs: [
      { text: 'One band wider (' + STAGES[selected - 1].label + '):', style: 'bold' },
      { text: STAGES[selected - 1].example }
    ] } :
    { kind: 'compare', drop: 1, text: 'Every band below is a smaller slice of this one. ' +
      'Press Narrow Next to make the first cut.' };

  let items;
  if (isWide) {
    items = [
      { kind: 'label', text: stageNum },
      { kind: 'name', text: st.label },
      { kind: 'body', text: st.definition },
      filter,
      example,
      compare
    ];
  } else {
    // The band above is already highlighted, so the name rides on the stage line
    items = [
      { kind: 'label', text: stageNum + '  ·  ' + st.label.toUpperCase() },
      { kind: 'body', text: st.definition },
      filter,
      example,
      compare
    ];
  }
  return fitColumn({ items: items, x: inner.x, y: inner.y, w: inner.w, h: inner.h });
}

function drawControlText() {
  let n = 0;
  for (let i = 0; i < STAGES.length; i++) if (visited[i]) n++;
  noStroke();
  textStyle(NORMAL);
  textSize(16);
  textAlign(RIGHT, CENTER);
  fill(n === STAGES.length ? CORRECT_GREEN : 'dimgray');
  let msg = n === STAGES.length ? 'All 5 stages explored' : 'Explored: ' + n + ' of 5';
  const room = canvasWidth - controlsRight - 22;
  if (textWidth(msg) > room) msg = n + ' / 5';
  if (textWidth(msg) <= room) text(msg, canvasWidth - 12, drawHeight + 25);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:  { size: 14, style: 'bold',   color: 'dimgray',   before: 0 },
  name:   { size: 22, style: 'bold',   color: DARK_ORANGE, before: 2 },
  body:   { size: 16, style: 'normal', color: 'black',     before: 6 },
  filter: { size: 16, style: 'normal', color: 'black',     before: 12 },
  quote:  { size: 16, style: 'italic', color: 'black',     before: 10 },
  compare: { size: 15, style: 'normal', color: 'dimgray',  before: 12 }
};
const BOXED = { filter: { fill: FILTER_FILL, bar: INDIGO }, quote: { fill: QUOTE_FILL, bar: AMBER } };
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
    const lines = wrapTokens(tokens, maxW - indent - 8 * (box ? 1 : 0));
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

// Index of the band under (mx, my), or -1. Tests the slanted sides, not just the box.
function bandAt(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return -1;
  for (let i = 0; i < bands.length; i++) {
    const b = bands[i];
    if (my < b.y || my > b.y + b.h) continue;
    if (abs(mx - b.cx) <= bandWidthAt(b, my) / 2) return i;
  }
  return -1;
}

function mousePressed() {
  const i = bandAt(mouseX, mouseY);
  if (i >= 0) selectStage(i);
}

function keyPressed() {
  if (keyCode === DOWN_ARROW || keyCode === RIGHT_ARROW) {
    narrowNext();
    return false;  // keep the arrow key from scrolling the page
  }
  if (keyCode === UP_ARROW || keyCode === LEFT_ARROW) {
    widenBack();
    return false;
  }
}

function selectStage(i) {
  selected = i;
  visited[i] = true;
  panelCache = null;
  updateButtons();
}

function narrowNext() {
  if (selected < STAGES.length - 1) selectStage(selected + 1);
}

function widenBack() {
  if (selected > 0) selectStage(selected - 1);
}

// Widen Back is off at the top of the funnel; Narrow Next is off at the bottom
function updateButtons() {
  if (selected <= 0) backButton.attribute('disabled', '');
  else backButton.removeAttribute('disabled');
  if (selected >= STAGES.length - 1) nextButton.attribute('disabled', '');
  else nextButton.removeAttribute('disabled');
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
