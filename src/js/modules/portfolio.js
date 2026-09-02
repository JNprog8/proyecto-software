/**
 * Módulo de Portafolio / Trabajos: Filtros interactivos por categoría.
 */
export function initPortfolio() {
  const filterButtons = document.querySelectorAll('[data-portfolio-filter]');
  const projectCards = document.querySelectorAll('[data-portfolio-item]');

  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-portfolio-filter');

      // Actualizar estado de los botones
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('is-active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      // Filtrar proyectos
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-portfolio-item');
        const matches = selectedCategory === 'all' || cardCategory === selectedCategory;

        if (matches) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}
