# The Petal Room 🌸

A modern, mobile-first website for **The Petal Room** — handmade crochet flowers,
bouquets, keychains and décor. The whole site is built to do one job beautifully:
guide visitors to **order on WhatsApp**.

**Tagline:** *Flowers that last, memories forever.*

## ✨ Features

- **Mobile-first & fully responsive** — looks great on phones, iPads and desktops.
- **WhatsApp-first** — every "Order" button opens a WhatsApp chat with a pre-filled
  message, plus a floating WhatsApp button that follows the visitor.
- **No build step** — plain HTML, CSS and a little vanilla JavaScript. Deploys
  instantly to Netlify (or any static host).
- **Easy to edit** — products and contact details live in one config file.
- Accessible, fast, and animated with tasteful reveal-on-scroll effects
  (respects `prefers-reduced-motion`).

## 🚀 Go-live checklist

Everything you need to change is at the top of **`script.js`**:

1. **WhatsApp number** — set `CONFIG.whatsappNumber` to the real number in full
   international format, digits only (no `+`, spaces or dashes).
   Example for India `98765 43210` → `"919876543210"`.
   > The site currently ships with a **placeholder** number (`919876543210`).
2. **Contact details** — update `instagram`, `instagramHandle` and `email` in `CONFIG`.
3. **Products** — edit the `PRODUCTS` list (names, prices, descriptions, images).

### Using real product photos

The product images live in `assets/products/` as hand-drawn SVG illustrations so the
site looks complete out of the box. To use real photos, drop a `.jpg`/`.png` into that
folder and point the product's `image` path to it in `script.js`. Square-ish images
(roughly 4:3) look best.

## 🧑‍💻 Run locally

It's a static site — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 📁 Structure

```
index.html            # markup & content
styles.css            # all styling (mobile-first, responsive)
script.js             # CONFIG (edit this!), product data & interactions
assets/
  favicon.svg
  products/*.svg      # product illustrations (swap for real photos)
netlify.toml          # Netlify config (static, cache headers)
robots.txt
```

## 🌐 Deploy to Netlify

Connect the repo in Netlify (no build command needed, publish directory `.`),
or drag-and-drop the folder into the Netlify dashboard. Done.

---

Handcrafted with 💗 in Pune, India.
