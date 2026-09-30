<!-- 1. Barra de Navegación Principal con Simulador de Roles -->
<nav class="navbar navbar-expand-lg navbar-custom sticky-top shadow-sm py-2">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-3" href="#inicio">
            <!-- Logotipo UNRN en Texto -->
            <div class="d-flex flex-column lh-1 unrn-logo-text" style="font-family: 'Montserrat', sans-serif; color: #11202C;">
                <span class="brand-unrn" style="font-weight: 800; font-size: 1.8rem; letter-spacing: -1px;">UNRN</span>
                <span class="brand-uni" style="font-weight: 400; font-size: 0.8rem;">Universidad Nacional</span>
                <span class="brand-rn" style="font-weight: 400; font-size: 0.8rem;">de <strong style="font-weight: 700;">Río Negro</strong></span>
            </div>
            <!-- Barra separadora -->
            <div class="border-start border-2 border-secondary opacity-50" style="height: 40px;"></div>
            <!-- Evento Hackaton -->
            <div class="d-flex flex-column justify-content-center lh-1" style="font-family: 'Montserrat', sans-serif;">
                <span class="fs-4 text-uppercase tracking-wider brand-title" style="font-weight: 800; color: #E00427;">HACKATON</span>
                <span class="fs-6 fw-semibold brand-subtitle mt-1" style="letter-spacing: 1px; color: #11202C;">Edición 2026</span>
            </div>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain"
            aria-controls="navbarMain" aria-expanded="false" aria-label="Alternar navegación">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMain">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" href="#inicio"><i class="bi bi-house-door me-1"></i> Inicio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#panelPrincipal"><i class="bi bi-grid-1x2-fill me-1"></i> Mi Panel</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#desafios"><i class="bi bi-flag me-1"></i> Desafíos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#roles"><i class="bi bi-shield-check me-1"></i> Roles</a>
                </li>
            </ul>

            <!-- CONMUTADOR DE ROL (SIMULADOR DE IDENTIDAD) -->
            <div class="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
                <div class="input-group input-group-sm w-auto">
                    <span class="input-group-text bg-secondary border-secondary text-white small"
                        title="Simulador de Perfil para evaluación del TP">
                        <i class="bi bi-person-badge-fill me-1"></i> Rol:
                    </span>
                    <select id="roleSwitcher"
                        class="form-select form-select-sm bg-dark text-white border-secondary fw-semibold">
                        <option value="1">Admin Global (Administrador)</option>
                        <option value="2">Carlos Tutor (Tutor)</option>
                        <option value="3">Mariana Mentor (Mentor)</option>
                        <option value="4">Juan Estudiante (Participante, pendiente)</option>
                        <option value="5">Ana Externa (Participante, aprobado)</option>
                        <option value="0">Visitante Público</option>
                    </select>
                </div>

                <a href="http://localhost:8081" target="_blank" rel="noopener noreferrer"
                    class="btn admin-button btn-sm" title="Abrir gestor Adminer de MariaDB">
                    <i class="bi bi-database me-1"></i> Adminer
                </a>

                <!-- Toggle de Modo Oscuro -->
                <button class="btn theme-toggle btn-sm ms-lg-2" id="darkModeToggle" title="Cambiar Tema (Claro/Oscuro)">
                    <i class="bi bi-moon-stars-fill" id="darkModeIcon"></i>
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Barra de Estado de la Identidad Activa -->
<aside class="identity-banner text-white py-2 px-3 shadow-sm border-bottom border-primary-subtle" id="identityBanner"
    aria-label="Información de sesión activa">
    <div class="container d-flex flex-wrap align-items-center justify-content-between gap-2 small">
        <div>
            <i class="bi bi-person-check-fill me-1"></i> Conectado como:
            <strong id="activeUserName">Joaquín González</strong>
            <span class="badge bg-white text-primary ms-1 fw-bold" id="activeUserRoleBadge">Organizador</span>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="text-white-50 small" id="activeRoleDescription">
                Control total del sistema, acreditación y administración de usuarios.
            </div>
            <button type="button" class="btn btn-outline-light btn-sm d-none" id="btnLogout"
                title="Cerrar sesión y volver al inicio">
                <i class="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
            </button>
        </div>
    </div>
</aside>