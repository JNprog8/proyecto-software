<!-- ========================================================================= -->
<!-- MODALES BOOTSTRAP 5                                                      -->
<!-- ========================================================================= -->

<!-- Modal: Formulario de Alta de Usuario -->

<div class="modal fade" id="userCreateModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold" id="modalTitleCreate">Inscribir Nuevo Participante</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <form id="userCreateForm" novalidate>
                <div class="modal-body pt-3">
                    <input type="hidden" id="userIdCreate" name="id" value="">

                    <!-- Alerta de Error del Servidor -->
                    <div id="formAlertCreate" class="alert alert-danger d-none" role="alert"></div>

                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="nombreCreate" class="form-label small fw-semibold">Nombre <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nombreCreate" name="nombre" placeholder="Ej: Lucía" required maxlength="100">
                            <div class="invalid-feedback" id="error_nombreCreate">El nombre es requerido (mínimo 2 caracteres).</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="apellidoCreate" class="form-label small fw-semibold">Apellido <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="apellidoCreate" name="apellido" placeholder="Ej: Martínez" required maxlength="100">
                            <div class="invalid-feedback" id="error_apellidoCreate">El apellido es requerido (mínimo 2 caracteres).</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="usernameCreate" class="form-label small fw-semibold">Nickname (Usuario) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text text-muted">@</span>
                                <input type="text" class="form-control" id="usernameCreate" name="username" placeholder="lmartinez" required maxlength="50">
                            </div>
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_usernameCreate">El nickname debe tener entre 3 y 30 caracteres alfanuméricos.</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="emailCreate" class="form-label small fw-semibold">Correo Electrónico <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="emailCreate" name="email" placeholder="lmartinez@unrn.edu.ar" required maxlength="100">
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_emailCreate">Ingrese un correo electrónico válido.</div>
                        </div>

                        <div class="col-12">
                            <label for="rolIdCreate" class="form-label small fw-semibold">Rol Asignado en la Hackatón <span class="text-danger">*</span></label>
                            <select class="form-select" id="rolIdCreate" name="rol_id" required>
                                <option value="">Seleccione un rol...</option>
                            </select>
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_rol_idCreate">Debe seleccionar un rol válido.</div>
                            <div class="form-text small text-muted mt-1" id="roleDescriptionHintCreate"></div>
                        </div>

                        <!-- Campos Condicionales de Registro (Estudiante vs Externo) -->
                        <div class="col-sm-6" id="containerTipoParticipanteCreate">
                            <label for="tipoParticipanteIdCreate" class="form-label small fw-semibold">Tipo de Participante</label>
                            <select class="form-select" id="tipoParticipanteIdCreate" name="tipo_participante_id">
                                <option value="">Seleccione tipo (opcional)</option>
                                <option value="1">Estudiante Universitario</option>
                                <option value="2">Público General (Externo)</option>
                            </select>
                        </div>

                        <div class="col-sm-6 d-none" id="containerLegajoCreate">
                            <label for="legajoCreate" class="form-label small fw-semibold">Número de Legajo <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="legajoCreate" name="legajo" placeholder="Ej: UNRN-12345" maxlength="50">
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_legajoCreate">El legajo es obligatorio para estudiantes.</div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary fw-semibold" id="btnSubmitUserCreate">
                        <span class="spinner-border spinner-border-sm me-1 d-none" id="submitSpinnerCreate" role="status" aria-hidden="true"></span>
                        <span id="submitBtnTextCreate">Registrar Participante</span>
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>

<!-- Modal: Formulario de Modificación de Usuario -->

