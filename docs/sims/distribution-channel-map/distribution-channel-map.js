// Distribution Channel Map - Chart.js MicroSim
// CANVAS_HEIGHT: 600
// A scatter plot of the eight distribution channels from Chapter 13, placed by
// Channel Cost (x axis, 1 = very low, 10 = high) and Channel Reach (y axis,
// 1 = very narrow, 10 = very wide). A shaded green zone in the lower left marks
// the channels that fit an early-stage, low-capital venture: cost of 4 or less,
// with narrow to moderate reach (up to about 6).
// Hovering a point shows a tooltip with the channel's one-sentence definition from
// the chapter and its (cost, reach) values. Clicking or tapping a point, or stepping
// with Previous / Next (or the arrow keys, cheapest channel first), highlights it in
// fox orange and fills the detail panel: why it sits at that cost and reach, what it
// is, what it is best for, and Jordan's or Priya's example.
// The "Compare with" menu marks a second channel with an amber diamond, joins the
// two points with a dashed line, and turns the panel into a side-by-side table of
// cost, reach, and zone with a one-line verdict on the tradeoff.
// Direct Sales and In-Person Distribution share the spot (3, 2). Their points are
// nudged 0.4 to each side on the cost axis so each one can be clicked; the tooltip and the
// panel always report the true values.
// Point labels are placed by a small collision-avoiding placer, so they do not overlap
// each other, the points, or the zone label at phone or desktop widths.
// Touch screens (no hover) skip the tooltip: a tap selects the point and the panel
// shows the same definition.
// Wide screens (700px and up): chart on the left, panel on the right.
// Narrow screens: a 270px-tall chart with the panel below it.

// Total height of everything above the Back link (drawing region + control region)
const CANVAS_HEIGHT = 600;

// Book palette
const INDIGO = '#3F51B5';        // channel points
const DARK_INDIGO = '#1A237E';   // channel labels
const FOX_ORANGE = '#E8791A';    // selected channel
const DARK_ORANGE = '#B25A10';   // selected label (orange that stays readable as text)
const AMBER = '#FFB300';         // compared channel
const AMBER_TEXT = '#8A5A00';    // compared label (amber that stays readable as text)
const CORRECT_GREEN = '#2E7D32'; // best-fit zone
const CREAM = 'oldlace';         // plot background
const ZONE_FILL = 'rgba(46, 125, 50, 0.12)';
const GRID = '#E6E1D6';

// Best-fit zone for early-stage, low-capital ventures (lower-left corner of the plot)
const ZONE_MAX_COST = 4;
const ZONE_MAX_REACH = 6.5;
const ZONE_TEXT = 'Best fit for early-stage, low-capital ventures';

// Radius used for label placement and collision boxes (the largest point radius)
const PLACE_R = 10;
const LABEL_GAP = 4;

