/**
 * Módulo de Validadores: Funciones que en comprobación de correo corporativo,
 * nombre, teléfono, longitud mínima de texto y sanitización para prevenir inyecciones en el DOM.
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 3) return false;
  const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  return re.test(trimmed);
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function hasMinLength(text, minLength = 1) {
  if (!text || typeof text !== 'string') return false;
  return text.trim().length >= minLength;
}

export function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
