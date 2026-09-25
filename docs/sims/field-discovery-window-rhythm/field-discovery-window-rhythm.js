// The Field Discovery Window Rhythm - vis-timeline MicroSim
// CANVAS_HEIGHT: 560
// A step-through timeline of the four-week course: Session 1, FDW 1, Session 2,
// FDW 2, Session 3, FDW 3, Session 4. Live sessions sit in the top row ("Inside the
// cohort") as thin solid indigo blocks drawn to scale (2 hours each). Field Discovery
// Windows sit in the bottom row ("Out in the field") as wide dashed fox-orange
// segments (7 days each), so the picture itself shows that most of the course's real
// work happens between sessions. Previous / Next (or the arrow keys) step through the
// seven entries in order; clicking any entry jumps to it; hovering shows a one-line
// preview. The panel below the timeline shows the selected entry's assignment,
// Jordan's version of it, and how it connects to the entries before and after it.
// On wide screens a "course clock" line adds up live hours and field days so far.
// There is no animation: each step holds still until the learner moves on.
// The course calendar is relative. vis-timeline needs real dates, so the sketch uses
// a fixed illustrative start (a Monday) and labels the axis only by week.
// Narrow screens: the timeline keeps a 660px minimum width inside a horizontal
// scroll box with a visible scrollbar, and each step scrolls its entry into view.

// Total height of everything above the Back link (drawing region + control region)
const CANVAS_HEIGHT = 560;

// Book palette
const INDIGO = '#3F51B5';        // live sessions
const FOX_ORANGE = '#E8791A';    // Field Discovery Windows
const DARK_ORANGE = '#B25A10';   // orange that stays readable as text

// Illustrative calendar: Monday, January 1, 2024 at midnight (local time).
// January avoids daylight-saving shifts, so every day tick is exactly 24 hours.
const T0 = new Date(2024, 0, 1, 0, 0, 0).getTime();
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const SESSION_HOURS = 2;

// The seven entries, in course order
const STEPS = [
  { id: 'session-1', kind: 'session', num: 1, week: 1,
    what: 'Clarity: define your Customer and Problem canvas blocks.',
    jordan: 'Jordan shares the founder story and drafts a first Customer block: busy dog owners within 5 miles without easy groomer access.',
    link: 'Starts the rhythm. These first blocks are guesses, and FDW 1 takes them out to real people.' },
  { id: 'fdw-1', kind: 'fdw', num: 1, days: '1-7',
    what: 'Conduct at least 3 real customer discovery interviews.',
    jordan: 'Jordan calls five neighbors with dogs and asks what their current grooming routine costs them in time and money.',
    link: 'Tests the Customer and Problem guesses from Session 1. The interview notes are what Session 2 builds on.' },
  { id: 'session-2', kind: 'session', num: 2, week: 2,
    what: 'Define Solution, Alternatives, and Benefit canvas blocks using interview findings.',
    jordan: 'Jordan uses the neighbors’ answers to sketch a Solution (grooming that comes to the driveway) and name the Alternative (the distant, booked-solid groomer).',
    link: 'Turns FDW 1’s interview notes into new blocks, then plans the test that FDW 2 will run.' },
  { id: 'fdw-2', kind: 'fdw', num: 2, days: '8-14',
    what: 'Design and run one lean validation test (e.g., a pre-sale offer or manual service delivery).',
    jordan: 'Jordan borrows a friend’s car and offers neighbors a flat $40 driveway grooming session. No van yet.',
    link: 'Tests the Solution from Session 2 with real money and real dogs. The results are what Session 3 builds on.' },
  { id: 'session-3', kind: 'session', num: 3, week: 3,
    what: 'Define Advantage, Message, Distribution, and Revenue canvas blocks using test results.',
    jordan: '3 of 5 neighbors said yes to $40 and 2 said the price was too high, so Jordan’s Revenue block starts from real numbers.',
    link: 'Turns FDW 2’s results into four new blocks. Cohort feedback shapes a sharper test for FDW 3.' },
  { id: 'fdw-3', kind: 'fdw', num: 3, days: '15-21',
    what: 'Run a second, sharper validation test based on Session 3 feedback.',
    jordan: 'Jordan posts the driveway offer in a neighborhood app for anyone within five miles, still without owning a van.',
    link: 'Tests the Message and Distribution from Session 3 on strangers, not just neighbors. The results go into Session 4.' },
  { id: 'session-4', kind: 'session', num: 4, week: 4,
    what: 'Mini Pitch + Commitments: present canvas, 30-day launch plan, and 2-minute pitch.',
    jordan: 'Jordan pitches a canvas built from three windows of evidence and makes a public commitment for the next 30 days.',
    link: 'Closes the rhythm. The pitch rests on evidence from all three windows, not on the Session 1 guesses.' }
];

