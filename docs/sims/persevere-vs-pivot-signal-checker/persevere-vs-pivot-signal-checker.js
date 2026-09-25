// Persevere vs Pivot Signal Checker - p5.js MicroSim
// CANVAS_HEIGHT: 600
// Three checkboxes hold the three validation evidence signals: Problem Validated?,
// Solution Got Payment Signals?, and Customer Definition Confirmed? The verdict panel
// updates the moment a signal changes, using a lookup table keyed on the three on/off
// states: Persevere (green), one of three pivots (fox orange), or Kill (gray). Each
// verdict comes with a one-sentence justification and a Keep / Change / Retest chip
// for each canvas element, so the learner sees what the evidence says to keep.
//
// Three ways to use it:
// 1. Explore: flip the signals and watch the verdict change. The card on the left
//    (top on phones) states the bar each signal has to clear.
// 2. Load Priya's Evidence: a worked example. Priya's evidence is set, annotated line by
//    line, and justified: the problem and customer are validated, the payment signal is
//    weak, so the verdict is Pivot the Solution.
// 3. Try a Scenario: four practice ventures. The learner reads the evidence, checks
//    only the signals whose evidence clears the bar, then clicks Check My Reading.
//    Each signal gets green (read honestly) or amber (misread) feedback with the reason,
//    and the panel shows the verdict the evidence actually supports.
// Loading a scenario turns all signals off; Reset returns to Explore with all signals off.
// Wide screens (>= 700px): card on the left, verdict panel on the right, the three
// checkboxes in one row. Narrow screens: card above the panel, checkboxes stacked.

// Canvas dimensions. controlHeight and drawHeight are recomputed in computeLayout()
// because narrow screens stack the checkboxes; their sum is always canvasHeight.
let canvasWidth = 800;
let drawHeight = 522;
let controlHeight = 78;   // one checkbox row + one button row on wide screens
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;
const WIDE_BREAK = 700;   // below this width the verdict panel moves under the card
const CB_ROW = 28;        // height of one checkbox row in the control area
const BTN_ROW = 36;       // height of one button row in the control area

// Book palette plus feedback colors
const INDIGO = '#3F51B5';        // a signal you have switched on
const FOX_ORANGE = '#E8791A';    // pivot verdicts (borders and fills)
const DARK_ORANGE = '#B25A10';   // pivot verdict text (readable on white)
const AMBER = '#FFB300';         // misread-signal mark
const AMBER_TEXT = '#8A5A00';    // amber that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // persevere verdict, honest-reading feedback
const PALE_GREEN = '#E8F5E9';    // KEEP chip fill
const PALE_ORANGE = '#FFF3E0';   // CHANGE chip fill

// The three evidence signals, in checkbox order. bar is the full standard of evidence
// (shown in Explore); barShort is the one-line reminder shown on scenario cards.
const SIGNALS = [
  { name: 'Problem Validated?', element: 'Problem',
    bar: 'Target customers raise the pain without being prompted and rank it a priority.',
    barShort: 'Bar: raised unprompted and ranked a priority.' },
  { name: 'Solution Got Payment Signals?', element: 'Solution',
    bar: 'Money changed hands, even a small deposit. Likes and "sounds great!" don\'t count.',
    barShort: 'Bar: money changed hands; interest doesn\'t count.' },
  { name: 'Customer Definition Confirmed?', element: 'Customer',
    bar: 'The people who felt the pain or paid match the target customer you defined.',
    barShort: 'Bar: responders match the defined target customer.' }
];

// Colors for the three kinds of verdict
const VERDICT_TYPES = {
  persevere: { text: CORRECT_GREEN, border: CORRECT_GREEN },
  pivot:     { text: DARK_ORANGE,   border: FOX_ORANGE },
  kill:      { text: 'dimgray',     border: 'gray' }
};

