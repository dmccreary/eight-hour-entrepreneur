// Competitive Landscape Map - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Learners differentiate the five kinds of alternative to Jordan's mobile dog-grooming
// offer by how directly each one solves the same problem. The five nodes sit along a
// spectrum from "Costs nothing to keep choosing" (the do-nothing alternative) to
// "Looks just like your offer" (a direct competitor). Each step along the spectrum adds
// one thing, labeled between the nodes: a fix, a dedicated offer, the same problem, and
// the same approach.
// Click a node (or its label) to select it: the node turns fox orange and the detail
// panel shows its definition, Jordan's example, why it sits where it does on the
// spectrum, and where it falls short for Jordan's customer. No node is selected on load.
// The buttons below the drawing area step the selection one node less or more direct
// (also the arrow keys) and Clear returns to the opening prompt. The status line counts
// how many of the five alternatives have been explored.
// Wide screens (>= 600px): a horizontal spectrum with labels above the nodes and the
// detail panel below.
// Narrow screens (< 600px): the spectrum turns vertical, top to bottom, with each label
// to the right of its node and the detail panel below.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 454;
let controlHeight = 44;   // one row: Less direct, More direct, Clear, and the explored count
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 600;   // below this width the spectrum runs top to bottom

// Book palette
const INDIGO = '#3F51B5';        // unselected nodes, arrowhead, "Why it sits here" label
const FOX_ORANGE = '#E8791A';    // selected node and the detail panel border
const DARK_ORANGE = '#B25A10';   // selected label and panel header (readable on white)
const AMBER = '#FFB300';         // bar beside "Where it falls short"
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // status line once all five have been explored
const SELECTED_FILL = '#FFF3E0'; // pale orange behind the selected node and label

// The five alternatives, least direct first. The x-positions along the spectrum are
// fixed: node i sits in slot i of five evenly spaced slots.
// step is what moving one node more direct adds (shown between node i-1 and node i);
// stepShort is used when the full step will not fit between two nodes.
const NODES = [
  { label: 'Do-Nothing Alternative',
    definition: 'Tolerating the problem unsolved.',
    example: 'the dog just doesn\'t get groomed this month.',
    why: 'Nothing gets fixed, so it costs nothing to keep choosing.',
    fallsShort: 'A slightly smelly, ungroomed dog between visits.' },
  { label: 'Current Workaround',
    definition: 'An informal, imperfect fix.',
    example: 'dry shampoo and at-home brushing.',
    why: 'A fix, but one the owner pieces together, not a dedicated solution.',
    fallsShort: 'It masks the smell for a while; the dog still needs a groom.',
    step: '+ a fix', stepShort: '+ a fix' },
  { label: 'Substitute Solution',
    definition: 'Solves the underlying need differently.',
    example: 'a self-service dog wash station at the pet store.',
    why: 'A dedicated service for the underlying need, but it doesn\'t groom.',
    fallsShort: 'The owner still drives there and does all the washing.',
    step: '+ a dedicated offer', stepShort: '+ dedicated' },
  { label: 'Indirect Competitor',
    definition: 'Solves the same problem, different approach.',
    example: 'a traditional storefront groomer requiring drop-off.',
    why: 'It grooms the dog, but by storefront drop-off instead of at home.',
    fallsShort: 'Weeks-long waits and a half-day lost to drop-off and pickup.',
    step: '+ the same problem', stepShort: '+ same problem' },
  { label: 'Direct Competitor',
    definition: 'Same problem, same approach.',
    example: 'another mobile dog-grooming service in the area.',
    why: 'Same problem, same at-home approach: just like Jordan\'s offer.',
    fallsShort: 'Nothing obvious, so Jordan must find a real point of difference.',
    step: '+ the same approach', stepShort: '+ same approach' }
];

const AXIS_QUESTION = 'How directly does this solve the same problem?';
const LESS_END = 'Costs nothing to keep choosing';
const MORE_END = 'Looks just like your offer';
const PROMPT = 'Click a node to explore Jordan\'s competitive landscape';

