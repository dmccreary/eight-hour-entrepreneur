// Minimum Viable Offer Slider - p5.js MicroSim
// CANVAS_HEIGHT: 498
// Learners drag the Offer Scope slider (0 = bare minimum, 100 = the full imagined
// business) and watch Jordan's full imagined mobile dog-grooming offer shrink or grow.
// Each of the eight features has a scope threshold: a feature is checked when the scope
// is at or above its threshold and fades to gray below it. The two features with
// threshold 0 (the wash and brush-out, and the visit to the customer's home) never
// leave the offer: they are the essential core. Everything else is a removable add-on.
// The panel names the scope tier (Minimum Viable Offer 0-25, Initial Offer 26-50,
// Established Offering 51-100), marks the scope on a three-zone meter, and states
// Jordan's offer in one sentence, so learners can watch the pitch get longer and less
// clear as features pile on. The slider starts at 15, Jordan's actual initial offer.
// Reset to 0 strips the offer back to its core.
// Wide screens (>= 680px): checklist card on the left, panel on the right.
// Narrow screens (< 680px): the panel stacks above the checklist, and the checklist
// sits directly above the slider.

// Canvas dimensions
let canvasWidth = 800;
let drawHeight = 418;
let controlHeight = 80;   // row 1: Offer Scope label and slider; row 2: Reset to 0 and range hint
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let sliderLeftMargin = 160;  // recomputed from the label width in computeLayout()
let defaultTextSize = 16;
const WIDE_BREAK = 680;   // below this width the panel moves above the checklist

// Book palette
const INDIGO = '#3F51B5';        // Initial Offer tier, CORE tags, core section label
const FOX_ORANGE = '#E8791A';    // current-scope marker on the meter and the slider
const DARK_ORANGE = '#B25A10';   // Established Offering tier (readable on white)
const AMBER = '#FFB300';         // bar beside the one-sentence offer
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // Minimum Viable Offer tier and check marks
const QUOTE_FILL = '#FFF8E1';    // pale amber behind the one-sentence offer
const CORE_FILL = 'lavender';    // pale indigo behind the two essential core features

// Jordan's full imagined offer. A feature is in the offer when scope >= threshold.
// short is used only when the full label will not fit on a very narrow card.
const FEATURES = [
  { label: 'Basic wash and brush-out', threshold: 0 },
  { label: 'At the customer\'s home', threshold: 0 },
  { label: 'Text-message booking', threshold: 10 },
  { label: 'Nail trim add-on', threshold: 30 },
  { label: 'Multiple dog breeds/sizes supported', threshold: 40, short: 'Multiple breeds/sizes' },
  { label: 'Online booking calendar', threshold: 55 },
  { label: 'Flea/tick treatment option', threshold: 65 },
  { label: 'Branded van and uniform', threshold: 85 }
];

// The three scope tiers. max is the highest scope value in the tier.
const TIERS = [
  { name: 'Minimum Viable Offer', short: 'Minimum', max: 25, color: CORRECT_GREEN,
    tint: '#C8E6C9',  // pale green
    message: 'This is a Minimum Viable Offer — just enough to test the core problem.' },
  { name: 'Initial Offer', short: 'Initial', max: 50, color: INDIGO,
    tint: '#C5CAE9',  // pale indigo
    message: 'Still small enough to test, but every add-on beyond the core is one more assumption.',
    extra: 'Would the first customer miss each one if it were cut?' },
  { name: 'Established Offering', short: 'Established', max: 100, color: DARK_ORANGE,
    tint: '#FFE0B2',  // pale orange
    message: 'This is the full imagined business, not a first test.',
    extra: 'Features beyond the core get added back one at a time, after real customers ask for them.' }
];

