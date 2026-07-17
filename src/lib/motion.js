import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------
   Capability gating — one place decides how rich we get.
   ------------------------------------------------------------ */
export const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const saveData = !!(navigator.connection && navigator.connection.saveData);
export const finePointer = window.matchMedia('(pointer: fine)').matches;
const lowMemory = (navigator.deviceMemory || 8) <= 4;
export const isMobile = window.matchMedia('(max-width: 760px)').matches;

/** Heavy GPU effects (WebGL, custom cursor) allowed? */
export const allowHeavy = !prefersReduced && !saveData;
/** WebGL specifically: skip on reduced/save-data; keep on mobile but lighter. */
export const allowWebGL = allowHeavy && !lowMemory;

let lenis = null;

/** Smooth scroll via Lenis + rAF loop bridged to ScrollTrigger. Off for reduced-motion. */
export async function initSmoothScroll() {
  if (prefersReduced) return null;
  const { default: Lenis } = await import('lenis');
  lenis = new Lenis({ duration: 1.1, lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() { return lenis; }

/** Smoothly scroll to a target (used by nav anchors). */
export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -70 });
  else document.querySelector(target)?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
}

/* ------------------------------------------------------------
   Reveal on scroll (batched) + split-line headline animation
   ------------------------------------------------------------ */
export function initReveals() {
  if (prefersReduced) {
    document.querySelectorAll('[data-reveal], [data-splitlines]').forEach((el) => el.classList.add('is-in'));
    return;
  }

  // Simple fade/rise for [data-reveal]
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
    once: true,
  });
  gsap.set('[data-reveal]', { opacity: 0, y: 30 });

  // Split headline into lines that rise from a mask (resilient)
  document.querySelectorAll('[data-splitlines]').forEach((el) => {
    try { splitLines(el); }
    catch (e) { el.classList.add('is-in'); gsap.set(el, { clearProps: 'all' }); }
  });
}

function splitLines(el) {
  const words = el.textContent.trim().split(/\s+/);
  const html = el.innerHTML; // preserve <em>
  // Rebuild preserving emphasis by wrapping the whole thing; use word wrappers.
  el.setAttribute('aria-label', el.textContent.trim());
  el.innerHTML = '';
  const holder = document.createElement('span');
  holder.style.display = 'inline';
  holder.innerHTML = html;
  el.appendChild(holder);

  // Wrap each word for line detection
  wrapWords(el);
  const wordEls = [...el.querySelectorAll('.w')];
  // Group by offsetTop → lines
  const lines = new Map();
  wordEls.forEach((w) => {
    const top = w.offsetTop;
    if (!lines.has(top)) lines.set(top, []);
    lines.get(top).push(w);
  });

  el.innerHTML = '';
  [...lines.values()].forEach((lineWords) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    lineWords.forEach((w, i) => {
      inner.appendChild(w);
      if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(' '));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
  });

  const inners = el.querySelectorAll('.line-inner');
  gsap.set(inners, { yPercent: 115 });
  gsap.to(inners, {
    yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.1,
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
  });
}

function wrapWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (part.trim() === '') { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.style.display = 'inline-block';
          w.textContent = part;
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // keep <em> etc. but mark its inner words
        child.style.display = 'inline-block';
        child.classList.add('w');
      }
    });
  };
  walk(el.firstChild); // holder span
  // hoist words out of holder
  const holder = el.firstChild;
  while (holder.firstChild) el.appendChild(holder.firstChild);
  el.removeChild(holder);
}

/* ------------------------------------------------------------
   Parallax layers ([data-parallax] = strength)
   ------------------------------------------------------------ */
export function initParallax() {
  if (prefersReduced) return;
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const strength = parseFloat(el.getAttribute('data-parallax')) || 0.1;
    gsap.to(el, {
      yPercent: -strength * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ------------------------------------------------------------
   Animated number counters
   ------------------------------------------------------------ */
export function animateCount(el, value, { suffix = '', decimals = 0, immediate = false } = {}) {
  if (prefersReduced) { el.textContent = value.toFixed(decimals) + suffix; return; }
  const obj = { n: 0 };
  const tween = {
    n: value, duration: 1.6, ease: 'power2.out',
    onUpdate: () => { el.textContent = obj.n.toFixed(decimals) + suffix; },
  };
  if (!immediate) tween.scrollTrigger = { trigger: el, start: 'top 92%', once: true };
  gsap.to(obj, tween);
}

/* ------------------------------------------------------------
   Header condense + scroll progress bar
   ------------------------------------------------------------ */
export function initChrome() {
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const fab = document.getElementById('fab');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 12);
    fab?.classList.toggle('show', y > 500);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

export { gsap, ScrollTrigger };