// The eight channels, in step order: cheapest first, then narrowest reach first.
// plotX differs from cost only for the two channels that share the spot (3, 2).
const CHANNELS = [
  { channel: 'Word of Mouth', short: 'Word of Mouth', cost: 1, reach: 3, plotX: 1,
    definition: 'Existing, satisfied customers tell others about the venture without being prompted or rewarded to do so.',
    costWhy: 'Free: it costs nothing beyond doing great work.',
    reachWhy: 'Narrow: it spreads only as far as your customers’ own conversations.',
    bestFor: 'An early-stage venture with a small, tight-knit target customer group.',
    example: 'Three of Jordan’s driveway customers mention the service to their neighbors.',
    prefs: ['right', 'above', 'below', 'left'] },
  { channel: 'Referral Channel', short: 'Referral', cost: 2, reach: 4, plotX: 2,
    definition: 'A deliberate system that encourages and rewards existing customers for bringing in new ones.',
    costWhy: 'Low: you pay a small reward only when a referral actually arrives.',
    reachWhy: 'Narrow to moderate: a bit wider than word of mouth, because customers are asked to share.',
    bestFor: 'A venture with a few happy customers whose friends look just like them.',
    example: '“$10 off your next session for every friend you refer.”',
    prefs: ['right', 'above', 'left', 'below'] },
  { channel: 'Social Media Channel', short: 'Social Media', cost: 2, reach: 6, plotX: 2,
    definition: 'Reaches customers through content posted on social platforms, whether through organic posts, groups, or paid promotion.',
    costWhy: 'Low: organic posts and group shares cost time, not money. Paid promotion raises the cost.',
    reachWhy: 'Moderate to wide: one post can reach a whole group at once.',
    bestFor: 'A venture whose target customers already gather in a specific online group.',
    example: 'Priya posting meal photos in a local parents’ group.',
    prefs: ['right', 'above', 'left', 'below'] },
  { channel: 'Direct Sales Channel', short: 'Direct Sales', cost: 3, reach: 2, plotX: 3 - 0.4,
    definition: 'The founder personally reaches out to and closes individual customers, one at a time, without an intermediary.',
    costWhy: 'Low to moderate: little money, but a lot of the founder’s time per customer.',
    reachWhy: 'Narrow: one customer per conversation.',
    bestFor: 'The very first customers, when every conversation also teaches you something.',
    example: 'Jordan offering a $40 driveway session to neighbors, one conversation at a time.',
    sameSpot: 'In-Person Distribution',
    prefs: ['left', 'below', 'above', 'right'] },
  { channel: 'In-Person Distribution', short: 'In-Person', cost: 3, reach: 2, plotX: 3 + 0.4,
    definition: 'Reaches customers through physical presence, like a booth at a local event, a flyer on a community board, or a conversation at the dog park.',
    costWhy: 'Low to moderate: flyers and event booths cost a little money and a lot of time.',
    reachWhy: 'Narrow: only people who are physically nearby.',
    bestFor: 'A local service whose customers live or gather within a small area.',
    example: 'Jordan chatting with dog owners at the dog park.',
    sameSpot: 'Direct Sales Channel',
    prefs: ['right', 'below', 'above', 'left'] },
  { channel: 'Partnership Channel', short: 'Partnership', cost: 3, reach: 5, plotX: 3,
    definition: 'Reaches customers through an agreement with another business that already has access to the same target customer.',
    costWhy: 'Low to moderate: time to pitch the partner, plus any favor or share you offer in return.',
    reachWhy: 'Moderate: you borrow the partner’s whole customer base.',
    bestFor: 'A venture that shares its exact target customer with a trusted local business.',
    example: 'A local pet store agreeing to display Jordan’s flyer.',
    prefs: ['right', 'above', 'below', 'left'] },
  { channel: 'Online Distribution', short: 'Online', cost: 5, reach: 7, plotX: 5,
    definition: 'Reaches customers through internet-based platforms such as websites, apps, or search, where a customer can discover and often buy without any in-person contact.',
    costWhy: 'Moderate: a site or app to build and keep up, and often ads to get found.',
    reachWhy: 'Wide: anyone searching online can find you.',
    bestFor: 'A venture that has tested its offer and is ready to be found by strangers.',
    example: 'A booking page a neighbor finds by searching for a mobile dog groomer.',
    prefs: ['right', 'below', 'above', 'left'] },
  { channel: 'Marketplace Channel', short: 'Marketplace', cost: 6, reach: 8, plotX: 6,
    definition: 'Reaches customers through a third-party platform that lists many similar offers together, trading some independence for built-in customer traffic.',
    costWhy: 'Moderate to high: listing fees or a cut of each sale, and less control over price.',
    reachWhy: 'Widest here: the platform brings its own crowd of shoppers.',
    bestFor: 'A venture that can compete side by side with rivals on price and reviews.',
    example: 'Listing Jordan’s grooming availability on a local services app.',
    prefs: ['right', 'above', 'below', 'left'] }
];

