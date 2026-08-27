/**
 * main.js
 * Único punto de entrada cargado desde index.html (`type="module"`).
 * Cada módulo se inicializa una vez; se comunican entre sí únicamente
 * a través del store centralizado (ver state.js), nunca directamente.
 */

import { initModal } from './modal.js';
import { initFormValidation } from './form-validation.js';
import { initCatalog } from './catalog.js';
import { initCart } from './cart.js';
import { initCheckout } from './checkout.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeader } from './header.js';

function init() {
  initModal();
  initFormValidation();
  initCatalog();
  initCart();
  initCheckout();
  initSmoothScroll();
  initHeader();
}

document.addEventListener('DOMContentLoaded', init);