// The decision lookup. Key = Problem, Solution, Customer as 1 (on) or 0 (off).
// change = index of the element the pivot changes (0 problem, 1 solution, 2 customer).
// All-off is a Kill rather than Pivot the Problem, because nothing has evidence behind it.
// 100 is not named in the chapter's rules; it is treated as Pivot the Customer, because
// the customer has to be pinned down before a new offer can be tested on anyone.
const DECISIONS = {
  '111': { type: 'persevere', name: 'Persevere', change: -1,
    sentence: 'Evidence supports the concept largely as designed.',
    why: 'Every element has evidence behind it, including money that changed hands. Keep going and set the next validation milestone.' },
  '101': { type: 'pivot', name: 'Pivot the Solution', change: 1,
    sentence: 'Keep the validated problem and customer, redesign the offer.',
    why: 'The pain and the people are real; only the offer failed to earn money. Change the offer, not the whole idea.' },
  '110': { type: 'pivot', name: 'Pivot the Customer', change: 2,
    sentence: 'The offer works for somebody, but maybe not this target customer. Revisit Chapter 4.',
    why: 'People paid, but not the people you defined. Find out who bought and why, then redefine the target customer.' },
  '100': { type: 'pivot', name: 'Pivot the Customer', change: 2,
    sentence: 'The pain is real, but you haven\'t confirmed who feels it most. Revisit Chapter 4.',
    why: 'Only the problem has evidence. Pin down exactly who has this pain before redesigning the offer, then retest the offer with them.' },
  '011': { type: 'pivot', name: 'Pivot the Problem', change: 0,
    sentence: 'The customer may be real, but this isn\'t their priority pain. Revisit Chapter 5.',
    why: 'Your target customers pay, but they don\'t rank this pain first. Find the pain that is really driving the purchase.' },
  '010': { type: 'pivot', name: 'Pivot the Problem', change: 0,
    sentence: 'The customer may be real, but this isn\'t their priority pain. Revisit Chapter 5.',
    why: 'Someone paid, but with no validated problem or customer you can\'t say why. One lucky sale is not validation.' },
  '001': { type: 'pivot', name: 'Pivot the Problem', change: 0,
    sentence: 'The customer may be real, but this isn\'t their priority pain. Revisit Chapter 5.',
    why: 'The right people showed up, but the pain you picked isn\'t the one they rank first. Ask what they would pay to fix.' },
  '000': { type: 'kill', name: 'Kill Decision', change: -1,
    sentence: 'See Chapter 10. No part of the current concept has evidence behind it yet.',
    why: 'Nothing has cleared its bar. Stopping now is validated learning, not failure.' }
};

// Keep / Change / Retest / Stop chips, one per canvas element
const CHIP_STYLES = {
  KEEP:   { fill: PALE_GREEN,   border: CORRECT_GREEN, text: CORRECT_GREEN },
  CHANGE: { fill: PALE_ORANGE,  border: FOX_ORANGE,    text: DARK_ORANGE },
  RETEST: { fill: 'white',      border: 'silver',      text: 'dimgray' },
  STOP:   { fill: 'whitesmoke', border: 'gray',        text: 'dimgray' }
};

// Scenario 0 is Priya's worked example; 1-4 are practice scenarios.
// honest = the reading the evidence supports (Problem, Solution, Customer).
// reasons explain each signal's honest reading; why justifies the verdict.
const SCENARIOS = [
  { title: 'Priya\'s meal-prep subscription', worked: true, honest: '101',
    evidence: [
      'Parents on rotating shifts described skipped dinners 3 to 5 nights a week before she asked.',
      'Only 1 of 10 families said yes to a weekly subscription that needs meals planned in advance.',
      'The parents who felt it most were her target: dual-income parents of kids under 10 on unpredictable shifts.'
    ],
    reasons: [
      'the pain came up unprompted, and often.',
      '1 yes in 10 is a weak payment signal.',
      'the pain showed up in the exact customer she defined.'
    ],
    why: 'The pain and the people are real. Only the offer failed, because it asked for planning that shift work can\'t support. Keep both and redesign the offer.' },
  { title: 'Jordan\'s driveway grooming test', honest: '111',
    evidence: [
      '4 of 5 neighbors brought up the 40-minute drive to the groomer before Jordan mentioned it.',
      '3 of 5 paid $40 for a driveway session. His bar, set in advance, was 2 of 5.',
      'All 3 who paid were busy dog owners within 5 miles, the customer he defined.'
    ],
    reasons: [
      'they raised the pain themselves.',
      'real money, and it cleared the bar set in advance.',
      'the buyers match his target customer.'
    ],
    why: 'Every element has evidence behind it, including money that changed hands. Jordan keeps going as designed and sets his next validation milestone.' },
  { title: 'Ana\'s closet-organizing service', honest: '001',
    evidence: [
      'Parents called messy closets "annoying" but ranked them last of 6 household frustrations.',
      'Her post got 15 likes and 4 "love this!" comments. Nobody paid the $20 deposit.',
      'Everyone who replied matched her target: dual-income parents in her zip code.'
    ],
    reasons: [
      'real, but not a priority pain.',
      'likes and comments cost nothing.',
      'the right people showed up.'
    ],
    why: 'Ana found the right customer, but not a pain they would pay to fix. She should ask what they rank first and reframe the problem. Revisit Chapter 5.' },
  { title: 'Theo\'s healthy lunch delivery', honest: '110',
    evidence: [
      '8 of 10 people he interviewed said, unprompted, that they skip lunch on busy days.',
      '7 people prepaid $30 for a week of lunches.',
      'Theo targeted downtown office workers, but 6 of the 7 buyers were hospital night-shift nurses.'
    ],
    reasons: [
      'the pain came up unprompted.',
      'seven prepayments are real money.',
      'the buyers are not the customer he defined.'
    ],
    why: 'The offer works for somebody, just not the office workers Theo targeted. He should learn why the nurses bought and redefine his target customer. Revisit Chapter 4.' },
  { title: 'Ben\'s houseplant-care subscription', honest: '000',
    evidence: [
      '1 of 12 people mentioned dying plants, and only after Ben asked, "Don\'t you hate it when plants die?"',
      'His landing page got 40 visits and 9 "cool idea!" comments, but zero preorders.',
      'Replies came from students, retirees, and one office manager, with no clear pattern.'
    ],
    reasons: [
      'a leading question, and only 1 of 12.',
      'comments are interest, not payment.',
      'no group of customers stands out.'
    ],
    why: 'Nothing cleared its bar. Stopping now is validated learning, not failure: Ben takes what he learned into his next idea. See Chapter 10.' }
];

