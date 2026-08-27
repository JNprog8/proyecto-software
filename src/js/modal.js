/**
 * modal.js
 * Maneja apertura/cierre de CUALQUIER <dialog> del sitio (registro,
 * carrito, checkout...) de forma genérica, vía delegación de eventos.
 *
 * Convención: un trigger usa `data-open-modal="id-del-dialog"`.
 * Un botón de cierre dentro de un dialog usa `data-close-modal`
 * (cierra el <dialog> ancestro más cercano).
 */

let lastFocusedElement = null;

/** @param {string} id */
export function openModalById(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;

  lastFocusedElement = document.activeElement;
  if (!dialog.open) dialog.showModal();
  const firstFocusable = dialog.querySelector('input, select, textarea, button, [href]');
  firstFocusable?.focus();
}

/** @param {HTMLDialogElement} dialog */
function closeModal(dialog) {
  if (!dialog) return;
  dialog.close();
  lastFocusedElement?.focus();
}

/** @param {string} id */
export function closeModalById(id) {
  const dialog = document.getElementById(id);
  if (dialog?.open) closeModal(dialog);
}

/**
 * Click en el propio <dialog> (fuera de su contenido) = click en el
 * backdrop, porque el elemento `dialog` ocupa todo el viewport cuando
 * está abierto.
 */
function handleDocumentClick(event) {
  const opener = event.target.closest('[data-open-modal]');
  if (opener) {
    openModalById(opener.dataset.openModal);
    return;
  }

  const closer = event.target.closest('[data-close-modal]');
  if (closer) {
    closeModal(closer.closest('dialog'));
    return;
  }

  if (event.target.tagName === 'DIALOG') {
    closeModal(event.target);
  }
}

export function initModal() {
  document.addEventListener('click', handleDocumentClick);
}
