/**
 * vista de tabla dinamica y paginacion (schema-driven table).
 * renderiza el listado segun las columnas declaradas en userschema, con soporte para
 * skeleton loader, empty state, delegacion de eventos y paginacion en base de datos.
 */
import { userSchema } from '../schema/userSchema.js';

export class UserTableView {
    constructor({ containerEl, paginationEl, onEdit, onDelete, onPageChange }) {
        this.containerEl = containerEl;
        this.paginationEl = paginationEl;
        this.onEdit = onEdit;
        this.onDelete = onDelete;
        this.onPageChange = onPageChange;

        this.bindEvents();
    }

    bindEvents() {
        // delegacion de eventos en la tabla para acciones de fila
        this.containerEl.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const id = Number(btn.dataset.id);

            if (action === 'edit' && this.onEdit) {
                this.onEdit(id);
            } else if (action === 'delete' && this.onDelete) {
                this.onDelete(id);
            }
        });

        // delegacion de eventos para la barra de paginacion
        if (this.paginationEl) {
            this.paginationEl.addEventListener('click', (e) => {
                const pageBtn = e.target.closest('[data-page]');
                if (!pageBtn || pageBtn.classList.contains('disabled')) return;

                const targetPage = Number(pageBtn.dataset.page);
                if (targetPage > 0 && this.onPageChange) {
                    this.onPageChange(targetPage);
                }
            });
        }
    }

    /**
     * renderiza un esqueleto animado (skeleton loader) mientras carga los datos.
     */
    renderSkeleton(limit = 5) {
        let rows = '';
        for (let i = 0; i < limit; i++) {
            rows += `
                <tr class="placeholder-glow">
                    <td><span class="placeholder col-8 py-2 rounded"></span></td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span class="placeholder rounded-circle" style="width: 32px; height: 32px;"></span>
                            <div class="w-75">
                                <span class="placeholder col-9 py-1 rounded d-block mb-1"></span>
                                <span class="placeholder col-5 py-1 rounded d-block"></span>
                            </div>
                        </div>
                    </td>
                    <td><span class="placeholder col-10 py-2 rounded"></span></td>
                    <td><span class="placeholder col-7 py-2 rounded-pill"></span></td>
                    <td><span class="placeholder col-6 py-2 rounded"></span></td>
                    <td class="text-end">
                        <span class="placeholder col-5 py-2 rounded"></span>
                    </td>
                </tr>
            `;
        }
        this.containerEl.innerHTML = rows;
    }

    /**
     * renderiza las filas de datos reales basadas en el esquema.
     */
    renderData(users, isOrganizer = true) {
        if (!users || users.length === 0) {
            this.containerEl.innerHTML = `
                <tr>
                    <td colspan="${userSchema.columns.length + 1}" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        <h6 class="fw-bold">No se encontraron participantes</h6>
                        <p class="small mb-0">Intenta modificando los términos de búsqueda o los filtros aplicados.</p>
                    </td>
                </tr>
            `;
            return;
        }

        const html = users.map((user) => {
            const cells = userSchema.columns.map((col) => {
                const cellClass = col.class || '';
                const content = col.render ? col.render(user) : escapeHtml(user[col.key] ?? '');
                return `<td class="${cellClass}">${content}</td>`;
            }).join('');

            // botones de accion (visibles con permisos)
            const actionsCell = `
                <td class="text-end text-nowrap">
                    ${isOrganizer ? `
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-secondary" data-action="edit" data-id="${user.id}" title="Modificar datos">
                                <i class="bi bi-pencil-square text-primary"></i>
                            </button>
                            <button type="button" class="btn btn-outline-secondary ${user.id === 1 ? 'disabled opacity-50' : ''}" data-action="delete" data-id="${user.id}" title="${user.id === 1 ? 'Organizador raíz protegido' : 'Dar de baja'}" ${user.id === 1 ? 'disabled' : ''}>
                                <i class="bi bi-trash3 text-danger"></i>
                            </button>
                        </div>
                    ` : `
                        <span class="badge bg-light text-muted border small"><i class="bi bi-eye"></i> Solo lectura</span>
                    `}
                </td>
            `;

            return `<tr>${cells}${actionsCell}</tr>`;
        }).join('');

        this.containerEl.innerHTML = html;
    }

    /**
     * renderiza los controles visuales de paginacion.
     */
    renderPagination(pagination) {
        if (!this.paginationEl) return;

        const { page, total_pages, total, limit } = pagination;
        if (total === 0 || total_pages <= 1) {
            this.paginationEl.innerHTML = '';
            return;
        }

        const start = (page - 1) * limit + 1;
        const end = Math.min(page * limit, total);

        let pageItems = '';
        for (let i = 1; i <= total_pages; i++) {
            pageItems += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <button class="page-link" type="button" data-page="${i}">${i}</button>
                </li>
            `;
        }

        this.paginationEl.innerHTML = `
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 w-100 py-2">
                <div class="small text-muted">
                    Mostrando <span class="fw-semibold text-dark">${start}-${end}</span> de <span class="fw-semibold text-dark">${total}</span> participantes registrados
                </div>
                <nav aria-label="Navegación de páginas">
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${page <= 1 ? 'disabled' : ''}">
                            <button class="page-link" type="button" data-page="${page - 1}" aria-label="Página anterior">&laquo;</button>
                        </li>
                        ${pageItems}
                        <li class="page-item ${page >= total_pages ? 'disabled' : ''}">
                            <button class="page-link" type="button" data-page="${page + 1}" aria-label="Página siguiente">&raquo;</button>
                        </li>
                    </ul>
                </nav>
            </div>
        `;
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