// App state
let mode = 'explore';          // 'explore' or 'scenario'
let current = 0;               // index into SCENARIOS while in scenario mode
let touched = false;           // has a signal been changed since this mode or scenario began?
let checked = false;           // is the current scenario's reading being shown as checked?
let checkedReading = '000';    // the signal key at the moment of checking
let learnerChecked = false;    // false when the worked example was loaded pre-checked
let practiceOrder = [1, 2, 3, 4];
let practiceResults = [null, null, null, null];  // first-check result per practice slot
let practicePos = 0;           // current slot in practiceOrder

// Layout, recomputed by computeLayout() on every resize
let isWide = true;
let contentTop = 46;           // top of the card and panel
let contentBottom = 508;       // bottom of the card and panel
let actionButtonMaxW = 150;    // widest label the action button can show
let fitCache = null;           // card and panel boxes plus their fitted text
const widthCache = new Map();  // measured word widths, keyed by size, style and word

let signalBoxes = [];
let priyaButton, actionButton, resetButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create every control before anything positions them
  for (const s of SIGNALS) {
    const cb = createCheckbox(s.name, false);
    cb.changed(onSignalChange);
    signalBoxes.push(cb);
  }
  priyaButton = createButton('Load Priya\'s Evidence');
  priyaButton.mousePressed(loadPriya);
  actionButton = createButton('Try a Scenario');
  actionButton.mousePressed(onAction);
  resetButton = createButton('Reset');
  resetButton.mousePressed(resetAll);

  // Larger text so the controls are readable from the back of the room
  for (const cb of signalBoxes) {
    cb.style('font-size', '16px');
    cb.style('white-space', 'nowrap');
    const box = cb.elt.querySelector('input');
    if (box) {
      box.style.accentColor = INDIGO;
      box.style.width = '18px';
      box.style.height = '18px';
      box.style.verticalAlign = 'middle';
      box.style.margin = '0 6px 0 0';
    }
    cb.position(0, 0);  // absolute positioning lets offsetWidth report the real width
  }
  for (const b of [priyaButton, actionButton, resetButton]) {
    b.style('font-size', '16px');
  }

  computeLayout();

  describe('A persevere, pivot, or kill decision checker with three evidence signals: ' +
    'Problem Validated, Solution Got Payment Signals, and Customer Definition Confirmed. ' +
    'Checking and unchecking the signals updates a verdict panel: Persevere in green, ' +
    'Pivot the Solution, Pivot the Customer or Pivot the Problem in orange, or Kill ' +
    'Decision in gray, with a reason and a keep or change tag for each element. A Load ' +
    'Priya\'s Evidence button shows a worked example, and Try a Scenario offers four ' +
    'practice ventures in which the learner judges each line of evidence and gets ' +
    'feedback on each signal.');
}

function draw() {
  updateCanvasSize();
  if (canvasWidth !== width) {
    // The container changed size without a window resize event
    resizeCanvas(canvasWidth, canvasHeight);
    computeLayout();
  }

  // Drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Control region
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  const f = fitContent();
  drawTitle();
  drawCard(f);
  drawPanel(f);
}

// ---------- Decision model ----------

function currentKey() {
  return signalBoxes.map(cb => (cb.checked() ? '1' : '0')).join('');
}

// Chip for element i under the verdict for key: KEEP what has evidence, CHANGE the
// element the pivot names, RETEST anything else. A kill stops everything.
function chipStatus(key, i) {
  const d = DECISIONS[key];
  if (d.type === 'kill') return 'STOP';
  if (i === d.change) return 'CHANGE';
  return key[i] === '1' ? 'KEEP' : 'RETEST';
}

function countMisses(a, b) {
  let n = 0;
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) n++;
  return n;
}

// ---------- Layout ----------

function computeLayout() {
  isWide = canvasWidth >= WIDE_BREAK;
  positionControls();
  drawHeight = canvasHeight - controlHeight;
  contentTop = isWide ? 46 : 36;
  contentBottom = drawHeight - (isWide ? 14 : 8);
  fitCache = null;
}

// Buttons get slimmer padding on phones so the two main buttons share one row.
// The action button is measured at its widest label so rows never jump when it changes.
function measureButtons() {
  const pad = canvasWidth < 500 ? '4px 8px' : '4px 12px';
  for (const b of [priyaButton, actionButton, resetButton]) b.style('padding', pad);
  actionButtonMaxW = 0;
  for (const label of ['Try a Scenario', 'Check My Reading', 'Next Scenario', 'Try Again']) {
    actionButton.html(label);
    actionButtonMaxW = max(actionButtonMaxW, actionButton.elt.offsetWidth);
  }
  actionButton.html(actionLabel());
}

