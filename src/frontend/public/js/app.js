/**
 * frontend ABMC - hackaton UNRN 2026 con control de acceso RBAC
 * consume la API REST, gestiona la conmutacion de identidades y renderiza vistas por rol.
 */
import { api, resolveApiUrl } from './modules/api.js';
import { state } from './modules/state.js';
import { ui } from './modules/ui.js';
import { rolesUI } from './modules/roles.js?v=2';

// Interceptor transparente de fetch para garantizar portabilidad en subdirectorios de servidores Apache (XAMPP / WAMP)
const originalFetch = window.fetch;
window.fetch = function (resource, init) {
    if (typeof resource === 'string' && resource.startsWith('/api')) {
        resource = resolveApiUrl(resource);
    }
    return originalFetch.call(this, resource, init);
};

function createModalInstance(element) {
    if (!element) return null;
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        return bootstrap.Modal.getOrCreateInstance(element);
    }

    let backdrop = null;
    let previousFocus = null;

    const hide = () => {
        element.classList.remove('show');
        element.setAttribute('aria-hidden', 'true');
        element.removeAttribute('aria-modal');
        backdrop?.remove();
        backdrop = null;
        document.body.classList.remove('modal-open');
        previousFocus?.focus();
    };

    element.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && element.dataset.bsKeyboard !== 'false') hide();
    });

    element.addEventListener('click', (event) => {
        if (event.target === element && element.dataset.bsBackdrop !== 'static') hide();
    });

    return {
        show() {
            if (element.classList.contains('show')) return;
            previousFocus = document.activeElement;
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
            element.classList.add('show');
            element.setAttribute('aria-modal', 'true');
            element.removeAttribute('aria-hidden');
            element.querySelector('input:not([type="hidden"]), select, textarea')?.focus();
        },
        hide
    };
}

