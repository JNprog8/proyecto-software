<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Usuarios - Sistema ABMC</title>
    <meta name="description" content="Sistema de Alta, Baja, Modificación y Consulta de Usuarios y Roles en PHP Vanilla.">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Estilos CSS -->
    <link rel="stylesheet" href="/public/css/styles.css">
</head>
<body>

    <header class="app-header">
        <div class="container header-container">
            <div class="brand">
                <div class="brand-badge">PHP Vanilla</div>
                <h1 class="brand-title">Gestión de Usuarios</h1>
            </div>
            <div class="header-actions">
                <a href="http://localhost:8081" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Abrir Adminer en nueva pestaña">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                    Adminer (BD)
                </a>
                <button id="btnOpenCreateModal" class="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Nuevo Usuario
                </button>
            </div>
        </div>
    </header>

    <main class="container main-content">
        <!-- Barra de métricas y filtros -->
        <section class="controls-card">
            <div class="search-box">
                <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="searchInput" placeholder="Buscar por nombre, nickname o email..." autocomplete="off">
                <button id="btnClearSearch" class="btn-clear hidden" aria-label="Limpiar búsqueda">&times;</button>
            </div>

            <div class="filter-box">
                <label for="roleFilter" class="visually-hidden">Filtrar por Rol</label>
                <select id="roleFilter">
                    <option value="">Todos los Roles</option>
                </select>
            </div>

            <div class="stats-badge" id="statsCounter">
                Cargando registros...
            </div>
        </section>

        <!-- Contenedor del listado -->
        <section class="table-card">
            <div class="table-responsive">
                <table class="data-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nickname</th>
                            <th>Correo Electrónico</th>
                            <th>Rol Asignado</th>
                            <th>Fecha Alta</th>
                            <th class="text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- Se puebla dinámicamente con JavaScript -->
                        <tr>
                            <td colspan="6" class="text-center py-4">Cargando usuarios...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="emptyState" class="empty-state hidden">
                <div class="empty-icon">🔍</div>
                <h3>No se encontraron usuarios</h3>
                <p>No hay registros que coincidan con los filtros aplicados o no hay usuarios registrados.</p>
                <button id="btnResetFilters" class="btn btn-secondary btn-sm mt-3">Restablecer filtros</button>
            </div>
        </section>
    </main>

    <!-- Modal Formulario de Alta y Edición -->
    <dialog id="userModal" class="modal-dialog">
        <div class="modal-content">
            <header class="modal-header">
                <h2 id="modalTitle">Nuevo Usuario</h2>
                <button type="button" class="btn-close" id="btnCloseUserModal" aria-label="Cerrar modal">&times;</button>
            </header>

            <form id="userForm" novalidate>
                <input type="hidden" id="userId" name="id" value="">

                <!-- Alerta de error general / servidor -->
                <div id="formAlert" class="alert alert-danger hidden" role="alert"></div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="nombre">Nombre <span class="required">*</span></label>
                        <input type="text" id="nombre" name="nombre" placeholder="Ej: Juan" required maxlength="100">
                        <span class="field-error" id="error_nombre"></span>
                    </div>

                    <div class="form-group">
                        <label for="apellido">Apellido <span class="required">*</span></label>
                        <input type="text" id="apellido" name="apellido" placeholder="Ej: Pérez" required maxlength="100">
                        <span class="field-error" id="error_apellido"></span>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="username">Nickname (Usuario) <span class="required">*</span></label>
                        <input type="text" id="username" name="username" placeholder="Ej: jperez" required maxlength="50">
                        <span class="field-error" id="error_username"></span>
                    </div>

                    <div class="form-group">
                        <label for="email">Correo Electrónico <span class="required">*</span></label>
                        <input type="email" id="email" name="email" placeholder="usuario@unrn.edu.ar" required maxlength="100">
                        <span class="field-error" id="error_email"></span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="rolId">Rol Asignado <span class="required">*</span></label>
                    <select id="rolId" name="rol_id" required>
                        <option value="">Seleccione un Rol...</option>
                    </select>
                    <span class="field-error" id="error_rol_id"></span>
                    <small class="field-hint" id="roleDescriptionHint"></small>
                </div>

                <footer class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="btnCancelUserModal">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="btnSubmitUser">
                        <span class="btn-text">Guardar Usuario</span>
                        <span class="spinner hidden"></span>
                    </button>
                </footer>
            </form>
        </div>
    </dialog>

    <!-- Modal de Confirmación para Eliminar Usuario -->
    <dialog id="deleteConfirmModal" class="modal-dialog modal-dialog-sm">
        <div class="modal-content">
            <header class="modal-header modal-header-danger">
                <h2>Confirmar Eliminación</h2>
                <button type="button" class="btn-close" id="btnCloseDeleteModal" aria-label="Cerrar modal">&times;</button>
            </header>

            <div class="modal-body">
                <p>¿Está seguro de que desea eliminar al siguiente usuario del sistema?</p>
                <div class="delete-user-card">
                    <strong id="deleteUserName"></strong>
                    <span id="deleteUserEmail"></span>
                </div>
                <p class="text-danger small mt-2">Esta acción no se puede deshacer y liberará el nickname y correo electrónico.</p>
            </div>

            <footer class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btnCancelDelete">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnConfirmDelete">
                    <span class="btn-text">Sí, Eliminar Registro</span>
                    <span class="spinner hidden"></span>
                </button>
            </footer>
        </div>
    </dialog>

    <!-- Contenedor de Notificaciones Toast -->
    <div id="toastContainer" class="toast-container" aria-live="polite"></div>

    <!-- Script de aplicación -->
    <script src="/public/js/app.js"></script>
</body>
</html>
