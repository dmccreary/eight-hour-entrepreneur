// The Four-Phase Founder Pipeline - p5.js MicroSim
// CANVAS_HEIGHT: 610
// Step through Clarity -> Validation -> Action -> Launch one phase at a time. Each
// phase shows its definition, Jordan's concrete example, and a "predict before you
// click Next" prompt. A curved return arrow from Validation back to Clarity (click it)
// shows that the phases form a repeating cycle, and Next on Launch loops back to Clarity.
// Wide screens: four boxes in a row with the return arrow curving beneath them.
// Narrow screens: a vertical stack with the return arrow curving on the right.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Book palette (matches the Scout mascot and the Material theme)
const INDIGO = '#3F51B5';       // the return arrow
const FOX_ORANGE = '#E8791A';   // selected phase outline
const DARK_ORANGE = '#B25A10';  // orange that stays readable as text on white
const CREAM = '#FDECD8';        // background behind Jordan's example

// The four phases: label, definition, Jordan's example, and a predict prompt
const STAGES = [
  {
    label: 'Clarity',
    definition: 'State who you think your customer is and what problem they have: an honest, testable guess, not a polished mission statement.',
    example: '"I think busy dog owners without easy grooming access would pay for grooming that comes to them."',
    predict: 'How could Jordan test this guess without spending any money on a van?'
  },
  {
    label: 'Validation',
    definition: 'Test that guess against reality by talking to real people, instead of trusting it because it feels right.',
    example: 'Called 5 neighbors, asked what their current grooming routine costs them in time and money.',
    predict: 'Three neighbors sounded interested. What is the smallest way to see if they will actually pay?'
  },
  {
    label: 'Action',
    definition: 'Do the smallest real-world thing that produces evidence, instead of building the complete product first.',
    example: 'Borrowed a friend\'s car, groomed one neighbor\'s dog for $40 in their driveway.',
    predict: 'The driveway groom worked. How could Jordan reach strangers without buying a van?'
  },
  {
    label: 'Launch',
    definition: 'Put a first real, incomplete version in front of actual customers and let their response teach you.',
    example: 'Posted the same offer in the neighborhood app for anyone within 5 miles.',
    predict: 'Strangers are booking. What new questions does that raise, and which phase answers them?'
  }
];

// Info shown when the return arrow is clicked
const PIVOT_INFO = {
  heading: 'If evidence says pivot',
  body: 'Phases aren\'t one-and-done. New evidence from Validation should send you back to sharpen Clarity.',
  example: 'If the 5 neighbors had said grooming was no hassle for them, Jordan would go back to Clarity and rethink the customer, perhaps older dog owners who no longer drive.',
  next: 'Click any phase box, or use Previous and Next, to return to the pipeline.'
};

// Layout, recomputed by computeLayout() on every resize
let boxes = [];         // [{x, y, w, h}] top-left rectangles for the four phases
let pivot = {};         // bezier points and label position for the return arrow
let panel = {};         // detail panel rectangle
let isWide = true;

// Interaction state
let selected = 0;       // index of the selected phase (Clarity on load)
let showPivot = false;  // true while the return arrow's infobox is showing
let hoverKey = null;    // 'box0'..'box3' or 'pivot'

let prevButton, nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  prevButton = createButton('◀ Previous');
  prevButton.mousePressed(goPrevious);
  nextButton = createButton('Next ▶');
  nextButton.mousePressed(goNext);

  computeLayout();
  updateButtons();

  describe('Four boxes labeled Clarity, Validation, Action, and Launch, connected by forward ' +
    'arrows, with a curved return arrow from Validation back to Clarity labeled if evidence ' +
    'says pivot. A detail panel shows the selected phase\'s definition, Jordan\'s mobile ' +
    'dog-grooming example, and a question to consider before moving to the next phase.');
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
  drawForwardArrows();
  drawPivotArrow();
  drawBoxes();
  drawPanel();
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= 600;

  if (isWide) {
    const W = canvasWidth - 2 * margin;
    const gap = constrain(W * 0.07, 36, 70);
    const bw = (W - 3 * gap) / 4;
    const bh = 64;
    const top = 58;
    boxes = STAGES.map((s, i) => ({ x: margin + i * (bw + gap), y: top, w: bw, h: bh }));
    const b0 = boxes[0], b1 = boxes[1];
    const yb = top + bh;
    const xs = b1.x + b1.w * 0.35;   // leaves the bottom of Validation
    const xe = b0.x + b0.w * 0.65;   // enters the bottom of Clarity
    pivot = {
      x1: xs, y1: yb + 2, cx1: xs, cy1: yb + 62,
      cx2: xe, cy2: yb + 62, x2: xe, y2: yb + 4,
      labelX: (xs + xe) / 2, labelY: yb + 62, labelLines: ['if evidence says pivot'], align: CENTER
    };
    const panelTop = yb + 90;
    panel = { x: margin, y: panelTop, w: W, h: drawHeight - 10 - panelTop };
  } else {
    const bw = min(240, canvasWidth - 160);
    const bh = 38;
    const gap = 20;
    const left = max(12, (canvasWidth - bw) / 2 - 45);
    const top = 44;
    boxes = STAGES.map((s, i) => ({ x: left, y: top + i * (bh + gap), w: bw, h: bh }));
    const b0 = boxes[0], b1 = boxes[1];
    const xr = left + bw;
    pivot = {
      x1: xr + 2, y1: b1.y + bh / 2, cx1: xr + 52, cy1: b1.y + bh / 2,
      cx2: xr + 52, cy2: b0.y + bh / 2, x2: xr + 4, y2: b0.y + bh / 2,
      labelX: xr + 46, labelY: (b0.y + b1.y + bh) / 2, labelLines: ['if evidence', 'says pivot'], align: LEFT
    };
    const last = boxes[3];
    const panelTop = last.y + last.h + 14;
    panel = { x: 10, y: panelTop, w: canvasWidth - 20, h: drawHeight - 10 - panelTop };
  }

  positionControls();
}

