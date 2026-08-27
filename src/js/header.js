/**
 * header.js
 * Reacciona al registro del usuario: muestra el saludo y retira el
 * botón "Unirme a la Zona" del header (el carrito lo maneja cart.js,
 * que también escucha `state.isRegistered`).
 */

import { subscribe } from './state.js';

const greeting = document.querySelector('[data-user-greeting]');
const joinButton = document.querySelector('[data-join-button]');

function render(state) {
  if (!state.isRegistered) return;

  if (greeting) {
    greeting.textContent = `Hola, ${state.userName}`;
    greeting.hidden = false;
  }
  joinButton?.remove();
}

export function initHeader() {
  subscribe(render);
}