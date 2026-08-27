/**
 * Store centralizado minimalista para el flujo e-commerce.
 * El estado se modifica solo mediante acciones exportadas.
 */

/** @typedef {'fisico' | 'digital'} ProductFormat */
/** @typedef {{ id: string, nombre: string, precio: number, formato: ProductFormat, cantidad: number }} CartItem */

const state = {
  /** @type {CartItem[]} */
  cart: [],
  shipping: {
    postalCode: '',
    cost: 0,
    calculated: false,
  },
};

/** @type {Set<(state: typeof state) => void>} */
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener(state));
}

/** @param {(state: typeof state) => void} listener */
export function subscribe(listener) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

/** @param {{ id: string, nombre: string, precio: number, formato: ProductFormat }} producto */
export function addToCart(producto) {
  const existing = state.cart.find((item) => item.id === producto.id);
  if (existing) {
    existing.cantidad += 1;
  } else {
    state.cart.push({ ...producto, cantidad: 1 });
  }

  if (!hasPhysicalItems()) {
    resetShipping();
    return;
  }

  notify();
}

/** @param {string} id */
export function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  if (!hasPhysicalItems()) {
    resetShipping();
    return;
  }
  notify();
}

export function clearCart() {
  state.cart = [];
  resetShipping();
}

/** @param {string} postalCode */
export function setShipping(postalCode) {
  state.shipping.postalCode = postalCode;
  state.shipping.cost = calculateShippingCost(postalCode);
  state.shipping.calculated = true;
  notify();
}

export function resetShipping() {
  state.shipping = {
    postalCode: '',
    cost: 0,
    calculated: false,
  };
  notify();
}

export function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.cantidad, 0);
}

export function cartSubtotal() {
  return state.cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

export function hasPhysicalItems() {
  return state.cart.some((item) => item.formato === 'fisico');
}

export function shippingCost() {
  return hasPhysicalItems() ? state.shipping.cost : 0;
}

export function cartTotal() {
  return cartSubtotal() + shippingCost();
}

function calculateShippingCost(postalCode) {
  const digits = postalCode.replace(/\D/g, '');
  const prefix = Number(digits.slice(0, 2));

  if (digits.length < 4) return 0;
  if (prefix <= 19) return 4500;
  if (prefix <= 59) return 6900;
  return 8900;
}
