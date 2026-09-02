/**
 * Módulo de Navegación: Sticky header, menú móvil accesible y smooth scrolling.
 */
export function initNavigation() {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const navLinks = document.querySelectorAll('[data-nav-link]');

  // 1. Sticky Header con detección de scroll
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Control del Menú Móvil
  if (navToggle && mobileNav) {
    const toggleMenu = (isOpen) => {
      const state = typeof isOpen === 'boolean' ? isOpen : navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(state));
      mobileNav.classList.toggle('is-open', state);
      document.body.style.overflow = state ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Cerrar al hacer click en enlaces del menú
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Cerrar con tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  // 3. Resaltar sección activa al hacer scroll
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('is-active');
              } else {
                link.classList.remove('is-active');
              }
            });
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
