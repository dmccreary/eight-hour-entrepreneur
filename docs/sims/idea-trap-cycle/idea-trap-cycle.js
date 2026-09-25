// The Idea Trap Cycle - p5.js MicroSim
// CANVAS_HEIGHT: 610
// Learners differentiate the closed "Refine the Plan" loop (feels productive, never
// produces an answer) from the open "Real-World Test" path (feels risky, ends in
// validated learning). Click any box for its meaning, hover or tap an arrow for its
// tooltip, and use the buttons to send Jordan around the loop or down the path while
// two counters compare hours invested with real customer answers.
// Wide screens: loop on the left, forward path to the right.
// Narrow screens: loop on top, forward path straight down the right column.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Book palette (matches the Scout mascot and the Material theme)
const INDIGO = '#3F51B5';       // idea / knowledge nodes
const FOX_ORANGE = '#E8791A';   // forward path and Validated Learning
const DARK_ORANGE = '#B25A10';  // orange that stays readable as text on white
const TRAP_RED = '#A0524F';     // muted gray-red for the highlighted trap loop
const CREAM = '#FDECD8';        // mascot background tint

// Text for the four boxes
const NODE_TEXT = {
  idea:   { label: 'Unrefined Business Idea', sub: "Jordan's grooming-van thought" },
  refine: { label: 'Refine the Plan',         sub: 'pitch decks, logos, spreadsheets' },
  test:   { label: 'Real-World Test',         sub: 'knock on 5 doors and ask' },
  learn:  { label: 'Validated Learning',      sub: 'a real yes or no' }
};

// Colors for the four boxes
const NODE_STYLE = {
  idea:   { fill: INDIGO,       border: INDIGO,      text: 'white' },
  refine: { fill: 'mistyrose',  border: 'rosybrown', text: 'black' },
  test:   { fill: CREAM,        border: FOX_ORANGE,  text: 'black' },
  learn:  { fill: FOX_ORANGE,   border: DARK_ORANGE, text: 'black' }
};

// Info panel content for each clickable box or arrow
const INFO = {
  intro: {
    title: 'Two ways to spend your next hour',
    body: 'Click any box to see what it means, and hover over (or tap) an arrow. ' +
          'Then use the buttons below: which path ever gives Jordan a real answer?',
    border: 'silver', titleColor: 'black'
  },
  idea: {
    title: 'Unrefined Business Idea',
    body: 'A business idea that exists only as a general direction, with none of its key details worked out.',
    example: 'Jordan: "Someone should just drive a grooming van to people\'s houses."',
    border: INDIGO, titleColor: INDIGO
  },
  refine: {
    title: 'Refine the Plan',
    body: 'Feels productive. Changes nothing about whether a customer wants this.',
    example: 'Jordan: a new logo, a polished pitch deck, a five-year spreadsheet.',
    border: TRAP_RED, titleColor: TRAP_RED
  },
  test: {
    title: 'Real-World Test',
    body: 'Feels risky. Is the only activity that actually reduces uncertainty.',
    example: 'Jordan: knock on 5 neighbors\' doors and ask what grooming costs them today.',
    border: FOX_ORANGE, titleColor: DARK_ORANGE
  },
  learn: {
    title: 'Validated Learning',
    body: 'What an assumption becomes once it has been tested against reality and the result, ' +
          'confirmed or disproven, is known with reasonable confidence.',
    example: 'Jordan: "3 of 5 neighbors said yes to a $40 driveway groom."',
    border: FOX_ORANGE, titleColor: DARK_ORANGE
  },
  loop: {
    title: 'The Trap Loop',
    body: 'This loop can run forever — refining never forces a decision.',
    border: TRAP_RED, titleColor: TRAP_RED
  },
  forward: {
    title: 'The Forward Path',
    body: 'This path ends — a real answer, yes or no.',
    border: FOX_ORANGE, titleColor: DARK_ORANGE
  }
};

