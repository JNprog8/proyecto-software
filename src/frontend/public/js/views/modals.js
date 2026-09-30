/**
 * modulo de gestion de modales (schema-driven form & delete modals).
 * controla el ciclo de vida del modal de formulario y del modal destructivo de confirmacion.
 */
import { userSchema } from '../schema/userSchema.js';

export class ModalsView {
    constructor({ formModalEl, deleteModalEl, onSave, onConfirmDelete }) {
        this.formModalEl = formModalEl;
        this.deleteModalEl = deleteModalEl;
        this.onSave = onSave;
        this.onConfirmDelete = onConfirmDelete;

        this.bsFormModal = window.bootstrap ? new bootstrap.Modal(formModalEl) : null;
        this.bsDeleteModal = window.bootstrap ? new bootstrap.Modal(deleteModalEl) : null;

        this.formEl = formModalEl.querySelector('form');
        this.modalTitleEl = formModalEl.querySelector('#modalTitle');
        this.btnSubmit = formModalEl.querySelector('#btnSubmitUser');
        this.formAlert = formModalEl.querySelector('#formAlert');

        this.deleteConfirmBtn = deleteModalEl.querySelector('#btnConfirmDelete');
        this.deleteTargetNameEl = deleteModalEl.querySelector('#deleteTargetName') || deleteModalEl.querySelector('#deleteUserName');

        this.editingUserId = null;
        this.pendingDeleteId = null;

        this.bindEvents();
    }

    bindEvents() {
        if (this.formEl) {
            this.formEl.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(this.formEl);
                const data = {
                    nombre: formData.get('nombre')?.toString().trim(),
                    apellido: formData.get('apellido')?.toString().trim(),
                    username: formData.get('username')?.toString().trim(),
                    email: formData.get('email')?.toString().trim(),
                    rol_id: Number(formData.get('rol_id'))
                };

                this.setSubmitting(true);
                try {
                    await this.onSave(data, this.editingUserId);
                    this.hideFormModal();
                } catch (err) {
                    this.showFormError(err.message || 'Error al procesar la solicitud.');
                } finally {
                    this.setSubmitting(false);
                }
            });
        }

        if (this.deleteConfirmBtn) {
            this.deleteConfirmBtn.addEventListener('click', async () => {
                if (!this.pendingDeleteId) return;

                this.setDeleting(true);
                try {
                    await this.onConfirmDelete(this.pendingDeleteId);
                    this.hideDeleteModal();
                } catch (err) {
                    alert('Error: ' + err.message);
                } finally {
                    this.setDeleting(false);
                }
            });
        }
    }

    /**
     * abre el modal de formulario para registrar un nuevo usuario.
     */
    openForCreate(roles) {
        this.editingUserId = null;
        if (this.modalTitleEl) {
            this.modalTitleEl.innerHTML = '<i class="bi bi-person-plus-fill me-2 text-primary"></i>Inscribir Nuevo Participante';
        }
        this.clearFormErrors();
        this.formEl.reset();
        this.populateRoles(roles);
        this.bsFormModal?.show();
    }

    /**
     * abre el modal de formulario con los datos cargados para editar.
     */
    openForEdit(user, roles) {
        this.editingUserId = user.id;
        if (this.modalTitleEl) {
            this.modalTitleEl.innerHTML = `<i class="bi bi-pencil-square me-2 text-primary"></i>Modificar Participante <span class="badge bg-light text-secondary">#${user.id}</span>`;
        }
        this.clearFormErrors();
        this.populateRoles(roles, user.rol_id);

        // completar valores
        const userIdInput = this.formEl.querySelector('#userId');
        if (userIdInput) userIdInput.value = user.id;

        const nombreInput = this.formEl.querySelector('#nombre');
        if (nombreInput) nombreInput.value = user.nombre || '';

        const apellidoInput = this.formEl.querySelector('#apellido');
        if (apellidoInput) apellidoInput.value = user.apellido || '';

        const usernameInput = this.formEl.querySelector('#username');
        if (usernameInput) usernameInput.value = user.username || '';

        const emailInput = this.formEl.querySelector('#email');
        if (emailInput) emailInput.value = user.email || '';

        const rolSelect = this.formEl.querySelector('#rolId');
        if (rolSelect) rolSelect.value = user.rol_id;

        this.bsFormModal?.show();
    }

    /**
     * abre el modal de confirmacion de baja logica.
     */
    openForDelete(user) {
        this.pendingDeleteId = user.id;
        if (this.deleteTargetNameEl) {
            this.deleteTargetNameEl.textContent = `${user.nombre_completo || user.nombre} (@${user.username})`;
        }
        this.bsDeleteModal?.show();
    }

    populateRoles(roles, selectedId = null) {
        const select = this.formEl.querySelector('#rolId');
        if (!select) return;

        select.innerHTML = '<option value="" disabled selected>Seleccione un rol...</option>' +
            roles.map((r) => `<option value="${r.id}" ${r.id === selectedId ? 'selected' : ''}>${r.nombre}</option>`).join('');
    }

    hideFormModal() {
        this.bsFormModal?.hide();
    }

    hideDeleteModal() {
        this.bsDeleteModal?.hide();
    }

    showFormError(msg) {
        if (!this.formAlert) return;
        this.formAlert.classList.remove('d-none');
        this.formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${escapeHtml(msg)}`;
    }

    clearFormErrors() {
        if (this.formAlert) {
            this.formAlert.classList.add('d-none');
            this.formAlert.innerHTML = '';
        }
    }

    setSubmitting(isSubmitting) {
        if (!this.btnSubmit) return;
        this.btnSubmit.disabled = isSubmitting;
        this.btnSubmit.innerHTML = isSubmitting
            ? '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...'
            : '<i class="bi bi-check-lg me-1"></i>Guardar Participante';
    }

    setDeleting(isDeleting) {
        if (!this.deleteConfirmBtn) return;
        this.deleteConfirmBtn.disabled = isDeleting;
        this.deleteConfirmBtn.innerHTML = isDeleting
            ? '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Dando de baja...'
            : '<i class="bi bi-trash3 me-1"></i>Confirmar Eliminación';
    }
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
