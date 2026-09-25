// 30-Day Launch Roadmap Timeline - vis-timeline MicroSim
// CANVAS_HEIGHT: 560
// A step-through timeline of Jordan's 30-day launch plan for the mobile dog-grooming
// idea. Four equal-width indigo week blocks run from Day 1 to Day 30, and each block
// shows its theme and its weekly target (sessions completed) directly on the block.
// The selected week is outlined in fox-orange. Previous / Next (or the arrow keys)
// step through the four weeks in order; clicking a block jumps to that week; hovering
// a block shows a one-line preview. The panel below the timeline shows the selected
// week's plan (Week 1 answers the plan's three questions: what to sell, who to sell
// to, how to reach them), its weekly milestone and weekly target, and how the week
// builds toward launch readiness. On wide screens a readiness line underneath checks
// off the pieces of launch readiness earned so far.
// There is no animation: each week holds still until the learner moves on.
// The plan's calendar is relative. vis-timeline needs real dates, so the sketch uses
// a fixed illustrative start and labels the axis only by plan day (Day 1 to Day 30).
// Each week block is exactly 7.5 days wide, so the four blocks are equal and together
// fill the 30 days.
// Narrow screens: the timeline keeps a 640px minimum width inside a horizontal
// scroll box with a visible scrollbar, and each step scrolls its week into view.

// Total height of everything above the Back link (drawing region + control region)
const CANVAS_HEIGHT = 560;

// Book palette
const INDIGO = '#3F51B5';        // week blocks
const FOX_ORANGE = '#E8791A';    // outline of the selected week
const DARK_ORANGE = '#B25A10';   // orange that stays readable as text
const CORRECT_GREEN = '#2E7D32'; // readiness pieces already earned

// Illustrative calendar: January 1, 2024 at midnight (local time), never shown.
// January avoids daylight-saving shifts, so every half-day tick is exactly 12 hours.
const T0 = new Date(2024, 0, 1, 0, 0, 0).getTime();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const HALF_DAY = 12 * HOUR;
const PLAN_DAYS = 30;
const WEEK_SPAN = PLAN_DAYS / 4;  // 7.5 days: four equal blocks fill Day 1 to Day 30

// Axis labels, keyed by half-day index from the start of the plan. Each label sits on
// a block boundary: Day 1, Day 8, Day 16 and Day 23 start Weeks 1-4, Day 30 ends it.
const AXIS_LABELS = { 0: 'Day 1', 15: 'Day 8', 30: 'Day 16', 45: 'Day 23', 60: 'Day 30' };

// The pieces of launch readiness (from the chapter's definition) and the week that adds each
const READINESS = ['Validated demand', 'Customer reach', 'Workable offer', 'Readiness check'];

// The four weeks of Jordan's plan, in order
const WEEKS = [
  { id: 'week-1', num: 1, days: '1-7', theme: 'Start selling', target: 5,
    milestone: 'First 5 bookings confirmed',
    plan: [
      ['What to sell', 'one wash-and-brush driveway session ($40).'],
      ['Who to sell to', '10 households within 5 miles.'],
      ['How to reach them', 'a neighborhood app post plus word-of-mouth from 3 existing customers.']
    ],
    builds: 'Five real bookings are the first evidence of <b>validated demand</b>: neighbors will book and pay.' },
  { id: 'week-2', num: 2, days: '8-15', theme: 'Add-on and referrals', target: 8,
    milestone: 'First referred customer booked',
    plan: [
      ['Jordan’s plan', 'add a nail-trim add-on, based on the offer design from Chapter 6, and launch the referral channel from Chapter 13.']
    ],
    builds: 'A referral proves <b>a working way to reach customers</b>, one that brings in people Jordan never asked directly.' },
  { id: 'week-3', num: 3, days: '16-22', theme: 'Test the price', target: 10,
    milestone: 'Price test evidence collected',
    plan: [
      ['Jordan’s plan', 'run the price point test from Chapter 14: one group of customers is offered $40, another $45.']
    ],
    builds: 'Price evidence turns a guessed number into <b>a workable offer</b>, priced from what customers did, not what Jordan hoped.' },
  { id: 'week-4', num: 4, days: '23-30', theme: 'Check readiness', target: 12,
    milestone: 'Launch readiness check passed',
    plan: [
      ['Jordan’s plan', 'review cash flow, from Chapter 15, against the startup budget. Is money from sessions keeping pace with what goes out?']
    ],
    builds: 'The check puts <b>demand, reach, and offer</b> side by side with the budget. Passing it means Jordan can keep going past Day 30.' }
];

