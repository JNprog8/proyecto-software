/**
 * aplicacion frontend modular (ES modules) - hackaton UNRN 2026.
 * orquestador principal que conecta el store reactivo, la API, las vistas y los modales.
 */
import { api } from './api/client.js';
import { store } from './state/store.js';
import { UserTableView } from './views/userTable.js';
import { ModalsView } from './views/modals.js';
import { updateRoleViews } from './views/roleViews.js';
import { showToast } from './views/toasts.js';

document.addEventListener('DOMContentLoaded', () => {
    let searchDebounceTimer = null;
    let currentFetchAbortController = null;

    // =========================================================================
    // 1. inicializacion de vistas
    // =========================================================================
    const usersTableBody = document.getElementById('usersTableBody');
    const paginationContainer = document.getElementById('paginationContainer');
    const userModalEl = document.getElementById('userModal');
    const deleteModalEl = document.getElementById('deleteConfirmModal');

    // instancia de vista de tabla
    const tableView = new UserTableView({
        containerEl: usersTableBody,
        paginationEl: paginationContainer,
        onEdit: (userId) => {
            const user = store.getState().users.find((u) => u.id === userId);
            if (user) {
                modalsView.openForEdit(user, store.getState().roles);
            }
        },
        onDelete: (userId) => {
            const user = store.getState().users.find((u) => u.id === userId);
            if (user) {
                modalsView.openForDelete(user);
            }
        },
        onPageChange: (targetPage) => {
            store.setPage(targetPage);
            loadUsers();
        }
    });

    // instancia de vista de modales
    const modalsView = new ModalsView({
        formModalEl: userModalEl,
        deleteModalEl: deleteModalEl,
        onSave: async (userData, editingId) => {
            if (editingId) {
                const res = await api.put(`/api/users/${editingId}`, userData);
                showToast(res.message || 'Participante actualizado exitosamente.', 'success');
            } else {
                const res = await api.post('/api/users', userData);
                showToast(res.message || 'Participante registrado exitosamente.', 'success');
            }
            await loadUsers();
            await updateMetrics();
        },
        onConfirmDelete: async (deleteId) => {
            const res = await api.delete(`/api/users/${deleteId}`);
            showToast(res.message || 'Participante dado de baja.', 'info');
            await loadUsers();
            await updateMetrics();
        }
    });

    // =========================================================================
    // 2. suscripcion reactiva al store
    // =========================================================================
    store.subscribe((state) => {
        // actualizar vistas contextuales segun el usuario activo
        updateRoleViews(state.currentUser);

        // si esta en carga, mostrar esqueleto; sino, renderizar datos
        const isOrganizer = Number(state.currentUser?.rol_id) === 1;
        if (state.isLoading) {
            tableView.renderSkeleton(state.pagination.limit || 5);
        } else {
            tableView.renderData(state.users, isOrganizer);
            tableView.renderPagination(state.pagination);
        }

        // actualizar contadores del panel
        const statsCounter = document.getElementById('statsCounter');
        if (statsCounter) {
            statsCounter.textContent = `${state.pagination.total} usuarios`;
        }
    });

    // =========================================================================
    // 3. operaciones de carga asincrona con abortcontroller
    // =========================================================================
    async function loadUsers() {
        if (currentFetchAbortController) {
            currentFetchAbortController.abort();
        }
        currentFetchAbortController = new AbortController();

        store.setLoading(true);

        const { page, limit } = store.getState().pagination;
        const { search, rolId } = store.getState().filters;

        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        if (search) params.set('search', search);
        if (rolId && Number(rolId) > 0) params.set('rol_id', rolId.toString());

        try {
            const res = await api.get(`/api/users?${params.toString()}`, currentFetchAbortController.signal);
            if (res.aborted) return;

            store.setUsers(res.data || [], res.pagination || null);
        } catch (err) {
            store.setLoading(false);
            showToast(err.message || 'Error al consultar la lista de usuarios.', 'error');
        }
    }

    async function loadRoles() {
        try {
            const res = await api.get('/api/roles');
            if (res.success && Array.isArray(res.data)) {
                store.setRoles(res.data);
                populateFilterRoles(res.data);
                renderRoleCards(res.data);
            }
        } catch (err) {
            console.error('Error al cargar roles:', err);
        }
    }

    async function loadCurrentAuthUser() {
        try {
            const res = await api.get('/api/auth/me');
            if (res.success && res.data) {
                store.setCurrentUser(res.data);
            }
        } catch (err) {
            console.error('Error al cargar usuario en sesión:', err);
        }
    }

    async function updateMetrics() {
        try {
            const res = await api.get('/api/users?limit=1');
            const heroUserCount = document.getElementById('heroUserCount');
            if (heroUserCount && res.pagination) {
                heroUserCount.textContent = res.pagination.total;
            }
        } catch (_) {}
    }

    // =========================================================================
    // 4. conexion de eventos de la interfaz
    // =========================================================================

    // conmutador de identidad (simulador de roles)
    const roleSwitcher = document.getElementById('roleSwitcher');
    if (roleSwitcher) {
        roleSwitcher.addEventListener('change', async (e) => {
            const targetId = Number(e.target.value);
            try {
                const res = await api.post('/api/auth/switch', { user_id: targetId });
                showToast(`Perfil conmutado a: ${res.data.nombre_completo || res.data.rol_nombre}`, 'info');
                store.setCurrentUser(res.data);
                await loadUsers();
            } catch (err) {
                showToast(err.message || 'No fue posible conmutar el rol.', 'error');
            }
        });
    }

    // busqueda en tiempo real con debounce
    const searchInput = document.getElementById('searchInput');
    const btnClearSearch = document.getElementById('btnClearSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (btnClearSearch) {
                btnClearSearch.classList.toggle('d-none', query.length === 0);
            }

            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                store.setFilters({ search: query });
                loadUsers();
            }, 280);
        });
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            searchInput.value = '';
            btnClearSearch.classList.add('d-none');
            store.setFilters({ search: '' });
            loadUsers();
        });
    }

    // filtro por rol
    const roleFilter = document.getElementById('roleFilter');
    if (roleFilter) {
        roleFilter.addEventListener('change', (e) => {
            const rolId = e.target.value ? Number(e.target.value) : null;
            store.setFilters({ rolId });
            loadUsers();
        });
    }

    // boton de limpiar filtros
    const btnResetFilters = document.getElementById('btnResetFilters');
    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (btnClearSearch) btnClearSearch.classList.add('d-none');
            if (roleFilter) roleFilter.value = '';
            store.setFilters({ search: '', rolId: null });
            loadUsers();
        });
    }

    // botones de alta de usuario (abren modal)
    const btnOpenCreate = document.getElementById('btnOpenCreateModal') || document.getElementById('btnOpenCreateUser');
    if (btnOpenCreate) {
        btnOpenCreate.addEventListener('click', () => {
            modalsView.openForCreate(store.getState().roles);
        });
    }

    const btnHeroRegister = document.getElementById('btnHeroRegister');
    if (btnHeroRegister) {
        btnHeroRegister.addEventListener('click', (e) => {
            e.preventDefault();
            modalsView.openForCreate(store.getState().roles);
        });
    }

    // =========================================================================
    // 5. utilidades de renderizado de roles
    // =========================================================================
    function populateFilterRoles(roles) {
        if (!roleFilter) return;
        roleFilter.innerHTML = '<option value="">Todos los Roles</option>' +
            roles.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
    }

    function renderRoleCards(roles) {
        const container = document.getElementById('rolesCardsContainer');
        if (!container) return;

        const roleMeta = {
            1: { icon: 'bi-shield-shaded', color: 'primary', title: 'Organizador' },
            2: { icon: 'bi-lightbulb-fill', color: 'info', title: 'Mentor' },
            3: { icon: 'bi-award-fill', color: 'warning', title: 'Juez / Evaluador' },
            4: { icon: 'bi-code-slash', color: 'success', title: 'Participante' }
        };

        container.innerHTML = roles.map(r => {
            const meta = roleMeta[r.id] || { icon: 'bi-person-badge', color: 'secondary', title: r.nombre };
            return `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm border-top border-3 border-${meta.color}">
                        <div class="card-body">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="badge bg-${meta.color}-subtle text-${meta.color} p-2 rounded-3">
                                    <i class="bi ${meta.icon} fs-5"></i>
                                </span>
                                <h6 class="card-title fw-bold mb-0">${r.nombre}</h6>
                            </div>
                            <p class="card-text small text-muted">${r.descripcion || 'Sin descripción detallada.'}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // =========================================================================
    // 6. arranque de la aplicacion
    // =========================================================================
    async function start() {
        await loadCurrentAuthUser();
        await loadRoles();
        await loadUsers();
        await updateMetrics();
    }

    start();
});
