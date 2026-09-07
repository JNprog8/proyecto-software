/**
 * Módulo de Animaciones: Revelado suave de elementos en el viewport mediante IntersectionObserver
 * respetando las preferencias de movimiento reducido del sistema.
 */
export function initAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach((el) => observer.observe(el));
}
