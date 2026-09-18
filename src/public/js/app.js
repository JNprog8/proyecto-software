/**
 * Aplicación Frontend ABMC - Vanilla JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    // Estado de la aplicación
    let rolesMap = new Map();
    let currentDeleteUserId = null;
    let searchDebounceTimer = null;

    // Referencias al DOM
    const usersTableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    const statsCounter = document.getElementById('statsCounter');
    const searchInput = document.getElementById('searchInput');
    const btnClearSearch = document.getElementById('btnClearSearch');
    const roleFilter = document.getElementById('roleFilter');
    const btnResetFilters = document.getElementById('btnResetFilters');

    // Modales y formularios
    const userModal = document.getElementById('userModal');
    const modalTitle = document.getElementById('modalTitle');
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const formAlert = document.getElementById('formAlert');
    const roleSelect = document.getElementById('rolId');
    const roleDescriptionHint = document.getElementById('roleDescriptionHint');
    const btnSubmitUser = document.getElementById('btnSubmitUser');

    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteUserName = document.getElementById('deleteUserName');
    const deleteUserEmail = document.getElementById('deleteUserEmail');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');

    const toastContainer = document.getElementById('toastContainer');

    // Inicialización
    init();

    async function init() {
        setupEventListeners();
        await loadRoles();
        await loadUsers();
    }

    // Configuración de eventos
    function setupEventListeners() {
        // Apertura de modal Nuevo Usuario
        document.getElementById('btnOpenCreateModal').addEventListener('click', openCreateModal);

        // Cierre de modal de usuario
        document.getElementById('btnCloseUserModal').addEventListener('click', () => userModal.close());
        document.getElementById('btnCancelUserModal').addEventListener('click', () => userModal.close());

        // Cierre de modal de confirmación de eliminación
        document.getElementById('btnCloseDeleteModal').addEventListener('click', () => deleteConfirmModal.close());
        document.getElementById('btnCancelDelete').addEventListener('click', () => deleteConfirmModal.close());

        // Envío de formulario (Alta y Modificación)
        userForm.addEventListener('submit', handleUserFormSubmit);

        // Confirmación de eliminación
        btnConfirmDelete.addEventListener('click', handleConfirmDelete);

        // Búsqueda en tiempo real con debounce
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim().length > 0) {
                btnClearSearch.classList.remove('hidden');
            } else {
                btnClearSearch.classList.add('hidden');
            }

            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                loadUsers();
            }, 300);
        });

        // Limpieza de búsqueda
        btnClearSearch.addEventListener('click', () => {
            searchInput.value = '';
            btnClearSearch.classList.add('hidden');
            loadUsers();
        });

        // Filtrado por rol
        roleFilter.addEventListener('change', () => {
            loadUsers();
        });

        // Restablecer filtros desde empty state
        btnResetFilters.addEventListener('click', () => {
            searchInput.value = '';
            btnClearSearch.classList.add('hidden');
            roleFilter.value = '';
            loadUsers();
        });

        // Cambio de rol en formulario para mostrar descripción
        roleSelect.addEventListener('change', () => {
            const selectedId = parseInt(roleSelect.value, 10);
            if (rolesMap.has(selectedId)) {
                roleDescriptionHint.textContent = rolesMap.get(selectedId).descripcion || '';
            } else {
                roleDescriptionHint.textContent = '';
            }
        });

        // Cerrar modales al hacer clic en el backdrop
        [userModal, deleteConfirmModal].forEach(dialog => {
            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                    rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
        });
    }

    // 1. Cargar Roles desde API
    async function loadRoles() {
        try {
            const response = await fetch('/api/roles');
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                rolesMap.clear();
                roleFilter.innerHTML = '<option value="">Todos los Roles</option>';
                roleSelect.innerHTML = '<option value="">Seleccione un Rol...</option>';

                data.data.forEach(role => {
                    rolesMap.set(role.id, role);

                    // Opción para el filtro
                    const filterOption = document.createElement('option');
                    filterOption.value = role.id;
                    filterOption.textContent = role.nombre;
                    roleFilter.appendChild(filterOption);

                    // Opción para el modal
                    const formOption = document.createElement('option');
                    formOption.value = role.id;
                    formOption.textContent = role.nombre;
                    roleSelect.appendChild(formOption);
                });
            }
        } catch (error) {
            console.error('Error al cargar roles:', error);
            showToast('No se pudieron cargar los roles del sistema', 'danger');
        }
    }

    // 2. Cargar Usuarios desde API
    async function loadUsers() {
        const search = searchInput.value.trim();
        const rolId = roleFilter.value;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (rolId) params.append('rol_id', rolId);

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <span class="spinner" style="border-color: #94a3b8; border-top-color: #3b82f6;"></span>
                    <span style="margin-left: 0.5rem; color: #64748b;">Cargando usuarios...</span>
                </td>
            </tr>
        `;

        try {
            const url = `/api/users${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            const res = await response.json();

            if (res.success) {
                renderUsersTable(res.data);
                statsCounter.textContent = `${res.total} ${res.total === 1 ? 'usuario registrado' : 'usuarios registrados'}`;
            } else {
                throw new Error(res.error || 'Error al obtener usuarios');
            }
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        Ocurrió un error al cargar los usuarios. Verifique que la base de datos esté activa.
                    </td>
                </tr>
            `;
            statsCounter.textContent = 'Error al consultar';
        }
    }

    // 3. Renderizar Tabla de Usuarios
    function renderUsersTable(users) {
        if (!users || users.length === 0) {
            usersTableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        usersTableBody.innerHTML = users.map(user => {
            const initials = getInitials(user.nombre, user.apellido);
            const roleBadgeClass = getRoleBadgeClass(user.rol_nombre);
            const formattedDate = formatDate(user.created_at);

            return `
                <tr data-id="${user.id}">
                    <td>
                        <div class="user-cell">
                            <div class="user-avatar" title="${escapeHtml(user.nombre_completo)}">${initials}</div>
                            <div>
                                <div class="user-name-title">${escapeHtml(user.nombre_completo)}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="user-nickname-code">@${escapeHtml(user.username)}</span>
                    </td>
                    <td>${escapeHtml(user.email)}</td>
                    <td>
                        <span class="role-badge ${roleBadgeClass}">
                            ${escapeHtml(user.rol_nombre || 'Sin Rol')}
                        </span>
                    </td>
                    <td style="color: var(--color-text-muted); font-size: 0.85rem;">
                        ${formattedDate}
                    </td>
                    <td class="text-right">
                        <div class="table-actions">
                            <button class="btn btn-icon btn-edit" title="Modificar usuario" data-user='${JSON.stringify(user)}'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            </button>
                            <button class="btn btn-icon btn-icon-danger btn-delete" title="Eliminar usuario" data-id="${user.id}" data-name="${escapeHtml(user.nombre_completo)}" data-email="${escapeHtml(user.email)}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Vincular listeners a botones de acción
        usersTableBody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const user = JSON.parse(btn.getAttribute('data-user'));
                openEditModal(user);
            });
        });

        usersTableBody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const email = btn.getAttribute('data-email');
                openDeleteModal(id, name, email);
            });
        });
    }

    // 4. Modal Alta de Usuario
    function openCreateModal() {
        modalTitle.textContent = 'Nuevo Usuario';
        userForm.reset();
        userIdInput.value = '';
        clearFormErrors();
        roleDescriptionHint.textContent = '';
        userModal.showModal();
        document.getElementById('nombre').focus();
    }

    // 5. Modal Modificación de Usuario
    function openEditModal(user) {
        modalTitle.textContent = 'Modificar Usuario';
        userForm.reset();
        clearFormErrors();

        userIdInput.value = user.id;
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('apellido').value = user.apellido;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        roleSelect.value = user.rol_id;

        if (rolesMap.has(user.rol_id)) {
            roleDescriptionHint.textContent = rolesMap.get(user.rol_id).descripcion || '';
        } else {
            roleDescriptionHint.textContent = '';
        }

        userModal.showModal();
        document.getElementById('nombre').focus();
    }

    // 6. Procesar formulario (Creación o Edición)
    async function handleUserFormSubmit(e) {
        e.preventDefault();
        clearFormErrors();

        const id = userIdInput.value ? parseInt(userIdInput.value, 10) : null;
        const isEditing = id !== null;

        const payload = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            username: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            rol_id: parseInt(roleSelect.value, 10)
        };

        // Validación cliente preliminar
        let hasClientError = false;
        if (!payload.nombre) {
            setFieldError('nombre', 'El nombre es obligatorio.');
            hasClientError = true;
        }
        if (!payload.apellido) {
            setFieldError('apellido', 'El apellido es obligatorio.');
            hasClientError = true;
        }
        if (!payload.username) {
            setFieldError('username', 'El nickname es obligatorio.');
            hasClientError = true;
        }
        if (!payload.email) {
            setFieldError('email', 'El correo electrónico es obligatorio.');
            hasClientError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            setFieldError('email', 'Formato de correo electrónico inválido.');
            hasClientError = true;
        }
        if (!payload.rol_id || isNaN(payload.rol_id)) {
            setFieldError('rol_id', 'Debe seleccionar un rol.');
            hasClientError = true;
        }

        if (hasClientError) {
            return;
        }

        // Estado de carga del botón
        setButtonLoading(btnSubmitUser, true);

        try {
            const url = isEditing ? `/api/users/${id}` : '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                userModal.close();
                showToast(data.message || (isEditing ? 'Usuario actualizado con éxito' : 'Usuario registrado con éxito'), 'success');
                await loadUsers();
            } else {
                // Manejo de errores de validación de negocio y unicidad
                if (data.errors) {
                    for (const [field, message] of Object.entries(data.errors)) {
                        setFieldError(field, message);
                    }
                }
                if (data.error) {
                    formAlert.textContent = data.error;
                    formAlert.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            formAlert.textContent = 'Ocurrió un error inesperado al comunicarse con el servidor.';
            formAlert.classList.remove('hidden');
        } finally {
            setButtonLoading(btnSubmitUser, false);
        }
    }

    // 7. Modal y confirmación de eliminación
    function openDeleteModal(id, name, email) {
        currentDeleteUserId = id;
        deleteUserName.textContent = name;
        deleteUserEmail.textContent = email;
        deleteConfirmModal.showModal();
    }

    async function handleConfirmDelete() {
        if (!currentDeleteUserId) return;

        setButtonLoading(btnConfirmDelete, true);

        try {
            const response = await fetch(`/api/users/${currentDeleteUserId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                deleteConfirmModal.close();
                showToast(data.message || 'Usuario eliminado correctamente', 'success');
                await loadUsers();
            } else {
                throw new Error(data.error || 'No se pudo eliminar el usuario');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            showToast(error.message, 'danger');
        } finally {
            setButtonLoading(btnConfirmDelete, false);
            currentDeleteUserId = null;
        }
    }

    // Auxiliares de UI
    function clearFormErrors() {
        formAlert.classList.add('hidden');
        formAlert.textContent = '';
        ['nombre', 'apellido', 'username', 'email', 'rol_id'].forEach(field => {
            const span = document.getElementById(`error_${field}`);
            if (span) span.textContent = '';
            const input = document.getElementById(field === 'rol_id' ? 'rolId' : field);
            if (input) input.classList.remove('input-invalid');
        });
    }

    function setFieldError(field, message) {
        const span = document.getElementById(`error_${field}`);
        if (span) span.textContent = message;
        const input = document.getElementById(field === 'rol_id' ? 'rolId' : field);
        if (input) input.classList.add('input-invalid');
    }

    function setButtonLoading(button, isLoading) {
        const textSpan = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner');

        if (isLoading) {
            button.disabled = true;
            if (textSpan) textSpan.style.opacity = '0.7';
            if (spinner) spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (textSpan) textSpan.style.opacity = '1';
            if (spinner) spinner.classList.add('hidden');
        }
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' 
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

        toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function getInitials(nombre, apellido) {
        const n = (nombre || '').trim().charAt(0).toUpperCase();
        const a = (apellido || '').trim().charAt(0).toUpperCase();
        return `${n}${a}` || 'U';
    }

    function getRoleBadgeClass(roleName) {
        const name = (roleName || '').toLowerCase();
        if (name.includes('admin')) return 'role-badge-admin';
        if (name.includes('oper')) return 'role-badge-operator';
        if (name.includes('audit')) return 'role-badge-auditor';
        return 'role-badge-guest';
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString.replace(' ', 'T'));
            return date.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