<div class="modal fade" id="userEditModal" tabindex="-1" aria-labelledby="modalTitle" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold" id="modalTitleEdit">Modificar Participante</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <form id="userEditForm" novalidate>
                <div class="modal-body pt-3">
                    <input type="hidden" id="userIdEdit" name="id" value="">

                    <!-- Alerta de Error del Servidor -->
                    <div id="formAlertEdit" class="alert alert-danger d-none" role="alert"></div>

                    <div class="row g-3">
                        <div class="col-sm-6">
                            <label for="nombreEdit" class="form-label small fw-semibold">Nombre <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nombreEdit" name="nombre" placeholder="Ej: Lucía" required maxlength="100">
                            <div class="invalid-feedback" id="error_nombreEdit">El nombre es requerido (mínimo 2 caracteres).</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="apellidoEdit" class="form-label small fw-semibold">Apellido <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="apellidoEdit" name="apellido" placeholder="Ej: Martínez" required maxlength="100">
                            <div class="invalid-feedback" id="error_apellidoEdit">El apellido es requerido (mínimo 2 caracteres).</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="usernameEdit" class="form-label small fw-semibold">Nickname (Usuario) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text text-muted">@</span>
                                <input type="text" class="form-control" id="usernameEdit" name="username" placeholder="lmartinez" required maxlength="50">
                            </div>
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_usernameEdit">El nickname debe tener entre 3 y 30 caracteres alfanuméricos.</div>
                        </div>

                        <div class="col-sm-6">
                            <label for="emailEdit" class="form-label small fw-semibold">Correo Electrónico <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="emailEdit" name="email" placeholder="lmartinez@unrn.edu.ar" required maxlength="100">
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_emailEdit">Ingrese un correo electrónico válido.</div>
                        </div>

                        <div class="col-12">
                            <label for="rolIdEdit" class="form-label small fw-semibold">Rol Asignado en la Hackatón <span class="text-danger">*</span></label>
                            <select class="form-select" id="rolIdEdit" name="rol_id" required>
                                <option value="">Seleccione un rol...</option>
                            </select>
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_rol_idEdit">Debe seleccionar un rol válido.</div>
                            <div class="form-text small text-muted mt-1" id="roleDescriptionHintEdit"></div>
                        </div>

                        <!-- Campos Condicionales de Registro (Estudiante vs Externo) -->
                        <div class="col-sm-6" id="containerTipoParticipanteEdit">
                            <label for="tipoParticipanteIdEdit" class="form-label small fw-semibold">Tipo de Participante</label>
                            <select class="form-select" id="tipoParticipanteIdEdit" name="tipo_participante_id">
                                <option value="">Seleccione tipo (opcional)</option>
                                <option value="1">Estudiante Universitario</option>
                                <option value="2">Público General (Externo)</option>
                            </select>
                        </div>

                        <div class="col-sm-6 d-none" id="containerLegajoEdit">
                            <label for="legajoEdit" class="form-label small fw-semibold">Número de Legajo <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="legajoEdit" name="legajo" placeholder="Ej: UNRN-12345" maxlength="50">
                            <div class="invalid-feedback d-block text-danger small mt-1 d-none" id="error_legajoEdit">El legajo es obligatorio para estudiantes.</div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary fw-semibold" id="btnSubmitUserEdit">
                        <span class="spinner-border spinner-border-sm me-1 d-none" id="submitSpinnerEdit" role="status" aria-hidden="true"></span>
                        <span id="submitBtnTextEdit">Guardar Cambios</span>
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>

<!-- Modal: Confirmación de Eliminación de Usuario --><!-- Modal: Confirmación de Eliminación de Usuario -->
<div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteModalTitle" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header bg-danger text-white rounded-top-4">
                <h5 class="modal-title fw-bold" id="deleteModalTitle"><i class="bi bi-exclamation-triangle-fill me-2"></i>Eliminar Registro</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-center p-4">
                <p class="mb-2">¿Confirmas la eliminación del siguiente participante del padrón?</p>
                <div class="p-3 bg-light rounded-3 my-3 border">
                    <strong class="d-block text-dark" id="deleteUserName">Nombre Usuario</strong>
                    <small class="text-muted" id="deleteUserEmail">email@unrn.edu.ar</small>
                </div>
                <p class="small text-danger mb-0">Esta acción liberará el nickname y el correo para nuevas inscripciones.</p>
            </div>
            <div class="modal-footer border-top-0 justify-content-center">
                <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger btn-sm fw-semibold" id="btnConfirmDelete">
                    <span class="spinner-border spinner-border-sm me-1 d-none" id="deleteSpinner" role="status" aria-hidden="true"></span>
                    <span id="deleteBtnText">Sí, Eliminar</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ========================================================================= -->
<!-- MODALES DE ROLES                                                         -->
<!-- ========================================================================= -->