// What Jordan does each time a button is pressed (cycles through the list)
const REFINE_STEPS = [
  { what: 'Redesigned the logo (version three).', hours: 4 },
  { what: 'Rewrote the pitch deck to sound more confident.', hours: 5 },
  { what: 'Built a five-year revenue spreadsheet for a service with zero customers.', hours: 6 },
  { what: 'Spent an evening reading competitor websites.', hours: 3 },
  { what: 'Picked a van color and a business name.', hours: 2 },
  { what: 'Rewrote the pitch deck again after reading a startup blog.', hours: 4 }
];
const TEST_STEPS = [
  { what: 'Knocked on 5 neighbors\' doors and asked what grooming costs them today.',
    result: '3 said they would try a $40 driveway groom; 2 said no.', hours: 2, answers: 5 },
  { what: 'Groomed one neighbor\'s dog in their driveway for $40.',
    result: 'The owner paid and asked to book again next month.', hours: 2, answers: 1 },
  { what: 'Posted the $40 offer in the neighborhood app.',
    result: '4 replies: 2 wanted to book, 2 said the price was too high.', hours: 1, answers: 4 }
];

// Layout: node positions keyed by id, recomputed by computeLayout() on every resize
let nodes = {};
let loopGeom = {};      // {cx, cy, r, gap} geometry of the trap loop circle
let layout = {};        // captions, counter chips and info panel rectangles
let isWide = true;

// Interaction state
let selectedKey = null; // box or arrow last clicked
let hoverKey = null;    // box or arrow under the mouse
let info;               // content shown in the info panel
let hoursInvested = 0;
let customerAnswers = 0;
let refineCount = 0;
let testCount = 0;
let token = null;       // {path: 'loop' | 'forward', t: 0..1} Jordan's marker
let learnGlow = 0;      // frames left in the Validated Learning glow

