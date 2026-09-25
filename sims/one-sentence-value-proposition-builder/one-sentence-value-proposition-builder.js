// One-Sentence Value Proposition Builder - p5.js MicroSim
// CANVAS_HEIGHT: 600
// Learners compose a one-sentence value proposition from four parts, chosen in four
// dropdowns: Target Customer, Core Benefit, Founder Advantage and Main Alternative.
// Each dropdown offers Jordan's wording (mobile dog grooming), Priya's wording (meal
// prep) and "Write your own", which reveals a text box beside the dropdown.
// The sentence "[Target Customer] gets [Core Benefit], from [Founder Advantage],
// unlike [Main Alternative]." is rebuilt live in the preview card on every change,
// wrapped to the card width, with each part in its own color. Missing parts stay as
// bracketed placeholders. The verb agrees with the customer ("parents get",
// "a nurse gets").
// Below the preview, formative feedback checks the sentence:
//   - how many of the four parts are filled in
//   - word count and read time at about 4 words per second (goal: under 10 seconds)
//   - one message, in priority order: missing parts, parts mixed from two founders,
//     generic words that any competitor could claim, too long, then next steps.
// Load Jordan's Version and Load Priya's Version fill all four dropdowns at once;
// Clear returns every dropdown to unset. All four dropdowns start unset.
// Wide screens (>= 560px): each role label sits left of its dropdown.
// Narrow screens (< 560px): each role label sits on its own line above its dropdown,
// the drawing area gets shorter, and the button labels shorten to fit.

// Canvas dimensions. The total height is fixed for the iframe; the split between the
// drawing area and the control area is recomputed for the layout in computeLayout().
let canvasWidth = 800;
let canvasHeight = 600;
let controlHeight = 212;  // wide: four dropdown rows + button row; narrow: 276
let drawHeight = canvasHeight - controlHeight;
let margin = 10;
let defaultTextSize = 16;
const WIDE_BREAK = 560;   // below this width the role labels move above the dropdowns
const FIELD_H = 32;       // height of every dropdown and text box
const MAX_OWN_CHARS = 70; // longest "Write your own" entry
const WORDS_PER_SECOND = 4;  // typical adult silent reading speed (about 240 words/min)

// Book palette
const INDIGO = '#3F51B5';        // Target Customer
const FOX_ORANGE = '#E8791A';    // bar on the preview card's left edge
const DARK_ORANGE = '#B25A10';   // Founder Advantage; "over 10 seconds" read time
const AMBER = '#FFB300';         // "close to 10 seconds" read time; warning bar
const CORRECT_GREEN = '#2E7D32'; // Core Benefit; "under 10 seconds"; success bar
const QUOTE_FILL = '#FFF8E1';    // pale amber behind warning messages
const ALT_PURPLE = 'darkmagenta';  // Main Alternative

// The four parts of the sentence, in sentence order. jordan and priya are the two
// founders' wording from the chapter; question is what the part answers for a stranger.
const PARTS = [
  { role: 'Target Customer', question: 'who is it for?',
    color: INDIGO,
    jordan: 'busy dog owners without easy groomer access',
    priya: 'dual-income parents on rotating shifts' },
  { role: 'Core Benefit', question: 'what do they get?',
    color: CORRECT_GREEN,
    jordan: 'grooming without losing an afternoon',
    priya: 'a real dinner without any advance planning' },
  { role: 'Founder Advantage', question: 'why you?',
    color: DARK_ORANGE,
    jordan: 'someone they already trust in the neighborhood',
    priya: 'someone who understands unpredictable schedules firsthand' },
  { role: 'Main Alternative', question: 'compared with what?',
    color: ALT_PURPLE,
    jordan: 'the booked-solid groomer across town',
    priya: 'another night of takeout' }
];

// Words that any competitor could claim (Chapter 8's "generic value statement" trap).
// Checked only in text the learner types.
const GENERIC_PHRASES = ['high quality', 'high-quality', 'great service', 'excellent service',
  'quality service', 'affordable', 'the best', 'world-class', 'world class', 'innovative',
  'cutting-edge', 'solutions', 'one-stop', 'everyone', 'everybody', 'anyone', 'anybody'];