<!-- Modal: Formulario de Alta de Rol -->
<div class="modal fade" id="roleCreateModal" tabindex="-1" aria-labelledby="modalTitleRoleCreate" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold" id="modalTitleRoleCreate">Crear Nuevo Rol</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <form id="roleCreateForm" novalidate>
                <div class="modal-body pt-3">
                    <input type="hidden" id="roleIdCreate" name="id" value="">
                    <div id="formAlertRoleCreate" class="alert alert-danger d-none" role="alert"></div>
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="nombreRoleCreate" class="form-label small fw-semibold">Nombre del Rol <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nombreRoleCreate" name="nombre" placeholder="Ej: Invitado Especial" required maxlength="50">
                            <div class="invalid-feedback" id="error_nombreRoleCreate">El nombre es requerido.</div>
                        </div>
                        <div class="col-12">
                            <label for="descripcionRoleCreate" class="form-label small fw-semibold">Descripción</label>
                            <textarea class="form-control" id="descripcionRoleCreate" name="descripcion" rows="3" placeholder="Descripción de permisos..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary fw-semibold" id="btnSubmitRoleCreate">
                        <span class="spinner-border spinner-border-sm me-1 d-none" id="submitRoleSpinnerCreate" role="status" aria-hidden="true"></span>
                        <span id="submitRoleBtnTextCreate">Crear Rol</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal: Formulario de Modificación de Rol -->
<div class="modal fade" id="roleEditModal" tabindex="-1" aria-labelledby="modalTitleRoleEdit" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header border-bottom-0 pb-0">
                <h5 class="modal-title fw-bold" id="modalTitleRoleEdit">Modificar Rol</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <form id="roleEditForm" novalidate>
                <div class="modal-body pt-3">
                    <input type="hidden" id="roleIdEdit" name="id" value="">
                    <div id="formAlertRoleEdit" class="alert alert-danger d-none" role="alert"></div>
                    <div class="row g-3">
                        <div class="col-12">
                            <label for="nombreRoleEdit" class="form-label small fw-semibold">Nombre del Rol <span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="nombreRoleEdit" name="nombre" required maxlength="50">
                            <div class="invalid-feedback" id="error_nombreRoleEdit">El nombre es requerido.</div>
                        </div>
                        <div class="col-12">
                            <label for="descripcionRoleEdit" class="form-label small fw-semibold">Descripción</label>
                            <textarea class="form-control" id="descripcionRoleEdit" name="descripcion" rows="3"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary fw-semibold" id="btnSubmitRoleEdit">
                        <span class="spinner-border spinner-border-sm me-1 d-none" id="submitRoleSpinnerEdit" role="status" aria-hidden="true"></span>
                        <span id="submitRoleBtnTextEdit">Guardar Cambios</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal: Confirmación de Eliminación de Rol -->
<div class="modal fade" id="deleteRoleConfirmModal" tabindex="-1" aria-labelledby="deleteRoleModalTitle" aria-hidden="true" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content rounded-4 border-0 shadow">
            <div class="modal-header bg-danger text-white rounded-top-4">
                <h5 class="modal-title fw-bold" id="deleteRoleModalTitle"><i class="bi bi-exclamation-triangle-fill me-2"></i>Eliminar Rol</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body text-center p-4">
                <p class="mb-2">¿Confirmas la eliminación de este rol?</p>
                <div class="p-3 bg-light rounded-3 my-3 border">
                    <strong class="d-block text-dark" id="deleteRoleName">Nombre Rol</strong>
                </div>
                <p class="small text-danger mb-0">No podrá eliminarse si tiene usuarios asignados.</p>
            </div>
            <div class="modal-footer border-top-0 justify-content-center">
                <button type="button" class="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger btn-sm fw-semibold" id="btnConfirmRoleDelete">
                    <span class="spinner-border spinner-border-sm me-1 d-none" id="deleteRoleSpinner" role="status" aria-hidden="true"></span>
                    <span id="deleteRoleBtnText">Sí, Eliminar</span>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- 7. Contenedor de Toasts de Bootstrap -->
<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1060;" id="toastContainer">
    <!-- Poblado por JS -->
</div>