let refineButton, testButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  refineButton = createButton('Refine the Plan');
  refineButton.mousePressed(refinePlan);
  testButton = createButton('Test with Customers');
  testButton.mousePressed(runTest);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetSim);

  info = INFO.intro;
  computeLayout();
  positionControls();

  describe('Diagram of the idea trap. On the left, an Unrefined Business Idea box and a ' +
    'Refine the Plan box are joined in a closed loop. On the right, a straight path runs ' +
    'from the idea to a Real-World Test and on to Validated Learning. Buttons send Jordan ' +
    'around the loop or down the path while counters track hours invested and real customer answers.');
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

  hoverKey = findHitKey(mouseX, mouseY);
  cursor(hoverKey ? HAND : ARROW);

  drawTitle();
  drawCaptions();
  drawLoop();
  drawForwardPath();
  for (const key of ['idea', 'refine', 'test', 'learn']) {
    drawNode(key);
  }
  updateAndDrawToken();
  drawChips();
  drawInfoPanel();
  drawTooltip();
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= 700;

  if (isWide) {
    // Row: [Refine] loop [Idea] -> [Test] -> [Learn]
    const W = canvasWidth - 2 * margin;
    const nodeW = constrain(W * 0.19, 120, 170);
    const nodeH = measureNodeHeight(nodeW, true);
    const rem = W - 4 * nodeW;
    const loopGap = min(rem * 0.4, 70);
    const pathGap = min((rem - loopGap) / 2, 110);
    const total = 4 * nodeW + loopGap + 2 * pathGap;
    const left = margin + (W - total) / 2 + nodeW / 2;
    const cy = 205;
    nodes.refine = { x: left, y: cy, w: nodeW, h: nodeH };
    nodes.idea = { x: left + nodeW + loopGap, y: cy, w: nodeW, h: nodeH };
    nodes.test = { x: nodes.idea.x + nodeW + pathGap, y: cy, w: nodeW, h: nodeH };
    nodes.learn = { x: nodes.test.x + nodeW + pathGap, y: cy, w: nodeW, h: nodeH };
    const r = (nodes.idea.x - nodes.refine.x) / 2;
    loopGeom = { cx: nodes.refine.x + r, cy: cy, r: r };
    layout.loopCaption = { x: loopGeom.cx, y: cy + r + 20 };
    layout.pathCaption = { x: nodes.test.x, y: cy - nodeH / 2 - 22 };
    const chipW = 220;
    layout.chips = [
      { x: canvasWidth / 2 - chipW - 10, y: 360, w: chipW, h: 54 },
      { x: canvasWidth / 2 + 10, y: 360, w: chipW, h: 54 }
    ];
    layout.chipLabels = ['Hours invested', 'Real customer answers'];
    layout.info = { x: margin, y: 428, w: canvasWidth - 2 * margin, h: drawHeight - 10 - 428 };
  } else {
    // Loop on top, forward path runs down the right column, counters in the left column
    const nodeW = constrain(canvasWidth * 0.36, 110, 160);
    const nodeH = measureNodeHeight(nodeW, false);
    const between = constrain(canvasWidth * 0.07, 24, 44);
    const r = (nodeW + between) / 2;
    const cx = canvasWidth / 2;
    const cy = 50 + r;
    nodes.refine = { x: cx - r, y: cy, w: nodeW, h: nodeH };
    nodes.idea = { x: cx + r, y: cy, w: nodeW, h: nodeH };
    nodes.test = { x: cx + r, y: cy + r + 18 + nodeH / 2, w: nodeW, h: nodeH };
    nodes.learn = { x: cx + r, y: nodes.test.y + nodeH + 30, w: nodeW, h: nodeH };
    loopGeom = { cx: cx, cy: cy, r: r };
    const colRight = nodes.test.x - nodeW / 2 - 10;
    const chipW = min(170, colRight - 12);
    layout.loopCaption = { x: 12 + chipW / 2, y: cy + r + 20 };
    layout.pathCaption = null;
    layout.chips = [
      { x: 12, y: cy + r + 40, w: chipW, h: 54 },
      { x: 12, y: cy + r + 102, w: chipW, h: 54 }
    ];
    layout.chipLabels = ['Hours invested', 'Customer answers'];
    const infoTop = max(nodes.learn.y + nodeH / 2, layout.chips[1].y + 54) + 12;
    layout.info = { x: 10, y: infoTop, w: canvasWidth - 20, h: drawHeight - 10 - infoTop };
  }

  // Angular gap so each loop arrow starts and ends just outside the boxes
  const r = loopGeom.r;
  const clearance = nodes.idea.h / 2 + 6;
  loopGeom.gap = asin(min(0.95, clearance / r));
}

// Tallest box needed to fit its wrapped label (and subtitle, when shown)
function measureNodeHeight(nodeW, withSub) {
  let tallest = 0;
  for (const key in NODE_TEXT) {
    textStyle(BOLD);
    textSize(16);
    let h = wrapText(NODE_TEXT[key].label, nodeW - 16).length * 19;
    if (withSub) {
      textStyle(NORMAL);
      textSize(14);
      h += 4 + wrapText(NODE_TEXT[key].sub, nodeW - 14).length * 17;
    }
    tallest = max(tallest, h);
  }
  textStyle(NORMAL);
  return tallest + 20;
}

// Buttons are placed left to right using their real rendered widths
function positionControls() {
  let x = 10;
  for (const b of [refineButton, testButton, resetButton]) {
    b.position(x, drawHeight + 13);
    x += b.elt.offsetWidth + 10;
  }
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('The Idea Trap Cycle', canvasWidth / 2, isWide ? 12 : 10);
  if (isWide) {
    fill('dimgray');
    textSize(16);
    text('Click any box, hover an arrow, then try both buttons below.', canvasWidth / 2, 46);
  }
}

