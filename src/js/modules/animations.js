/**
 * Módulo de Animaciones: Revelado suave de elementos mediante IntersectionObserver.
 */
export function initAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length === 0) return;

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
