/**
 * validators.js
 * Reglas de validación y formateo de inputs, reutilizables por
 * cualquier formulario del sitio (evita duplicar la misma lógica
 * entre el registro y el checkout).
 */

export const isRequired = (value) => value.trim().length >= 2;
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function isValidCardNumber(value) {
  const digits = value.replace(/\s/g, '');
  return /^\d{13,19}$/.test(digits);
}

export function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const [, month, year] = match;
  if (Number(month) < 1 || Number(month) > 12) return false;
  const expiry = new Date(2000 + Number(year), Number(month));
  return expiry > new Date();
}

export const isValidCvv = (value) => /^\d{3,4}$/.test(value);

/** Autoformatea "0000 0000 0000 0000" mientras se escribe. */
export function formatCardNumberInput(rawValue) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/** Autoformatea "MM/AA" mientras se escribe. */
export function formatExpiryInput(rawValue) {
  const digits = rawValue.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/**
 * Corre un set de reglas `{ nombreDeCampo: (value) => mensajeDeError }`
 * sobre un <form>, pinta los errores en `[data-error-for]` y marca
 * `aria-invalid`. Devuelve true si todos los campos son válidos.
 * @param {HTMLFormElement} form
 * @param {Record<string, (value: string) => string>} rules
 */
export function runValidation(form, rules) {
  let isValid = true;

  for (const [fieldName, validate] of Object.entries(rules)) {
    const input = form.elements[fieldName];
    if (!input) continue;

    const message = validate(input.value);
    const errorEl = form.querySelector(`[data-error-for="${input.id}"]`);
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');

    if (message) isValid = false;
  }

  return isValid;
}