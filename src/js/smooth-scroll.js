/**
 * smooth-scroll.js
 * Botones (no anclas) que deben scrollear a una sección, ej. el CTA
 * principal del Hero. Los <a href="#..."> ya scrollean solos gracias a
 * `scroll-behavior: smooth` en base.css; esto cubre los <button>.
 */

function handleClick(event) {
  const trigger = event.target.closest('[data-scroll-to]');
  if (!trigger) return;

  const target = document.querySelector(trigger.dataset.scrollTo);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
}

export function initSmoothScroll() {
  document.addEventListener('click', handleClick);
}