// Selection state
let selected = -1;          // index into NODES, -1 = nothing selected
let hovered = -1;           // node under the mouse, -1 = none
let visited = new Set();    // nodes explored since load

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let nodePos = [];           // per node: {x, y, r, lines, pill, hit}
let labelSize = 16, labelLead = 19;
let stepPos = [];           // per step (between node i-1 and i): {x, y, align}
let stepKey = 'step', stepSize = 14;   // which step text to use and its size; null = hide
let endLabels = [];         // {text, x, y, align}
let endSize = 15;
let lineStart = {}, lineEnd = {};
let panelBox = {};
let statusX = 0;

let lessButton, moreButton, clearButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  lessButton = createButton('← Less direct');
  lessButton.mousePressed(() => stepSelection(-1));
  moreButton = createButton('More direct →');
  moreButton.mousePressed(() => stepSelection(1));
  clearButton = createButton('Clear');
  clearButton.mousePressed(clearSelection);

  computeLayout();
  updateButtons();

  describe('A horizontal spectrum titled "How directly does this solve the same problem?" ' +
    'runs from "Costs nothing to keep choosing" to "Looks just like your offer." Five nodes sit ' +
    'on it: Do-Nothing Alternative, Current Workaround, Substitute Solution, Indirect Competitor, ' +
    'and Direct Competitor. Clicking a node shows its definition, an example from Jordan\'s mobile ' +
    'dog-grooming idea, why it sits there, and where it falls short. Buttons step the selection ' +
    'one node less or more direct.');
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

  hovered = nodeAt(mouseX, mouseY);
  drawTitle();
  drawPills();
  drawSpectrum();
  drawSteps();
  drawEndLabels();
  drawNodes();
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
  positionControls();
}

// Wide: five evenly spaced slots across the canvas, labels above, panel below
function layoutWide() {
  const n = NODES.length;
  const spacing = (canvasWidth - 2 * margin) / n;
  const nodeY = 136;
  const r = 18;

  // One label size for all five: the largest at which every label fits in two lines
  const maxW = spacing - 12;
  for (labelSize = 16; labelSize > 12; labelSize--) {
    if (NODES.every(nd => fitsLines(nd.label, maxW, labelSize, BOLD, 2))) break;
  }
  labelLead = labelSize * 1.2;
  const labelBottom = nodeY - r - 8;
  const pillTop = labelBottom - 2 * labelLead - 6;
  const pillBottom = nodeY + 22;
  textStyle(BOLD);
  textSize(labelSize);
  nodePos = NODES.map((nd, i) => {
    const x = margin + spacing * (i + 0.5);
    const lines = wrapText(nd.label, maxW);
    const pill = { x: x - spacing / 2 + 4, y: pillTop, w: spacing - 8, h: pillBottom - pillTop };
    return { x: x, y: nodeY, r: r, lines: lines, labelTop: labelBottom - lines.length * labelLead,
      pill: pill, hit: { x: x - spacing / 2 + 2, y: pillTop, w: spacing - 4, h: pillBottom - pillTop } };
  });
  textStyle(NORMAL);
  lineStart = { x: nodePos[0].x - spacing * 0.42, y: nodeY };
  lineEnd = { x: nodePos[n - 1].x + spacing * 0.42, y: nodeY };

  // Step labels centered between neighbors, just under the line
  chooseStepStyle(spacing - 10, [14, 13, 12]);
  stepPos = [];
  for (let i = 1; i < n; i++) {
    stepPos[i] = { x: (nodePos[i - 1].x + nodePos[i].x) / 2, y: nodeY + 31, align: CENTER };
  }

  // End labels under the two ends of the line
  const endY = nodeY + 57;
  const left = '← ' + LESS_END;
  const right = MORE_END + ' →';
  textStyle(BOLD);
  for (endSize = 15; endSize > 11; endSize--) {
    textSize(endSize);
    if (textWidth(left) + textWidth(right) + 24 <= lineEnd.x - lineStart.x) break;
  }
  textStyle(NORMAL);
  endLabels = [
    { text: left, x: max(margin, lineStart.x), y: endY, align: LEFT },
    { text: right, x: min(canvasWidth - margin, lineEnd.x), y: endY, align: RIGHT }
  ];

  const py = nodeY + 76;
  panelBox = { x: margin, y: py, w: canvasWidth - 2 * margin, h: drawHeight - 10 - py };
}

