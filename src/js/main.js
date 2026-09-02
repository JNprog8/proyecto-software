/**
 * Punto de entrada principal para el Portal Corporativo de Next Corp.
 * Inicializa todos los módulos ES tras la carga del DOM.
 */
import { initPageTransitions } from './modules/page-transitions.js';
import { initNavigation } from './modules/navigation.js';
import { initCarousel } from './modules/carousel.js';
import { initPortfolio } from './modules/portfolio.js';
import { initContactForm } from './modules/form-validation.js';
import { initAnimations } from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions();
  initNavigation();
  initCarousel();
  initPortfolio();
  initContactForm();
  initAnimations();
});