// Checkboxes flow left to right and wrap; buttons flow on the rows below them.
// When the checkboxes are stacked one per row, Reset moves to the right end of the
// first checkbox row to save a row. controlHeight grows to hold the rows used.
function positionControls() {
  measureButtons();
  const cbGap = 18;
  const btnGap = canvasWidth < 500 ? 8 : 10;
  const right = canvasWidth - 10;

  const cbW = signalBoxes.map(cb => cb.elt.offsetWidth);
  const cbSlots = [];
  let row = 0, x = 10;
  for (let i = 0; i < 3; i++) {
    if (x > 10 && x + cbW[i] > right) {
      row++;
      x = 10;
    }
    cbSlots.push({ x, row });
    x += cbW[i] + cbGap;
  }
  const cbRows = row + 1;
  const resetW = resetButton.elt.offsetWidth;
  const resetBeside = cbRows === 3 && 10 + cbW[0] + 16 + resetW <= right;

  // Plan the button rows with the widest action label; place them with actual widths
  const btns = resetBeside ? [priyaButton, actionButton] : [priyaButton, actionButton, resetButton];
  const planW = btns.map(b => (b === actionButton ? actionButtonMaxW : b.elt.offsetWidth));
  const btnSlots = [];
  row = 0;
  x = 10;
  let placeX = 10;
  for (let i = 0; i < btns.length; i++) {
    if (x > 10 && x + planW[i] > right) {
      row++;
      x = 10;
      placeX = 10;
    }
    btnSlots.push({ x: placeX, row });
    x += planW[i] + btnGap;
    placeX += btns[i].elt.offsetWidth + btnGap;
  }
  const btnRows = row + 1;

  controlHeight = 8 + cbRows * CB_ROW + 4 + btnRows * BTN_ROW + 2;
  const dh = canvasHeight - controlHeight;
  for (let i = 0; i < 3; i++) {
    signalBoxes[i].position(cbSlots[i].x, dh + 10 + cbSlots[i].row * CB_ROW);
  }
  if (resetBeside) resetButton.position(right - resetW, dh + 5);
  const btnTop = dh + 8 + cbRows * CB_ROW + 4;
  for (let i = 0; i < btns.length; i++) {
    btns[i].position(btnSlots[i].x, btnTop + btnSlots[i].row * BTN_ROW + 2);
  }
}

// Card and panel boxes plus their fitted text, rebuilt only when the state changes.
// Wide screens split side by side. Narrow screens stack the card above the panel and
// try several splits, keeping the one that lets both show the most at the largest size.
function fitContent() {
  const key = stateKey();
  if (fitCache && fitCache.key === key) return fitCache;
  const cardC = cardCandidates();
  const panelC = panelCandidates();
  let best;
  if (isWide) {
    const inner = canvasWidth - 3 * margin;
    const cardW = Math.round(inner * 0.55);
    const h = contentBottom - contentTop;
    const cardBox = { x: margin, y: contentTop, w: cardW, h };
    const panelBox = { x: 2 * margin + cardW, y: contentTop, w: inner - cardW, h };
    best = { cardBox, panelBox, card: fitBlocks(cardC, cardBox), panel: fitBlocks(panelC, panelBox, 10) };
  } else {
    const gap = 8;
    const avail = contentBottom - contentTop - gap;
    const w = canvasWidth - 20;
    for (let r = 0.44; r <= 0.761; r += 0.04) {
      const ch = Math.round(avail * r);
      const cardBox = { x: 10, y: contentTop, w, h: ch };
      const panelBox = { x: 10, y: contentTop + ch + gap, w, h: avail - ch };
      const card = fitBlocks(cardC, cardBox);
      const panel = fitBlocks(panelC, panelBox, 10);
      const cost = max(card.rank, panel.rank) * 1000 + card.rank + panel.rank;
      if (!best || cost < best.cost) best = { cost, cardBox, panelBox, card, panel };
    }
  }
  best.key = key;
  fitCache = best;
  return best;
}

// ---------- Drawing ----------

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(isWide ? 24 : 20);
  text('Persevere vs Pivot Signal Checker', canvasWidth / 2, isWide ? 10 : 8);
}

// The card: the bar for each signal (Explore) or a scenario's evidence
function drawCard(f) {
  const c = f.cardBox;
  const sc = SCENARIOS[current];
  let border = 'silver';
  let weight = 1;
  if (mode === 'scenario' && checked && (learnerChecked || !sc.worked)) {
    border = checkedReading === sc.honest ? CORRECT_GREEN : AMBER;
    weight = 3;
  }
  noStroke();
  fill(0, 0, 0, 20);
  rect(c.x + 2, c.y + 3, c.w, c.h, 12);
  fill('white');
  stroke(border);
  strokeWeight(weight);
  rect(c.x, c.y, c.w, c.h, 12);
  strokeWeight(1);

  renderBlocks(f.card.blocks, f.card.x, f.card.y, f.card.w, f.card.s);
}

