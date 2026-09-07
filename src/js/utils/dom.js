/**
 * Utilidades DOM y Manejo de Eventos: Delegación de eventos (fase de burbujeo),
 * registro de listeners seguros, selectores auxiliares y control de foco accesible.
 */

export function delegate(container, eventType, selector, handler, options = false) {
  if (!container || typeof handler !== 'function') return () => {};

  const listener = (event) => {
    const target = event.target ? event.target.closest(selector) : null;
    if (target && container.contains(target)) {
      handler.call(target, event, target);
    }
  };

  container.addEventListener(eventType, listener, options);

  return () => {
    container.removeEventListener(eventType, listener, options);
  };
}

export function on(target, type, listener, options) {
  if (!target) return () => {};
  target.addEventListener(type, listener, options);
  return () => target.removeEventListener(type, listener, options);
}

export function safeQuery(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (err) {
    console.warn(`[DOM Helper] Selector inválido: ${selector}`, err);
    return null;
  }
}

export function safeQueryAll(selector, context = document) {
  try {
    return Array.from(context.querySelectorAll(selector));
  } catch (err) {
    console.warn(`[DOM Helper] Selector inválido: ${selector}`, err);
    return [];
  }
}

export function trapFocus(container, event) {
  if (!container || event.key !== 'Tab') return;

  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusables.length === 0) return;

  const firstFocusable = focusables[0];
  const lastFocusable = focusables[focusables.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault();
    lastFocusable.focus();
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
  }
}
