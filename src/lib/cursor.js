import gsap from 'gsap';
import { finePointer, allowHeavy } from './motion.js';

/** Desktop-only custom cursor + magnetic buttons. No-op on touch / reduced-motion. */
export function initCursor() {
  if (!finePointer || !allowHeavy) return;

  const ring = document.createElement('div');
  ring.className = 'cursor';
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.append(ring, dot);
  document.body.classList.add('has-cursor');

  const rx = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });

  let visible = false;
  window.addEventListener('pointermove', (e) => {
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
    if (!visible) { visible = true; gsap.to([ring, dot], { opacity: 1, duration: 0.3 }); }
  });
  window.addEventListener('pointerout', (e) => { if (!e.relatedTarget) gsap.to([ring, dot], { opacity: 0, duration: 0.3 }); });

  const hoverables = 'a, button, .magnetic, .swatch, .chip, .product-card';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => ring.classList.remove('is-hover'));
  });

  initMagnetic();
}

/** Buttons that lean toward the pointer. */
export function initMagnetic() {
  if (!finePointer || !allowHeavy) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}