// Verdict panel: colored left strip and border in the verdict's color
function drawPanel(f) {
  const p = f.panelBox;
  const color = panelColor();
  noStroke();
  fill(0, 0, 0, 20);
  rect(p.x + 2, p.y + 3, p.w, p.h, 12);
  fill('white');
  stroke(color);
  strokeWeight(color === 'silver' ? 1 : 3);
  rect(p.x, p.y, p.w, p.h, 12);
  strokeWeight(1);
  if (color !== 'silver') {
    noStroke();
    fill(color);
    rect(p.x + 1.5, p.y + 12, 7, p.h - 24, 3);
  }

  renderBlocks(f.panel.blocks, f.panel.x, f.panel.y, f.panel.w, f.panel.s);
}

// Border color of the verdict panel: the verdict on display, or silver for a prompt
function panelColor() {
  if (mode === 'scenario' && checked) {
    return VERDICT_TYPES[DECISIONS[SCENARIOS[current].honest].type].border;
  }
  if (!touched) return 'silver';
  return VERDICT_TYPES[DECISIONS[currentKey()].type].border;
}

function stateKey() {
  return [canvasWidth, drawHeight, mode, current, touched, checked, checkedReading,
    learnerChecked, currentKey(), practicePos, practiceResults.join(',')].join('|');
}

// ---------- Card and panel content ----------

// Each candidate is a list of text items; fitBlocks() uses the first one that fits.
function cardCandidates() {
  if (mode === 'explore') {
    const rows = (inline) => SIGNALS.map((s, i) => {
      const on = signalBoxes[i].checked();
      const headColor = on ? INDIGO : 'black';
      if (inline) {
        return { kind: 'row', mark: on ? 'on' : 'off', paras: [
          { kind: 'evidence', runs: [{ text: s.element + ':', style: 'bold', color: headColor }, { text: s.bar }] }
        ] };
      }
      return { kind: 'row', mark: on ? 'on' : 'off', paras: [
        { kind: 'head', text: s.name, color: headColor },
        { kind: 'evidence', text: s.bar }
      ] };
    });
    const label = { kind: 'label', text: 'THE BAR EACH SIGNAL MUST CLEAR' };
    const hint = { kind: 'hint', text: 'See it applied: click Load Priya\'s Evidence. Judge on your own: click Try a Scenario.' };
    return [
      [label, ...rows(false), hint],
      [label, ...rows(false)],
      [label, ...rows(true)]
    ];
  }

  const sc = SCENARIOS[current];
  const done = practiceResults.filter(r => r !== null);
  const honestCount = done.filter(r => r).length;
  const header = sc.worked ? 'WORKED EXAMPLE' : 'PRACTICE ' + (practicePos + 1) + ' OF ' + practiceOrder.length;
  const tallyLong = done.length ? 'Honest: ' + honestCount + ' of ' + done.length : null;
  const label = { kind: 'label', text: header, right: sc.worked ? null : tallyLong, rightColor: CORRECT_GREEN };
  const title = { kind: 'title', text: sc.title };
  const reading = checked ? checkedReading : currentKey();
  const annotate = checked && !learnerChecked && sc.worked;   // worked example as loaded

  // variant: 0 = head, bar, evidence; 1 = head, evidence; 2 = bold element name inline;
  // 3 = checked only, head and feedback note without the evidence text
  const rows = (variant) => SIGNALS.map((s, i) => {
    const honestOn = sc.honest[i] === '1';
    const matched = reading[i] === sc.honest[i];
    let mark;
    if (!checked) mark = reading[i] === '1' ? 'on' : 'off';
    else if (annotate) mark = honestOn ? 'on' : 'off';
    else mark = matched ? 'right' : 'wrong';
    const headColor = mark === 'on' ? INDIGO : 'black';
    const paras = [];
    if (variant === 2) {
      paras.push({ kind: 'evidence', runs: [
        { text: s.element + ':', style: 'bold', color: headColor }, { text: sc.evidence[i] }] });
    } else {
      paras.push({ kind: 'head', text: s.name, color: headColor });
      if (variant === 0) paras.push({ kind: 'bar', text: s.barShort });
      if (variant !== 3) paras.push({ kind: 'evidence', text: sc.evidence[i] });
    }
    if (checked) {
      let noteColor;
      if (annotate) noteColor = honestOn ? CORRECT_GREEN : DARK_ORANGE;
      else noteColor = matched ? CORRECT_GREEN : AMBER_TEXT;
      paras.push({ kind: 'note', runs: [
        { text: honestOn ? 'Counts:' : 'Doesn\'t count:', style: 'bold', color: noteColor },
        { text: sc.reasons[i], style: 'normal', color: noteColor }] });
    }
    return { kind: 'row', mark, paras };
  });

  const list = [
    [label, title, ...rows(0)],
    [label, title, ...rows(1)],
    [label, title, ...rows(2)]
  ];
  if (checked) list.push([label, title, ...rows(3)]);
  return list;
}

