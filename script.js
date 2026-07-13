/* ============================================================
   The Petal Room — script.js
   ------------------------------------------------------------
   ⭐ TO GO LIVE: change the values in CONFIG below.
   Everything the shop owner needs to edit lives right here.
   ============================================================ */

const CONFIG = {
  /* 🔴 REPLACE with the real WhatsApp number.
     Full international format, digits only (country code + number),
     NO "+", spaces or dashes.  e.g. India 98765 43210 -> "919876543210" */
  whatsappNumber: "919876543210", // <-- PLACEHOLDER, update before launch

  // Shown on the site / used in links
  instagram: "https://www.instagram.com/_thepetalroom_/",
  instagramHandle: "@_thepetalroom_",
  email: "thepetalroom@gmail.com",

  // Default message when someone taps the generic "Order on WhatsApp"
  defaultMessage: "Hi The Petal Room! I'd like to order some handmade crochet flowers. 🌸",
};

/* ------------------------------------------------------------
   PRODUCTS — edit names, prices, descriptions or images here.
   `image` points to a file in assets/products/.  To use a real
   photo, drop a .jpg/.png in that folder and update the path.
   ------------------------------------------------------------ */
const PRODUCTS = [
  {
    name: "Handcrafted Flower",
    price: "₹150",
    priceNote: "each",
    desc: "An elegant single bloom — perfect for gifting or brightening a shelf, forever.",
    image: "assets/products/handcrafted-flower.svg",
    badge: "",
  },
  {
    name: "Flower Keychain",
    price: "₹50",
    priceNote: "each",
    desc: "A cute little crochet flower to carry everywhere — bags, keys and gift add-ons.",
    image: "assets/products/flower-keychain.svg",
    badge: "",
  },
  {
    name: "Dashboard Flower",
    price: "₹250",
    priceNote: "each",
    desc: "Timeless blooms designed to sit pretty on your car dashboard, mile after mile.",
    image: "assets/products/dashboard-flower.svg",
    badge: "",
  },
  {
    name: "Desk Flower",
    price: "₹250",
    priceNote: "each",
    desc: "Premium floral décor to bring calm and colour to your workspace or study.",
    image: "assets/products/desk-flower.svg",
    badge: "",
  },
  {
    name: "Fridge Magnet",
    price: "₹200",
    priceNote: "each",
    desc: "Beautiful handcrafted flower magnets that turn any fridge into a garden.",
    image: "assets/products/fridge-magnet.svg",
    badge: "",
  },
  {
    name: "Customized Bouquet",
    price: "From ₹350",
    priceNote: "made to order",
    desc: "A personalised arrangement in your colours — the gift they'll keep forever.",
    image: "assets/products/customized-bouquet.svg",
    badge: "Best seller",
  },
];

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function waLink(message) {
  const text = encodeURIComponent(message || CONFIG.defaultMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

// data-wa-message may already contain %0A etc. Decode first so we don't double-encode.
function safeDecode(str) {
  try { return decodeURIComponent(str); } catch { return str; }
}

/* ------------------------------------------------------------
   Render products
   ------------------------------------------------------------ */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const msg = `Hi The Petal Room! I'd like to order the *${p.name}* (${p.price}). 🌸`;
    const badge = p.badge ? `<span class="product-badge">${p.badge}</span>` : "";
    return `
      <article class="product-card reveal">
        <div class="product-media">
          ${badge}
          <img src="${p.image}" alt="${p.name} — handmade crochet" loading="lazy" />
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-foot">
            <span class="product-price">${p.price}<small>${p.priceNote}</small></span>
            <a class="btn btn-whatsapp btn-sm product-order" href="${waLink(msg)}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><use href="#wa-icon" /></svg>
              Order
            </a>
          </div>
        </div>
      </article>`;
  }).join("");
}

/* ------------------------------------------------------------
   Wire every [data-wa] element to a WhatsApp link
   ------------------------------------------------------------ */
function wireWhatsApp() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const raw = el.getAttribute("data-wa-message");
    const message = raw ? safeDecode(raw) : CONFIG.defaultMessage;
    el.setAttribute("href", waLink(message));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

/* ------------------------------------------------------------
   Contact details from CONFIG
   ------------------------------------------------------------ */
function applyContactConfig() {
  const ig = document.getElementById("igLink");
  if (ig) { ig.setAttribute("href", CONFIG.instagram); }
  const email = document.getElementById("emailLink");
  if (email) { email.setAttribute("href", `mailto:${CONFIG.email}`); }
  const year = document.getElementById("year");
  if (year) { year.textContent = new Date().getFullYear(); }
}

/* ------------------------------------------------------------
   Mobile nav toggle
   ------------------------------------------------------------ */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const close = () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); };
  const open = () => { nav.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); toggle.setAttribute("aria-label", "Close menu"); };

  toggle.addEventListener("click", () => {
    nav.classList.contains("open") ? close() : open();
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

/* ------------------------------------------------------------
   Sticky header shadow on scroll
   ------------------------------------------------------------ */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------ */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((i) => i.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((i) => io.observe(i));
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();   // build cards first
  wireWhatsApp();     // then wire all WA links (incl. new cards)
  applyContactConfig();
  initNav();
  initHeaderScroll();

  // mark section cards for reveal, then observe
  document.querySelectorAll(".trust-item, .value-card, .step, .testi-card, .bestseller-visual, .bestseller-copy")
    .forEach((el) => el.classList.add("reveal"));
  initReveal();
});