// Narrow: the spectrum runs top to bottom down the left edge, one row per node
function layoutNarrow() {
  const n = NODES.length;
  const lineX = 24, r = 11, top = 84, gap = 30;
  const labelX = lineX + r + 12;

  // Step labels sit right-aligned between two rows, so they must clear the longest node
  // label. Use the largest label size (16 down to 13) that leaves room for them; if none
  // does, keep the largest label size that fits and hide the step labels.
  let fitSize = 12;
  let withSteps = false;
  textStyle(BOLD);
  for (labelSize = 16; labelSize >= 13; labelSize--) {
    textSize(labelSize);
    const longest = max(NODES.map(nd => textWidth(nd.label)));
    if (longest > canvasWidth - labelX - 10) continue;
    if (fitSize === 12) fitSize = labelSize;
    chooseStepStyle(canvasWidth - 12 - (labelX + longest + 14), [13, 12]);
    textStyle(BOLD);
    if (stepKey) {
      withSteps = true;
      break;
    }
  }
  if (!withSteps) {
    labelSize = fitSize;
    stepKey = null;
  }
  textStyle(BOLD);
  textSize(labelSize);
  labelLead = labelSize * 1.2;
  nodePos = NODES.map((nd, i) => {
    const y = top + i * gap;
    const lw = textWidth(nd.label);
    const pill = { x: lineX - 15, y: y - 13, w: labelX + lw + 10 - (lineX - 15), h: 26 };
    return { x: lineX, y: y, r: r, lines: [nd.label], labelX: labelX, pill: pill,
      hit: { x: 4, y: y - gap / 2, w: canvasWidth - 8, h: gap } };
  });
  textStyle(NORMAL);
  lineStart = { x: lineX, y: top - 16 };
  lineEnd = { x: lineX, y: top + (n - 1) * gap + 16 };

  // Step labels right-aligned in the gap between two rows
  stepPos = [];
  for (let i = 1; i < n; i++) {
    stepPos[i] = { x: canvasWidth - 12, y: top + (i - 0.5) * gap, align: RIGHT };
  }

  // End labels above the top of the line and below its arrowhead
  const up = '↑ ' + LESS_END;
  const down = '↓ ' + MORE_END;
  textStyle(BOLD);
  for (endSize = 14; endSize > 11; endSize--) {
    textSize(endSize);
    if (textWidth(up) <= canvasWidth - 20) break;
  }
  textStyle(NORMAL);
  endLabels = [
    { text: up, x: 10, y: top - 26, align: LEFT },
    { text: down, x: 10, y: lineEnd.y + 23, align: LEFT }
  ];

  const py = lineEnd.y + 38;
  panelBox = { x: 10, y: py, w: canvasWidth - 20, h: drawHeight - 8 - py };
}

// Pick the full or short step text, and the largest size, at which all four steps fit
function chooseStepStyle(maxW, sizes) {
  textStyle(ITALIC);
  for (const key of ['step', 'stepShort']) {
    for (const s of sizes) {
      textSize(s);
      if (NODES.slice(1).every(nd => textWidth(nd[key]) <= maxW)) {
        stepKey = key;
        stepSize = s;
        textStyle(NORMAL);
        return;
      }
    }
  }
  stepKey = null;   // no room: hide the step labels
  textStyle(NORMAL);
}