const ALL_POSITIONS = ['right', 'left', 'above', 'below', 'above-right', 'below-right', 'above-left', 'below-left'];

let chart = null;
let selected = 0;                // index into CHANNELS
let compare = -1;                // index into CHANNELS, or -1 for no comparison
let noHover = false;             // true on touch screens
let detailBox, prevButton, nextButton, compareSelect;
let lastLayout = null;           // most recent label placement (read by tests)

document.addEventListener('DOMContentLoaded', setup);

function setup() {
  document.getElementById('sim').style.height = CANVAS_HEIGHT + 'px';
  detailBox = document.getElementById('detail');
  prevButton = document.getElementById('prev-button');
  nextButton = document.getElementById('next-button');
  compareSelect = document.getElementById('compare-select');
  noHover = window.matchMedia ? window.matchMedia('(hover: none)').matches : false;

  prevButton.addEventListener('click', () => selectChannel(selected - 1));
  nextButton.addEventListener('click', () => selectChannel(selected + 1));
  compareSelect.addEventListener('change', () => {
    compare = parseInt(compareSelect.value, 10);
    refresh();
  });
  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.tagName === 'SELECT') return;   // arrows belong to the menu
    if (e.key === 'ArrowRight') selectChannel(selected + 1);
    if (e.key === 'ArrowLeft') selectChannel(selected - 1);
  });

  buildChart();
  selectChannel(0);
  window.addEventListener('resize', () => {
    applyResponsiveText();
    chart.update('none');
    fitDetail();
  });
}

// ---------- Chart ----------

function buildChart() {
  const canvas = document.getElementById('chart');
  chart = new Chart(canvas, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Distribution channels',
        data: CHANNELS.map(c => ({ x: c.plotX, y: c.reach })),
        pointRadius: (ctx) => pointRadius(ctx.dataIndex),
        pointHoverRadius: (ctx) => pointRadius(ctx.dataIndex) + 2,
        pointHitRadius: 6,
        pointStyle: (ctx) => (ctx.dataIndex === compare ? 'rectRot' : 'circle'),
        pointBackgroundColor: (ctx) => pointFill(ctx.dataIndex),
        pointHoverBackgroundColor: (ctx) => pointFill(ctx.dataIndex),
        pointBorderColor: (ctx) => pointEdge(ctx.dataIndex),
        pointHoverBorderColor: (ctx) => pointEdge(ctx.dataIndex),
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      animations: { colors: false },   // the highlight switches color at once; only the size animates
      layout: { padding: { top: 10, right: 14, bottom: 2, left: 2 } },
      interaction: { mode: 'nearest', intersect: true },
      onClick: (evt, elements) => {
        if (elements.length > 0) selectChannel(elements[0].index);
      },
      onHover: (evt, elements) => {
        evt.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      },
      scales: {
        x: {
          type: 'linear', min: 0, max: 10,
          ticks: { stepSize: 1, color: '#444', font: (ctx) => ({ size: isNarrow(ctx.chart) ? 11 : 13 }) },
          grid: { color: GRID },
          title: { display: true, text: '', color: '#222',
                   font: (ctx) => ({ size: isNarrow(ctx.chart) ? 12 : 14, weight: 'bold' }) }
        },
        y: {
          type: 'linear', min: 0, max: 10,
          ticks: { stepSize: 1, color: '#444', font: (ctx) => ({ size: isNarrow(ctx.chart) ? 11 : 13 }) },
          grid: { color: GRID },
          title: { display: true, text: '', color: '#222',
                   font: (ctx) => ({ size: isNarrow(ctx.chart) ? 12 : 14, weight: 'bold' }) }
        }
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          enabled: !noHover,
          displayColors: false,
          backgroundColor: 'rgba(44, 62, 80, 0.95)',
          padding: 8,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          footerFont: { size: 13, weight: 'bold' },
          footerColor: '#FFD699',
          callbacks: {
            title: (items) => CHANNELS[items[0].dataIndex].channel,
            label: (item) => wrapWords(CHANNELS[item.dataIndex].definition, tooltipChars(item.chart)),
            footer: (items) => {
              const c = CHANNELS[items[0].dataIndex];
              return 'Cost ' + c.cost + ' · Reach ' + c.reach + '  (1–10 scale)';
            }
          }
        }
      }
    },
    plugins: [channelMapPlugin]
  });
  applyResponsiveText();
  chart.update('none');
}