function panelCandidates() {
  const key = currentKey();
  const d = DECISIONS[key];
  const dColor = VERDICT_TYPES[d.type].text;

  if (mode === 'explore') {
    if (!touched) {
      const label = { kind: 'label', text: 'VERDICT' };
      const prompt = { kind: 'heading', text: 'Set your evidence signals below.', color: 'dimgray' };
      const body = { kind: 'body', text: 'Check a signal only when real evidence clears its bar. The verdict updates the moment you change one.' };
      // Color key for the three kinds of verdict
      const legend = [
        { kind: 'label', text: 'THREE KINDS OF VERDICT' },
        { kind: 'row', mark: 'persevere', paras: [{ kind: 'evidence', runs: [
          { text: 'Persevere:', style: 'bold', color: CORRECT_GREEN }, { text: 'every signal has evidence.' }] }] },
        { kind: 'row', mark: 'pivot', paras: [{ kind: 'evidence', runs: [
          { text: 'Pivot:', style: 'bold', color: DARK_ORANGE }, { text: 'keep what has evidence, change one element.' }] }] },
        { kind: 'row', mark: 'kill', paras: [{ kind: 'evidence', runs: [
          { text: 'Kill:', style: 'bold', color: 'dimgray' }, { text: 'nothing has evidence behind it yet.' }] }] }
      ];
      return [[label, prompt, body, ...legend], [label, prompt, body], [label, prompt]];
    }
    const label = { kind: 'label', text: 'VERDICT' };
    const name = { kind: 'heading', text: d.name, color: dColor };
    const sentence = { kind: 'body', text: d.sentence, style: 'bold' };
    const why = { kind: 'body', text: d.why };
    const chips = { kind: 'chips', key };
    return [
      [label, name, sentence, why, chips],
      [label, name, sentence, chips],
      [label, name, sentence, why],
      [label, name, sentence]
    ];
  }

  const sc = SCENARIOS[current];
  if (!checked) {
    if (!touched) {
      const label = { kind: 'label', text: 'YOUR TASK' };
      const body = { kind: 'body', text: 'Judge each line of evidence against its bar. Check a signal below only if its evidence clears the bar.' };
      const hint = { kind: 'hint', text: 'Then click Check My Reading. Leaving every signal unchecked is also a reading.' };
      return [[label, body, hint], [label, body]];
    }
    const label = { kind: 'label', text: 'YOUR READING POINTS TO' };
    const name = { kind: 'heading', text: d.name, color: dColor };
    const sentence = { kind: 'body', text: d.sentence, style: 'bold' };
    const chips = { kind: 'chips', key };
    const hint = { kind: 'hint', text: 'Sure of your reading? Click Check My Reading.' };
    return [
      [label, name, sentence, chips, hint],
      [label, name, sentence, chips],
      [label, name, sentence]
    ];
  }

  // Checked: the verdict the evidence supports, with feedback on the learner's reading
  const h = DECISIONS[sc.honest];
  const hColor = VERDICT_TYPES[h.type].text;
  const supports = { kind: 'label', text: 'THE EVIDENCE SUPPORTS' };
  const name = { kind: 'heading', text: h.name, color: hColor };
  const why = { kind: 'body', text: sc.why };
  const chips = { kind: 'chips', key: sc.honest };
  if (sc.worked && !learnerChecked) {
    const sentence = { kind: 'body', text: h.sentence, style: 'bold' };
    return [
      [supports, name, sentence, why, chips],
      [supports, name, why, chips],
      [supports, name, why]
    ];
  }
  const misses = countMisses(checkedReading, sc.honest);
  const result = misses === 0
    ? { kind: 'result', text: '✓ Honest reading!', color: CORRECT_GREEN }
    : { kind: 'result', text: '✗ Not quite: ' + misses + ' signal' + (misses > 1 ? 's' : '') + ' misread', color: AMBER_TEXT };
  const yours = { kind: 'body', text: 'Your reading pointed to ' + DECISIONS[checkedReading].name + '.' };
  const top = misses ? [result, yours] : [result];
  const done = !sc.worked && practiceResults.every(r => r !== null);
  const tail = [];
  if (done) {
    const n = practiceResults.filter(r => r).length;
    tail.push({ kind: 'hint', text: 'Practice complete: ' + n + ' of ' + practiceResults.length + ' read honestly on the first try.' });
  }
  return [
    [...top, supports, name, why, chips, ...tail],
    [...top, supports, name, why, chips],
    [...top, supports, name, why],
    [result, supports, name, why],
    [result, name, why]
  ];
}

// ---------- Text blocks ----------

// Base size, style, color and space-before for each kind of item. Styles are the string
// values of p5's BOLD / NORMAL / ITALIC constants, because those constants are not
// defined yet when this top-level object is created.
const ITEM_STYLE = {
  label:    { size: 13, style: 'bold',   color: 'dimgray', before: 10 },
  title:    { size: 19, style: 'bold',   color: 'black',   before: 4 },
  heading:  { size: 25, style: 'bold',   color: 'black',   before: 3 },
  result:   { size: 19, style: 'bold',   color: 'black',   before: 0 },
  body:     { size: 16, style: 'normal', color: 'black',   before: 6 },
  hint:     { size: 15, style: 'italic', color: 'dimgray', before: 10 },
  head:     { size: 16, style: 'bold',   color: 'black',   before: 0 },
  bar:      { size: 14, style: 'italic', color: 'dimgray', before: 1 },
  evidence: { size: 16, style: 'normal', color: 'black',   before: 2 },
  note:     { size: 15, style: 'normal', color: 'black',   before: 3 },
  row:      { before: 12 },
  chips:    { before: 12 }
};