function positionControls() {
  const small = canvasWidth < 420;
  for (const b of [lessButton, moreButton, clearButton]) {
    b.style('font-size', small ? '14px' : '16px');
    b.style('padding', small ? '4px 8px' : '4px 14px');
  }
  const h = lessButton.elt.offsetHeight;
  const y = drawHeight + (controlHeight - h) / 2;
  let x = 10;
  lessButton.position(x, y);
  x += lessButton.elt.offsetWidth + 8;
  moreButton.position(x, y);
  x += moreButton.elt.offsetWidth + 8;
  clearButton.position(x, y);
  statusX = x + clearButton.elt.offsetWidth + 14;
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  const title = 'Competitive Landscape Map';
  let s = isWide ? 24 : 20;
  textSize(s);
  while (s > 14 && textWidth(title) > canvasWidth - 20) textSize(--s);
  text(title, canvasWidth / 2, isWide ? 10 : 6);

  // The spectrum's own label: the question every node answers
  textStyle(BOLD);
  s = isWide ? 17 : 15;
  textSize(s);
  while (s > 11 && textWidth(AXIS_QUESTION) > canvasWidth - 20) textSize(--s);
  fill(INDIGO);
  text(AXIS_QUESTION, canvasWidth / 2, isWide ? 45 : 31);
  textStyle(NORMAL);
}

// Pale pill behind the selected node (orange) and the hovered node (lavender)
function drawPills() {
  for (let i = 0; i < nodePos.length; i++) {
    if (i !== selected && i !== hovered) continue;
    const p = nodePos[i].pill;
    if (i === selected) {
      fill(SELECTED_FILL);
      stroke(FOX_ORANGE);
    } else {
      fill('lavender');
      stroke('lightsteelblue');
    }
    strokeWeight(1);
    rect(p.x, p.y, p.w, p.h, isWide ? 10 : 15);
  }
}

// The spectrum line: light at the less-direct end, indigo at the more-direct end,
// with an arrowhead pointing toward "Looks just like your offer"
function drawSpectrum() {
  // Drawn straight on the 2D context as a filled bar; save/restore leaves p5's own
  // fill and stroke settings untouched
  const ctx = drawingContext;
  const grad = ctx.createLinearGradient(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
  grad.addColorStop(0, 'lightsteelblue');
  grad.addColorStop(1, INDIGO);
  ctx.save();
  ctx.fillStyle = grad;
  if (isWide) ctx.fillRect(lineStart.x, lineStart.y - 2.5, lineEnd.x - lineStart.x, 5);
  else ctx.fillRect(lineStart.x - 2.5, lineStart.y, 5, lineEnd.y - lineStart.y);
  ctx.restore();
  noStroke();
  fill(INDIGO);
  const e = lineEnd;
  if (isWide) triangle(e.x, e.y - 8, e.x, e.y + 8, e.x + 13, e.y);
  else triangle(e.x - 8, e.y, e.x + 8, e.y, e.x, e.y + 13);
}

// What each step toward "more direct" adds, between the two nodes it separates
function drawSteps() {
  if (!stepKey) return;
  noStroke();
  textStyle(ITALIC);
  textSize(stepSize);
  fill('dimgray');
  for (let i = 1; i < NODES.length; i++) {
    const p = stepPos[i];
    textAlign(p.align, CENTER);
    text(NODES[i][stepKey], p.x, p.y);
  }
  textStyle(NORMAL);
}

function drawEndLabels() {
  noStroke();
  textStyle(BOLD);
  textSize(endSize);
  fill('dimgray');
  for (const e of endLabels) {
    textAlign(e.align, CENTER);
    text(e.text, e.x, e.y);
  }
  textStyle(NORMAL);
}

function drawNodes() {
  for (let i = 0; i < NODES.length; i++) {
    const p = nodePos[i];
    const isSel = i === selected;
    const r = isSel ? p.r + 3 : p.r;

    // Circle with its number
    stroke('white');
    strokeWeight(3);
    fill(isSel ? FOX_ORANGE : INDIGO);
    circle(p.x, p.y, 2 * r);
    noStroke();
    fill('white');
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    textSize(isWide ? 16 : 13);
    text(i + 1, p.x, p.y + 1);

    // Label: above the node when wide, to its right when narrow
    textSize(labelSize);
    fill(isSel ? DARK_ORANGE : 'black');
    if (isWide) {
      textAlign(CENTER, TOP);
      let y = p.labelTop;
      for (const ln of p.lines) {
        text(ln, p.x, y);
        y += labelLead;
      }
    } else {
      textAlign(LEFT, CENTER);
      text(p.lines[0], p.labelX, p.y + 1);
    }
  }
  textStyle(NORMAL);
  strokeWeight(1);
}

// The selected node's definition, Jordan's example, why it sits where it does, and
// where it falls short; the opening prompt when nothing is selected
function drawPanel() {
  const p = panelBox;
  const has = selected >= 0;
  fill('white');
  stroke(has ? FOX_ORANGE : 'silver');
  strokeWeight(has ? 2 : 1);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);
  const fit = fitPanel();
  renderBlocks(fit.blocks, fit.x, fit.y, fit.w);
}

