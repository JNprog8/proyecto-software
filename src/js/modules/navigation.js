/**
 * Módulo de Navegación: Orquesta el comportamiento de la cabecera sticky,
 * la interacción del menú móvil accesible con trampa de foco y el scroll-spy para anclas de sección.
 */
import { trapFocus } from '../utils/dom.js';

function setupStickyHeader(header) {
  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function setupMobileMenu(header, navToggle, mobileNav) {
  if (!navToggle || !mobileNav) return;

  const toggleMenu = (isOpen) => {
    const state = typeof isOpen === 'boolean' ? isOpen : navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(state));
    mobileNav.classList.toggle('is-open', state);
    document.body.style.overflow = state ? 'hidden' : '';

    if (state) {
      const firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  };

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      toggleMenu(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('is-open') && (!header || !header.contains(e.target))) {
      toggleMenu(false);
    }
  });

  mobileNav.addEventListener('keydown', (e) => {
    trapFocus(mobileNav, e);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      toggleMenu(false);
      navToggle.focus();
    }
  });
}

function setupScrollSpy(navLinks) {
  const sections = document.querySelectorAll('section[id]');
  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
              link.classList.toggle('is-active', href === `#${id}`);
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -70% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initNavigation() {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));

  setupStickyHeader(header);
  setupMobileMenu(header, navToggle, mobileNav);
  setupScrollSpy(navLinks);
}