// Jordan's offer in one sentence, indexed by how many features are in the offer (2-8).
// Thresholds only ever add features, so the count identifies the exact feature set.
const OFFER_SENTENCES = {
  2: 'A dog wash and brush-out at your home.',
  3: 'A dog wash and brush-out at your home, booked by text.',
  4: 'A dog wash and brush-out at your home, booked by text, with an optional nail trim.',
  5: 'A wash and brush-out for any breed or size, at your home, booked by text, with an optional nail trim.',
  6: 'A wash and brush-out for any breed or size, at your home, booked by text or on an online calendar, with an optional nail trim.',
  7: 'A wash and brush-out for any breed or size, at your home, booked by text or online, with optional nail trims and flea/tick treatments.',
  8: 'A wash and brush-out for any breed or size, at your home, from a branded van and a uniformed groomer, booked by text or online, with optional nail trims and flea/tick treatments.'
};

// Hints for the control area, longest first; the first one that fits is drawn
const RANGE_HINTS = [
  ['0 = bare minimum  ·  100 = full imagined business', 16],
  ['0 = bare minimum  ·  100 = full business', 16],
  ['0 = bare minimum, 100 = full business', 14],
  ['0 = bare minimum', 14]
];

// State
let fade = [];              // per feature: 0 = cut (gray) ... 1 = in the offer (checked)

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let cardBox = {}, panelBox = {};
let rows = [];              // per feature: {y, h, text}
let sectionLabels = [];     // wide only: {text, y, color}
let rowPadX = 14;
let checkSize = 20;
let labelSize = 17;
let useLongTags = true;     // "scope 30+" when there is room, "30+" otherwise
let headerTop = 0;
let panelCache = null;      // laid-out panel text, rebuilt when the scope or width changes

let scopeSlider, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  scopeSlider = createSlider(0, 100, 15, 1);
  scopeSlider.style('accent-color', FOX_ORANGE);
  resetButton = createButton('Reset to 0');
  resetButton.mousePressed(resetScope);
  // Larger button text so the control is readable from the back of the room
  resetButton.style('font-size', '16px');
  resetButton.style('padding', '4px 12px');

  // Start with every row already at its resting state (no fade on first load)
  const scope = scopeSlider.value();
  fade = FEATURES.map(f => (scope >= f.threshold ? 1 : 0));

  computeLayout();

  describe('A checklist of the eight features in Jordan\'s full imagined mobile ' +
    'dog-grooming offer, controlled by an Offer Scope slider from 0 (bare minimum) to ' +
    '100 (full imagined business). Features whose scope threshold is at or below the ' +
    'slider value are checked; the rest fade to gray. The basic wash and brush-out and ' +
    'the visit to the customer\'s home are always checked because they are the essential ' +
    'core. A panel names the scope tier: Minimum Viable Offer (0 to 25), Initial Offer ' +
    '(26 to 50), or Established Offering (51 to 100), and states Jordan\'s offer in one ' +
    'sentence. The slider starts at 15, Jordan\'s actual initial offer.');
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

  const scope = scopeSlider.value();
  // Ease each row toward checked (1) or cut (0) so features visibly fade in and out
  for (let i = 0; i < FEATURES.length; i++) {
    const target = scope >= FEATURES[i].threshold ? 1 : 0;
    fade[i] += (target - fade[i]) * 0.25;
    if (abs(target - fade[i]) < 0.01) fade[i] = target;
  }

  drawTitle();
  drawCard(scope);
  drawPanel(scope);
  drawControlText(scope);
}

// ---------- Offer model ----------

function tierFor(scope) {
  for (let i = 0; i < TIERS.length; i++) {
    if (scope <= TIERS[i].max) return i;
  }
  return TIERS.length - 1;
}

function includedCount(scope) {
  return FEATURES.filter(f => scope >= f.threshold).length;
}