const initApp = () => {
    // timer debounce para busqueda
    let searchDebounceTimer = null;
    let cachedUsers = [];
    let rolesMap = new Map();
    let currentAuthUser = null;
    let currentDeleteUserId = null;
    let currentPage = 1;
    const pageLimit = 10;

    let bsUserCreateModal = null;
    let bsUserEditModal = null;
    let bsDeleteModal = null;
    let bsRoleCreateModal = null;
    let bsRoleEditModal = null;
    let bsRoleDeleteModal = null;
    bsUserCreateModal = createModalInstance(document.getElementById('userCreateModal'));
    bsUserEditModal = createModalInstance(document.getElementById('userEditModal'));
    bsDeleteModal = createModalInstance(document.getElementById('deleteConfirmModal'));
    bsRoleCreateModal = createModalInstance(document.getElementById('roleCreateModal'));
    bsRoleEditModal = createModalInstance(document.getElementById('roleEditModal'));
    bsRoleDeleteModal = createModalInstance(document.getElementById('deleteRoleConfirmModal'));

    // referencias del DOM

    // conmutador de identidad y banner
    const roleSwitcher = document.getElementById('roleSwitcher');
    const activeUserName = document.getElementById('activeUserName');
    const activeUserRoleBadge = document.getElementById('activeUserRoleBadge');
    const activeRoleDescription = document.getElementById('activeRoleDescription');

    // vistas por rol
    const views = {
        organizador: document.getElementById('viewOrganizador'),
        mentor: document.getElementById('viewMentor'),
        juez: document.getElementById('viewJuez'),
        participante: document.getElementById('viewParticipante'),
        visitante: document.getElementById('viewVisitante')
    };

    // controles del panel organizador
    const usersTableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    const statsCounter = document.getElementById('statsCounter');
    const searchInput = document.getElementById('searchInput');
    const btnClearSearch = document.getElementById('btnClearSearch');
    const roleFilter = document.getElementById('roleFilter');
    const btnResetFilters = document.getElementById('btnResetFilters');
    const paginationContainer = document.getElementById('paginationContainer');
    const userRoleSelects = [
        document.getElementById('rolIdCreate'),
        document.getElementById('rolIdEdit')
    ].filter(Boolean);

    // metricas del hero
    const heroUserCount = document.getElementById('heroUserCount');
    const heroRoleCount = document.getElementById('heroRoleCount');
    const rolesCardsContainer = document.getElementById('rolesCardsContainer');

    // formulario de usuario (modal)
                                        
            
    // modal de eliminacion
    const deleteUserName = document.getElementById('deleteUserName');
    const deleteUserEmail = document.getElementById('deleteUserEmail');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const deleteSpinner = document.getElementById('deleteSpinner');
    const deleteBtnText = document.getElementById('deleteBtnText');

    // botones de sesion y UX
    const btnLogout = document.getElementById('btnLogout');
    const btnPublicLogin = document.getElementById('btnPublicLogin');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');

    // contenedores de vistas especificas
    const mentorUsersTableBody = document.getElementById('mentorUsersTableBody');
    const publicUsersTableBody = document.getElementById('publicUsersTableBody');
    const mentorsListContainer = document.getElementById('mentorsListContainer');

    // elementos del perfil de participante
    const participantName = document.getElementById('participantName');
    const participantUsername = document.getElementById('participantUsername');
    const participantEmail = document.getElementById('participantEmail');
    const participantAvatar = document.getElementById('participantAvatar');
    const btnEditMyProfile = document.getElementById('btnEditMyProfile');

    // rubrica de juez
    const scoreSliders = document.querySelectorAll('.score-slider');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const btnSubmitScore = document.getElementById('btnSubmitScore');

    // contenedor toast
    const toastContainer = document.getElementById('toastContainer');

    // inicializacion
    init();

    async function init() {
        ui.initDarkMode();
        setupEventListeners();
        await loadRoles();
        await fetchAuthUser();
        await loadUsers();
    }

    // eventos (+ configuracion)
    function setupEventListeners() {
        // funcion lambda (helper) para evitar verbosidad y chequeos null repetitivos
        const on = (id, event, action) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, action);
        };

        // conmutador de identidad (simulador de roles en navbar)
        on('roleSwitcher', 'change', handleRoleSwitch);

        // apertura de modal manejada por eventos nativos de Bootstrap
        
        on('btnPublicLogin', 'click', () => {
            const switcher = document.getElementById('roleSwitcher');
            if (switcher) switcher.focus();
            ui.showToast('Inicio de Sesión', 'Utiliza el conmutador de roles en la parte superior para seleccionar tu perfil.', 'info');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        on('btnLogout', 'click', () => {
            const switcher = document.getElementById('roleSwitcher');
            if (switcher) {
                switcher.value = '0';
                handleRoleSwitch();
            }
            window.location.hash = '#inicio';
        });

        on('darkModeToggle', 'click', () => ui.toggleDarkMode());

        // apertura explícita de modales para no depender de los atributos data-bs.
        ['btnOpenCreateModal', 'btnHeroRegister', 'btnPublicRegister'].forEach((id) => {
            on(id, 'click', openCreateModal);
        });
        document.addEventListener('click', (event) => {
            const dismissButton = event.target.closest('[data-bs-dismiss="modal"]');
            const modal = dismissButton?.closest('.modal');
            if (!modal) return;

            const instances = {
                userCreateModal: bsUserCreateModal,
                userEditModal: bsUserEditModal,
                deleteConfirmModal: bsDeleteModal,
                roleCreateModal: bsRoleCreateModal,
                roleEditModal: bsRoleEditModal,
                deleteRoleConfirmModal: bsRoleDeleteModal
            };
            instances[modal.id]?.hide();
        });
        
        on('userCreateForm', 'submit', (e) => handleUserFormSubmit(e, 'Create'));
        on('userEditForm', 'submit', (e) => handleUserFormSubmit(e, 'Edit'));
        on('tipoParticipanteIdCreate', 'change', () => handleTipoParticipanteChange('Create'));
        on('tipoParticipanteIdEdit', 'change', () => handleTipoParticipanteChange('Edit'));
        
        on('rolIdCreate', 'change', () => updateRoleDescriptionHint('Create'));
        on('rolIdEdit', 'change', () => updateRoleDescriptionHint('Edit'));

        // Eventos para ABMC de Roles
        on('btnOpenRoleCreateModal', 'click', openRoleCreateModal);
        on('roleCreateForm', 'submit', (e) => handleRoleFormSubmit(e, 'Create'));
        on('roleEditForm', 'submit', (e) => handleRoleFormSubmit(e, 'Edit'));
        on('btnConfirmRoleDelete', 'click', handleConfirmRoleDelete);

        // confirmacion de eliminacion de usuario
        on('btnConfirmDelete', 'click', handleConfirmDelete);

        // busqueda en tiempo real con debounce
        on('searchInput', 'input', () => {
            const searchInput = document.getElementById('searchInput');
            const btnClearSearch = document.getElementById('btnClearSearch');
            if (!searchInput || !btnClearSearch) return;

            const query = searchInput.value.trim();
            btnClearSearch.classList.toggle('d-none', query.length === 0);

            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                currentPage = 1;
                loadUsers();
            }, 300);
        });

        // limpiar busqueda
        on('btnClearSearch', 'click', () => {
            const searchInput = document.getElementById('searchInput');
            const btnClearSearch = document.getElementById('btnClearSearch');
            if (searchInput) searchInput.value = '';
            if (btnClearSearch) btnClearSearch.classList.add('d-none');
            currentPage = 1;
            loadUsers();
            if (searchInput) searchInput.focus();
        });

        // filtrar por rol
        on('roleFilter', 'change', () => {
            currentPage = 1;
            loadUsers();
        });

        on('paginationContainer', 'click', (event) => {
            const button = event.target.closest('[data-page]');
            if (!button || button.disabled) return;
            const page = Number(button.dataset.page);
            if (Number.isInteger(page) && page > 0 && page !== currentPage) {
                currentPage = page;
                loadUsers();
            }
        });

        // restablecer filtros
        on('btnResetFilters', 'click', () => {
            const searchInput = document.getElementById('searchInput');
            const roleFilter = document.getElementById('roleFilter');
            const btnClearSearch = document.getElementById('btnClearSearch');
            
            if (searchInput) searchInput.value = '';
            if (roleFilter) roleFilter.value = '';
            if (btnClearSearch) btnClearSearch.classList.add('d-none');
            currentPage = 1;
            loadUsers();
        });

        // actualizar descripcion del rol en el formulario
        on('rolId', 'change', updateRoleDescriptionHint);

        // editar perfil propio desde la vista participante
        on('btnEditMyProfile', 'click', () => {
            const user = state.getAuthUser();
            if (user && user.id > 0) {
                openEditModal(user.id, true); // modo autoedición = true
            }
        });

        // sliders de la rubrica de calificacion del juez
        scoreSliders.forEach(slider => {
            slider.addEventListener('input', calculateJudgeScore);
        });

        // boton de calificacion del juez
        if (btnSubmitScore) {
            btnSubmitScore.addEventListener('click', () => {
                showToast('Calificación Registrada', `Se asignó un puntaje de ${finalScoreDisplay.textContent} al equipo seleccionado.`, 'success');
            });
        }

        // acciones interactivas de mentores
        document.querySelectorAll('.btn-mentor-act').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Disponibilidad Confirmada', 'Tu estado fue actualizado como mentor activo para este track.', 'info');
            });
        });

        // limpieza de errores en inputs
        ['nombre', 'apellido', 'username', 'email'].forEach(fieldId => {
            const el = document.getElementById(fieldId);
            if (el) {
                el.addEventListener('input', () => {
                    el.classList.remove('is-invalid');
                    const errEl = document.getElementById(`error_${fieldId}`);
                    if (errEl) errEl.classList.add('d-none');
                    document.getElementById('formAlertCreate')?.classList.add('d-none');
                    document.getElementById('formAlertEdit')?.classList.add('d-none');
                });
            }
        });
    }

    //gestion de sesion y conmutador de identidad (RBAC)
    
    /**
     * consulta el usuario autenticado activo en el backend (GET /api/auth/me).
     */
    async function fetchAuthUser() {
        try {
            const result = await api.get('/api/auth/me');
            if (result.data) {
                currentAuthUser = result.data;
                state.setAuthUser(result.data);
                rolesUI.applyUserRoleView(result.data);
            }
        } catch (error) {
            console.error('Error al obtener usuario autenticado:', error);
        }
    }

    /**
     * conmuta la identidad activa en la sesion (POST /api/auth/switch).
     */
    async function handleRoleSwitch() {
        const selectedUserId = Number(roleSwitcher.value);

        try {
            const response = await fetch('/api/auth/switch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ user_id: selectedUserId })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error al cambiar de perfil.');
            }

            currentAuthUser = result.data;
            state.setAuthUser(result.data);
            rolesUI.applyUserRoleView(currentAuthUser);
            showToast('Perfil Conmutado', result.message || 'Identidad actualizada con éxito.', 'info');

            // recargar datos para actualizar la vista contextual
            await loadUsers();

        } catch (error) {
            console.error('Error al cambiar rol:', error);
            showToast('Error', error.message, 'danger');
        }
    }

    // NOTA: la funcion applyuserroleview fue delegada a rolesui

    // carga de datos y consumo de la API REST

    /**
     * carga el catalogo de roles desde GET /api/roles.
     */
    async function loadRoles() {
        try {
            const response = await fetch('/api/roles');
            const result = await response.json();

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error(result.error || 'No se pudieron obtener los roles.');
            }

            rolesMap.clear();
            userRoleSelects.forEach((select) => {
                select.innerHTML = '<option value="">Seleccione un rol...</option>';
            });
            roleFilter.innerHTML = '<option value="">Todos los Roles del Evento</option>';
            if (rolesCardsContainer) rolesCardsContainer.innerHTML = '';

            result.data.forEach(role => {
                rolesMap.set(Number(role.id), role);

                userRoleSelects.forEach((select) => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = role.nombre;
                    select.appendChild(option);
                });

                const optFilter = document.createElement('option');
                optFilter.value = role.id;
                optFilter.textContent = role.nombre;
                roleFilter.appendChild(optFilter);

                if (rolesCardsContainer) {
                    const col = document.createElement('div');
                    col.className = 'col-md-6 col-lg-3';
                    col.innerHTML = `
                        <div class="card h-100 border-0 shadow-sm rounded-4 p-3 challenge-card">
                            <div class="card-body">
                                <span class="badge-role badge-role-${role.id} mb-2">${escapeHtml(role.nombre)}</span>
                                <p class="text-muted small mb-0 mt-2">${escapeHtml(role.descripcion || 'Sin descripción.')}</p>
                            </div>
                        </div>
                    `;
                    rolesCardsContainer.appendChild(col);
                }
            });

            if (heroRoleCount) heroRoleCount.textContent = rolesMap.size;
            renderRolesTable(result.data);

        } catch (error) {
            console.error('Error al cargar roles:', error);
            showToast('Error', 'No se pudo conectar con el catálogo de roles.', 'danger');
        }
    }

    function renderRolesTable(roles) {
        const tbody = document.getElementById('rolesTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (roles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay roles definides.</td></tr>';
            return;
        }
        roles.forEach(role => {
            const tr = document.createElement('tr');
            const roleId = Number(role.id);
            const isBaseRole = [1, 2, 3, 4].includes(roleId);
            tr.innerHTML = `
                <td class="ps-4 fw-semibold text-secondary">#${roleId}</td>
                <td><span class="badge-role badge-role-${roleId}">${escapeHtml(role.nombre)}</span></td>
                <td class="text-muted small">${escapeHtml(role.descripcion || '')}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary me-2 btn-edit-role" data-id="${roleId}" title="Modificar Rol"><i class="bi bi-pencil"></i></button>
                    ${isBaseRole ? '' : `<button class="btn btn-sm btn-outline-danger btn-delete-role" data-id="${roleId}" data-name="${escapeHtml(role.nombre)}" title="Eliminar Rol"><i class="bi bi-trash"></i></button>`}
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Eventos Edit Role
        document.querySelectorAll('.btn-edit-role').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.getAttribute('data-id'));
                const role = rolesMap.get(id);
                if (role) openRoleEditModal(role);
            });
        });

        // Eventos Delete Role
        document.querySelectorAll('.btn-delete-role').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.getAttribute('data-id'));
                const name = btn.getAttribute('data-name');
                openRoleDeleteModal(id, name);
            });
        });
    }

    /**
     * carga los usuarios desde GET /api/users y sincroniza las vistas activas.
     */
    async function loadUsers() {
        const searchTerm = searchInput.value.trim();
        const selectedRolId = roleFilter.value;

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedRolId) params.append('rol_id', selectedRolId);

        params.set('page', String(currentPage));
        params.set('limit', String(pageLimit));
        const url = `/api/users?${params.toString()}`;

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Buscando participantes...
                </td>
            </tr>
        `;

        try {
            const response = await fetch(url);
            const result = await response.json();

            if (!result.success) throw new Error(result.error || 'Error al obtener usuarios.');

            cachedUsers = result.data || [];

            // actualizar vista del organizador
            renderUsersTable(cachedUsers);
            renderUsersPagination(result.pagination);
            updateStatsCounter(result.total || 0);

            // sincronizar vistas auxiliares
            if (currentAuthUser) {
                if (currentAuthUser.rol_id === 2) renderMentorUsers();
                if (currentAuthUser.rol_id === 4) renderMentorsDirectory();
                if (currentAuthUser.rol_id === 0) renderPublicUsers();
            }

        } catch (error) {
            console.error('Error al listar usuarios:', error);
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i> Error: ${escapeHtml(error.message)}
                    </td>
                </tr>
            `;
            updateStatsCounter(0);
            if (paginationContainer) paginationContainer.innerHTML = '';
        }
    }

    function renderUsersPagination(pagination) {
        if (!paginationContainer) return;
        if (!pagination || pagination.total_pages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        const { page, total_pages: totalPages, total, limit } = pagination;
        const firstItem = (page - 1) * limit + 1;
        const lastItem = Math.min(page * limit, total);
        paginationContainer.innerHTML = `
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
                <span class="small text-muted">Mostrando ${firstItem}-${lastItem} de ${total} participantes</span>
                <nav aria-label="Paginación de participantes">
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${page <= 1 ? 'disabled' : ''}">
                            <button class="page-link" type="button" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="Página anterior">&laquo;</button>
                        </li>
                        <li class="page-item disabled" aria-current="page">
                            <span class="page-link">${page} / ${totalPages}</span>
                        </li>
                        <li class="page-item ${page >= totalPages ? 'disabled' : ''}">
                            <button class="page-link" type="button" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''} aria-label="Página siguiente">&raquo;</button>
                        </li>
                    </ul>
                </nav>
            </div>
        `;
    }

    // 7. renderizado de vistas contextuales

    /**
     * renderiza la tabla de administracion del organizador (control total).
     */
    function renderUsersTable(users) {
        usersTableBody.innerHTML = '';

        if (users.length === 0) {
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');

        users.forEach(user => {
            const tr = document.createElement('tr');
            const initials = ((user.nombre?.[0] || '') + (user.apellido?.[0] || '')).toUpperCase();
            const roleClass = `badge-role-${user.rol_id}`;

            tr.innerHTML = `
                <td class="ps-4">
                    <div class="d-flex align-items-center gap-2.5">
                        <span class="user-avatar">${escapeHtml(initials)}</span>
                        <div>
                            <span class="fw-semibold text-dark d-block">${escapeHtml(user.nombre_completo || (user.nombre + ' ' + user.apellido))}</span>
                            <small class="text-muted d-block d-md-none">@${escapeHtml(user.username)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-light text-secondary border px-2 py-1">@${escapeHtml(user.username)}</span>
                </td>
                <td>
                    <span class="text-muted">${escapeHtml(user.email)}</span>
                </td>
                <td>
                    <span class="badge-role ${roleClass}">
                        <i class="bi bi-person-badge"></i> ${escapeHtml(user.rol_nombre || 'Sin Rol')}
                    </span>
                </td>
                <td>
                    <span class="badge ${user.estado_usuario_id === 1 ? 'bg-warning text-dark' : 'bg-success'}">
                        ${escapeHtml(user.estado_usuario_nombre || (user.estado_usuario_id === 1 ? 'Pendiente' : 'Aprobado'))}
                    </span>
                </td>
                <td>
                    <small class="text-muted">${formatDate(user.created_at)}</small>
                </td>
                <td class="text-end pe-4">
                    <div class="btn-group btn-group-sm">
                        ${user.estado_usuario_id === 1 ? `
                        <button type="button" class="btn btn-outline-success btn-approve" data-id="${user.id}" title="Aprobar participante">
                            <i class="bi bi-check-circle-fill"></i>
                        </button>` : ''}
                        <button type="button" class="btn btn-outline-secondary btn-edit" data-id="${user.id}" title="Modificar participante">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-delete" data-id="${user.id}" data-name="${escapeHtml(user.nombre + ' ' + user.apellido)}" data-email="${escapeHtml(user.email)}" title="Eliminar del padrón">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </td>
            `;

            const btnApprove = tr.querySelector('.btn-approve');
            if (btnApprove) btnApprove.addEventListener('click', () => approveUser(user.id, user.nombre + ' ' + user.apellido));
            
            tr.querySelector('.btn-edit').addEventListener('click', () => openEditModal(user.id));
            tr.querySelector('.btn-delete').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                openDeleteConfirmModal(btn.dataset.id, btn.dataset.name, btn.dataset.email);
            });

            usersTableBody.appendChild(tr);
        });
    }

    /**
     * renderiza la vista de solo lectura del mentor.
     */
    function renderMentorUsers() {
        if (!mentorUsersTableBody) return;
        mentorUsersTableBody.innerHTML = '';

        cachedUsers.forEach(user => {
            const tr = document.createElement('tr');
            const initials = ((user.nombre?.[0] || '') + (user.apellido?.[0] || '')).toUpperCase();
            tr.innerHTML = `
                <td class="ps-4">
                    <div class="d-flex align-items-center gap-2">
                        <span class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${escapeHtml(initials)}</span>
                        <span class="fw-semibold text-dark">${escapeHtml(user.nombre_completo)}</span>
                    </div>
                </td>
                <td><span class="badge bg-light text-secondary border">@${escapeHtml(user.username)}</span></td>
                <td><span class="badge-role badge-role-${user.rol_id}">${escapeHtml(user.rol_nombre)}</span></td>
                <td>
                    <span class="badge ${user.estado_usuario_id === 1 ? 'bg-warning text-dark' : 'bg-success'}">
                        ${escapeHtml(user.estado_usuario_nombre || (user.estado_usuario_id === 1 ? 'Pendiente' : 'Aprobado'))}
                    </span>
                </td>
                <td class="text-end pe-4">
                    ${user.estado_usuario_id === 1 ? `
                    <button class="btn btn-outline-success btn-sm btn-approve" data-id="${user.id}" title="Aprobar participante">
                        <i class="bi bi-check-circle-fill me-1"></i> Aprobar
                    </button>` : ''}
                    <button class="btn btn-outline-info btn-sm btn-offer-help" data-name="${escapeHtml(user.nombre_completo)}">
                        <i class="bi bi-chat-dots me-1"></i> Orientar
                    </button>
                </td>
            `;
            const btnApprove = tr.querySelector('.btn-approve');
            if (btnApprove) btnApprove.addEventListener('click', () => approveUser(user.id, user.nombre_completo));
            
            tr.querySelector('.btn-offer-help').addEventListener('click', (e) => {
                showToast('Orientación Iniciada', `Canal de asesoría abierto con ${e.currentTarget.dataset.name}.`, 'info');
            });
            mentorUsersTableBody.appendChild(tr);
        });
    }

    /**
     * renderiza el perfil propio del participante.
     */
    function renderParticipantProfile(user) {
        if (!participantName) return;
        participantName.textContent = user.nombre_completo || (user.nombre + ' ' + user.apellido);
        participantUsername.textContent = '@' + (user.username || '');
        participantEmail.textContent = user.email || '';
        const initials = ((user.nombre?.[0] || '') + (user.apellido?.[0] || '')).toUpperCase();
        participantAvatar.textContent = initials || 'UN';
    }

    /**
     * renderiza el directorio de mentores disponibles para el participante.
     */
    function renderMentorsDirectory() {
        if (!mentorsListContainer) return;
        mentorsListContainer.innerHTML = '';

        const mentors = cachedUsers.filter(u => u.rol_id === 2);

        if (mentors.length === 0) {
            mentorsListContainer.innerHTML = '<div class="col-12 text-muted small">No hay mentores conectados en este momento.</div>';
            return;
        }

        mentors.forEach(m => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.innerHTML = `
                <div class="p-3 bg-light rounded-3 border h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge-role badge-role-2"><i class="bi bi-lightbulb"></i> Mentor</span>
                            <strong class="text-dark">${escapeHtml(m.nombre_completo)}</strong>
                        </div>
                        <small class="text-muted d-block">Especialidad: Arquitectura de Software & APIs</small>
                    </div>
                    <button class="btn btn-primary btn-sm mt-3 btn-req-mentor" data-name="${escapeHtml(m.nombre_completo)}">
                        <i class="bi bi-hand-index-thumb me-1"></i> Pedir Asistencia
                    </button>
                </div>
            `;
            col.querySelector('.btn-req-mentor').addEventListener('click', (e) => {
                showToast('Solicitud Enviada', `Se notificó a ${e.currentTarget.dataset.name} que solicitaste ayuda técnica.`, 'success');
            });
            mentorsListContainer.appendChild(col);
        });
    }

    /**
     * renderiza el padron publico para visitantes anonimos (correos protegidos).
     */
    function renderPublicUsers() {
        if (!publicUsersTableBody) return;
        publicUsersTableBody.innerHTML = '';

        cachedUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4 fw-semibold text-dark">${escapeHtml(user.nombre_completo)}</td>
                <td><span class="badge bg-light text-secondary border">@${escapeHtml(user.username)}</span></td>
                <td><span class="badge-role badge-role-${user.rol_id}">${escapeHtml(user.rol_nombre)}</span></td>
                <td class="text-end pe-4"><span class="badge bg-success-subtle text-success">Inscripto</span></td>
            `;
            publicUsersTableBody.appendChild(tr);
        });
    }

    /**
     * calcula la puntuacion ponderada de la rubrica del juez en tiempo real.
     */
    function calculateJudgeScore() {
        const valInn = Number(document.getElementById('scoreInnovacion').value);
        const valTec = Number(document.getElementById('scoreTecnica').value);
        const valImp = Number(document.getElementById('scoreImpacto').value);

        document.getElementById('valInnovacion').textContent = `${valInn} / 10`;
        document.getElementById('valTecnica').textContent = `${valTec} / 10`;
        document.getElementById('valImpacto').textContent = `${valImp} / 10`;

        const finalScore = ((valInn * 0.35) + (valTec * 0.35) + (valImp * 0.30)).toFixed(1);
        finalScoreDisplay.textContent = `${finalScore} / 10`;
    }

    function updateStatsCounter(total) {
        if (total === 1) {
            statsCounter.innerHTML = `<i class="bi bi-check-circle-fill text-success me-1"></i> 1 participante`;
        } else {
            statsCounter.innerHTML = `<i class="bi bi-people me-1"></i> ${total} participantes`;
        }
        if (!searchInput.value.trim() && !roleFilter.value && heroUserCount) {
            heroUserCount.textContent = total;
        }
    }

    // 8. modales de creacion y edicion


    
    function handleTipoParticipanteChange(prefix) {
        const select = document.getElementById('tipoParticipanteId' + prefix);
        const containerLegajo = document.getElementById('containerLegajo' + prefix);
        const legajoInput = document.getElementById('legajo' + prefix);
        if (!select || !containerLegajo) return;
        
        if (select.value === '1') {
            containerLegajo.classList.remove('d-none');
        } else {
            containerLegajo.classList.add('d-none');
            if (legajoInput) {
                legajoInput.value = '';
                legajoInput.classList.remove('is-invalid');
            }
            const err = document.getElementById('error_legajo' + prefix);
            if (err) err.classList.add('d-none');
        }
    }

    function resetUserForm(prefix) {
        document.getElementById('user' + prefix + 'Form').reset();
        document.getElementById('userId' + prefix).value = '';
        
        const formAlert = document.getElementById('formAlert' + prefix);
        if (formAlert) {
            formAlert.classList.add('d-none');
            formAlert.textContent = '';
        }
        
        const roleHint = document.getElementById('roleDescriptionHint' + prefix);
        if (roleHint) roleHint.textContent = '';
        
        const roleSelect = document.getElementById('rolId' + prefix);
        if (roleSelect) roleSelect.disabled = false;

        ['nombre', 'apellido', 'username', 'email', 'rolId', 'tipoParticipanteId', 'legajo'].forEach(fieldId => {
            const el = document.getElementById(fieldId + prefix);
            if (el) el.classList.remove('is-invalid');
            const errEl = document.getElementById(`error_${fieldId}${prefix}`);
            if (errEl) errEl.classList.add('d-none');
        });
        
        const containerLegajo = document.getElementById('containerLegajo' + prefix);
        if (containerLegajo) containerLegajo.classList.add('d-none');
    }

    function openCreateModal() {
        resetUserForm('Create');
        const roleSelect = document.getElementById('rolIdCreate');
        if (roleSelect) roleSelect.disabled = false;
        
        if (!currentAuthUser || currentAuthUser.id === 0) {
            if (roleSelect) {
                roleSelect.value = '4'; // Participante
                roleSelect.disabled = true;
            }
            updateRoleDescriptionHint('Create');
        }
        bsUserCreateModal?.show();
    }

    async function openEditModal(id, isSelfEdit = false) {
        resetUserForm('Edit');
        const roleSelect = document.getElementById('rolIdEdit');

        try {
            const response = await fetch(`/api/users/${id}`);
            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'No se pudo cargar la información del usuario.');
            }

            const user = result.data;
            document.getElementById('userIdEdit').value = user.id;
            document.getElementById('nombreEdit').value = user.nombre;
            document.getElementById('apellidoEdit').value = user.apellido;
            document.getElementById('usernameEdit').value = user.username;
            document.getElementById('emailEdit').value = user.email;
            
            if (roleSelect) roleSelect.value = user.rol_id;
            
            const tipoParticipanteSelect = document.getElementById('tipoParticipanteIdEdit');
            if (tipoParticipanteSelect) {
                if (user.tipo_participante_id) {
                    tipoParticipanteSelect.value = user.tipo_participante_id;
                } else {
                    tipoParticipanteSelect.value = '';
                }
            }
            
            const legajoInput = document.getElementById('legajoEdit');
            if (legajoInput) legajoInput.value = user.legajo || '';
            
            if (tipoParticipanteSelect) {
                handleTipoParticipanteChange('Edit');
            }

            if (roleSelect) {
                if (isSelfEdit || (currentAuthUser && currentAuthUser.rol_id === 4)) {
                    roleSelect.disabled = true;
                } else {
                    roleSelect.disabled = false;
                }
            }

            updateRoleDescriptionHint('Edit');
            bsUserEditModal.show();
            setTimeout(() => document.getElementById('nombreEdit').focus(), 150);

        } catch (error) {
            console.error('Error al obtener usuario para editar:', error);
            showToast('Error', error.message, 'danger');
        }
    }

    function updateRoleDescriptionHint(prefix) {
        const hint = document.getElementById('roleDescriptionHint' + prefix);
        const select = document.getElementById('rolId' + prefix);
        if (!hint || !rolesMap) return;
        const roleId = Number(select.value);
        if (roleId && rolesMap.has(roleId)) {
            hint.textContent = rolesMap.get(roleId).descripcion;
        } else {
            hint.textContent = '';
        }
    }

    // 9. envio de formulario (validacion y manejo RBAC)

    async function handleUserFormSubmit(event, prefix) {
        event.preventDefault();
        const formAlert = document.getElementById('formAlert' + prefix);
        if (formAlert) {
            formAlert.classList.add('d-none');
            formAlert.textContent = '';
        }

        const userIdInput = document.getElementById('userId' + prefix);
        const userId = userIdInput && userIdInput.value ? Number(userIdInput.value) : null;
        const isEdit = prefix === 'Edit';

        const roleSelect = document.getElementById('rolId' + prefix);
        const tipoParticipanteSelect = document.getElementById('tipoParticipanteId' + prefix);
        const legajoInput = document.getElementById('legajo' + prefix);

        const payload = {
            nombre: document.getElementById('nombre' + prefix).value.trim(),
            apellido: document.getElementById('apellido' + prefix).value.trim(),
            username: document.getElementById('username' + prefix).value.trim(),
            email: document.getElementById('email' + prefix).value.trim(),
            rol_id: roleSelect ? Number(roleSelect.value) : 0
        };
        
        if (tipoParticipanteSelect && tipoParticipanteSelect.value) {
            payload.tipo_participante_id = Number(tipoParticipanteSelect.value);
            if (payload.tipo_participante_id === 1 && legajoInput && legajoInput.value.trim() !== '') {
                payload.legajo = legajoInput.value.trim();
            }
        }

        const clientErrors = validateClientInput(payload, prefix);
        if (Object.keys(clientErrors).length > 0) {
            displayValidationErrors(clientErrors, prefix);
            return;
        }

        setFormSubmitting(true, prefix);
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `/api/users/${userId}` : '/api/users';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                if (response.status === 403) {
                    if (formAlert) {
                        formAlert.textContent = result.error || 'Acceso denegado por permisos RBAC.';
                        formAlert.classList.remove('d-none');
                    }
                } else if (result.errors && typeof result.errors === 'object') {
                    displayValidationErrors(result.errors, prefix);
                } else {
                    if (formAlert) {
                        formAlert.textContent = result.error || 'Ocurrió un error al procesar el registro.';
                        formAlert.classList.remove('d-none');
                    }
                }
                return;
            }

            if (isEdit) {
                bsUserEditModal.hide();
            } else {
                bsUserCreateModal.hide();
            }
            
            const actionText = isEdit ? 'modificado correctamente' : 'registrado con éxito';
            showToast('Operación Exitosa', `El participante '${payload.nombre} ${payload.apellido}' fue ${actionText}.`, 'success');

            if (isEdit && currentAuthUser && currentAuthUser.id === userId) {
                await fetchAuthUser();
            }

            await loadUsers();

        } catch (error) {
            console.error('Error en la petición de usuario:', error);
            if (formAlert) {
                formAlert.textContent = 'Error de conexión con el servidor. Intente nuevamente.';
                formAlert.classList.remove('d-none');
            }
        } finally {
            setFormSubmitting(false, prefix);
        }
    }

    function validateClientInput(data, prefix) {
        const errors = {};
        if (!data.nombre || data.nombre.length < 2) errors.nombre = 'El nombre es obligatorio (mínimo 2 caracteres).';
        if (!data.apellido || data.apellido.length < 2) errors.apellido = 'El apellido es obligatorio (mínimo 2 caracteres).';
        if (!data.username || !/^[a-zA-Z0-9._-]{3,30}$/.test(data.username)) errors.username = 'El nickname debe tener entre 3 y 30 caracteres alfanuméricos.';
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Ingrese una dirección de correo válida.';
        if (!data.rol_id || !rolesMap.has(data.rol_id)) errors.rol_id = 'Debe seleccionar un rol válido.';
        
        if (data.tipo_participante_id === 1 && (!data.legajo || data.legajo.length < 2)) {
            errors.legajo = 'El número de legajo es obligatorio para estudiantes.';
        }
        
        return errors;
    }

    function displayValidationErrors(errors, prefix) {
        for (const [field, message] of Object.entries(errors)) {
            const inputField = document.getElementById(field === 'rol_id' ? 'rolId' + prefix : field + prefix);
            const errorElement = document.getElementById(`error_${field}${prefix}`);
            if (inputField) inputField.classList.add('is-invalid');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('d-none');
            }
        }
        const formAlert = document.getElementById('formAlert' + prefix);
        const messages = Object.values(errors).filter(Boolean);
        if (formAlert && messages.length > 0) {
            formAlert.textContent = messages.join(' ');
            formAlert.classList.remove('d-none');
        }
    }

    function setFormSubmitting(isSubmitting, prefix) {
        const btnSubmitUser = document.getElementById('btnSubmitUser' + prefix);
        const submitSpinner = document.getElementById('submitSpinner' + prefix);
        const submitBtnText = document.getElementById('submitBtnText' + prefix);
        const isEdit = prefix === 'Edit';
        
        if (btnSubmitUser) btnSubmitUser.disabled = isSubmitting;
        if (isSubmitting) {
            if (submitSpinner) submitSpinner.classList.remove('d-none');
            if (submitBtnText) submitBtnText.textContent = 'Guardando...';
        } else {
            if (submitSpinner) submitSpinner.classList.add('d-none');
            if (submitBtnText) submitBtnText.textContent = isEdit ? 'Guardar Cambios' : 'Registrar Participante';
        }
    }

    // =========================================================================
    // 10. eliminacion con confirmacion
    // =========================================================================

    function openDeleteConfirmModal(id, name, email) {
        currentDeleteUserId = id;
        deleteUserName.textContent = name;
        deleteUserEmail.textContent = email;
        bsDeleteModal.show();
    }

    async function handleConfirmDelete() {
        if (!currentDeleteUserId) return;

        btnConfirmDelete.disabled = true;
        deleteSpinner.classList.remove('d-none');
        deleteBtnText.textContent = 'Eliminando...';

        try {
            const response = await fetch(`/api/users/${currentDeleteUserId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'No se pudo eliminar el registro.');
            }

            bsDeleteModal.hide();
            showToast('Registro Eliminado', result.message || 'El participante fue eliminado.', 'warning');
            currentDeleteUserId = null;
            await loadUsers();

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            showToast('Error', error.message, 'danger');
        } finally {
            btnConfirmDelete.disabled = false;
            deleteSpinner.classList.add('d-none');
            deleteBtnText.textContent = 'Sí, Eliminar';
        }
    }

    // =========================================================================
    // ABMC DE ROLES
    // =========================================================================

    let currentDeleteRoleId = null;

    function resetRoleForm(prefix) {
        document.getElementById('role' + prefix + 'Form').reset();
        document.getElementById('roleId' + prefix).value = '';
        const formAlert = document.getElementById('formAlertRole' + prefix);
        if (formAlert) formAlert.classList.add('d-none');
        ['nombreRole'].forEach(fieldId => {
            const el = document.getElementById(fieldId + prefix);
            if (el) el.classList.remove('is-invalid');
            const errEl = document.getElementById(`error_${fieldId}${prefix}`);
            if (errEl) errEl.classList.add('d-none');
        });
    }

    function openRoleCreateModal() {
        resetRoleForm('Create');
        bsRoleCreateModal?.show();
    }

    function openRoleEditModal(role) {
        resetRoleForm('Edit');
        document.getElementById('roleIdEdit').value = role.id;
        document.getElementById('nombreRoleEdit').value = role.nombre;
        document.getElementById('descripcionRoleEdit').value = role.descripcion || '';
        bsRoleEditModal.show();
    }

    function openRoleDeleteModal(id, name) {
        currentDeleteRoleId = id;
        document.getElementById('deleteRoleName').textContent = name;
        bsRoleDeleteModal.show();
    }

    async function handleRoleFormSubmit(e, prefix) {
        e.preventDefault();
        
        const nombreEl = document.getElementById('nombreRole' + prefix);
        if (!nombreEl.value.trim()) {
            nombreEl.classList.add('is-invalid');
            return;
        }

        const btnSubmit = document.getElementById('btnSubmitRole' + prefix);
        const spinner = document.getElementById('submitRoleSpinner' + prefix);
        const btnText = document.getElementById('submitRoleBtnText' + prefix);
        const alertEl = document.getElementById('formAlertRole' + prefix);

        btnSubmit.disabled = true;
        spinner.classList.remove('d-none');
        btnText.textContent = prefix === 'Create' ? 'Creando...' : 'Guardando...';
        alertEl.classList.add('d-none');

        const formData = {
            nombre: nombreEl.value.trim(),
            descripcion: document.getElementById('descripcionRole' + prefix).value.trim()
        };

        const roleId = document.getElementById('roleId' + prefix).value;
        const url = prefix === 'Create' ? '/api/roles' : `/api/roles/${roleId}`;
        const method = prefix === 'Create' ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error al guardar el rol');
            }

            if (prefix === 'Create') bsRoleCreateModal.hide();
            else bsRoleEditModal.hide();

            showToast('Éxito', result.message || 'Rol guardado correctamente.', 'success');
            await loadRoles(); // Recarga y re-renderiza tabla
            await fetchAuthUser();
            await loadUsers(); // Refrescar los select de roles
        } catch (error) {
            alertEl.textContent = error.message;
            alertEl.classList.remove('d-none');
        } finally {
            btnSubmit.disabled = false;
            spinner.classList.add('d-none');
            btnText.textContent = prefix === 'Create' ? 'Crear Rol' : 'Guardar Cambios';
        }
    }

    async function handleConfirmRoleDelete() {
        if (!currentDeleteRoleId) return;

        const btnConfirmDeleteRole = document.getElementById('btnConfirmRoleDelete');
        const deleteRoleSpinner = document.getElementById('deleteRoleSpinner');
        const deleteRoleBtnText = document.getElementById('deleteRoleBtnText');

        btnConfirmDeleteRole.disabled = true;
        deleteRoleSpinner.classList.remove('d-none');
        deleteRoleBtnText.textContent = 'Eliminando...';

        try {
            const response = await fetch(`/api/roles/${currentDeleteRoleId}`, { method: 'DELETE' });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error al eliminar el rol');
            }

            bsRoleDeleteModal.hide();
            showToast('Rol Eliminado', result.message || 'El rol ha sido borrado.', 'success');
            await loadRoles();
        } catch (error) {
            showToast('Error', error.message, 'danger');
            bsRoleDeleteModal.hide();
        } finally {
            btnConfirmDeleteRole.disabled = false;
            deleteRoleSpinner.classList.add('d-none');
            deleteRoleBtnText.textContent = 'Sí, Eliminar';
        }
    }

    // =========================================================================
    // 11. aprobar participante
    // =========================================================================

    async function approveUser(id, name) {
        if (!confirm(`¿Está seguro que desea aprobar la inscripción de ${name}?`)) return;
        
        try {
            const response = await fetch(`/api/users/${id}/approve`, { method: 'POST' });
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                showToast('No Autorizado', result.error || 'Ocurrió un error al intentar aprobar.', 'danger');
                return;
            }
            
            showToast('Aprobado Exitosamente', result.message || `La inscripción de ${name} ha sido aprobada.`, 'success');
            await loadUsers();
            
        } catch (error) {
            console.error('Error al aprobar usuario:', error);
            showToast('Error', 'No se pudo contactar al servidor.', 'danger');
        }
    }

    // =========================================================================
    // 12. toasts y utilitarios
    // =========================================================================

    function showToast(title, message, type = 'info') {
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
                <strong class="me-auto text-dark">${escapeHtml(title)}</strong>
                <small class="text-muted">Ahora</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
            <div class="toast-body pt-0 text-muted small">
                ${escapeHtml(message)}
            </div>
        `;

        toastContainer.appendChild(toastEl);
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
            bsToast.show();
            toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
        } else {
            toastEl.classList.add('show');
            toastEl.querySelector('[data-bs-dismiss="toast"]')?.addEventListener('click', () => toastEl.remove());
            setTimeout(() => toastEl.remove(), 4000);
        }
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatDate(dateStr) {
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
