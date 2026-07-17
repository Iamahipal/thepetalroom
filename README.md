# The Petal Room 🌸 — a digital craft atelier

An immersive, mobile-first website for **The Petal Room** — handmade crochet flowers,
bouquets, keychains and décor that never wilt. Built as an *experience*, with one job at
its heart: guide visitors to **order on WhatsApp**.

**Live:** https://iamahipal.github.io/thepetalroom/
**Tagline:** *Flowers that last, memories forever.*

## ✨ Highlights

- **Cinematic & tactile** — a "crochet-in" intro loader, kinetic Fraunces display type,
  a soft **WebGL** aurora hero, smooth scroll, film grain and scroll-choreographed reveals.
- **Every product shines** — 3D-tilt cards, accent glows, animated counters, magnetic buttons.
- **Build-your-bouquet** — pick colours, size & occasion; the bouquet **recolours live**, then
  “Design mine on WhatsApp” opens a chat pre-filled with the exact choices.
- **WhatsApp-first** — every order button + the floating FAB deep-link into WhatsApp.
- **Fast & resilient** — Vite build, self-hosted fonts & libraries (no CDN), lazy-loaded WebGL,
  and full **`prefers-reduced-motion`** / low-power / save-data fallbacks. Core content and
  WhatsApp links work even if JavaScript fails.

## 🧱 Stack

Vite + vanilla JS (no UI framework) · [GSAP](https://gsap.com) + ScrollTrigger ·
[Lenis](https://lenis.darkroom.engineering) smooth scroll · [OGL](https://github.com/oframe/ogl)
WebGL · self-hosted **Fraunces** + **Manrope** variable fonts.

## 🚀 Go-live checklist

Everything the shop owner needs is in **`src/config.js`**:

1. **WhatsApp number** — set `CONFIG.whatsappNumber` to the real number in full international
   format, digits only (no `+`, spaces or dashes). e.g. `98765 43210` → `"919876543210"`.
   > Ships with a **placeholder** (`919876543210`).
2. **Contact** — update `instagram`, `instagramHandle`, `email`.
3. **Products** — edit the `PRODUCTS` list (names, prices, descriptions, images, accent colour).
4. **Bouquet options** — tweak `BOUQUET_COLORS`, `BOUQUET_SIZES`, `BOUQUET_OCCASIONS`.

### Using real product photos
Product art lives in `public/assets/products/` as SVG illustrations so the site looks complete
out of the box. Drop a real `.jpg`/`.png` into that folder and point the product's `image`
(in `src/config.js`) at it. Square-ish (~4:3) images look best.

## 🧑‍💻 Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## 📁 Structure

```
index.html              # app shell + SEO content + icon sprite + intro loader
vite.config.js          # base: '/thepetalroom/' (GitHub Pages subpath)
src/
  main.js               # boot & orchestration
  config.js             # ← edit this: CONFIG + PRODUCTS + bouquet options
  lib/                  # motion, cursor, whatsapp, hero-webgl
  sections/             # loader, collection, bouquet
  styles/               # tokens, base, sections
public/assets/          # fonts/, products/*.svg, favicon.svg, fonts.css
.github/workflows/      # deploy-pages.yml (build + deploy to GitHub Pages)
```

## 🌐 Deploy

Pushing to the site branch triggers **GitHub Actions** → `npm ci && npm run build` →
publishes `dist/` to GitHub Pages automatically. No manual steps.

---

Handcrafted with 💗 in Pune, India.