// The tier's second sentence. In the Minimum Viable Offer tier it depends on whether
// text-message booking (threshold 10) is in the offer.
function tierExtra(scope) {
  const t = TIERS[tierFor(scope)];
  if (t.extra) return t.extra;
  return scope < 10 ? 'Only the essential core is left.' :
    'It matches Jordan\'s actual initial offer.';
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  if (isWide) {
    const top = 48;
    const bottom = drawHeight - 14;
    const panelW = Math.round(constrain(canvasWidth * 0.4, 260, 380));
    cardBox = { x: margin, y: top, w: canvasWidth - 3 * margin - panelW, h: bottom - top };
    panelBox = { x: canvasWidth - margin - panelW, y: top, w: panelW, h: bottom - top };
    rowPadX = 14;
    checkSize = 20;
  } else {
    const top = 32;
    panelBox = { x: 10, y: top, w: canvasWidth - 20, h: 144 };
    const cy = panelBox.y + panelBox.h + 8;
    cardBox = { x: 10, y: cy, w: canvasWidth - 20, h: drawHeight - 8 - cy };
    rowPadX = 10;
    checkSize = 17;
  }
  layoutRows();
  panelCache = null;
  positionControls();
}

// Stack the eight checklist rows inside the card. Wide cards also get two section
// labels: ESSENTIAL CORE above the first two rows, REMOVABLE ADD-ONS above the rest.
function layoutRows() {
  const c = cardBox;
  headerTop = c.y + (isWide ? 14 : 8);
  let y = headerTop + (isWide ? 28 : 22);
  const sectionH = isWide ? 18 : 0;
  const sectionGap = isWide ? 4 : 0;
  const bottomPad = isWide ? 10 : 6;
  const rowH = (c.y + c.h - bottomPad - y - 2 * sectionH - sectionGap) / FEATURES.length;
  rows = [];
  sectionLabels = [];
  for (let i = 0; i < FEATURES.length; i++) {
    if (isWide && i === 0) {
      sectionLabels.push({ text: 'ESSENTIAL CORE', y: y, color: INDIGO });
      y += sectionH;
    }
    if (isWide && i === 2) {
      y += sectionGap;
      sectionLabels.push({ text: 'REMOVABLE ADD-ONS', y: y, color: 'dimgray' });
      y += sectionH;
    }
    rows.push({ y: y, h: rowH, text: FEATURES[i].label });
    y += rowH;
  }
  fitRowLabels();
}

function tagText(f, long) {
  if (f.threshold === 0) return 'CORE';
  return (long ? 'scope ' : '') + f.threshold + '+';
}

function maxTagWidth(long) {
  textStyle(BOLD);
  textSize(13);
  let w = 0;
  for (const f of FEATURES) w = max(w, textWidth(tagText(f, long)) + 14);
  return w;
}

function widestLabel(s) {
  textStyle(NORMAL);
  textSize(s);
  let w = 0;
  for (const f of FEATURES) w = max(w, textWidth(f.label));
  return w;
}

// Pick one label size for every row. Long tags ("scope 30+") are used only if the
// labels still fit at (nearly) full size; otherwise the tags shrink to "30+" first,
// then the labels shrink. A label that still will not fit uses its short form.
function fitRowLabels() {
  const innerW = cardBox.w - 2 * rowPadX;
  const maxS = isWide ? 17 : 15;
  const minS = 13;
  let best = null;
  for (const long of [true, false]) {
    const room = innerW - checkSize - 10 - maxTagWidth(long) - 10;
    const lowest = long ? maxS - 1 : minS;
    for (let s = maxS; s >= lowest; s--) {
      if (widestLabel(s) <= room) {
        best = { long: long, s: s, room: room };
        break;
      }
    }
    if (best) break;
  }
  if (!best) {
    best = { long: false, s: minS, room: innerW - checkSize - 20 - maxTagWidth(false) };
  }
  useLongTags = best.long;
  labelSize = best.s;
  textStyle(NORMAL);
  textSize(labelSize);
  for (let i = 0; i < FEATURES.length; i++) {
    const f = FEATURES[i];
    rows[i].text = textWidth(f.label) <= best.room ? f.label : (f.short || f.label);
  }
}

function positionControls() {
  textStyle(BOLD);
  textSize(16);
  sliderLeftMargin = 10 + Math.ceil(textWidth('Offer Scope: 100')) + 14;
  textStyle(NORMAL);
  scopeSlider.position(sliderLeftMargin, drawHeight + 11);
  scopeSlider.size(canvasWidth - sliderLeftMargin - margin);
  resetButton.position(10, drawHeight + 44);
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('Minimum Viable Offer Slider', canvasWidth / 2, isWide ? 10 : 6);
}

