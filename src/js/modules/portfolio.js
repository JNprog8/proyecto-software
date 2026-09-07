/**
 * Módulo de Portafolio: Filtra proyectos por categoría mediante delegación
 * de eventos sobre el contenedor padre y alternancia de clases CSS puras (.is-hidden, .is-filtered-in).
 */
import { delegate } from '../utils/dom.js';

export function initPortfolio() {
  const filterContainer = document.querySelector('[data-portfolio-filters]') || document.querySelector('.portfolio-filters');
  const projectCards = Array.from(document.querySelectorAll('[data-portfolio-item]'));

  if (!filterContainer || projectCards.length === 0) return;

  const filterButtons = Array.from(filterContainer.querySelectorAll('[data-portfolio-filter]'));

  delegate(filterContainer, 'click', '[data-portfolio-filter]', (event, btn) => {
    const selectedCategory = btn.getAttribute('data-portfolio-filter');

    filterButtons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    projectCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-portfolio-item');
      const matches = selectedCategory === 'all' || cardCategory === selectedCategory;

      if (matches) {
        card.classList.remove('is-hidden');
        card.classList.remove('is-filtered-in');
        void card.offsetWidth;
        card.classList.add('is-filtered-in');
      } else {
        card.classList.add('is-hidden');
        card.classList.remove('is-filtered-in');
      }
    });
  });
}
