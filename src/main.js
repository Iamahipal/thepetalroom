import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { CONFIG, STATS, TESTIMONIALS } from './config.js';
import { wireWhatsApp } from './lib/whatsapp.js';
import {
  initSmoothScroll, initReveals, initParallax, initChrome,
  animateCount, scrollTo, prefersReduced, ScrollTrigger,
} from './lib/motion.js';
import { renderCollection } from './sections/collection.js';
import { renderBouquet } from './sections/bouquet.js';
import { runLoader } from './sections/loader.js';

/* ---------- grain texture (SVG turbulence, inlined) ---------- */
function setGrain() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>`;
  document.documentElement.style.setProperty('--grain-url', `url("data:image/svg+xml,${svg}")`);
}

/* ---------- dynamic content ---------- */
function renderHeroStats() {
  const ul = document.getElementById('heroStats');
  if (!ul) return;
  ul.innerHTML = STATS.map(
    (s) => `<li><span class="num" data-count="${s.value}" data-suffix="${s.suffix}" data-decimals="${s.decimals || 0}">0${s.suffix}</span><span class="lbl">${s.label}</span></li>`
  ).join('');
}

function renderMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const items = ['Handmade with love', 'Never wilts', 'Made to order', 'Ships across India', 'Crocheted by hand', 'Flowers that last'];
  const one = items.map((t) => `<span class="marquee-item">${t} <span class="star">✿</span></span>`).join('');
  track.innerHTML = one + one; // duplicate for seamless loop
}

function renderTestimonials() {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const card = (t) => `
    <figure class="testi-card">
      <div class="stars" aria-label="${t.stars} out of 5 stars">${'★'.repeat(t.stars)}</div>
      <blockquote>“${t.quote}”</blockquote>
      <figcaption>— ${t.name}, ${t.city}</figcaption>
    </figure>`;
  const one = TESTIMONIALS.map(card).join('');
  track.innerHTML = one + one;
}

function fillContact() {
  const ig = document.getElementById('igLink');
  const igHandle = document.getElementById('igHandle');
  const email = document.getElementById('emailLink');
  const emailText = document.getElementById('emailText');
  const year = document.getElementById('year');
  if (ig) ig.href = CONFIG.instagram;
  if (igHandle) igHandle.textContent = CONFIG.instagramHandle;
  if (email) email.href = `mailto:${CONFIG.email}`;
  if (emailText) emailText.textContent = CONFIG.email;
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); };
  const open = () => { nav.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Close menu'); };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // smooth in-page anchors (works with Lenis when present)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      close();
      scrollTo(id);
      history.pushState(null, '', id);
    });
  });
}

/* ---------- boot ---------- */
async function boot() {
  setGrain();
  renderHeroStats();
  renderMarquee();
  renderTestimonials();
  renderCollection();
  renderBouquet();
  fillContact();
  wireWhatsApp();        // wire all [data-wa] (bouquet order manages its own href after)
  initNav();
  initChrome();

  await runLoader();

  // motion after the curtain lifts
  await initSmoothScroll();
  initReveals();
  initParallax();
  // recalc trigger positions now that content + fonts are laid out
  requestAnimationFrame(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // hero stat counters — animate immediately (they're in the first view)
  document.querySelectorAll('.num[data-count]').forEach((el) => {
    animateCount(el, parseFloat(el.dataset.count), {
      suffix: el.dataset.suffix || '',
      decimals: parseInt(el.dataset.decimals || '0', 10),
      immediate: true,
    });
  });

  // progressive enhancements (heavy) — after first paint, non-blocking
  if (!prefersReduced) {
    requestIdleCallbackShim(async () => {
      const canvas = document.getElementById('heroCanvas');
      const { initHeroWebGL } = await import('./lib/hero-webgl.js');
      initHeroWebGL(canvas);
      const { initCursor } = await import('./lib/cursor.js');
      initCursor();
    });
  }
}

function requestIdleCallbackShim(cb) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(cb, { timeout: 1200 });
  else setTimeout(cb, 400);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
