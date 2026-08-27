/**
 * format.js
 * Un solo lugar para formatear precios. Cambiar de moneda o formato
 * para otra campaña/región es editar esta función únicamente.
 */

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
});

/** @param {number} amount */
export function formatPrice(amount) {
  return currencyFormatter.format(amount);
}