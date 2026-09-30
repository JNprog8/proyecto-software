/**
 * modulo RBAC (role-based access control UI)
 * muta la interfaz dependiendo de la identidad seleccionada.
 */
import { ui } from './ui.js';

export const rolesUI = {
    applyUserRoleView(user) {
        if (!user) return;

        // referencias al DOM (evaluadas perezosamente para evitar nulls)
        const activeUserName = document.getElementById('activeUserName');
        const activeUserRoleBadge = document.getElementById('activeUserRoleBadge');
        const activeRoleDescription = document.getElementById('activeRoleDescription');
        const roleSwitcher = document.getElementById('roleSwitcher');
        const btnLogout = document.getElementById('btnLogout');

        const views = {
            organizador: document.getElementById('viewOrganizador'),
            mentor: document.getElementById('viewMentor'),
            juez: document.getElementById('viewJuez'),
            participante: document.getElementById('viewParticipante'),
            visitante: document.getElementById('viewVisitante')
        };

        if (activeUserName) {
            activeUserName.textContent = user.nombre_completo || (user.nombre + ' ' + user.apellido) || 'Sin Nombre';
        }
        if (activeUserRoleBadge) {
            activeUserRoleBadge.textContent = user.rol_nombre || 'Visitante';
        }
        if (roleSwitcher && roleSwitcher.value !== String(user.id)) {
            roleSwitcher.value = user.id;
        }

        // ocultar todas
        Object.values(views).forEach(v => { if (v) v.classList.add('d-none'); });

        const rolId = Number(user.rol_id);

        if (btnLogout) {
            btnLogout.classList.toggle('d-none', rolId === 0);
        }

        const eventStatusCard = document.getElementById('eventStatusCard');
        if (eventStatusCard) {
            eventStatusCard.classList.toggle('d-none', rolId !== 1);
        }

        const btnHeroRegister = document.getElementById('btnHeroRegister');
        if (btnHeroRegister) {
            btnHeroRegister.classList.toggle('d-none', rolId === 4);
        }

        const roleConfigs = {
            1: { view: views.organizador, desc: 'Control total del sistema, acreditación y administración de usuarios.' },
            2: { view: views.mentor, desc: 'Orientación técnica y acompañamiento a equipos en competencia.' },
            3: { view: views.juez, desc: 'Mesa de evaluación, rúbricas de puntaje y selección de ganadores.' },
            4: { view: views.participante, desc: 'Competidor oficial en la Hackatón. Gestión de perfil personal y asesoría.' },
            0: { view: views.visitante, desc: 'Modo público de solo lectura con datos de contacto protegidos.' }
        };

        const config = roleConfigs[rolId] || roleConfigs[0];
        
        if (config.view) config.view.classList.remove('d-none');
        if (activeRoleDescription) activeRoleDescription.textContent = config.desc;
    }
};
