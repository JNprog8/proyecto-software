/**
 * form-validation.js
 * Valida y procesa el registro de cuenta. Ya NO pide tarjeta: ese dato
 * se mueve al checkout (ver checkout.js), que es donde corresponde en
 * cualquier flujo de e-commerce real.
 */

import { runValidation, isRequired, isValidEmail } from './validators.js';
import { register } from './state.js';
import { closeModalById } from './modal.js';

const form = document.querySelector('[data-register-form]');

const rules = {
  nombre: (value) => (isRequired(value) ? '' : 'Ingresá tu nombre.'),
  apellido: (value) => (isRequired(value) ? '' : 'Ingresá tu apellido.'),
  email: (value) => (isValidEmail(value) ? '' : 'Ingresá un email válido.'),
};

function handleSubmit(event) {
  event.preventDefault();

  if (!runValidation(form, rules)) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  register(form.elements.nombre.value.trim());
  form.reset();
  closeModalById('register-modal');
}

export function initFormValidation() {
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
}