// Small italic captions: "going in circles" and "moving forward"
function drawCaptions() {
  noStroke();
  textStyle(ITALIC);
  textSize(16);
  textAlign(CENTER, CENTER);
  fill(TRAP_RED);
  text('going in circles', layout.loopCaption.x, layout.loopCaption.y);
  if (layout.pathCaption) {
    fill(DARK_ORANGE);
    text('moving forward', layout.pathCaption.x, layout.pathCaption.y);
  }
  textStyle(NORMAL);
}

// Closed loop: Idea -> (top arc) -> Refine -> (bottom arc) -> Idea
function drawLoop() {
  const active = hoverKey === 'loop' || selectedKey === 'loop' || (token && token.path === 'loop');
  const col = active ? TRAP_RED : 'rosybrown';
  const w = active ? 7 : 4;
  const { cx, cy, r, gap } = loopGeom;
  const trim = arrowSize(w) * 0.7 / r;   // stop the stroke under the arrowhead
  noFill();
  stroke(col);
  strokeWeight(w);
  arc(cx, cy, 2 * r, 2 * r, PI + gap + trim, TWO_PI - gap);   // top arc, travels right to left
  arc(cx, cy, 2 * r, 2 * r, gap + trim, PI - gap);            // bottom arc, travels left to right
  drawArrowhead(cx + r * cos(PI + gap), cy + r * sin(PI + gap), atan2(cos(gap), -sin(gap)), col, w);
  drawArrowhead(cx + r * cos(gap), cy + r * sin(gap), atan2(-cos(gap), sin(gap)), col, w);
  strokeWeight(1);
}

// Open path: Idea -> Test -> Learn, drawn as straight segments
function forwardSegments() {
  const a = nodes.idea, b = nodes.test, c = nodes.learn;
  if (isWide) {
    return [
      { x1: a.x + a.w / 2, y1: a.y, x2: b.x - b.w / 2 - 3, y2: b.y },
      { x1: b.x + b.w / 2, y1: b.y, x2: c.x - c.w / 2 - 3, y2: c.y }
    ];
  }
  return [
    { x1: a.x, y1: a.y + a.h / 2, x2: b.x, y2: b.y - b.h / 2 - 3 },
    { x1: b.x, y1: b.y + b.h / 2, x2: c.x, y2: c.y - c.h / 2 - 3 }
  ];
}

function drawForwardPath() {
  const active = hoverKey === 'forward' || selectedKey === 'forward' || (token && token.path === 'forward');
  const col = active ? FOX_ORANGE : 'sandybrown';
  const w = active ? 7 : 4;
  for (const s of forwardSegments()) {
    const ang = atan2(s.y2 - s.y1, s.x2 - s.x1);
    const back = arrowSize(w) * 0.7;
    stroke(col);
    strokeWeight(w);
    line(s.x1, s.y1, s.x2 - back * cos(ang), s.y2 - back * sin(ang));
    drawArrowhead(s.x2, s.y2, ang, col, w);
  }
  strokeWeight(1);
}

function arrowSize(weight) {
  return 10 + weight * 1.5;
}

function drawArrowhead(x, y, angle, col, weight) {
  const size = arrowSize(weight);
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill(col);
  triangle(0, 0, -size, -size * 0.55, -size, size * 0.55);
  pop();
}

