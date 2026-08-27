/**
 * cart.js
 * Popup del carrito (dentro de #cart-modal). Se re-renderiza solo
 * suscribiéndose al store — no conoce a catalog.js ni a checkout.js
 * directamente, solo lee/escribe el estado compartido.
 */

import { subscribe, removeFromCart, cartTotal, cartCount } from './state.js';
import { formatPrice } from './format.js';
import { openModalById, closeModalById } from './modal.js';

const itemsContainer = document.querySelector('[data-cart-items]');
const emptyMessage = document.querySelector('[data-cart-empty]');
const subtotalEl = document.querySelector('[data-cart-subtotal]');
const countBadges = document.querySelectorAll('[data-cart-count]');
const cartButton = document.querySelector('[data-cart-button]');
const checkoutTrigger = document.querySelector('[data-checkout-trigger]');

/** @param {{ id: string, nombre: string, precio: number, cantidad: number }} item */
function renderItem(item) {
  const row = document.createElement('div');
  row.className = 'cart-item';

  const info = document.createElement('div');
  info.className = 'cart-item__info';

  const name = document.createElement('p');
  name.className = 'cart-item__name';
  name.textContent = item.nombre;

  const meta = document.createElement('p');
  meta.className = 'cart-item__meta';
  meta.textContent = `${item.cantidad} x ${formatPrice(item.precio)}`;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'cart-item__remove';
  removeButton.dataset.removeId = item.id;
  removeButton.setAttribute('aria-label', `Quitar ${item.nombre} del carrito`);
  removeButton.textContent = 'x';

  info.append(name, meta);
  row.append(info, removeButton);
  return row;
}

function render(state) {
  if (!itemsContainer) return;

  itemsContainer.innerHTML = '';
  state.cart.forEach((item) => itemsContainer.appendChild(renderItem(item)));

  const hasItems = state.cart.length > 0;
  if (emptyMessage) emptyMessage.hidden = hasItems;
  if (checkoutTrigger) checkoutTrigger.disabled = !hasItems;
  if (subtotalEl) subtotalEl.textContent = formatPrice(cartTotal());

  const count = cartCount();
  countBadges.forEach((badge) => { badge.textContent = String(count); });
  if (cartButton) cartButton.hidden = !state.isRegistered;
}

function handleItemsClick(event) {
  const removeButton = event.target.closest('[data-remove-id]');
  if (removeButton) removeFromCart(removeButton.dataset.removeId);
}

function handleCheckoutTrigger() {
  closeModalById('cart-modal');
  openModalById('checkout-modal');
}

export function initCart() {
  if (!itemsContainer) return;
  subscribe(render);
  itemsContainer.addEventListener('click', handleItemsClick);
  checkoutTrigger?.addEventListener('click', handleCheckoutTrigger);
}
