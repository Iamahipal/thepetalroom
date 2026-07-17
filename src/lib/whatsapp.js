import { CONFIG } from '../config.js';

/** Build a wa.me deep link with a prefilled, URL-encoded message. */
export function waLink(message) {
  const text = encodeURIComponent(message || CONFIG.defaultMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function safeDecode(str) {
  try { return decodeURIComponent(str); } catch { return str; }
}

/** Point every [data-wa] element at WhatsApp. Re-runnable for dynamic nodes. */
export function wireWhatsApp(root = document) {
  root.querySelectorAll('[data-wa]').forEach((el) => {
    const raw = el.getAttribute('data-wa-message');
    const message = raw ? safeDecode(raw) : CONFIG.defaultMessage;
    el.setAttribute('href', waLink(message));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}