// Try each candidate at a few scales and keep the first that fits the box.
// rank counts how far down the list of candidates and scales the fit had to go.
function fitBlocks(candidates, box, padLeft) {
  const inset = { x: box.x + 14 + (padLeft || 0), y: box.y + 12,
    w: box.w - 28 - (padLeft || 0), h: box.h - 22 };
  const scales = isWide ? [1.0, 0.95, 0.9] : [0.95, 0.9, 0.85];
  let rank = 0;
  for (const items of candidates) {
    for (const s of scales) {
      const laid = layoutItems(items, inset.w, s);
      if (laid.height <= inset.h) return { blocks: laid, x: inset.x, y: inset.y, w: inset.w, s, rank };
      rank++;
    }
  }
  // Nothing fit: shrink the last (shortest) candidate until it does
  const last = candidates[candidates.length - 1];
  let laid, s;
  for (s = 0.8; s > 0.6; s -= 0.05) {
    laid = layoutItems(last, inset.w, s);
    if (laid.height <= inset.h) break;
    rank++;
  }
  return { blocks: laid, x: inset.x, y: inset.y, w: inset.w, s, rank };
}

function layoutItems(items, maxW, s) {
  const blocks = [];
  let height = 0;
  for (const it of items) {
    const b = layoutItem(it, maxW, s);
    b.before = blocks.length ? ITEM_STYLE[it.kind].before * s : 0;
    blocks.push(b);
    height += b.before + b.h;
  }
  blocks.height = height;
  return blocks;
}

function layoutItem(it, maxW, s) {
  if (it.kind === 'chips') return { it, h: 48 * s };
  if (it.kind === 'row') {
    const markD = 20 * s;
    const indent = markD + 10 * s;
    const paras = [];
    let h = 0;
    it.paras.forEach((p, i) => {
      const lp = layoutPara(p, maxW - indent, s);
      lp.before = i ? ITEM_STYLE[p.kind].before * s : 0;
      paras.push(lp);
      h += lp.before + lp.h;
    });
    return { it, paras, indent, markD, h: max(h, markD) };
  }
  return layoutPara(it, maxW, s);
}

// Wrap a paragraph made of one or more styled runs
function layoutPara(p, maxW, s) {
  const st = ITEM_STYLE[p.kind];
  const size = st.size * s;
  const runs = p.runs || [{ text: p.text }];
  const tokens = [];
  for (const r of runs) {
    for (const w of r.text.split(' ')) {
      if (w) tokens.push({ w, style: r.style || p.style || st.style, color: r.color || p.color || st.color });
    }
  }
  textSize(size);
  let rightW = 0;
  if (p.right) {
    textStyle(BOLD);
    rightW = textWidth(p.right) + 12 * s;
  }
  const lines = wrapTokens(tokens, maxW - rightW);
  textStyle(NORMAL);
  const lead = size * 1.3;
  return { it: p, lines, size, lead, spaceW: textWidth(' '), h: lines.length * lead };
}