// Lay out the panel text for the current selection inside the panel's padding
function fitPanel() {
  const p = panelBox;
  const inner = { x: p.x + 14, y: p.y + 10, w: p.w - 28, h: p.h - 18 };
  const blocks = fitColumn(panelItems(), inner.w, inner.h, isWide ? 1.0 : 0.94);
  return { blocks: blocks, x: inner.x, y: inner.y, w: inner.w, h: inner.h };
}

function panelItems() {
  if (selected >= 0) {
    const nd = NODES[selected];
    return [
      { kind: 'label', text: (selected + 1) + ' OF 5 · ' + nd.label.toUpperCase(), drop: 1 },
      { kind: 'heading', text: nd.definition },
      { kind: 'body', prefix: 'Jordan\'s example: ', prefixColor: DARK_ORANGE,
        text: nd.example },
      { kind: 'body', prefix: 'Why it sits here: ', prefixColor: INDIGO, text: nd.why },
      { kind: 'body', prefix: 'Where it falls short: ', prefixColor: AMBER_TEXT,
        text: nd.fallsShort, bar: AMBER }
    ];
  }
  let how = 'The five alternatives run from simply doing nothing to an offer that looks just ' +
    'like Jordan\'s mobile grooming. Each step ' + (isWide ? 'to the right' : 'down the line') +
    ' adds one thing';
  if (stepKey) how += ', labeled ' + (isWide ? 'under the line' : 'on the right');
  return [
    { kind: 'prompt', text: PROMPT },
    { kind: 'body', text: how + '.' },
    { kind: 'hint', text: 'Compare neighbors: what single difference separates them?', drop: 1 }
  ];
}

// Explored count to the right of the buttons, shortened or dropped to fit
function drawControlText() {
  noStroke();
  textAlign(LEFT, CENTER);
  const small = canvasWidth < 420;
  textSize(small ? 14 : 16);
  const room = canvasWidth - statusX - 10;
  const y = drawHeight + controlHeight / 2;
  let options;
  if (visited.size === NODES.length) {
    textStyle(BOLD);
    fill(CORRECT_GREEN);
    options = ['All 5 explored', '5 of 5'];
  } else {
    textStyle(NORMAL);
    fill('dimgray');
    options = ['Explored ' + visited.size + ' of 5', visited.size + ' of 5'];
  }
  const msg = options.find(m => textWidth(m) <= room);
  if (msg) text(msg, statusX, y);
  textStyle(NORMAL);
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of panel item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:   { size: 14, style: 'bold',   color: DARK_ORANGE, before: 0 },
  heading: { size: 20, style: 'bold',   color: 'black',     before: 4 },
  prompt:  { size: 20, style: 'bold',   color: INDIGO,      before: 0 },
  body:    { size: 17, style: 'normal', color: 'black',     before: 8 },
  hint:    { size: 16, style: 'italic', color: 'dimgray',   before: 10 }
};
const MIN_SCALE = 0.78;  // never shrink panel text below 78% of its base size