let timeline = null;
let current = 0;                 // index into WEEKS
let scrollBox, detailBox, prevButton, nextButton, stepLabel;

document.addEventListener('DOMContentLoaded', setup);

function setup() {
  document.getElementById('sim').style.height = CANVAS_HEIGHT + 'px';
  scrollBox = document.getElementById('timeline-scroll');
  detailBox = document.getElementById('detail');
  prevButton = document.getElementById('prev-button');
  nextButton = document.getElementById('next-button');
  stepLabel = document.getElementById('step-label');

  prevButton.addEventListener('click', () => goTo(current - 1));
  nextButton.addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'ArrowLeft') goTo(current - 1);
  });

  buildTimeline();
  updateScrollRoom();
  goTo(0);
  window.addEventListener('resize', () => {
    updateScrollRoom();
    updateControls();
    fitDetail();
    scrollToCurrent(false);
  });
}

// ---------- Timeline ----------

function buildTimeline() {
  const container = document.getElementById('timeline');
  const items = new vis.DataSet(WEEKS.map(weekToItem));

  const options = {
    width: '100%',
    orientation: 'top',
    start: new Date(T0 - 0.25 * DAY),      // a sliver of room so the outline is not clipped
    end: new Date(T0 + (PLAN_DAYS + 0.25) * DAY),
    min: new Date(T0 - 1 * DAY),
    max: new Date(T0 + (PLAN_DAYS + 1) * DAY),
    moveable: false,                       // a fixed diagram: no drag, no zoom
    zoomable: false,
    selectable: true,
    multiselect: false,
    stack: false,
    align: 'center',                       // center each label inside its week block
    showCurrentTime: false,
    showMajorLabels: false,                // no months or years: the calendar is relative
    timeAxis: { scale: 'hour', step: 12 }, // half-day ticks, so 7.5-day boundaries land on a tick
    format: { minorLabels: dayLabel },
    margin: { item: { horizontal: 0, vertical: 8 }, axis: 4 },
    tooltip: { followMouse: true, overflowMethod: 'cap' }
  };

  timeline = new vis.Timeline(container, items, options);

  // Clicking a week jumps to it; clicking empty space keeps the current week selected
  timeline.on('select', (props) => {
    if (props.items.length > 0) {
      const i = WEEKS.findIndex(w => w.id === props.items[0]);
      if (i >= 0) goTo(i);
    } else {
      timeline.setSelection([WEEKS[current].id]);
    }
  });

  // After every redraw, right-align the closing "Day 30" label
  timeline.on('changed', alignEndLabel);

  // Let the mouse wheel scroll the page (and the scroll box) instead of the timeline
  container.addEventListener('wheel', (e) => { e.stopImmediatePropagation(); }, true);
}

function weekToItem(w) {
  const start = T0 + (w.num - 1) * WEEK_SPAN * DAY;
  return {
    id: w.id, className: 'week',
    start: new Date(start), end: new Date(start + WEEK_SPAN * DAY),
    content: blockLabel(w),
    title: 'Week ' + w.num + ' (Days ' + dashed(w.days) + '): ' + w.theme +
           '. Milestone: ' + lowerFirst(w.milestone) + '.'
  };
}

// Axis labels: a plan day on each block boundary, blank on every other half-day tick
function dayLabel(date) {
  const h = Math.round((date.valueOf() - T0) / HALF_DAY);
  return AXIS_LABELS[h] || '';
}

// vis anchors every axis label at its left edge. Pull the closing "Day 30" label
// left by its own width so it ends exactly where the plan ends.
function alignEndLabel() {
  document.querySelectorAll('#timeline .vis-time-axis .vis-text.vis-minor').forEach(el => {
    const isEnd = el.textContent === AXIS_LABELS[60];
    el.classList.toggle('end-label', isEnd);
    el.style.marginLeft = isEnd ? (-el.offsetWidth) + 'px' : '';
  });
}