// The checklist card: Jordan's full imagined offer, one row per feature
function drawCard(scope) {
  const c = cardBox;
  const t = TIERS[tierFor(scope)];

  // Shadow, then the card
  noStroke();
  fill(0, 0, 0, 25);
  rect(c.x + 3, c.y + 4, c.w, c.h, 12);
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(c.x, c.y, c.w, c.h, 12);

  // Header: card title on the left, feature count on the right
  const n = includedCount(scope);
  const innerW = c.w - 2 * rowPadX;
  noStroke();
  textStyle(BOLD);
  textSize(14);
  let count = n + ' of 8 in the offer';
  let title = 'JORDAN\'S FULL IMAGINED OFFER';
  if (textWidth(title) + textWidth(count) + 16 > innerW) count = n + ' of 8';
  if (textWidth(title) + textWidth(count) + 16 > innerW) title = 'JORDAN\'S OFFER';
  fill('dimgray');
  textAlign(LEFT, TOP);
  text(title, c.x + rowPadX, headerTop);
  fill(t.color);
  textAlign(RIGHT, TOP);
  text(count, c.x + c.w - rowPadX, headerTop);

  // Section labels (wide only)
  textSize(13);
  textAlign(LEFT, CENTER);
  for (const s of sectionLabels) {
    fill(s.color);
    text(s.text, c.x + rowPadX, s.y + 9);
  }
  textStyle(NORMAL);

  for (let i = 0; i < FEATURES.length; i++) drawRow(i, scope);
}

function drawRow(i, scope) {
  const c = cardBox;
  const r = rows[i];
  const f = FEATURES[i];
  const a = fade[i];
  const core = f.threshold === 0;
  const inOffer = scope >= f.threshold;
  const midY = r.y + r.h / 2;

  // Pale indigo band behind the two essential core features
  if (core) {
    noStroke();
    fill(CORE_FILL);
    rect(c.x + rowPadX - 6, r.y + 2, c.w - 2 * rowPadX + 12, r.h - 4, 6);
  }

  // Check box: green with a white check when in the offer, empty when cut
  const bs = checkSize;
  const bx = c.x + rowPadX;
  const by = midY - bs / 2;
  stroke(lerpColor(color('silver'), color(CORRECT_GREEN), a));
  strokeWeight(1.5);
  fill(lerpColor(color('white'), color(CORRECT_GREEN), a));
  rect(bx, by, bs, bs, 4);
  if (a > 0.05) {
    stroke(255, 255 * a);
    strokeWeight(2.5);
    noFill();
    beginShape();
    vertex(bx + bs * 0.22, by + bs * 0.52);
    vertex(bx + bs * 0.42, by + bs * 0.72);
    vertex(bx + bs * 0.78, by + bs * 0.30);
    endShape();
  }
  strokeWeight(1);

  // Feature label: black when in the offer, faded to gray when cut
  noStroke();
  fill(lerpColor(color('gray'), color('black'), a));
  textStyle(NORMAL);
  textSize(labelSize);
  textAlign(LEFT, CENTER);
  text(r.text, bx + bs + 10, midY + 1);

  // Tag on the right: CORE, or the scope at which the add-on joins the offer
  const tag = tagText(f, useLongTags);
  textStyle(BOLD);
  textSize(13);
  const tw = textWidth(tag) + 14;
  const th = min(20, r.h - 6);
  const tx = c.x + c.w - rowPadX - tw;
  const ty = midY - th / 2;
  if (core) {
    noStroke();
    fill(INDIGO);
    rect(tx, ty, tw, th, th / 2);
    fill('white');
  } else {
    stroke(inOffer ? CORRECT_GREEN : 'silver');
    strokeWeight(1);
    fill('white');
    rect(tx, ty, tw, th, th / 2);
    noStroke();
    fill(inOffer ? CORRECT_GREEN : 'gray');
  }
  textAlign(CENTER, CENTER);
  text(tag, tx + tw / 2, midY + 1);
  textStyle(NORMAL);
}

