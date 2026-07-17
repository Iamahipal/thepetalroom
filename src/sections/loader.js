import gsap from 'gsap';
import { prefersReduced } from '../lib/motion.js';

/**
 * Intro loader: the logo flower "crochets" itself in via stroke draw,
 * then lifts to reveal the page. Skippable, skips on reduced-motion and
 * on repeat visits within a session. Resolves when the page is revealed.
 */
export function runLoader() {
  return new Promise((resolve) => {
    const loader = document.getElementById('loader');
    const skipBtn = document.getElementById('loaderSkip');
    if (!loader) return resolve();

    const seen = sessionStorage.getItem('tpr_seen');
    const finish = () => {
      loader.classList.add('done');
      document.body.classList.remove('no-scroll');
      sessionStorage.setItem('tpr_seen', '1');
      setTimeout(resolve, 300);
    };

    if (prefersReduced || seen) {
      // no theatrics — reveal immediately
      loader.style.transition = 'none';
      finish();
      return;
    }

    document.body.classList.add('no-scroll');
    const strokes = loader.querySelectorAll('.draw');
    const tl = gsap.timeline({ onComplete: () => setTimeout(finish, 180) });
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.62, ease: 'power2.inOut', stagger: 0.045 })
      .fromTo('.loader-word', { y: 8, opacity: 0 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
      .to('.loader-sub', { opacity: 1, duration: 0.3 }, '-=0.15')
      .to(loader.querySelector('svg'), { scale: 1.05, duration: 0.4, ease: 'power1.inOut' }, '-=0.15');

    skipBtn?.addEventListener('click', () => { tl.kill(); finish(); }, { once: true });
    // hard safety: never trap the user
    setTimeout(() => { if (!loader.classList.contains('done')) { tl.kill(); finish(); } }, 3000);
  });
}