// Verb agreement for the Target Customer ("parents get" / "a nurse gets")
const SINGULAR_STARTS = ['a', 'an', 'one', 'each', 'every', 'this', 'my', 'our'];
const HEAD_BREAKS = ['who', 'whose', 'that', 'which', 'with', 'without', 'on', 'in', 'at',
  'from', 'for', 'near', 'of', 'like', 'over', 'under', 'across', 'around', 'by', 'after',
  'before', 'during', 'between', 'within', 'outside', 'inside', 'living', 'working'];
const PLURAL_WORDS = ['people', 'children', 'men', 'women', 'folk', 'staff', 'personnel'];

// Controls
let selects = [];      // one dropdown per part
let inputs = [];       // one "Write your own" text box per part (hidden until chosen)
let jordanButton, priyaButton, clearButton;

// Layout, recomputed by computeLayout() on every resize or dropdown change
let isWide = true;
let labelRows = [];    // per part: {y} center of the role label
let fieldX = 10;       // wide: x where the dropdowns start
let cardBox = {}, statusBox = {}, msgBox = {};
let msgLines = 2;      // message lines reserved below the preview
let cache = null;      // laid-out sentence and feedback, rebuilt when anything changes

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  for (let i = 0; i < PARTS.length; i++) {
    const p = PARTS[i];
    const sel = createSelect();
    sel.option('Choose a ' + p.role.toLowerCase() + '…', '');
    sel.option(p.jordan, 'jordan');
    sel.option(p.priya, 'priya');
    sel.option('Write your own', 'own');
    styleField(sel, p.color);
    sel.changed(() => partChanged(i));
    selects.push(sel);

    const inp = createInput('', 'text');
    inp.attribute('placeholder', 'Type your own ' + p.role.toLowerCase());
    inp.attribute('maxlength', String(MAX_OWN_CHARS));
    inp.attribute('aria-label', 'Your own ' + p.role);
    styleField(inp, p.color);
    inp.input(invalidate);
    inp.hide();
    inputs.push(inp);
  }
  jordanButton = createButton('Load Jordan\'s Version');
  jordanButton.mousePressed(() => loadVersion('jordan'));
  priyaButton = createButton('Load Priya\'s Version');
  priyaButton.mousePressed(() => loadVersion('priya'));
  clearButton = createButton('Clear');
  clearButton.mousePressed(clearAll);
  // Larger button text so the controls are readable from the back of the room
  for (const b of [jordanButton, priyaButton, clearButton]) {
    b.style('font-size', '16px');
    b.style('padding', '4px 10px');
  }

  computeLayout();

  describe('A one-sentence value proposition builder. Four dropdowns, labeled Target ' +
    'Customer, Core Benefit, Founder Advantage and Main Alternative, each offer Jordan\'s ' +
    'mobile dog-grooming wording, Priya\'s meal-prep wording, or Write your own, which ' +
    'opens a text box. A preview card assembles the sentence "Target Customer gets Core ' +
    'Benefit, from Founder Advantage, unlike Main Alternative" as the choices change, ' +
    'with each part in its own color. Below it, the word count, an estimated read time ' +
    'against a ten-second goal, and a feedback message about missing parts, mixed ' +
    'founders, generic words, or length. Buttons load Jordan\'s or Priya\'s complete ' +
    'version or clear every choice.');
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

  if (!cache) cache = buildView();

  drawTitle();
  drawCard(cache.sentence);
  drawStatus(cache.status);
  drawMessage(cache.message);
  drawControlLabels();
}

// ---------- Sentence model ----------

// Collapse spaces and drop trailing punctuation, since the template adds its own
function cleanText(s) {
  return s.replace(/\s+/g, ' ').trim().replace(/[\s.,;:!?]+$/, '');
}

// Snapshot of the four parts: mode is '', 'jordan', 'priya' or 'own';
// text is '' while a part is still missing
function readParts() {
  return PARTS.map((p, i) => {
    const mode = selects[i].value();
    let text = '';
    if (mode === 'jordan' || mode === 'priya') text = p[mode];
    if (mode === 'own') text = cleanText(inputs[i].value());
    return { mode: mode, text: text };
  });
}