let timeline = null;
let current = 0;                 // index into STEPS
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

  const groups = new vis.DataSet([
    { id: 'live', content: twoLines('Inside the', 'cohort'), className: 'live-row', order: 1 },
    { id: 'field', content: twoLines('Out in', 'the field'), className: 'field-row', order: 2 }
  ]);

  const items = new vis.DataSet(STEPS.map(stepToItem));

  const options = {
    width: '100%',
    orientation: 'top',
    start: new Date(T0 - 0.4 * DAY),       // a little room before Session 1
    end: new Date(T0 + 26.5 * DAY),        // room for the selected Session 4 label
    min: new Date(T0 - 1 * DAY),
    max: new Date(T0 + 27 * DAY),
    moveable: false,                       // a fixed diagram: no drag, no zoom
    zoomable: false,
    selectable: true,
    multiselect: false,
    stack: false,
    showCurrentTime: false,
    showMajorLabels: false,                // no months or years: the calendar is relative
    timeAxis: { scale: 'day', step: 1 },   // one grid line per day
    format: { minorLabels: weekLabel },
    margin: { item: { horizontal: 0, vertical: 8 }, axis: 6 },
    groupOrder: 'order',
    tooltip: { followMouse: true, overflowMethod: 'cap' }
  };

  timeline = new vis.Timeline(container, items, groups, options);

  // Clicking an entry jumps to it; clicking empty space keeps the current entry selected
  timeline.on('select', (props) => {
    if (props.items.length > 0) {
      const i = STEPS.findIndex(s => s.id === props.items[0]);
      if (i >= 0) goTo(i);
    } else {
      timeline.setSelection([STEPS[current].id]);
    }
  });

  // Let the mouse wheel scroll the page (and the scroll box) instead of the timeline
  container.addEventListener('wheel', (e) => { e.stopImmediatePropagation(); }, true);
}

function stepToItem(s) {
  if (s.kind === 'session') {
    const start = T0 + (s.week - 1) * 7 * DAY;
    return {
      id: s.id, group: 'live', className: 'session',
      start: new Date(start), end: new Date(start + SESSION_HOURS * HOUR),
      content: twoLines('Session ' + s.num, 'Week ' + s.week + ' \u00b7 2 hrs', 'sub'),
      title: 'Session ' + s.num + ' (Week ' + s.week + ', live, 2 hrs): ' + shortWhat(s)
    };
  }
  // A window fills the gap from the end of one session to the start of the next
  const start = T0 + (s.num - 1) * 7 * DAY + SESSION_HOURS * HOUR;
  return {
    id: s.id, group: 'field', className: 'fdw',
    start: new Date(start), end: new Date(T0 + s.num * 7 * DAY),
    content: twoLines('FDW ' + s.num, 'Days ' + dashed(s.days) + ' \u00b7 7 days', 'sub'),
    title: 'FDW ' + s.num + ' (Days ' + dashed(s.days) + ', in the field): ' + shortWhat(s)
  };
}

// Axis labels: "Week N" on the first day of each week, blank on the other days
function weekLabel(date) {
  const dayIndex = Math.round((date.valueOf() - T0) / DAY);
  if (dayIndex >= 0 && dayIndex <= 21 && dayIndex % 7 === 0) {
    return 'Week ' + (dayIndex / 7 + 1);
  }
  return '';
}

// ---------- Stepping ----------

function goTo(i) {
  if (i < 0 || i >= STEPS.length) return;
  current = i;
  timeline.setSelection([STEPS[i].id]);
  renderDetail();
  updateControls();
  scrollToCurrent(true);
}