// Fit the items to the box, starting at scale base. Droppable items go first (highest
// drop first), before any text is shrunk; then the largest scale that fits is used.
function fitColumn(items, w, h, base = 1.0) {
  let list = items.slice();
  for (;;) {
    const laid = layoutItems(list, w, base);
    if (laid.height <= h) return laid;
    let worst = -1;
    list.forEach((it, idx) => {
      if (it.drop && (worst < 0 || it.drop > list[worst].drop)) worst = idx;
    });
    if (worst < 0) break;
    list = list.filter((_, idx) => idx !== worst);
  }
  for (let s = base - 0.03; s >= MIN_SCALE - 0.001; s -= 0.03) {
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
    const barPad = it.bar ? 10 : 0;   // room for the colored bar at the left
    textSize(size);
    // A bold inline prefix, such as "Jordan's example: ", indents the first line only
    textStyle(BOLD);
    const prefixW = it.prefix ? textWidth(it.prefix) : 0;
    textStyle(st.style);
    const lines = wrapText(it.text, maxW - barPad, prefixW);
    const lead = size * 1.3;
    const before = blocks.length ? st.before * s : 0;
    blocks.push({ lines: lines, size: size, style: st.style, color: it.color || st.color,
      lead: lead, before: before, prefix: it.prefix, prefixW: prefixW,
      prefixColor: it.prefixColor, bar: it.bar, barPad: barPad });
    height += before + lines.length * lead;
  }
  textStyle(NORMAL);
  blocks.height = height;
  return blocks;
}

function renderBlocks(blocks, x, y, w) {
  noStroke();
  for (const b of blocks) {
    y += b.before;
    if (b.bar) {
      fill(b.bar);
      rect(x, y + 1, 4, b.lines.length * b.lead - 4, 2);
    }
    const tx = x + b.barPad;
    textAlign(LEFT, TOP);
    textSize(b.size);
    b.lines.forEach((ln, k) => {
      let lx = tx;
      if (k === 0 && b.prefix) {
        textStyle(BOLD);
        fill(b.prefixColor || 'black');
        text(b.prefix, tx, y);
        lx += b.prefixW;
      }
      textStyle(b.style);
      fill(b.color);
      text(ln, lx, y);
      y += b.lead;
    });
  }
  textStyle(NORMAL);
}

// ---------- Selection ----------

function selectNode(i) {
  selected = i;
  visited.add(i);
  updateButtons();
}

// Move the selection one node less direct (-1) or more direct (+1). With nothing
// selected, More direct starts at the do-nothing end and Less direct at the direct end.
function stepSelection(d) {
  if (selected < 0) selectNode(d > 0 ? 0 : NODES.length - 1);
  else selectNode(constrain(selected + d, 0, NODES.length - 1));
}

function clearSelection() {
  selected = -1;
  updateButtons();
}

function updateButtons() {
  setEnabled(lessButton, selected !== 0);
  setEnabled(moreButton, selected !== NODES.length - 1);
  setEnabled(clearButton, selected >= 0);
}

function setEnabled(b, on) {
  if (on) b.removeAttribute('disabled');
  else b.attribute('disabled', '');
}

// ---------- Interaction ----------

// Index of the node whose node-and-label area is under (mx, my), or -1
function nodeAt(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return -1;
  for (let i = 0; i < nodePos.length; i++) {
    const h = nodePos[i].hit;
    if (mx >= h.x && mx <= h.x + h.w && my >= h.y && my <= h.y + h.h) return i;
  }
  return -1;
}

function mousePressed() {
  const i = nodeAt(mouseX, mouseY);
  if (i >= 0) selectNode(i);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
    stepSelection(-1);
    return false;
  }
  if (keyCode === RIGHT_ARROW || keyCode === DOWN_ARROW) {
    stepSelection(1);
    return false;
  }
  if (keyCode === ESCAPE) clearSelection();
}

// ---------- Helpers ----------

// True when str wraps into at most maxLines lines, each no wider than maxW
function fitsLines(str, maxW, size, style, maxLines) {
  textStyle(style);
  textSize(size);
  const lines = wrapText(str, maxW);
  const ok = lines.length <= maxLines && lines.every(l => textWidth(l) <= maxW);
  textStyle(NORMAL);
  return ok;
}

// Split a string into lines no wider than maxW at the current text size and style.
// firstIndent reserves room at the start of the first line (for an inline prefix).
function wrapText(str, maxW, firstIndent = 0) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const room = maxW - (lines.length === 0 ? firstIndent : 0);
    const test = line ? line + ' ' + word : word;
    if (textWidth(test) > room && (line || (lines.length === 0 && firstIndent > 0))) {
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
