/**
 * checkout.js
 * Pide los datos de tarjeta al finalizar la compra. Sigue siendo DEMO:
 * no hay `fetch` ni almacenamiento de estos datos en ningún lugar de
 * este archivo. Cuando haya integración real, reemplazar `handleSubmit`
 * por la llamada a Stripe/MercadoPago Checkout.
 */

import { subscribe, cartTotal, clearCart } from './state.js';
import { closeModalById } from './modal.js';
import { formatPrice } from './format.js';
import {
  isValidCardNumber,
  isValidExpiry,
  isValidCvv,
  formatCardNumberInput,
  formatExpiryInput,
  runValidation,
} from './validators.js';

const form = document.querySelector('[data-checkout-form]');
const totalEl = document.querySelector('[data-checkout-total]');
const successMessage = document.querySelector('[data-checkout-success]');

const rules = {
  cardNumber: (value) => (isValidCardNumber(value) ? '' : 'Número de tarjeta inválido.'),
  cardExpiry: (value) => (isValidExpiry(value) ? '' : 'Formato esperado MM/AA.'),
  cardCvv: (value) => (isValidCvv(value) ? '' : 'CVV inválido.'),
};

function renderTotal() {
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
}

/** Simula el procesamiento de pago y limpia el carrito al confirmar. */
function handleSubmit(event) {
  event.preventDefault();

  if (!runValidation(form, rules)) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  form.hidden = true;
  if (successMessage) {
    successMessage.hidden = false;
    successMessage.focus();
  }

  setTimeout(() => {
    clearCart();
    form.reset();
    form.hidden = false;
    if (successMessage) successMessage.hidden = true;
    closeModalById('checkout-modal');
  }, 1600);
}

export function initCheckout() {
  if (!form) return;

  subscribe(renderTotal);

  form.querySelector('#checkout-card-number')?.addEventListener('input', (event) => {
    event.target.value = formatCardNumberInput(event.target.value);
  });
  form.querySelector('#checkout-card-exp')?.addEventListener('input', (event) => {
    event.target.value = formatExpiryInput(event.target.value);
  });

  form.addEventListener('submit', handleSubmit);
}