function positionControls() {
  prevButton.position(10, drawHeight + 13);
  nextButton.position(10 + prevButton.elt.offsetWidth + 10, drawHeight + 13);
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('The Four-Phase Founder Pipeline', canvasWidth / 2, isWide ? 14 : 10);
}

function drawBoxes() {
  boxes.forEach((b, i) => {
    const isSel = !showPivot && i === selected;
    const isHover = hoverKey === 'box' + i;
    // Flat boxes: selected = white with fox-orange outline, others = light gray
    if (isSel) {
      fill('white');
      stroke(FOX_ORANGE);
      strokeWeight(4);
    } else {
      fill(isHover ? 'whitesmoke' : 'gainsboro');
      stroke(isHover ? 'gray' : 'silver');
      strokeWeight(isHover ? 2 : 1);
    }
    rect(b.x, b.y, b.w, b.h, 12);

    noStroke();
    textAlign(CENTER, CENTER);
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    if (isWide) {
      fill(isSel ? DARK_ORANGE : 'dimgray');
      textStyle(BOLD);
      textSize(14);
      text('PHASE ' + (i + 1), cx, cy - 13);
      fill('black');
      textSize(20);
      text(STAGES[i].label, cx, cy + 10);
    } else {
      fill('black');
      textStyle(BOLD);
      textSize(18);
      text((i + 1) + '. ' + STAGES[i].label, cx, cy);
    }
    textStyle(NORMAL);
  });
}

// Straight gray arrows from each phase to the next
function drawForwardArrows() {
  stroke('gray');
  strokeWeight(3);
  for (let i = 0; i < 3; i++) {
    const a = boxes[i], b = boxes[i + 1];
    let x1, y1, x2, y2;
    if (isWide) {
      x1 = a.x + a.w + 4; y1 = a.y + a.h / 2;
      x2 = b.x - 4;       y2 = y1;
    } else {
      x1 = a.x + a.w / 2; y1 = a.y + a.h + 3;
      x2 = x1;            y2 = b.y - 3;
    }
    const ang = atan2(y2 - y1, x2 - x1);
    stroke('gray');
    strokeWeight(3);
    line(x1, y1, x2 - 8 * cos(ang), y2 - 8 * sin(ang));
    drawArrowhead(x2, y2, ang, 'gray', 12);
  }
}

// Curved return arrow from Validation back to Clarity
function drawPivotArrow() {
  const active = showPivot || hoverKey === 'pivot';
  const col = active ? INDIGO : 'slateblue';
  const p = pivot;
  noFill();
  stroke(col);
  strokeWeight(active ? 5 : 3);
  beginShape();
  for (let t = 0; t <= 0.9; t += 0.02) {
    vertex(bezierPoint(p.x1, p.cx1, p.cx2, p.x2, t), bezierPoint(p.y1, p.cy1, p.cy2, p.y2, t));
  }
  endShape();
  const ang = atan2(bezierTangent(p.y1, p.cy1, p.cy2, p.y2, 1), bezierTangent(p.x1, p.cx1, p.cx2, p.x2, 1));
  drawArrowhead(p.x2, p.y2, ang, col, active ? 16 : 13);

  // Label
  noStroke();
  fill(col);
  textStyle(active ? BOLDITALIC : ITALIC);
  textSize(isWide ? 16 : 14);
  textAlign(p.align, CENTER);
  const lead = isWide ? 18 : 16;
  const startY = p.labelY - (p.labelLines.length - 1) * lead / 2;
  p.labelLines.forEach((ln, i) => text(ln, p.labelX, startY + i * lead));
  textStyle(NORMAL);
}

function drawArrowhead(x, y, angle, col, size) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill(col);
  triangle(0, 0, -size, -size * 0.55, -size, size * 0.55);
  pop();
}