function drawNode(key) {
  const n = nodes[key];
  const style = NODE_STYLE[key];
  const left = n.x - n.w / 2;
  const top = n.y - n.h / 2;

  // Glow on Validated Learning when Jordan arrives
  if (key === 'learn' && learnGlow > 0) {
    noFill();
    stroke(232, 121, 26, map(learnGlow, 0, 45, 0, 160));
    strokeWeight(10);
    rect(left - 4, top - 4, n.w + 8, n.h + 8, 16);
    learnGlow--;
  }

  // Soft shadow, then the box
  noStroke();
  fill(0, 0, 0, 25);
  rect(left + 3, top + 4, n.w, n.h, 14);
  fill(style.fill);
  if (selectedKey === key) {
    stroke('black');
    strokeWeight(3);
  } else {
    stroke(style.border);
    strokeWeight(hoverKey === key ? 3 : 2);
  }
  rect(left, top, n.w, n.h, 14);

  // Wrapped label (and subtitle on wide screens), centered vertically
  noStroke();
  fill(style.text);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(16);
  const labelLines = wrapText(NODE_TEXT[key].label, n.w - 16);
  let subLines = [];
  if (isWide) {
    textStyle(NORMAL);
    textSize(14);
    subLines = wrapText(NODE_TEXT[key].sub, n.w - 14);
  }
  const blockH = labelLines.length * 19 + (subLines.length ? 4 + subLines.length * 17 : 0);
  let y = n.y - blockH / 2;
  textStyle(BOLD);
  textSize(16);
  for (const ln of labelLines) {
    text(ln, n.x, y);
    y += 19;
  }
  if (subLines.length) {
    y += 4;
    textStyle(NORMAL);
    textSize(14);
    for (const ln of subLines) {
      text(ln, n.x, y);
      y += 17;
    }
  }
  textStyle(NORMAL);
}

// Jordan's marker travels once around the loop or once down the path
function updateAndDrawToken() {
  if (!token) return;
  token.t += 1 / 80;
  let x, y, col;
  if (token.path === 'loop') {
    const theta = -TWO_PI * min(token.t, 1);
    x = loopGeom.cx + loopGeom.r * cos(theta);
    y = loopGeom.cy + loopGeom.r * sin(theta);
    col = TRAP_RED;
  } else {
    const t = min(token.t, 1);
    const a = nodes.idea, b = nodes.test, c = nodes.learn;
    if (t < 0.5) {
      x = lerp(a.x, b.x, t * 2);
      y = lerp(a.y, b.y, t * 2);
    } else {
      x = lerp(b.x, c.x, (t - 0.5) * 2);
      y = lerp(b.y, c.y, (t - 0.5) * 2);
    }
    col = FOX_ORANGE;
  }
  fill('white');
  stroke(col);
  strokeWeight(3);
  circle(x, y, 30);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(16);
  text('J', x, y + 1);
  textStyle(NORMAL);
  if (token.t >= 1) {
    if (token.path === 'forward') learnGlow = 45;
    token = null;
  }
}

function drawChips() {
  drawChip(layout.chips[0], layout.chipLabels[0], hoursInvested, 'silver', 'black');
  drawChip(layout.chips[1], layout.chipLabels[1], customerAnswers, FOX_ORANGE,
    customerAnswers > 0 ? DARK_ORANGE : 'black');
}

function drawChip(c, label, value, borderCol, valueCol) {
  fill('white');
  stroke(borderCol);
  strokeWeight(2);
  rect(c.x, c.y, c.w, c.h, 10);
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(15);
  fill('dimgray');
  text(label, c.x + c.w / 2, c.y + 6);
  textStyle(BOLD);
  textSize(22);
  fill(valueCol);
  text(value, c.x + c.w / 2, c.y + 25);
  textStyle(NORMAL);
}

// Info panel shrinks its text size if needed so the content always fits
function drawInfoPanel() {
  const p = layout.info;
  fill('white');
  stroke(info.border || 'silver');
  strokeWeight(2);
  rect(p.x, p.y, p.w, p.h, 10);
  let lines = [];
  for (let size = 16; size >= 13; size--) {
    lines = buildInfoLines(info, p.w - 24, size);
    const h = lines.reduce((sum, ln) => sum + ln.lead, 0);
    if (h <= p.h - 18) break;
  }
  noStroke();
  textAlign(LEFT, TOP);
  let y = p.y + 10;
  for (const ln of lines) {
    textStyle(ln.style);
    textSize(ln.size);
    fill(ln.col);
    text(ln.t, p.x + 12, y);
    y += ln.lead;
  }
  textStyle(NORMAL);
}

