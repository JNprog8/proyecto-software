/**
 * modulo de renderizado contextual por rol (RBAC views).
 * conmuta dinamicamente las secciones visibles segun la identidad del usuario activo.
 */
export function updateRoleViews(user) {
    const roleId = user ? Number(user.rol_id) : 0;
    const roleName = user?.rol_nombre || (roleId === 0 ? 'Visitante' : 'Desconocido');

    // actualizar badges e indicadores de identidad en la barra de navegacion
    const activeUserName = document.getElementById('activeUserName');
    const activeUserRoleBadge = document.getElementById('activeUserRoleBadge');
    const activeRoleDescription = document.getElementById('activeRoleDescription');
    const roleSwitcher = document.getElementById('roleSwitcher');

    if (activeUserName) {
        activeUserName.textContent = user?.nombre_completo || 'Visitante Anónimo';
    }

    if (activeUserRoleBadge) {
        const badgeClasses = {
            1: 'bg-primary text-white',
            2: 'bg-info text-dark',
            3: 'bg-warning text-dark',
            4: 'bg-success text-white',
            0: 'bg-secondary text-white'
        };
        activeUserRoleBadge.className = `badge ${badgeClasses[roleId] || 'bg-secondary text-white'}`;
        activeUserRoleBadge.textContent = roleName;
    }

    if (activeRoleDescription) {
        const descriptions = {
            1: 'Panel de Control Total: Administración del Padrón de Usuarios, Gestión de Roles y Métricas.',
            2: 'Asesoramiento Técnico: Guía en arquitectura de software y soporte continuo a los equipos.',
            3: 'Evaluación de Entregables: Rúbrica de calificación, innovación tecnológica e impacto regional.',
            4: 'Espacio del Competidor: Retos asignados, entregables y estado de participación en la Hackatón.',
            0: 'Acceso Público: Información general sobre la Hackatón UNRN y requisitos de participación.'
        };
        activeRoleDescription.textContent = descriptions[roleId] || 'Plataforma oficial de la Hackatón UNRN 2026.';
    }

    if (roleSwitcher) {
        roleSwitcher.value = roleId.toString();
    }

    // alternar visibilidad de las secciones especificas por rol
    const views = {
        1: document.getElementById('viewOrganizador'),
        2: document.getElementById('viewMentor'),
        3: document.getElementById('viewJuez'),
        4: document.getElementById('viewParticipante'),
        0: document.getElementById('viewVisitante')
    };

    for (const [idStr, el] of Object.entries(views)) {
        if (!el) continue;
        const id = Number(idStr);
        if (id === roleId) {
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    }

    // botones de accion restringida (ej: inscribir nuevo usuario solo para organizador)
    const organizerOnlyButtons = document.querySelectorAll('[data-role-required="organizador"]');
    organizerOnlyButtons.forEach(btn => {
        if (roleId === 1) {
            btn.classList.remove('d-none');
        } else {
            btn.classList.add('d-none');
        }
    });
}