// Detail panel: text scales down in small steps until everything fits
function drawPanel() {
  const p = panel;
  fill('white');
  stroke(showPivot ? INDIGO : FOX_ORANGE);
  strokeWeight(2);
  rect(p.x, p.y, p.w, p.h, 12);

  const items = showPivot ? pivotItems() : stageItems(selected);
  const base = isWide ? 1.12 : 0.94;
  let blocks = null;
  for (let s = base; s >= 0.72; s -= 0.04) {
    blocks = layoutItems(items, p.w - 36, s);
    if (blocks.height <= p.h - 24) break;
  }
  renderBlocks(blocks, p.x + 18, p.y + 14);
}

function stageItems(i) {
  const s = STAGES[i];
  return [
    { kind: 'kicker', text: 'PHASE ' + (i + 1) + ' OF 4' },
    { kind: 'heading', text: s.label, color: DARK_ORANGE },
    { kind: 'label', text: 'WHAT IT MEANS' },
    { kind: 'body', text: s.definition },
    { kind: 'label', text: 'JORDAN\'S EXAMPLE' },
    { kind: 'quote', text: s.example },
    { kind: 'label', text: i === 3 ? 'BEFORE YOU LOOP BACK TO CLARITY' : 'BEFORE YOU CLICK NEXT' },
    { kind: 'body', text: s.predict }
  ];
}

function pivotItems() {
  return [
    { kind: 'kicker', text: 'THE RETURN ARROW' },
    { kind: 'heading', text: PIVOT_INFO.heading, color: INDIGO },
    { kind: 'body', text: PIVOT_INFO.body },
    { kind: 'label', text: 'JORDAN\'S EXAMPLE' },
    { kind: 'quote', text: PIVOT_INFO.example },
    { kind: 'body', text: PIVOT_INFO.next, color: 'dimgray' }
  ];
}

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  kicker:  { size: 14, style: 'bold',   color: 'dimgray', before: 0 },
  heading: { size: 24, style: 'bold',   color: 'black',   before: 2 },
  label:   { size: 14, style: 'bold',   color: 'dimgray', before: 12 },
  body:    { size: 17, style: 'normal', color: 'black',   before: 4 },
  quote:   { size: 17, style: 'italic', color: 'black',   before: 6 }
};

// Wraps every item at scale s and measures the total height
function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const size = st.size * s;
    const indent = it.kind === 'quote' ? 16 : 0;
    textStyle(st.style);
    textSize(size);
    const lines = wrapText(it.text, maxW - indent - (indent ? 8 : 0));
    const lead = size * 1.3;
    const before = st.before * s;
    const pad = it.kind === 'quote' ? 6 : 0;
    blocks.push({ kind: it.kind, lines, size, style: st.style, color: it.color || st.color,
      lead, before, indent, pad });
    height += before + lines.length * lead + 2 * pad;
  }
  blocks.height = height;
  return blocks;
}

function renderBlocks(blocks, x, y) {
  textAlign(LEFT, TOP);
  for (const b of blocks) {
    y += b.before;
    if (b.kind === 'quote') {
      // Jordan's example sits on a cream card with a fox-orange bar
      const h = b.lines.length * b.lead + 2 * b.pad;
      noStroke();
      fill(CREAM);
      rect(x, y, panel.w - 36, h, 6);
      fill(FOX_ORANGE);
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

function findHitKey(mx, my) {
  if (mx < 0 || mx > canvasWidth || my < 0 || my > drawHeight) return null;
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return 'box' + i;
  }
  // Near the curve?
  const p = pivot;
  for (let t = 0; t <= 1; t += 0.05) {
    const px = bezierPoint(p.x1, p.cx1, p.cx2, p.x2, t);
    const py = bezierPoint(p.y1, p.cy1, p.cy2, p.y2, t);
    if (dist(mx, my, px, py) < 12) return 'pivot';
  }
  // On the label?
  textSize(isWide ? 16 : 14);
  const lead = isWide ? 18 : 16;
  const labelW = Math.max(...p.labelLines.map(l => textWidth(l)));
  const labelH = p.labelLines.length * lead;
  const lx = p.align === CENTER ? p.labelX - labelW / 2 : p.labelX;
  if (mx >= lx - 4 && mx <= lx + labelW + 4 && abs(my - p.labelY) <= labelH / 2 + 4) return 'pivot';
  return null;
}

function mousePressed() {
  const key = findHitKey(mouseX, mouseY);
  if (!key) return;
  if (key === 'pivot') {
    showPivot = true;
  } else {
    selected = int(key.slice(3));
    showPivot = false;
  }
  updateButtons();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) goNext();
  else if (keyCode === LEFT_ARROW) goPrevious();
}

function goNext() {
  // Launch loops back to Clarity: the phases are a cycle, not a checklist
  selected = (selected + 1) % STAGES.length;
  showPivot = false;
  updateButtons();
}

function goPrevious() {
  if (selected > 0) selected--;
  showPivot = false;
  updateButtons();
}

function updateButtons() {
  if (selected === 0) prevButton.attribute('disabled', '');
  else prevButton.removeAttribute('disabled');
  nextButton.html(selected === STAGES.length - 1 ? 'Back to Clarity ↺' : 'Next ▶');
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