// Panel: tier name, three-zone meter, tier message, and the offer in one sentence
function drawPanel(scope) {
  const p = panelBox;
  const t = TIERS[tierFor(scope)];
  fill('white');
  stroke(t.color);
  strokeWeight(2);
  rect(p.x, p.y, p.w, p.h, 10);
  strokeWeight(1);

  const key = scope + '|' + canvasWidth;
  if (!panelCache || panelCache.key !== key) panelCache = { key: key, col: buildPanel(scope) };
  const col = panelCache.col;
  renderBlocks(col.blocks, col.x, col.y, col.w, scope);
}

// Build the panel's text and fit it. Candidates are tried in order, each at a few
// scales; the first that fits wins. Dropping order: the scope label, then the
// one-sentence offer, then the tier's second sentence.
function buildPanel(scope) {
  const p = panelBox;
  const inner = { x: p.x + 14, y: p.y + 12, w: p.w - 28, h: p.h - 22 };
  const t = TIERS[tierFor(scope)];
  const n = includedCount(scope);
  const sentence = OFFER_SENTENCES[n];
  const words = sentence.split(' ').length;

  const label = { kind: 'label', text: 'OFFER SCOPE: ' + scope + ' OF 100' };
  const name = { kind: 'name', text: t.name, color: t.color };
  const meter = { kind: 'meter' };
  const bodyFull = { kind: 'body', text: t.message + ' ' + tierExtra(scope) };
  const bodyMain = { kind: 'body', text: t.message };
  const quote = { kind: 'quote', runs: [
    { text: 'Jordan\'s offer in one sentence (' + words + ' words):', style: 'bold', color: AMBER_TEXT },
    { text: sentence }
  ] };

  const candidates = [
    [label, name, meter, bodyFull, quote],
    [name, meter, bodyFull, quote],
    [name, meter, bodyFull],
    [name, meter, bodyMain]
  ];
  const base = isWide ? 1.0 : 0.95;
  for (const items of candidates) {
    for (const s of [base, base - 0.05, base - 0.1]) {
      const laid = layoutItems(items, inner.w, s);
      if (laid.height <= inner.h) return { blocks: laid, x: inner.x, y: inner.y, w: inner.w };
    }
  }
  const last = candidates[candidates.length - 1];
  return { blocks: layoutItems(last, inner.w, 0.8), x: inner.x, y: inner.y, w: inner.w };
}

// Three-zone scope meter: Minimum Viable Offer 0-25, Initial Offer 26-50,
// Established Offering 51-100. The current zone is solid and a fox-orange pointer marks
// the current scope. Wide screens add 0 / 25 / 50 / 100 tick labels.
function drawMeter(scope, x, y, w) {
  const t = tierFor(scope);
  const barY = y + 11;
  const barH = 20;
  const xAt = v => x + w * v / 100;
  const bounds = [0, 25, 50, 100];
  textStyle(BOLD);
  textSize(13);
  // Zone names: full names if all three fit, otherwise the short names for all three
  // (dropping to 12px if a short name is still too wide)
  const zoneW = i => xAt(bounds[i + 1]) - xAt(bounds[i]) - 8;
  const useFull = TIERS.every((tier, i) => textWidth(tier.name) <= zoneW(i));
  if (!useFull && !TIERS.every((tier, i) => textWidth(tier.short) <= zoneW(i))) textSize(12);
  for (let i = 0; i < TIERS.length; i++) {
    const x0 = xAt(bounds[i]);
    const x1 = xAt(bounds[i + 1]);
    noStroke();
    fill(i === t ? TIERS[i].color : TIERS[i].tint);
    const left = i === 0 ? 6 : 0;
    const right = i === TIERS.length - 1 ? 6 : 0;
    rect(x0, barY, x1 - x0, barH, left, right, right, left);
    const zoneLabel = useFull ? TIERS[i].name : TIERS[i].short;
    if (textWidth(zoneLabel) <= zoneW(i)) {
      fill(i === t ? 'white' : 'dimgray');
      textAlign(CENTER, CENTER);
      text(zoneLabel, (x0 + x1) / 2, barY + barH / 2 + 1);
    }
  }
  // White gaps between the zones
  stroke('white');
  strokeWeight(2);
  line(xAt(25), barY, xAt(25), barY + barH);
  line(xAt(50), barY, xAt(50), barY + barH);
  strokeWeight(1);

  // Current scope: a fox-orange pointer whose tip touches the top of the bar
  const mx = xAt(scope);
  noStroke();
  fill(FOX_ORANGE);
  triangle(mx - 7, y, mx + 7, y, mx, y + 11);

  if (isWide) {
    textStyle(NORMAL);
    textSize(13);
    fill('dimgray');
    textAlign(CENTER, TOP);
    for (const v of [0, 25, 50, 100]) {
      const lbl = String(v);
      const half = textWidth(lbl) / 2;
      text(lbl, constrain(xAt(v), x + half, x + w - half), barY + barH + 4);
    }
  }
  textStyle(NORMAL);
}