function buildInfoLines(content, maxW, size) {
  const out = [];
  const sections = [
    { str: content.title, style: BOLD, size: size + 1, col: content.titleColor || 'black' },
    { str: content.body, style: NORMAL, size: size, col: 'black' },
    { str: content.example, style: ITALIC, size: size, col: 'dimgray' }
  ];
  for (const s of sections) {
    if (!s.str) continue;
    textStyle(s.style);
    textSize(s.size);
    const wrapped = wrapText(s.str, maxW);
    wrapped.forEach((t, i) => {
      out.push({ t: t, style: s.style, size: s.size, col: s.col,
        lead: s.size * 1.3 + (i === wrapped.length - 1 ? 6 : 0) });
    });
  }
  return out;
}

// Tooltip that follows the mouse while an arrow is hovered
function drawTooltip() {
  if (hoverKey !== 'loop' && hoverKey !== 'forward') return;
  const msg = INFO[hoverKey].body;
  textStyle(NORMAL);
  textSize(15);
  const lines = wrapText(msg, 230);
  const w = Math.max(...lines.map(l => textWidth(l))) + 20;
  const h = lines.length * 20 + 12;
  let x = mouseX + 14;
  let y = mouseY + 16;
  if (x + w > canvasWidth - 5) x = mouseX - w - 14;
  if (y + h > drawHeight - 5) y = mouseY - h - 14;
  fill(255, 255, 255, 245);
  stroke(hoverKey === 'loop' ? TRAP_RED : FOX_ORANGE);
  strokeWeight(2);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  lines.forEach((l, i) => text(l, x + 10, y + 7 + i * 20));
}

// ---------- Interaction ----------

// Returns the id of the box or arrow at (mx, my), or null
function findHitKey(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return null;
  for (const key in nodes) {
    const n = nodes[key];
    if (abs(mx - n.x) <= n.w / 2 && abs(my - n.y) <= n.h / 2) return key;
  }
  if (abs(dist(mx, my, loopGeom.cx, loopGeom.cy) - loopGeom.r) < 10) return 'loop';
  for (const s of forwardSegments()) {
    if (distToSegment(mx, my, s.x1, s.y1, s.x2, s.y2) < 10) return 'forward';
  }
  return null;
}

function mousePressed() {
  const key = findHitKey(mouseX, mouseY);
  if (!key) return;
  selectedKey = key;
  info = INFO[key];
}

function refinePlan() {
  const step = REFINE_STEPS[refineCount % REFINE_STEPS.length];
  refineCount++;
  hoursInvested += step.hours;
  token = { path: 'loop', t: 0 };
  selectedKey = 'loop';
  info = {
    title: 'Refine loop #' + refineCount + ':  +' + step.hours + ' hours,  0 new customer answers',
    body: step.what,
    example: 'It felt productive, but no customer was involved, so Jordan is back at the same unanswered question.',
    border: TRAP_RED, titleColor: TRAP_RED
  };
}

function runTest() {
  const step = TEST_STEPS[testCount % TEST_STEPS.length];
  testCount++;
  hoursInvested += step.hours;
  customerAnswers += step.answers;
  token = { path: 'forward', t: 0 };
  selectedKey = 'forward';
  info = {
    title: 'Real-world test #' + testCount + ':  +' + step.hours + ' hours,  +' + step.answers + ' real answers',
    body: step.what,
    example: 'Result: ' + step.result,
    border: FOX_ORANGE, titleColor: DARK_ORANGE
  };
}

function resetSim() {
  hoursInvested = 0;
  customerAnswers = 0;
  refineCount = 0;
  testCount = 0;
  token = null;
  learnGlow = 0;
  selectedKey = null;
  info = INFO.intro;
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

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / len2;
  t = constrain(t, 0, 1);
  return dist(px, py, x1 + t * dx, y1 + t * dy);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  computeLayout();
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.floor(container.getBoundingClientRect().width);
  }
}
