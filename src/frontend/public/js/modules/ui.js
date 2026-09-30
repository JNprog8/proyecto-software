/**
 * modulo de UI (user interface)
 * agrupa la logica de DOM general independiente del negocio: modos oscuros, toasts y utilidades visuales.
 */

export const ui = {
    toastContainer: document.getElementById('toastContainer'),
    darkModeIcon: document.getElementById('darkModeIcon'),

    initDarkMode() {
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme');
        } catch (e) {
            console.warn('localStorage access denied', e);
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            if (this.darkModeIcon) {
                this.darkModeIcon.classList.remove('bi-moon-stars-fill');
                this.darkModeIcon.classList.add('bi-sun-fill');
            }
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    },

    toggleDarkMode() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (this.darkModeIcon) {
            if (newTheme === 'dark') {
                this.darkModeIcon.classList.remove('bi-moon-stars-fill');
                this.darkModeIcon.classList.add('bi-sun-fill');
            } else {
                this.darkModeIcon.classList.remove('bi-sun-fill');
                this.darkModeIcon.classList.add('bi-moon-stars-fill');
            }
        }
    },

    showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toastId = 'toast_' + Date.now();
        const iconClass = type === 'success' ? 'bi-check-circle-fill text-success' :
                          type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' :
                          type === 'danger' ? 'bi-x-circle-fill text-danger' :
                          'bi-info-circle-fill text-info';

        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center border-0 shadow-lg mb-2';
        toastEl.id = toastId;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="toast-header border-bottom-0">
                <i class="bi ${iconClass} me-2 fs-6"></i>
                <strong class="me-auto text-dark">${this.escapeHtml(title)}</strong>
                <small class="text-muted">Ahora</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
            <div class="toast-body pt-0 text-muted small">
                ${this.escapeHtml(message)}
            </div>
        `;

        toastContainer.appendChild(toastEl);
        if (window.bootstrap) {
            const bsToast = new window.bootstrap.Toast(toastEl, { delay: 4000 });
            bsToast.show();
            toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
        }
    },

    escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const parts = dateStr.split(' ')[0].split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return dateStr;
        } catch {
            return dateStr;
        }
    }
};