// "busy dog owners ... get" but "a night-shift nurse gets". The head noun is the word
// just before the first qualifier (who, with, on, ...), or the last word.
function verbFor(customer) {
  if (!customer) return 'gets';  // the spec's placeholder wording
  const words = customer.toLowerCase().split(' ');
  if (SINGULAR_STARTS.includes(words[0])) return 'gets';
  let head = words[words.length - 1];
  for (let k = 1; k < words.length; k++) {
    if (HEAD_BREAKS.includes(words[k])) {
      head = words[k - 1];
      break;
    }
  }
  head = head.replace(/[^a-z-]/g, '');
  const plural = PLURAL_WORDS.includes(head) ||
    (head.endsWith('s') && !/(ss|us|is)$/.test(head));
  return plural ? 'get' : 'gets';
}

// Build the sentence as unbreakable units (a word plus any punctuation glued to it).
// Each piece records its part (-1 for the template's own words) and whether it is a
// placeholder for a missing part.
function buildUnits(parts) {
  const units = [];
  const addWord = w => units.push({ pieces: [{ t: w, part: -1 }] });
  const addPart = (i, punct) => {
    const filled = parts[i].text !== '';
    const src = filled ? parts[i].text : '[' + PARTS[i].role + ']';
    // Break very long typed "words" so they cannot overflow the card
    let words = [];
    for (const w of src.split(' ')) {
      for (let k = 0; k < w.length; k += 24) words.push(w.slice(k, k + 24));
    }
    words.forEach((w, k) => {
      if (i === 0 && k === 0 && filled) w = w.charAt(0).toUpperCase() + w.slice(1);
      const u = { pieces: [{ t: w, part: i, placeholder: !filled }] };
      if (punct && k === words.length - 1) u.pieces.push({ t: punct, part: -1 });
      units.push(u);
    });
  };
  addPart(0);
  addWord(verbFor(parts[0].text));
  addPart(1, ',');
  addWord('from');
  addPart(2, ',');
  addWord('unlike');
  addPart(3, '.');
  return units;
}

function countWords(parts) {
  let n = 0;
  for (const p of parts) if (p.text) n += p.text.split(' ').length;
  // The template adds "get(s)", "from" and "unlike" once the sentence has any content
  return n > 0 ? n + 3 : 0;
}

function readSeconds(words) {
  return Math.ceil(words / WORDS_PER_SECOND);
}

// Read-time zone: green up to 8 seconds, amber 9-10, dark orange over 10
function readZone(seconds) {
  if (seconds <= 8) return { color: CORRECT_GREEN, textColor: 'white' };
  if (seconds <= 10) return { color: AMBER, textColor: 'black' };
  return { color: DARK_ORANGE, textColor: 'white' };
}

// Generic phrases in the learner's own text, in the order they appear (at most two)
function findGeneric(parts) {
  const found = [];
  for (const p of parts) {
    if (p.mode !== 'own' || !p.text) continue;
    const t = ' ' + p.text.toLowerCase().replace(/[^a-z\s-]/g, ' ') + ' ';
    const hits = GENERIC_PHRASES.map(g => ({ g: g, at: t.indexOf(' ' + g + ' ') }))
      .filter(h => h.at >= 0)
      .sort((a, b) => a.at - b.at);
    for (const h of hits) found.push('"' + h.g + '"');
  }
  return found.slice(0, 2);
}

