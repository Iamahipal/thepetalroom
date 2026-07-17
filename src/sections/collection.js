import { PRODUCTS } from '../config.js';
import { waLink } from '../lib/whatsapp.js';
import { gsap, finePointer, prefersReduced } from '../lib/motion.js';

const asset = (file) => `${import.meta.env.BASE_URL}assets/products/${file}`;

export function renderCollection() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const msg = `Hi The Petal Room! I'd like to order the *${p.name}* (${p.price}). 🌸`;
    const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
    const tags = (p.tags || []).map((t) => `<span>${t}</span>`).join('');
    return `
      <article class="product-card ${p.badge ? 'featured' : ''}" data-reveal style="--_accent:${p.accent}; --_glow:${hexToGlow(p.accent)}">
        <div class="product-media">
          ${badge}
          <div class="product-tags" aria-hidden="true">${tags}</div>
          <div class="product-glow" aria-hidden="true"></div>
          <img src="${asset(p.image)}" alt="${p.name} — handmade crochet" loading="lazy" width="400" height="330" />
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-foot">
            <span class="product-price">${p.price}<small>${p.priceNote}</small></span>
            <a class="btn btn-whatsapp btn-sm product-order magnetic" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Order the ${p.name} on WhatsApp">
              <svg class="ico" viewBox="0 0 24 24"><use href="#i-wa" /></svg> Order
            </a>
          </div>
        </div>
      </article>`;
  }).join('');

  if (finePointer && !prefersReduced) grid.querySelectorAll('.product-card').forEach(initTilt);
}

/** Pointer-driven 3D tilt with a subtle image "lift". */
function initTilt(card) {
  const media = card.querySelector('.product-media img');
  const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
  const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
  gsap.set(card, { transformPerspective: 800, transformOrigin: 'center' });

  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry(px * 10);
    rx(-py * 10);
    if (media) gsap.to(media, { x: px * 10, y: py * 10, duration: 0.5, ease: 'power3' });
  });
  card.addEventListener('pointerleave', () => {
    rx(0); ry(0);
    if (media) gsap.to(media, { x: 0, y: 0, duration: 0.6, ease: 'power3' });
  });
}

function hexToGlow(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.4)`;
}