function updateControls() {
  prevButton.disabled = current === 0;
  nextButton.disabled = current === STEPS.length - 1;
  const s = STEPS[current];
  const name = s.kind === 'session' ? 'Session ' + s.num : 'FDW ' + s.num;
  // Narrow screens drop the name; the panel heading already shows it
  stepLabel.textContent = 'Step ' + (current + 1) + ' of 7' + (window.innerWidth < 480 ? '' : ': ' + name);
}

// When the timeline is wider than the screen, leave room under the rows for the
// scrollbar so it never covers the Field Discovery Window blocks
function updateScrollRoom() {
  scrollBox.classList.toggle('scrolls', scrollBox.scrollWidth > scrollBox.clientWidth + 1);
}

// On narrow screens, bring the selected entry (including its label) into view
function scrollToCurrent(smooth) {
  const el = document.querySelector('#timeline .vis-item.vis-selected');
  if (!el || scrollBox.scrollWidth <= scrollBox.clientWidth) return;
  const box = scrollBox.getBoundingClientRect();
  const a = el.getBoundingClientRect();
  const content = el.querySelector('.vis-item-content');
  const b = content ? content.getBoundingClientRect() : a;
  const left = Math.min(a.left, b.left) - box.left + scrollBox.scrollLeft;
  const right = Math.max(a.right, b.right) - box.left + scrollBox.scrollLeft;
  const viewL = scrollBox.scrollLeft, viewR = viewL + scrollBox.clientWidth;
  if (left >= viewL + 8 && right <= viewR - 8) return;
  const target = Math.max(0, (left + right) / 2 - scrollBox.clientWidth / 2);
  scrollBox.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
}

// ---------- Detail panel ----------

function renderDetail() {
  const s = STEPS[current];
  const live = s.kind === 'session';
  detailBox.className = live ? 'live' : 'field';
  // Running totals up to and including this step
  const done = STEPS.slice(0, current + 1);
  const liveHours = done.filter(d => d.kind === 'session').length * SESSION_HOURS;
  const fieldDays = done.filter(d => d.kind === 'fdw').length * 7;
  const heading = live ? 'Session ' + s.num : 'Field Discovery Window ' + s.num;
  const pill = live ? 'LIVE &middot; INSIDE THE COHORT' : 'FIELD WORK &middot; OUT IN THE WORLD';
  const meta = live
    ? 'Week ' + s.week + ' &middot; 2 hours, live on video with the cohort'
    : 'Days ' + dashed(s.days) + ' &middot; 7 days of testing with real customers';
  detailBox.innerHTML =
    '<div class="head"><h2>' + heading + '</h2><span class="pill">' + pill + '</span></div>' +
    '<div class="meta">' + meta + '</div>' +
    '<p><span class="label">What happens: </span>' + noBreak(s.what) + '</p>' +
    '<p><span class="label">Jordan’s version: </span>' + s.jordan + '</p>' +
    '<p><span class="label">How it connects: </span>' + s.link + '</p>' +
    '<div class="clock">Course clock after this step: <b>' + liveHours + ' of 8</b> live hours &middot; <b>' +
    fieldDays + ' of 21</b> field days</div>';
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

// Two-line label built as DOM nodes, so vis-timeline needs no raw HTML strings
function twoLines(first, second, secondClass) {
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(first));
  el.appendChild(document.createElement('br'));
  const sub = document.createElement('span');
  if (secondClass) sub.className = secondClass;
  sub.textContent = second;
  el.appendChild(sub);
  return el;
}

// The first clause of the assignment, for the one-line hover preview
function shortWhat(s) {
  return s.what.length > 70 ? s.what.slice(0, s.what.lastIndexOf(' ', 67)) + '…' : s.what;
}

// Keep "2-minute" and "30-day" from splitting across lines at the hyphen
function noBreak(str) {
  return str.replace(/(\d+-(?:minute|day))/g, '<span class="nw">$1</span>');
}

// "1-7" -> "1–7" with an en dash
function dashed(range) {
  return range.replace('-', '–');
}