function listJoin(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return items[0] + ' and ' + items[1];
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// The single feedback message, in priority order. kind picks the color:
// info (indigo), warn (amber) or good (green).
function feedbackFor(parts, words) {
  const filled = parts.filter(p => p.text).length;
  const chosen = parts.filter(p => p.mode !== '').length;
  if (chosen === 0) {
    return { kind: 'info', text: 'Choose a part in each dropdown below, or load Jordan\'s ' +
      'or Priya\'s version to see a finished sentence.' };
  }
  const emptyOwn = parts.findIndex(p => p.mode === 'own' && !p.text);
  if (emptyOwn >= 0) {
    return { kind: 'info', text: 'Type your own ' + PARTS[emptyOwn].role + ' in the box ' +
      'beside its dropdown. It answers "' + PARTS[emptyOwn].question + '"' };
  }
  const founders = new Set(parts.filter(p => p.mode === 'jordan' || p.mode === 'priya')
    .map(p => p.mode));
  if (founders.size > 1) {
    return { kind: 'warn', text: 'These parts mix Jordan\'s dog grooming with Priya\'s ' +
      'meal prep. Every part has to describe the same customer and the same offer.' };
  }
  if (filled < PARTS.length) {
    const missing = [];
    parts.forEach((p, i) => {
      if (!p.text) missing.push(PARTS[i].role + ' (' + PARTS[i].question + ')');
    });
    return { kind: 'info', text: 'Still missing: ' + listJoin(missing) + '.' };
  }
  const generic = findGeneric(parts);
  if (generic.length) {
    return { kind: 'warn', text: listJoin(generic) + ' could describe any competitor. ' +
      'Replace ' + (generic.length > 1 ? 'them' : 'it') +
      ' with the specific words your customer would use.' };
  }
  const secs = readSeconds(words);
  if (secs > 10) {
    return { kind: 'warn', text: 'Over ten seconds to read. Cut every word that doesn\'t ' +
      'change what the customer understands.' };
  }
  if (secs > 8) {
    return { kind: 'warn', text: 'Close to the ten-second limit. Try trimming the longest ' +
      'part by a few words.' };
  }
  for (const who of ['jordan', 'priya']) {
    if (parts.every(p => p.mode === who)) {
      const name = who === 'jordan' ? 'Jordan' : 'Priya';
      return { kind: 'good', text: 'This is ' + name + '\'s finished value proposition. ' +
        'Now choose Write your own in each dropdown and compose one for your idea.' };
    }
  }
  return { kind: 'good', text: 'Complete, and readable in under ten seconds. Next, run ' +
    'the five-second test on someone outside your circle.' };
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  controlHeight = isWide ? 212 : 276;
  drawHeight = canvasHeight - controlHeight;
  msgLines = canvasWidth >= 700 ? 2 : 3;

  // Drawing area, bottom up: message box, read-time status line, then the preview card
  const msgSize = isWide ? 16 : 15;
  const msgH = msgLines * msgSize * 1.3 + 14;
  msgBox = { x: margin, y: drawHeight - 10 - msgH, w: canvasWidth - 2 * margin, h: msgH };
  statusBox = { x: margin, y: msgBox.y - 32, w: canvasWidth - 2 * margin, h: 26 };
  const top = isWide ? 46 : 38;
  cardBox = { x: margin, y: top, w: canvasWidth - 2 * margin, h: statusBox.y - 8 - top };

  positionControls();
  cache = null;
}

function styleField(el, color) {
  el.style('font-size', '16px');  // 16px also stops phones zooming in on focus
  el.style('font-family', 'Arial, Helvetica, sans-serif');
  el.style('padding', '2px 6px');
  el.style('box-sizing', 'border-box');
  el.style('border', '2px solid ' + color);
  el.style('border-radius', '6px');
  el.style('background-color', 'white');
  el.style('color', 'black');
}

// Width of a dropdown that shows "Write your own" next to its text box
function ownSelectWidth() {
  textStyle(NORMAL);
  textSize(16);
  return Math.ceil(textWidth('Write your own')) + 42;  // padding, border and arrow
}

// One row of fields: the dropdown fills the row, or shrinks to make room for the
// "Write your own" text box
function placeRow(i, x, y, w) {
  if (selects[i].value() === 'own') {
    const sw = min(ownSelectWidth(), Math.floor(w * 0.45));
    selects[i].position(x, y);
    selects[i].size(sw, FIELD_H);
    inputs[i].position(x + sw + 6, y);
    inputs[i].size(w - sw - 6, FIELD_H);
    inputs[i].show();
  } else {
    selects[i].position(x, y);
    selects[i].size(w, FIELD_H);
    inputs[i].hide();
  }
}

function positionControls() {
  labelRows = [];
  let buttonsY;
  if (isWide) {
    // Role labels in a left column, dropdowns to their right
    textStyle(BOLD);
    textSize(16);
    let labelW = 0;
    for (const p of PARTS) labelW = max(labelW, textWidth(p.role));
    textStyle(NORMAL);
    fieldX = 10 + Math.ceil(labelW) + 14;
    for (let i = 0; i < PARTS.length; i++) {
      const y = drawHeight + 10 + i * 40;
      labelRows.push({ y: y + FIELD_H / 2 });
      placeRow(i, fieldX, y, canvasWidth - margin - fieldX);
    }
    buttonsY = drawHeight + 172;
  } else {
    // Role label on its own line, dropdown full width below it
    for (let i = 0; i < PARTS.length; i++) {
      const top = drawHeight + 6 + i * 57;
      labelRows.push({ y: top + 9 });
      placeRow(i, 10, top + 19, canvasWidth - 20);
    }
    buttonsY = drawHeight + 238;
  }

  // Buttons: the longest labels that fit on one row
  const labelSets = [
    ['Load Jordan\'s Version', 'Load Priya\'s Version', 'Clear'],
    ['Jordan\'s Version', 'Priya\'s Version', 'Clear'],
    ['Jordan\'s', 'Priya\'s', 'Clear']
  ];
  const buttons = [jordanButton, priyaButton, clearButton];
  for (const set of labelSets) {
    buttons.forEach((b, k) => b.html(set[k]));
    const total = buttons.reduce((s, b) => s + b.elt.offsetWidth, 0) + 16;
    if (total <= canvasWidth - 20) break;
  }
  let x = 10;
  for (const b of buttons) {
    b.position(x, buttonsY);
    x += b.elt.offsetWidth + 8;
  }
}

// Lay out everything that depends on the parts: the wrapped sentence, the read-time
// status line and the feedback message
function buildView() {
  const parts = readParts();
  const words = countWords(parts);
  const filled = parts.filter(p => p.text).length;
  return {
    sentence: fitSentence(buildUnits(parts)),
    status: buildStatus(filled, words),
    message: fitMessage(feedbackFor(parts, words))
  };
}

// Largest text size at which the sentence fits the card's text area
function fitSentence(units) {
  const box = sentenceBox();
  const maxS = isWide ? 28 : 20;
  const minS = 13;
  let laid = null;
  for (let s = maxS; s >= minS; s--) {
    laid = wrapUnits(units, s, box.w);
    laid.lead = s * 1.4;
    if (laid.lines.length * laid.lead <= box.h) break;
  }
  laid.box = box;
  return laid;
}

// Text area inside the preview card, below its small header (wide screens only;
// on narrow screens the title already names the card and every pixel goes to the text)
function sentenceBox() {
  const pad = isWide ? 18 : 12;
  const headerH = isWide ? 24 : 0;
  return { x: cardBox.x + pad + 6, y: cardBox.y + 8 + headerH,
    w: cardBox.w - 2 * pad - 6, h: cardBox.h - 8 - headerH - 10 };
}

// Greedy word wrap over units; measures every piece at size s
function wrapUnits(units, s, maxW) {
  textSize(s);
  textStyle(NORMAL);
  const spaceW = textWidth(' ');
  for (const u of units) {
    u.w = 0;
    for (const p of u.pieces) {
      textStyle(p.placeholder ? ITALIC : NORMAL);
      p.w = textWidth(p.t);
      u.w += p.w;
    }
  }
  textStyle(NORMAL);
  const lines = [];
  let line = [];
  let lineW = 0;
  for (const u of units) {
    const add = line.length ? spaceW + u.w : u.w;
    if (line.length && lineW + add > maxW) {
      lines.push(line);
      line = [u];
      lineW = u.w;
    } else {
      line.push(u);
      lineW += add;
    }
  }
  if (line.length) lines.push(line);
  return { lines: lines, size: s, spaceW: spaceW };
}

function buildStatus(filled, words) {
  if (filled < PARTS.length) {
    return { pill: filled + ' of 4', pillColor: 'white', pillText: INDIGO, outline: INDIGO,
      long: 'parts filled in' + (words ? ' · ' + words + ' words so far' : ''),
      short: 'parts' + (words ? ' · ' + words + ' words so far' : '') };
  }
  const secs = readSeconds(words);
  const z = readZone(secs);
  return { pill: '≈ ' + secs + ' s', pillColor: z.color, pillText: z.textColor, outline: null,
    long: words + ' words · about ' + secs + ' seconds to read · goal: under 10 seconds',
    short: words + ' words · goal: under 10 s' };
}

// Wrap the message into the reserved lines, shrinking the text if it needs more room
function fitMessage(m) {
  const w = msgBox.w - 26;
  let laid = null;
  for (let s = isWide ? 16 : 15; s >= 12; s--) {
    textSize(s);
    textStyle(NORMAL);
    laid = wrapWords(m.text, w);
    laid.size = s;
    laid.lead = s * 1.3;
    if (laid.lines.length * laid.lead <= msgBox.h - 12) break;
  }
  laid.kind = m.kind;
  return laid;
}

function wrapWords(str, maxW) {
  const lines = [];
  let line = '';
  for (const w of str.split(' ')) {
    const trial = line ? line + ' ' + w : w;
    if (line && textWidth(trial) > maxW) {
      lines.push(line);
      line = w;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return { lines: lines };
}

// ---------- Drawing ----------

function drawTitle() {
  const full = 'One-Sentence Value Proposition Builder';
  let s = isWide ? 24 : 20;
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textSize(s);
  while (s > 17 && textWidth(full) > canvasWidth - 20) textSize(--s);
  const title = textWidth(full) <= canvasWidth - 20 ? full : 'Value Proposition Builder';
  textAlign(CENTER, TOP);
  text(title, canvasWidth / 2, isWide ? 10 : 8);
}

// The preview card with the assembled sentence
function drawCard(L) {
  const c = cardBox;
  // Shadow, then the card with a fox-orange bar on its left edge
  noStroke();
  fill(0, 0, 0, 25);
  rect(c.x + 3, c.y + 4, c.w, c.h, 12);
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(c.x, c.y, c.w, c.h, 12);
  noStroke();
  fill(FOX_ORANGE);
  rect(c.x, c.y, 6, c.h, 12, 0, 0, 12);

  // Header (wide screens only)
  if (isWide) {
    noStroke();
    fill('dimgray');
    textStyle(BOLD);
    textSize(13);
    textAlign(LEFT, TOP);
    text('ONE-SENTENCE VALUE PROPOSITION', c.x + 24, c.y + 10);
    textStyle(NORMAL);
  }

  drawSentence(L);
}

// Draw the wrapped sentence, vertically centered in its box. Filled parts are drawn in
// their role color and underlined; missing parts are italic placeholders on a pale
// tint of the role color.
function drawSentence(L) {
  const b = L.box;
  textSize(L.size);
  textAlign(LEFT, TOP);
  const asc = textAscent();
  const blockH = L.lines.length * L.lead;
  let y = b.y + max(0, (b.h - blockH) / 2);
  for (const row of L.lines) {
    const ty = y + (L.lead - L.size) / 2;
    let x = b.x;
    let joined = false;  // true when the previous word ran on into this one
    for (let j = 0; j < row.length; j++) {
      const u = row[j];
      const next = row[j + 1];
      let px = x;
      for (let k = 0; k < u.pieces.length; k++) {
        const p = u.pieces[k];
        const last = k === u.pieces.length - 1;
        // Does this part continue with the next word on the same line?
        const joins = last && next && p.part >= 0 && next.pieces[0].part === p.part;
        const runW = p.w + (joins ? L.spaceW : 0);
        if (p.part >= 0 && p.placeholder) {
          // Pale band behind the placeholder, padded only at the run's outer ends
          const c = color(PARTS[p.part].color);
          c.setAlpha(30);
          noStroke();
          fill(c);
          const padL = joined && k === 0 ? 0 : 3;
          const padR = joins ? 0 : 3;
          rect(px - padL, ty - 2, runW + padL + padR, L.size + 6);
        } else if (p.part >= 0) {
          stroke(PARTS[p.part].color);
          strokeWeight(isWide ? 2 : 1.5);
          const uy = ty + asc + 3;
          line(px, uy, px + runW, uy);
        }
        noStroke();
        fill(p.part >= 0 ? PARTS[p.part].color : 'black');
        textStyle(p.placeholder ? ITALIC : NORMAL);
        text(p.t, px, ty);
        px += p.w;
        if (last) joined = joins;
      }
      x += u.w + L.spaceW;
    }
    y += L.lead;
  }
  strokeWeight(1);
  textStyle(NORMAL);
}

// Read-time line: a pill (parts filled, or estimated seconds) then the word count
function drawStatus(st) {
  const b = statusBox;
  textStyle(BOLD);
  textSize(15);
  const pw = textWidth(st.pill) + 22;
  if (st.outline) {
    stroke(st.outline);
    strokeWeight(1.5);
  } else {
    noStroke();
  }
  fill(st.pillColor);
  rect(b.x, b.y, pw, b.h, b.h / 2);
  strokeWeight(1);
  noStroke();
  fill(st.pillText);
  textAlign(CENTER, CENTER);
  text(st.pill, b.x + pw / 2, b.y + b.h / 2 + 1);

  textStyle(NORMAL);
  fill('black');
  textAlign(LEFT, CENTER);
  const room = b.w - pw - 10;
  let msg = st.long;
  textSize(15);
  if (textWidth(msg) > room) msg = st.short;
  if (textWidth(msg) > room) textSize(13);
  text(msg, b.x + pw + 10, b.y + b.h / 2 + 1);
}

// Feedback message box, colored by kind
function drawMessage(M) {
  const b = msgBox;
  const styles = {
    info: { fill: 'lavender', bar: INDIGO },
    warn: { fill: QUOTE_FILL, bar: AMBER },
    good: { fill: 'honeydew', bar: CORRECT_GREEN }
  };
  const st = styles[M.kind];
  noStroke();
  fill(st.fill);
  rect(b.x, b.y, b.w, b.h, 8);
  fill(st.bar);
  rect(b.x, b.y, 6, b.h, 8, 0, 0, 8);

  fill('black');
  textStyle(NORMAL);
  textSize(M.size);
  textAlign(LEFT, TOP);
  const blockH = M.lines.length * M.lead;
  let y = b.y + (b.h - blockH) / 2 + (M.lead - M.size) / 2;
  for (const ln of M.lines) {
    noStroke();
    text(ln, b.x + 16, y);
    y += M.lead;
  }
}

// Role labels in the control area, each in its part's color. Wide screens stack the
// role name over its question; narrow screens put both on one line.
function drawControlLabels() {
  for (let i = 0; i < PARTS.length; i++) {
    const p = PARTS[i];
    const y = labelRows[i].y;
    noStroke();
    textAlign(LEFT, CENTER);
    if (isWide) {
      fill(p.color);
      textStyle(BOLD);
      textSize(16);
      text(p.role, 10, y - 7);
      fill('dimgray');
      textStyle(NORMAL);
      textSize(13);
      text(p.question, 10, y + 10);
    } else {
      fill(p.color);
      textStyle(BOLD);
      textSize(15);
      text(p.role, 10, y);
      const w = textWidth(p.role);
      fill('dimgray');
      textStyle(NORMAL);
      textSize(14);
      if (10 + w + 8 + textWidth('· ' + p.question) <= canvasWidth - 10) {
        text('· ' + p.question, 10 + w + 8, y);
      }
    }
  }
  textStyle(NORMAL);
}

// ---------- Interaction ----------

function invalidate() {
  cache = null;
}

// A dropdown changed: show or hide its text box, then rebuild the sentence
function partChanged(i) {
  positionControls();
  invalidate();
  if (selects[i].value() === 'own') inputs[i].elt.focus();
}

// Fill all four dropdowns with one founder's wording. Typed text is kept, so
// choosing Write your own again brings it back.
function loadVersion(who) {
  for (const s of selects) s.elt.value = who;
  positionControls();
  invalidate();
}

// Return every dropdown to unset and empty every text box
function clearAll() {
  for (let i = 0; i < PARTS.length; i++) {
    selects[i].elt.value = '';
    inputs[i].value('');
  }
  positionControls();
  invalidate();
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