// Greedy word wrap over tokens that may differ in style; measures at the current size
function wrapTokens(tokens, maxW) {
  textStyle(NORMAL);
  const spaceW = textWidth(' ');
  const lines = [];
  let line = [];
  let lineW = 0;
  const size = textSize();
  for (const t of tokens) {
    const k = size + '|' + t.style + '|' + t.w;
    if (!widthCache.has(k)) {
      textStyle(t.style);
      widthCache.set(k, textWidth(t.w));
    }
    t.width = widthCache.get(k);
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

function renderBlocks(blocks, x, y, w, s) {
  for (const b of blocks) {
    y += b.before;
    if (b.it.kind === 'chips') {
      drawChips(b.it.key, x, y, w, b.h, s);
    } else if (b.it.kind === 'row') {
      const firstLead = b.paras.length ? b.paras[0].lead : b.markD;
      drawMark(b.it.mark, x + b.markD / 2, y + firstLead / 2, b.markD);
      let yy = y;
      for (const p of b.paras) {
        yy += p.before;
        renderPara(p, x + b.indent, yy, w - b.indent);
        yy += p.h;
      }
    } else {
      renderPara(b, x, y, w);
    }
    y += b.h;
  }
  textStyle(NORMAL);
}

function renderPara(p, x, y, w) {
  textSize(p.size);
  textAlign(LEFT, TOP);
  if (p.it.right) {
    noStroke();
    textStyle(BOLD);
    fill(p.it.rightColor || 'black');
    textAlign(RIGHT, TOP);
    text(p.it.right, x + w, y);
    textAlign(LEFT, TOP);
  }
  for (const ln of p.lines) {
    let tx = x;
    for (const t of ln) {
      noStroke();
      fill(t.color);
      textStyle(t.style);
      text(t.w, tx, y);
      tx += t.width + p.spaceW;
    }
    y += p.lead;
  }
  textStyle(NORMAL);
}

// Round mark beside each signal row:
// on = signal checked (indigo), off = unchecked (empty),
// right = read honestly (green check), wrong = misread (amber cross),
// persevere / pivot / kill = a plain dot in that verdict's color
function drawMark(kind, cx, cy, d) {
  strokeWeight(1.5);
  if (VERDICT_TYPES[kind]) {
    // Plain colored dot for the verdict color key
    noStroke();
    fill(VERDICT_TYPES[kind].border);
    circle(cx, cy, d * 0.8);
    strokeWeight(1);
    return;
  }
  if (kind === 'on') { fill(INDIGO); stroke(INDIGO); }
  else if (kind === 'right') { fill(CORRECT_GREEN); stroke(CORRECT_GREEN); }
  else if (kind === 'wrong') { fill(AMBER); stroke(AMBER_TEXT); }
  else { fill('white'); stroke('darkgray'); }
  circle(cx, cy, d);
  noFill();
  strokeWeight(max(2, d * 0.12));
  const r = d / 2;
  if (kind === 'on' || kind === 'right') {
    stroke('white');
    beginShape();
    vertex(cx - r * 0.45, cy + r * 0.02);
    vertex(cx - r * 0.1, cy + r * 0.38);
    vertex(cx + r * 0.48, cy - r * 0.35);
    endShape();
  } else if (kind === 'wrong') {
    stroke('black');
    line(cx - r * 0.38, cy - r * 0.38, cx + r * 0.38, cy + r * 0.38);
    line(cx + r * 0.38, cy - r * 0.38, cx - r * 0.38, cy + r * 0.38);
  }
  strokeWeight(1);
}

// One chip per canvas element: the element's name above KEEP / CHANGE / RETEST / STOP
function drawChips(key, x, y, w, h, s) {
  const gap = 8 * s;
  const cw = (w - 2 * gap) / 3;
  for (let i = 0; i < 3; i++) {
    const status = chipStatus(key, i);
    const cs = CHIP_STYLES[status];
    const cx = x + i * (cw + gap);
    stroke(cs.border);
    strokeWeight(1.5);
    fill(cs.fill);
    rect(cx, y, cw, h, 8);
    noStroke();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(12 * s);
    fill('dimgray');
    text(SIGNALS[i].element.toUpperCase(), cx + cw / 2, y + h * 0.3);
    textSize(16 * s);
    fill(cs.text);
    text(status, cx + cw / 2, y + h * 0.68);
  }
  strokeWeight(1);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
}

// ---------- Interaction ----------

function onSignalChange() {
  touched = true;
  if (checked) checked = false;   // a changed reading needs a new check
  updateButtons();
}

function setSignals(key) {
  for (let i = 0; i < 3; i++) signalBoxes[i].checked(key[i] === '1');
}

// Worked example: Priya's honest reading, already annotated and justified
function loadPriya() {
  mode = 'scenario';
  current = 0;
  setSignals(SCENARIOS[0].honest);
  touched = true;
  checked = true;
  checkedReading = SCENARIOS[0].honest;
  learnerChecked = false;
  updateButtons();
}

function loadPractice() {
  mode = 'scenario';
  current = practiceOrder[practicePos];
  setSignals('000');
  touched = false;
  checked = false;
  learnerChecked = false;
  updateButtons();
}

function restartPractice() {
  practiceOrder = shuffle([1, 2, 3, 4]);
  practiceResults = [null, null, null, null];
  practicePos = 0;
  loadPractice();
}

function nextOpenSlot() {
  return practiceResults.findIndex(r => r === null);
}

function checkReading() {
  const sc = SCENARIOS[current];
  checkedReading = currentKey();
  checked = true;
  learnerChecked = true;
  touched = true;
  if (!sc.worked && practiceResults[practicePos] === null) {
    practiceResults[practicePos] = checkedReading === sc.honest;
  }
  updateButtons();
}

function actionLabel() {
  if (mode === 'explore') return 'Try a Scenario';
  if (!checked) return 'Check My Reading';
  if (SCENARIOS[current].worked) return 'Try a Scenario';
  return nextOpenSlot() >= 0 ? 'Next Scenario' : 'Try Again';
}

function onAction() {
  const label = actionLabel();
  if (label === 'Check My Reading') {
    checkReading();
  } else if (label === 'Try Again') {
    restartPractice();
  } else {
    // Try a Scenario or Next Scenario: the next practice slot not yet checked
    const slot = nextOpenSlot();
    if (slot < 0) {
      restartPractice();
    } else {
      practicePos = slot;
      loadPractice();
    }
  }
}

function resetAll() {
  mode = 'explore';
  current = 0;
  setSignals('000');
  touched = false;
  checked = false;
  learnerChecked = false;
  practiceOrder = [1, 2, 3, 4];
  practiceResults = [null, null, null, null];
  practicePos = 0;
  updateButtons();
}

// Relabel the action button, then re-place the buttons for the new label's width
function updateButtons() {
  actionButton.html(actionLabel());
  positionControls();
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