// ---------- Stepping ----------

function goTo(i) {
  if (i < 0 || i >= WEEKS.length) return;
  current = i;
  timeline.setSelection([WEEKS[i].id]);
  renderDetail();
  updateControls();
  scrollToCurrent(true);
}

function updateControls() {
  prevButton.disabled = current === 0;
  nextButton.disabled = current === WEEKS.length - 1;
  const w = WEEKS[current];
  // Narrow screens drop the theme; the panel heading already shows it
  stepLabel.textContent = 'Week ' + w.num + ' of 4' + (window.innerWidth < 480 ? '' : ': ' + w.theme);
}

// When the timeline is wider than the screen, leave room under the blocks for the
// scrollbar so it never covers them
function updateScrollRoom() {
  scrollBox.classList.toggle('scrolls', scrollBox.scrollWidth > scrollBox.clientWidth + 1);
}

// On narrow screens, bring the selected week block into view
function scrollToCurrent(smooth) {
  const el = document.querySelector('#timeline .vis-item.vis-selected');
  if (!el || scrollBox.scrollWidth <= scrollBox.clientWidth) return;
  const box = scrollBox.getBoundingClientRect();
  const a = el.getBoundingClientRect();
  const left = a.left - box.left + scrollBox.scrollLeft;
  const right = a.right - box.left + scrollBox.scrollLeft;
  const viewL = scrollBox.scrollLeft, viewR = viewL + scrollBox.clientWidth;
  if (left >= viewL + 4 && right <= viewR - 4) return;
  const target = Math.max(0, (left + right) / 2 - scrollBox.clientWidth / 2);
  scrollBox.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
}

// ---------- Detail panel ----------

function renderDetail() {
  const w = WEEKS[current];
  let html =
    '<div class="head"><h2>Week ' + w.num + ': ' + w.theme + '</h2>' +
    '<span class="pill">DAYS ' + dashed(w.days) + '</span></div>';
  w.plan.forEach(([label, text]) => {
    html += '<p><span class="label">' + label + ':</span> ' + text + '</p>';
  });
  html +=
    '<div class="stats">' +
    '<div><span class="label">Weekly milestone:</span> ' + w.milestone + '</div>' +
    '<div><span class="label">Weekly target:</span> <b>' + w.target + '</b> sessions completed</div>' +
    '</div>' +
    '<p><span class="label">Toward launch readiness:</span> ' + w.builds + '</p>' +
    '<div class="ready">Launch readiness so far: ' +
    READINESS.map((r, k) => k <= current
      ? '<span class="chip done">&#10003; ' + r + '</span>'
      : '<span class="chip">' + r + '</span>').join(' ') +
    '</div>';
  detailBox.innerHTML = html;
  fitDetail();
}

// Shrink the panel text in small steps until it fits (never below 12px)
function fitDetail() {
  const base = window.innerWidth < 600 ? 15 : 18;
  let size = base;
  detailBox.style.fontSize = size + 'px';
  while (detailBox.scrollHeight > detailBox.clientHeight + 1 && size > 12) {
    size -= 0.5;
    detailBox.style.fontSize = size + 'px';
  }
}

// ---------- Helpers ----------

// Three-line block label built as DOM nodes, so vis-timeline needs no raw HTML strings:
// "Week N", the week's theme, and the weekly target number
function blockLabel(w) {
  const el = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'wk-name';
  name.textContent = 'Week ' + w.num;
  const theme = document.createElement('div');
  theme.className = 'wk-theme';
  theme.textContent = w.theme;
  const target = document.createElement('div');
  target.className = 'wk-target';
  target.appendChild(document.createTextNode('Target: '));
  const num = document.createElement('b');
  num.textContent = w.target;
  target.appendChild(num);
  target.appendChild(document.createTextNode(' sessions'));
  el.appendChild(name);
  el.appendChild(theme);
  el.appendChild(target);
  return el;
}

// "First 5 bookings confirmed" -> "first 5 bookings confirmed" for mid-sentence use
function lowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// "1-7" -> "1–7" with an en dash
function dashed(range) {
  return range.replace('-', '–');
}
