/**
 * modulo de notificaciones toast flotantes.
 * muestra alertas accesibles y auto-desvanecibles sin interrumpir la interaccion del usuario.
 */
export function showToast(message, type = 'success', title = null) {
    let container = document.getElementById('toastNotificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastNotificationContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1090';
        document.body.appendChild(container);
    }

    const typeConfig = {
        success: {
            icon: 'bi-check-circle-fill',
            bg: 'text-bg-success',
            title: title || 'Operación Exitosa'
        },
        error: {
            icon: 'bi-exclamation-octagon-fill',
            bg: 'text-bg-danger',
            title: title || 'Atención'
        },
        warning: {
            icon: 'bi-exclamation-triangle-fill',
            bg: 'text-bg-warning',
            title: title || 'Advertencia'
        },
        info: {
            icon: 'bi-info-circle-fill',
            bg: 'text-bg-info text-white',
            title: title || 'Información'
        }
    };

    const cfg = typeConfig[type] || typeConfig.info;
    const toastId = 'toast_' + Date.now();

    const toastEl = document.createElement('div');
    toastEl.id = toastId;
    toastEl.className = `toast align-items-center ${cfg.bg} border-0 shadow-lg`;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-start gap-2">
                <i class="bi ${cfg.icon} fs-5 mt-n1"></i>
                <div>
                    <div class="fw-bold">${escapeHtml(cfg.title)}</div>
                    <div>${escapeHtml(message)}</div>
                </div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;

    container.appendChild(toastEl);

    if (window.bootstrap && bootstrap.Toast) {
        const bsToast = new bootstrap.Toast(toastEl, { delay: 4500 });
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
        // fallback basico sin bootstrap
        setTimeout(() => toastEl.remove(), 4500);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
