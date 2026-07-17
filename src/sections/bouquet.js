import { BOUQUET_COLORS, BOUQUET_OCCASIONS, BOUQUET_SIZES } from '../config.js';
import { waLink } from '../lib/whatsapp.js';
import { gsap, prefersReduced } from '../lib/motion.js';

const state = {
  colors: ['rose', 'plum', 'butter'], // ids, up to 3
  size: 'classic',
  occasion: 'Birthday',
};

export function renderBouquet() {
  const stage = document.getElementById('bouquetStage');
  const swatchWrap = document.getElementById('bqSwatches');
  const sizeWrap = document.getElementById('bqSizes');
  const occWrap = document.getElementById('bqOccasions');
  const orderBtn = document.getElementById('bqOrder');
  const summary = document.getElementById('bqSummary');
  if (!stage || !swatchWrap) return;

  stage.innerHTML = bouquetSVG();
  const svg = stage.querySelector('svg');

  // Colour swatches
  swatchWrap.innerHTML = BOUQUET_COLORS.map(
    (c) => `<button class="swatch" type="button" role="button" data-color="${c.id}" aria-pressed="false"
             title="${c.label}" aria-label="${c.label}" style="background:${c.hex}"></button>`
  ).join('');

  // Sizes
  sizeWrap.innerHTML = BOUQUET_SIZES.map(
    (s) => `<button class="chip" type="button" data-size="${s.id}" aria-pressed="false">${s.label} · ${s.stems}</button>`
  ).join('');

  // Occasions
  occWrap.innerHTML = BOUQUET_OCCASIONS.map(
    (o) => `<button class="chip" type="button" data-occasion="${o}" aria-pressed="false">${o}</button>`
  ).join('');

  // ---- interactions ----
  swatchWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    const id = btn.dataset.color;
    const i = state.colors.indexOf(id);
    if (i >= 0) { if (state.colors.length > 1) state.colors.splice(i, 1); }
    else { if (state.colors.length >= 3) state.colors.shift(); state.colors.push(id); }
    syncSwatches(); applyColors(svg); updateOrder(orderBtn, summary);
  });

  sizeWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip'); if (!btn) return;
    state.size = btn.dataset.size; syncChips(sizeWrap, 'size', state.size); updateOrder(orderBtn, summary);
  });
  occWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip'); if (!btn) return;
    state.occasion = btn.dataset.occasion; syncChips(occWrap, 'occasion', state.occasion); updateOrder(orderBtn, summary);
  });

  // initial sync
  syncSwatches();
  syncChips(sizeWrap, 'size', state.size);
  syncChips(occWrap, 'occasion', state.occasion);
  applyColors(svg, true);
  updateOrder(orderBtn, summary);

  function syncSwatches() {
    swatchWrap.querySelectorAll('.swatch').forEach((b) => {
      const on = state.colors.includes(b.dataset.color);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
}

function syncChips(wrap, key, value) {
  wrap.querySelectorAll('.chip').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset[key] === value ? 'true' : 'false');
  });
}

function hexFor(id) { return (BOUQUET_COLORS.find((c) => c.id === id) || BOUQUET_COLORS[0]).hex; }
function labelFor(id) { return (BOUQUET_COLORS.find((c) => c.id === id) || BOUQUET_COLORS[0]).label; }

function applyColors(svg, instant = false) {
  const [c1, c2, c3] = [0, 1, 2].map((i) => hexFor(state.colors[i % state.colors.length]));
  const set = { '--f1': c1, '--f2': c2, '--f3': c3 };
  Object.entries(set).forEach(([k, v]) => svg.style.setProperty(k, v));
  if (!instant && !prefersReduced) {
    // playful "bloom" pop on recolour
    gsap.fromTo(svg.querySelectorAll('.bloom'),
      { scale: 0.86, transformOrigin: 'center' },
      { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', stagger: 0.03 });
  }
}

function updateOrder(orderBtn, summary) {
  const size = BOUQUET_SIZES.find((s) => s.id === state.size);
  const colours = state.colors.map(labelFor).join(', ');
  if (summary) summary.innerHTML = `A <b>${size.label}</b> bouquet in <b>${colours}</b> for a <b>${state.occasion}</b>.`;
  const msg =
    `Hi The Petal Room! I'd love to design a custom crochet bouquet 🌸\n\n` +
    `• Size: ${size.label} (${size.stems})\n` +
    `• Colours: ${colours}\n` +
    `• Occasion: ${state.occasion}\n\n` +
    `Could you share options and pricing?`;
  if (orderBtn) {
    orderBtn.setAttribute('href', waLink(msg));
    orderBtn.setAttribute('target', '_blank');
    orderBtn.setAttribute('rel', 'noopener');
  }
}

/* ---- the recolourable bouquet illustration ---- */
function flower(cx, cy, s, slot) {
  const petals = [0, 72, 144, 216, 288]
    .map((a) => `<ellipse cx="0" cy="-42" rx="19" ry="33" transform="rotate(${a})"/>`)
    .join('');
  return `
    <g class="bloom" transform="translate(${cx} ${cy}) scale(${s})">
      <g fill="var(--f${slot})" stroke="rgba(67,39,46,.10)" stroke-width="2.4" stroke-dasharray="6 6">
        ${petals}
      </g>
      <circle r="20" fill="#F2C94C"/>
      <circle r="20" fill="none" stroke="#E0B03A" stroke-width="2.5" stroke-dasharray="3 6"/>
    </g>`;
}

function bouquetSVG() {
  const flowers = [
    [200, 150, 1.0, 1],
    [138, 188, 0.82, 2],
    [262, 188, 0.82, 3],
    [108, 250, 0.7, 3],
    [292, 250, 0.7, 2],
    [200, 224, 0.66, 2],
    [168, 120, 0.58, 3],
    [232, 120, 0.58, 1],
  ];
  return `
  <svg viewBox="0 0 400 460" role="img" aria-label="A custom crochet bouquet you can recolour">
    <!-- wrap cone -->
    <path d="M200 452 L120 316 Q200 356 280 316 Z" fill="#F2E1C6"/>
    <path d="M200 452 L120 316 Q200 356 280 316 Z" fill="none" stroke="#DEC195" stroke-width="2.5" stroke-dasharray="6 8"/>
    <path d="M200 452 L150 372 M200 452 L250 372" stroke="#DEC195" stroke-width="2" stroke-dasharray="5 7"/>
    <!-- stems -->
    <g stroke="#8FA382" stroke-width="6" fill="none" stroke-linecap="round">
      <path d="M200 330 L200 150"/>
      <path d="M200 330 L138 188"/><path d="M200 330 L262 188"/>
      <path d="M200 330 L108 250"/><path d="M200 330 L292 250"/>
    </g>
    <!-- leaves -->
    <g fill="#9DAE8E">
      <path d="M170 300 C142 288 124 272 116 252 C150 252 168 274 170 300 Z"/>
      <path d="M230 300 C258 288 276 272 284 252 C250 252 232 274 230 300 Z"/>
    </g>
    <!-- flowers -->
    ${flowers.map((f) => flower(...f)).join('')}
    <!-- ribbon -->
    <path d="M168 322 Q200 340 232 322 L224 360 Q200 346 176 360 Z" fill="#C56B78"/>
    <circle cx="200" cy="330" r="8" fill="#D98A94"/>
  </svg>`;
}
