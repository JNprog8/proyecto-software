/**
 * Módulo de Transición Fluida de Páginas: Mantiene el Top-Bar fijo y coordina
 * una barra de progreso superior con la animación suave de entrada y salida del contenido principal.
 */

function getOrCreateProgressBar() {
  let progressBar = document.querySelector('.page-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'page-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);
  }
  return progressBar;
}

function isEligibleInternalLink(link, event) {
  if (!link) return false;

  const href = link.getAttribute('href');
  if (!href) return false;

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
    return false;
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const targetPath = href.split('#')[0].split('?')[0];

  if (targetPath === currentPath && !href.includes('#')) {
    return false;
  }

  return (
    href.endsWith('.html') ||
    href.includes('index.html') ||
    href.includes('equipo.html') ||
    href.includes('servicios.html') ||
    href.includes('trabajos.html') ||
    href.includes('contacto.html')
  );
}

export function initPageTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mainContent = document.querySelector('#main') || document.querySelector('main');
  const progressBar = getOrCreateProgressBar();

  if (mainContent) {
    mainContent.classList.add('page-content', 'is-page-entering');
    setTimeout(() => {
      mainContent.classList.remove('is-page-entering');
    }, 500);
  }

  window.addEventListener('pageshow', () => {
    if (progressBar) {
      progressBar.classList.add('is-finished');
      setTimeout(() => {
        progressBar.className = 'page-progress-bar';
      }, 400);
    }
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!isEligibleInternalLink(link, event)) return;

    event.preventDefault();
    const href = link.getAttribute('href');

    if (progressBar) {
      progressBar.className = 'page-progress-bar is-active';
    }

    if (mainContent) {
      mainContent.classList.add('is-page-leaving');
    }

    setTimeout(() => {
      window.location.href = href;
    }, 220);
  });
}
