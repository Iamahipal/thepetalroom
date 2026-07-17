/* ============================================================
   The Petal Room — site configuration & product data
   ------------------------------------------------------------
   ⭐ TO GO LIVE: change the values in CONFIG below.
   Everything the shop owner needs to edit lives right here.
   ============================================================ */

export const CONFIG = {
  /* 🔴 REPLACE with the real WhatsApp number.
     Full international format, digits only (country code + number),
     NO "+", spaces or dashes.  e.g. India 98765 43210 -> "919876543210" */
  whatsappNumber: '919876543210', // <-- PLACEHOLDER, update before launch

  instagram: 'https://www.instagram.com/_thepetalroom_/',
  instagramHandle: '@_thepetalroom_',
  email: 'thepetalroom@gmail.com',
  location: 'Pune, India',

  defaultMessage:
    "Hi The Petal Room! I'd like to order some handmade crochet flowers. 🌸",
};

/* ------------------------------------------------------------
   PRODUCTS — edit names, prices, descriptions or images here.
   `image` is resolved from src/assets at build time (see collection.js).
   `accent` tints the card's glow/among motifs.
   ------------------------------------------------------------ */
export const PRODUCTS = [
  {
    id: 'handcrafted-flower',
    name: 'Handcrafted Flower',
    price: '₹150',
    priceValue: 150,
    priceNote: 'each',
    desc: 'An elegant single bloom — perfect for gifting or brightening a shelf, forever.',
    image: 'handcrafted-flower.svg',
    accent: '#D98A94',
    tags: ['Gifting', 'Home'],
    badge: '',
  },
  {
    id: 'flower-keychain',
    name: 'Flower Keychain',
    price: '₹50',
    priceValue: 50,
    priceNote: 'each',
    desc: 'A cute little crochet flower to carry everywhere — bags, keys and gift add-ons.',
    image: 'flower-keychain.svg',
    accent: '#E29B88',
    tags: ['Everyday', 'Add-on'],
    badge: '',
  },
  {
    id: 'dashboard-flower',
    name: 'Dashboard Flower',
    price: '₹250',
    priceValue: 250,
    priceNote: 'each',
    desc: 'Timeless blooms designed to sit pretty on your car dashboard, mile after mile.',
    image: 'dashboard-flower.svg',
    accent: '#B283C2',
    tags: ['Car', 'Décor'],
    badge: '',
  },
  {
    id: 'desk-flower',
    name: 'Desk Flower',
    price: '₹250',
    priceValue: 250,
    priceNote: 'each',
    desc: 'Premium floral décor to bring calm and colour to your workspace or study.',
    image: 'desk-flower.svg',
    accent: '#8FA382',
    tags: ['Workspace', 'Décor'],
    badge: '',
  },
  {
    id: 'fridge-magnet',
    name: 'Fridge Magnet',
    price: '₹200',
    priceValue: 200,
    priceNote: 'each',
    desc: 'Beautiful handcrafted flower magnets that turn any fridge into a little garden.',
    image: 'fridge-magnet.svg',
    accent: '#E0B03A',
    tags: ['Home', 'Gifting'],
    badge: '',
  },
  {
    id: 'customized-bouquet',
    name: 'Customized Bouquet',
    price: 'From ₹350',
    priceValue: 350,
    priceNote: 'made to order',
    desc: 'A personalised arrangement in your colours — the gift they will keep forever.',
    image: 'customized-bouquet.svg',
    accent: '#C56B78',
    tags: ['Best seller', 'Custom'],
    badge: 'Best seller',
  },
];

/* Trust badges shown under the hero */
export const TRUST = [
  { icon: '🧶', title: '100% handmade', note: 'Every petal crocheted by hand' },
  { icon: '🌿', title: 'Never wilts', note: 'Lasts for years, not days' },
  { icon: '🎁', title: 'Made to order', note: 'Colours & styles your way' },
  { icon: '🚚', title: 'Ships across India', note: 'Carefully packed with love' },
];

export const STATS = [
  { value: 500, suffix: '+', label: 'Happy customers' },
  { value: 1000, suffix: '+', label: 'Gifts crafted' },
  { value: 4.9, suffix: '★', label: 'Average rating', decimals: 1 },
];

export const TESTIMONIALS = [
  { stars: 5, quote: 'My bouquet still looks perfect months later. It sits on my desk and everyone asks where I got it!', name: 'Aditi', city: 'Pune' },
  { stars: 5, quote: 'Ordered a custom set for my mom’s birthday. The colours were exactly what I asked for. So thoughtful.', name: 'Rohan', city: 'Mumbai' },
  { stars: 5, quote: 'The little keychains are adorable and so well made. Ordering more as gifts for my whole team.', name: 'Sneha', city: 'Bengaluru' },
  { stars: 5, quote: 'Beautiful craftsmanship and lovely packaging. It genuinely felt like a handmade gift made with love.', name: 'Meera', city: 'Delhi' },
];

/* Build-your-bouquet palette options */
export const BOUQUET_COLORS = [
  { id: 'rose', label: 'Blush Rose', hex: '#D98A94' },
  { id: 'plum', label: 'Lavender', hex: '#B283C2' },
  { id: 'peach', label: 'Peach', hex: '#E29B88' },
  { id: 'butter', label: 'Butter', hex: '#EAC85A' },
  { id: 'sage', label: 'Sage', hex: '#8FA382' },
  { id: 'cream', label: 'Cream', hex: '#EBD9B8' },
  { id: 'ruby', label: 'Ruby', hex: '#C0506A' },
  { id: 'sky', label: 'Sky', hex: '#8FB6C9' },
];

export const BOUQUET_OCCASIONS = ['Birthday', 'Anniversary', 'Just because', 'Graduation', 'Get well', 'Wedding'];
export const BOUQUET_SIZES = [
  { id: 'petite', label: 'Petite', stems: '3–5 stems' },
  { id: 'classic', label: 'Classic', stems: '6–9 stems' },
  { id: 'grand', label: 'Grand', stems: '10+ stems' },
];
