/**
 * esquema declarativo para la entidad usuario (schema-driven ABMC).
 * define columnas de tabla, campos de formulario, validaciones visuales y renderizadores.
 * permite generalizar el ABMC a cualquier entidad futura sin duplicar logica de DOM.
 */
export const userSchema = {
    entityName: 'Participante',
    pluralName: 'Participantes',
    endpoint: '/api/users',

    // definicion de columnas para la tabla
    columns: [
        {
            key: 'id',
            label: '# ID',
            class: 'text-muted small fw-semibold',
            render: (user) => `<span class="badge bg-light text-secondary border">#${user.id}</span>`
        },
        {
            key: 'nombre_completo',
            label: 'Participante',
            render: (user) => `
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-initials bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold small" style="width: 32px; height: 32px;">
                        ${(user.nombre?.[0] || 'U') + (user.apellido?.[0] || '')}
                    </div>
                    <div>
                        <div class="fw-semibold text-dark">${escapeHtml(user.nombre_completo || `${user.nombre} ${user.apellido}`)}</div>
                        <div class="small text-muted font-monospace">@${escapeHtml(user.username)}</div>
                    </div>
                </div>
            `
        },
        {
            key: 'email',
            label: 'Correo Electrónico',
            render: (user) => `<a href="mailto:${escapeHtml(user.email)}" class="text-decoration-none text-secondary"><i class="bi bi-envelope me-1"></i>${escapeHtml(user.email)}</a>`
        },
        {
            key: 'rol_nombre',
            label: 'Rol en Hackatón',
            render: (user) => {
                const roleBadges = {
                    'Organizador': 'bg-primary-subtle text-primary border-primary-subtle',
                    'Mentor': 'bg-info-subtle text-info-emphasis border-info-subtle',
                    'Juez / Evaluador': 'bg-warning-subtle text-warning-emphasis border-warning-subtle',
                    'Participante': 'bg-success-subtle text-success-emphasis border-success-subtle'
                };
                const badgeClass = roleBadges[user.rol_nombre] || 'bg-secondary-subtle text-secondary';
                return `<span class="badge border ${badgeClass} px-2.5 py-1.5 fw-medium"><i class="bi bi-shield-shaded me-1"></i>${escapeHtml(user.rol_nombre || 'Sin Rol')}</span>`;
            }
        },
        {
            key: 'created_at',
            label: 'Alta',
            class: 'small text-muted',
            render: (user) => {
                if (!user.created_at) return '-';
                const date = new Date(user.created_at);
                return isNaN(date.getTime()) ? escapeHtml(user.created_at) : date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
        }
    ],

    // definicion de campos del formulario de alta y edicion
    fields: [
        {
            name: 'nombre',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Ej: Martín',
            colClass: 'col-md-6',
            required: true,
            minLength: 2,
            maxLength: 100
        },
        {
            name: 'apellido',
            label: 'Apellido',
            type: 'text',
            placeholder: 'Ej: Gómez',
            colClass: 'col-md-6',
            required: true,
            minLength: 2,
            maxLength: 100
        },
        {
            name: 'username',
            label: 'Nickname (Usuario)',
            type: 'text',
            placeholder: 'mgomez',
            prefix: '@',
            colClass: 'col-md-6',
            required: true,
            pattern: '^[a-zA-Z0-9._-]{3,30}$',
            helpText: 'Entre 3 y 30 caracteres (letras, números, ., -, _)'
        },
        {
            name: 'email',
            label: 'Correo Electrónico (UNRN)',
            type: 'email',
            placeholder: 'mgomez@unrn.edu.ar',
            colClass: 'col-md-6',
            required: true,
            helpText: 'Correo institucional o personal válido'
        },
        {
            name: 'rol_id',
            label: 'Rol Asignado en la Hackatón',
            type: 'select',
            colClass: 'col-12',
            required: true,
            optionsSource: 'roles',
            helpText: 'Selecciona el perfil de acceso y responsabilidades en el evento'
        }
    ]
};

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