function drawControlText(scope) {
  // Slider label and current value, left of the slider
  noStroke();
  fill('black');
  textStyle(BOLD);
  textSize(16);
  textAlign(LEFT, CENTER);
  text('Offer Scope: ' + scope, 10, drawHeight + 21);

  // What the ends of the slider mean, beside the Reset button
  textStyle(NORMAL);
  fill('dimgray');
  const x = 10 + resetButton.elt.offsetWidth + 14;
  const room = canvasWidth - x - 10;
  for (const [msg, s] of RANGE_HINTS) {
    textSize(s);
    if (textWidth(msg) <= room) {
      text(msg, x, drawHeight + 58);
      break;
    }
  }
}

// ---------- Text blocks ----------

// Base text size, style, color and space-before for each kind of item.
// Styles are the string values of p5's BOLD / NORMAL / ITALIC constants, because
// those constants are not defined yet when this top-level object is created.
const ITEM_STYLE = {
  label: { size: 14, style: 'bold',   color: 'dimgray', before: 0 },
  name:  { size: 22, style: 'bold',   color: 'black',   before: 2 },
  meter: { before: 10 },
  body:  { size: 16, style: 'normal', color: 'black',   before: 10 },
  quote: { size: 16, style: 'italic', color: 'black',   before: 12 }
};
const BOXED = { quote: { fill: QUOTE_FILL, bar: AMBER } };

// Lay out each item as wrapped lines of styled words at scale s.
// The meter is a fixed-height block drawn by drawMeter().
function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const st = ITEM_STYLE[it.kind];
    const before = blocks.length ? st.before * s : 0;
    if (it.kind === 'meter') {
      const h = isWide ? 48 : 32;
      blocks.push({ kind: 'meter', h: h, before: before });
      height += before + h;
      continue;
    }
    const size = st.size * s;
    const box = BOXED[it.kind];
    const indent = box ? 14 : 0;
    const pad = box ? 6 : 0;
    const runs = it.runs || [{ text: it.text }];
    const tokens = [];
    for (const r of runs) {
      for (const w of r.text.split(' ')) {
        if (w) tokens.push({ w: w, style: r.style || st.style, color: r.color || it.color || st.color });
      }
    }
    textSize(size);
    const lines = wrapTokens(tokens, maxW - indent - (box ? 8 : 0));
    textStyle(NORMAL);
    const spaceW = textWidth(' ');
    const lead = size * 1.3;
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

function renderBlocks(blocks, x, y, w, scope) {
  for (const b of blocks) {
    y += b.before;
    if (b.kind === 'meter') {
      drawMeter(scope, x, y, w);
      y += b.h;
      continue;
    }
    textAlign(LEFT, TOP);
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

// Reset strips the offer back to its essential core
function resetScope() {
  scopeSlider.value(0);
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
