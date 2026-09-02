/**
 * Módulo de Transición Fluida de Páginas (Estilo Lando Norris / High-End UI):
 * Mantiene el Top Bar fijo y estable sin duplicar animaciones ni parpadeos,
 * coordinando una barra de carga superior ultra-fina con un suave reveal del contenido principal.
 */
export function initPageTransitions() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const mainContent = document.querySelector('#main') || document.querySelector('main');

  // 1. Inyectar o asegurar la barra de progreso superior en el DOM
  let progressBar = document.querySelector('.page-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'page-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);
  }

  // 2. Animación de entrada suave del contenido al cargar
  if (mainContent) {
    mainContent.classList.add('page-content', 'is-page-entering');
    setTimeout(() => {
      mainContent.classList.remove('is-page-entering');
    }, 500);
  }

  // Finalizar barra de progreso al estar lista la página
  window.addEventListener('pageshow', () => {
    if (progressBar) {
      progressBar.classList.add('is-finished');
      setTimeout(() => {
        progressBar.className = 'page-progress-bar';
      }, 400);
    }
  });

  // 3. Interceptar clics en enlaces de navegación interna
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignorar hashes en la misma página, enlaces externos o teclas modificadoras
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.target === '_blank' ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    // Comprobar si es un enlace a una página HTML interna
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const targetPath = href.split('#')[0].split('?')[0];

    // Si ya estamos en esa página exacta (ej. clic en Home estando en Home), no relanzar
    if (targetPath === currentPath && !href.includes('#')) {
      event.preventDefault();
      return;
    }

    const isInternalPage =
      href.endsWith('.html') ||
      href.includes('index.html') ||
      href.includes('equipo.html') ||
      href.includes('servicios.html') ||
      href.includes('trabajos.html') ||
      href.includes('contacto.html');

    if (isInternalPage) {
      event.preventDefault();

      // Iniciar barra de progreso superior
      if (progressBar) {
        progressBar.className = 'page-progress-bar is-active';
      }

      // Transicionar suavemente solo el contenido principal (el header queda intacto)
      if (mainContent) {
        mainContent.classList.add('is-page-leaving');
      }

      // Navegar rápidamente de forma limpia
      setTimeout(() => {
        window.location.href = href;
      }, 220);
    }
  });
}