function isNarrow(c) {
  return c.width < 480;
}

// Axis titles: shorter wording when the chart is narrow
function applyResponsiveText() {
  const narrow = isNarrow(chart);
  chart.options.scales.x.title.text = narrow
    ? 'Channel Cost (1 = very low, 10 = high)'
    : 'Channel Cost (1 = very low cost, 10 = high cost)';
  chart.options.scales.y.title.text = narrow
    ? 'Channel Reach (1 = narrow, 10 = wide)'
    : 'Channel Reach (1 = very narrow, 10 = very wide)';
}

function tooltipChars(c) {
  return Math.max(24, Math.min(46, Math.floor(c.width * 0.72 / 7)));
}

function pointRadius(i) {
  if (i === selected) return 10;
  if (i === compare) return 9;
  return 7;
}

function pointFill(i) {
  if (i === selected) return FOX_ORANGE;
  if (i === compare) return AMBER;
  return INDIGO;
}

function pointEdge(i) {
  if (i === selected) return DARK_ORANGE;
  if (i === compare) return AMBER_TEXT;
  return 'white';
}

// Plot background, best-fit zone, comparison line, and point labels
const channelMapPlugin = {
  id: 'channelMap',
  // Runs before the grid is drawn, so grid lines stay visible over the shading
  beforeDraw(c) {
    const a = c.chartArea;
    if (!a) return;
    const z = zoneRect(c);
    const ctx = c.ctx;
    ctx.save();
    ctx.fillStyle = CREAM;
    ctx.fillRect(a.left, a.top, a.right - a.left, a.bottom - a.top);
    ctx.fillStyle = ZONE_FILL;
    ctx.fillRect(z.left, z.top, z.right - z.left, z.bottom - z.top);
    ctx.restore();
  },
  // Zone edge and comparison line sit under the points
  beforeDatasetsDraw(c) {
    const z = zoneRect(c);
    const ctx = c.ctx;
    ctx.save();
    ctx.strokeStyle = CORRECT_GREEN;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(z.left, z.top);
    ctx.lineTo(z.right, z.top);
    ctx.lineTo(z.right, z.bottom);
    ctx.stroke();
    if (compare >= 0) {
      const meta = c.getDatasetMeta(0);
      const p = meta.data[selected], q = meta.data[compare];
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
    ctx.restore();
  },
  // Labels are drawn before the tooltip, so the tooltip always covers them
  afterDatasetsDraw(c) {
    const layout = placeLabels(c);
    lastLayout = layout;
    const ctx = c.ctx;
    ctx.save();
    ctx.font = layout.font;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(253, 245, 230, 0.95)';   // cream halo keeps text readable over grid lines
    layout.zone.lines.forEach((line, k) => {
      const y = layout.zone.box.y + k * layout.lineHeight;
      ctx.strokeText(line, layout.zone.box.x, y);
      ctx.fillStyle = CORRECT_GREEN;
      ctx.fillText(line, layout.zone.box.x, y);
    });
    layout.labels.forEach((lab) => {
      ctx.strokeText(lab.text, lab.box.x, lab.box.y + 1);
      ctx.fillStyle = lab.index === selected ? DARK_ORANGE : (lab.index === compare ? AMBER_TEXT : DARK_INDIGO);
      ctx.fillText(lab.text, lab.box.x, lab.box.y + 1);
    });
    ctx.restore();
  }
};

function zoneRect(c) {
  const x = c.scales.x, y = c.scales.y;
  return {
    left: x.getPixelForValue(0), right: x.getPixelForValue(ZONE_MAX_COST),
    top: y.getPixelForValue(ZONE_MAX_REACH), bottom: y.getPixelForValue(0)
  };
}

// ---------- Label placement ----------

// Greedy placement: the zone label first, then each channel label in step order.
// Every candidate box is scored by how much it overlaps points, earlier labels, and
// the outside of the plot; the first box with a zero score wins.
function placeLabels(c) {
  const ctx = c.ctx;
  const area = c.chartArea;
  const fontSize = isNarrow(c) ? 11 : 12;
  const lineHeight = fontSize + 3;
  const font = 'bold ' + fontSize + 'px Arial, Helvetica, sans-serif';
  ctx.save();
  ctx.font = font;
  const meta = c.getDatasetMeta(0);
  const obstacles = meta.data.map(p => ({
    x: p.x - PLACE_R - 1, y: p.y - PLACE_R - 1, w: 2 * PLACE_R + 2, h: 2 * PLACE_R + 2
  }));
  const placed = [];

  const zone = placeZoneLabel(c, ctx, lineHeight, obstacles);
  placed.push(zone.box);

  const labels = CHANNELS.map((ch, i) => {
    const p = meta.data[i];
    const w = Math.ceil(ctx.measureText(ch.short).width);
    const h = lineHeight;
    let best = null, bestScore = Infinity;
    for (const pos of ch.prefs.concat(ALL_POSITIONS)) {
      const box = candidateBox(p, w, h, pos);
      const score = overlapScore(box, area, obstacles, placed);
      if (score < bestScore) { best = box; bestScore = score; }
      if (score === 0) break;
    }
    placed.push(best);
    return { text: ch.short, box: best, index: i, score: bestScore };
  });
  ctx.restore();
  return { font, lineHeight, zone, labels };
}

function candidateBox(p, w, h, pos) {
  const d = PLACE_R + LABEL_GAP;
  switch (pos) {
    case 'right': return { x: p.x + d, y: p.y - h / 2, w, h };
    case 'left': return { x: p.x - d - w, y: p.y - h / 2, w, h };
    case 'above': return { x: p.x - w / 2, y: p.y - d - h, w, h };
    case 'below': return { x: p.x - w / 2, y: p.y + d, w, h };
    case 'above-right': return { x: p.x + PLACE_R * 0.6, y: p.y - d - h + 3, w, h };
    case 'below-right': return { x: p.x + PLACE_R * 0.6, y: p.y + d - 3, w, h };
    case 'above-left': return { x: p.x - PLACE_R * 0.6 - w, y: p.y - d - h + 3, w, h };
    default: return { x: p.x - PLACE_R * 0.6 - w, y: p.y + d - 3, w, h };   // below-left
  }
}

// The zone label sits just above the zone's top edge when there is room,
// wrapped to about the zone's width; otherwise inside the zone
function placeZoneLabel(c, ctx, lineHeight, obstacles) {
  const area = c.chartArea;
  const z = zoneRect(c);
  const zoneW = z.right - z.left;
  const candidates = [
    { where: 'above', wrap: zoneW + 10 },
    { where: 'above', wrap: zoneW - 8 },
    { where: 'inside-top', wrap: zoneW - 12 },
    { where: 'inside-bottom', wrap: zoneW - 12 }
  ];
  let best = null, bestScore = Infinity;
  for (const cand of candidates) {
    const lines = wrapToWidth(ctx, ZONE_TEXT, Math.max(60, cand.wrap));
    const w = Math.ceil(Math.max(...lines.map(l => ctx.measureText(l).width)));
    const h = lines.length * lineHeight;
    let y;
    if (cand.where === 'above') y = z.top - 4 - h;
    else if (cand.where === 'inside-top') y = z.top + 5;
    else y = z.bottom - 5 - h;
    const box = { x: z.left + 6, y, w, h };
    const score = overlapScore(box, area, obstacles, []);
    if (score < bestScore) { best = { box, lines }; bestScore = score; }
    if (score === 0) break;
  }
  return best;
}

function overlapScore(box, area, obstacles, placed) {
  let score = 0;
  // Anything outside the plot area counts three times as much as an overlap
  const inside = intersectArea(box, { x: area.left + 1, y: area.top + 1,
                                      w: area.right - area.left - 2, h: area.bottom - area.top - 2 });
  score += 3 * (box.w * box.h - inside);
  for (const o of obstacles) score += intersectArea(box, o);
  for (const o of placed) score += intersectArea(box, pad(o, 2));
  return score;
}

function intersectArea(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return (w > 0 && h > 0) ? w * h : 0;
}

function pad(b, n) {
  return { x: b.x - n, y: b.y - n, w: b.w + 2 * n, h: b.h + 2 * n };
}

// ---------- Selection ----------

function selectChannel(i) {
  if (i < 0 || i >= CHANNELS.length) return;
  selected = i;
  if (compare === selected) compare = -1;
  rebuildCompareMenu();
  refresh();
}

function refresh() {
  prevButton.disabled = selected === 0;
  nextButton.disabled = selected === CHANNELS.length - 1;
  chart.update();
  renderDetail();
}

// The menu lists every channel except the selected one
function rebuildCompareMenu() {
  compareSelect.innerHTML = '';
  const none = document.createElement('option');
  none.value = '-1';
  none.textContent = '(none)';
  compareSelect.appendChild(none);
  CHANNELS.forEach((c, i) => {
    if (i === selected) return;
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = c.channel;
    compareSelect.appendChild(opt);
  });
  compareSelect.value = String(compare);
}

// ---------- Detail panel ----------

function inZone(c) {
  return c.cost <= ZONE_MAX_COST && c.reach <= ZONE_MAX_REACH;
}

function renderDetail() {
  const a = CHANNELS[selected];
  if (compare < 0) {
    const pill = inZone(a)
      ? '<span class="pill in">BEST-FIT ZONE</span>'
      : '<span class="pill out">OUTSIDE THE ZONE</span>';
    detailBox.className = 'single';
    detailBox.innerHTML =
      '<div class="head"><h2>' + a.channel + '</h2>' + pill + '</div>' +
      '<div class="row"><span class="tag">Cost ' + a.cost + '</span>' + a.costWhy + '</div>' +
      '<div class="row"><span class="tag">Reach ' + a.reach + '</span>' + a.reachWhy + '</div>' +
      '<p><span class="label">What it is: </span>' + a.definition + '</p>' +
      '<p><span class="label">Best for: </span>' + a.bestFor + '</p>' +
      '<p class="opt"><span class="label">Wider reach for the same or less cost: </span>' + beatenBy(selected) + '</p>' +
      '<p class="opt"><span class="label">Example: </span>' + a.example + '</p>' +
      (a.sameSpot ? '<p class="opt note">Shares the spot (3, 2) with ' + a.sameSpot +
        '; the two points are nudged apart so you can click each one.</p>' : '');
  } else {
    const b = CHANNELS[compare];
    detailBox.className = 'compare';
    detailBox.innerHTML =
      '<div class="head"><h2><span class="a">' + a.short + '</span> vs. <span class="b">' + b.short + '</span></h2></div>' +
      '<table><thead><tr><th></th><th class="a">' + a.short + '</th><th class="b">' + b.short + '</th></tr></thead>' +
      '<tbody><tr><th>Cost</th><td>' + a.cost + '</td><td>' + b.cost + '</td></tr>' +
      '<tr><th>Reach</th><td>' + a.reach + '</td><td>' + b.reach + '</td></tr>' +
      '<tr><th>Zone</th><td>' + (inZone(a) ? 'Best fit' : 'Outside') + '</td><td>' +
      (inZone(b) ? 'Best fit' : 'Outside') + '</td></tr></tbody></table>' +
      '<p><span class="label">Tradeoff: </span>' + tradeoff(a, b) + '</p>' +
      '<div class="opt"><p><span class="label a">' + a.short + ' is best for: </span>' + a.bestFor + '</p>' +
      '<p><span class="label b">' + b.short + ' is best for: </span>' + b.bestFor + '</p></div>';
  }
  fitDetail();
}

// Channels that reach wider at the same or lower cost (they beat this one on both axes)
function beatenBy(i) {
  const c = CHANNELS[i];
  const better = CHANNELS.filter(o => o !== c && o.cost <= c.cost && o.reach > c.reach).map(o => o.short);
  return better.length ? better.join(', ') + '.' : 'none on this chart.';
}

// One- or two-sentence verdict on cost versus reach, plus where each sits
function tradeoff(a, b) {
  const dCost = b.cost - a.cost;
  const dReach = b.reach - a.reach;
  let s;
  if (dCost === 0 && dReach === 0) {
    s = 'Same cost and same reach, so the chart cannot separate them. Channel fit decides: which one does your customer already pay attention to?';
  } else if (dCost <= 0 && dReach >= 0) {
    s = winsOutright(b, -dCost, dReach);
  } else if (dCost >= 0 && dReach <= 0) {
    s = winsOutright(a, dCost, -dReach);
  } else {
    const cheap = dCost > 0 ? a : b;
    const wide = dCost > 0 ? b : a;
    s = wide.short + ' buys ' + points(Math.abs(dReach)) + ' more reach for ' + points(Math.abs(dCost)) +
        ' more cost. On a small budget, start with ' + cheap.short + ' unless channel fit clearly favors ' +
        wide.short + '.';
  }
  return s + ' ' + zoneSentence(a, b);
}

function winsOutright(w, cheaperBy, widerBy) {
  let s;
  if (cheaperBy === 0) s = w.short + ' costs the same and reaches ' + points(widerBy) + ' more';
  else if (widerBy === 0) s = w.short + ' reaches just as far for ' + points(cheaperBy) + ' less cost';
  else s = w.short + ' costs ' + points(cheaperBy) + ' less and reaches ' + points(widerBy) + ' more';
  return s + ', so it wins on this chart. Channel fit can still overrule it.';
}

function zoneSentence(a, b) {
  const ia = inZone(a), ib = inZone(b);
  if (ia && ib) return 'Both sit in the best-fit zone.';
  if (!ia && !ib) return 'Neither sits in the best-fit zone.';
  return 'Only ' + (ia ? a.short : b.short) + ' sits in the best-fit zone.';
}

function points(n) {
  return n === 1 ? '1 point' : n + ' points';
}

// Shrink the panel text in small steps until it fits, never below 13px. If it still
// does not fit, hide the optional lines one at a time (last one first) and retry;
// only when every optional line is hidden may the text drop to 12px.
function fitDetail() {
  const base = window.innerWidth < 600 ? 15 : 16;
  const opts = Array.from(detailBox.querySelectorAll('.opt'));
  opts.forEach(o => { o.style.display = ''; });
  if (shrinkToFit(base, 13)) return;
  for (let k = opts.length - 1; k >= 0; k--) {
    opts[k].style.display = 'none';
    if (shrinkToFit(base, 13)) return;
  }
  shrinkToFit(base, 12);
}

function shrinkToFit(base, min) {
  let size = base;
  detailBox.style.fontSize = size + 'px';
  while (detailBox.scrollHeight > detailBox.clientHeight + 1 && size > min) {
    size -= 0.5;
    detailBox.style.fontSize = size + 'px';
  }
  return detailBox.scrollHeight <= detailBox.clientHeight + 1;
}

// ---------- Helpers ----------

// Word wrap by character count (tooltip lines)
function wrapWords(str, maxChars) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line && (line + ' ' + w).length > maxChars) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + ' ' + w : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Word wrap by measured pixel width (zone label)
function wrapToWidth(ctx, str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}
