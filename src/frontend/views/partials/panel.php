<!-- ========================================================================= -->
    <!-- 3. CONTENEDOR DINÁMICO DE PANELES CONTEXTUALES SEGÚN ROL                  -->
    <!-- ========================================================================= -->
    <main id="panelPrincipal" class="py-5 bg-light">
        <div class="container">

            <!-- ================================================================= -->
            <!-- VISTA 1: ORGANIZADOR (ADMIN - CONTROL TOTAL ABMC)                -->
            <!-- ================================================================= -->
            <div id="viewOrganizador" class="role-view">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-danger px-2.5 py-1.5"><i class="bi bi-shield-fill-check"></i> Modo Organizador</span>
                            <h2 class="fw-bold mb-0">Gestión Integral del Padrón (ABMC)</h2>
                        </div>
                        <p class="text-muted mb-0 mt-1">Control total de altas, modificaciones, bajas con confirmación y auditoría de la Hackatón.</p>
                    </div>
                    <div>
                        <button type="button" class="btn btn-primary fw-semibold px-3 py-2 shadow-sm" id="btnOpenCreateModal" data-bs-toggle="modal" data-bs-target="#userCreateModal">
                            <i class="bi bi-person-plus-fill me-1"></i> Inscribir Usuario
                        </button>
                    </div>
                </div>

                <!-- Card de Filtros del Organizador -->
                <div class="card border-0 shadow-sm rounded-4 mb-4">
                    <div class="card-body p-3 p-md-4">
                        <div class="row g-3 align-items-center">
                            <div class="col-md-6 col-lg-5">
                                <div class="input-group">
                                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                                    <input type="text" id="searchInput" class="form-control border-start-0 ps-0" placeholder="Buscar por nombre, nickname o email..." autocomplete="off">
                                    <button class="btn btn-outline-secondary d-none" type="button" id="btnClearSearch" title="Limpiar búsqueda">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="col-md-4 col-lg-4">
                                <select id="roleFilter" class="form-select" aria-label="Filtrar por rol">
                                    <option value="">Todos los Roles del Evento</option>
                                </select>
                            </div>

                            <div class="col-md-2 col-lg-3 text-md-end">
                                <span class="badge bg-secondary-subtle text-secondary border px-3 py-2 fs-6 rounded-pill" id="statsCounter">
                                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Cargando...
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabla de Datos del Organizador -->
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" id="usersTable">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col" class="ps-4">Participante</th>
                                    <th scope="col">Nickname</th>
                                    <th scope="col">Correo Electrónico</th>
                                    <th scope="col">Rol Asignado</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Fecha Alta</th>
                                    <th scope="col" class="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="usersTableBody">
                                <!-- Poblado dinámicamente desde JS -->
                            </tbody>
                        </table>
                    </div>
                    <!-- Paginador Dinámico en Servidor -->
                    <div id="paginationContainer" class="px-3 px-md-4 py-2 bg-light border-top"></div>
                    <div id="emptyState" class="p-5 text-center d-none">
                        <div class="display-5 text-muted mb-3"><i class="bi bi-person-x"></i></div>
                        <h5 class="fw-bold">No se encontraron participantes</h5>
                        <p class="text-muted small">No hay registros que coincidan con la búsqueda.</p>
                        <button type="button" id="btnResetFilters" class="btn btn-outline-primary btn-sm mt-2">Restablecer filtros</button>
                    </div>
                </div>

                <!-- SECCIÓN DE ROLES (NUEVO ABMC) -->
                <div class="d-flex justify-content-between align-items-center mt-5 mb-3">
                    <h3 class="fw-bold mb-0"><i class="bi bi-shield-lock-fill me-2 text-primary"></i> Gestión de Roles</h3>
                    <button type="button" class="btn btn-outline-primary fw-semibold px-3 py-2 shadow-sm" id="btnOpenRoleCreateModal" data-bs-toggle="modal" data-bs-target="#roleCreateModal">
                        <i class="bi bi-plus-circle-fill me-1"></i> Nuevo Rol
                    </button>
                </div>
                
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0" id="rolesTable">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col" class="ps-4">ID</th>
                                    <th scope="col">Nombre del Rol</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col" class="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="rolesTableBody">
                                <!-- Poblado dinámicamente desde JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================================================================= -->
            <!-- VISTA 2: MENTOR TÉCNICO                                          -->
            <!-- ================================================================= -->
            <div id="viewMentor" class="role-view d-none">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge bg-info text-dark px-2.5 py-1.5"><i class="bi bi-lightbulb-fill"></i> Modo Mentor Técnico</span>
                    <h2 class="fw-bold mb-0">Centro de Asesoramiento y Mentorías</h2>
                </div>
                <p class="text-muted mb-4">Consulta los participantes inscriptos y ofrece orientación técnica en los desafíos de la competencia.</p>

                <!-- Tarjetas de Soporte a Desafíos -->
                <div class="row g-4 mb-5">
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                            <div class="card-body">
                                <div class="badge bg-primary-subtle text-primary mb-2">Track IA</div>
                                <h5 class="fw-bold">Inteligencia Artificial</h5>
                                <p class="small text-muted">Brinda apoyo en integración de APIs de LLMs, embeddings y procesamiento de datos.</p>
                                <button type="button" class="btn btn-outline-primary btn-sm w-100 btn-mentor-act">
                                    <i class="bi bi-check-circle me-1"></i> Disponible para Asesorar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                            <div class="card-body">
                                <div class="badge bg-success-subtle text-success mb-2">Track Verde</div>
                                <h5 class="fw-bold">Sostenibilidad</h5>
                                <p class="small text-muted">Asesora en modelos de impacto ecológico, sensores IoT y eficiencia energética.</p>
                                <button type="button" class="btn btn-outline-success btn-sm w-100 btn-mentor-act">
                                    <i class="bi bi-check-circle me-1"></i> Disponible para Asesorar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                            <div class="card-body">
                                <div class="badge bg-warning-subtle text-warning mb-2">Track Público</div>
                                <h5 class="fw-bold">GovTech & Educación</h5>
                                <p class="small text-muted">Orienta en arquitectura web accesible, estándares W3C y experiencia de usuario.</p>
                                <button type="button" class="btn btn-outline-warning btn-sm w-100 btn-mentor-act">
                                    <i class="bi bi-check-circle me-1"></i> Disponible para Asesorar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Directorio de Consulta de Participantes (Solo Lectura) -->
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-header bg-white py-3 border-0">
                        <h5 class="fw-bold mb-0"><i class="bi bi-people me-2 text-info"></i>Directorio de Participantes (Consulta)</h5>
                        <small class="text-muted">Como mentor puedes visualizar a los participantes para orientarlos, sin permisos de edición ni borrado.</small>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Participante</th>
                                    <th>Nickname</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th class="text-end pe-4">Asistencia</th>
                                </tr>
                            </thead>
                            <tbody id="mentorUsersTableBody">
                                <!-- Poblado desde JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ================================================================= -->
            <!-- VISTA 3: JUEZ / EVALUADOR                                         -->
            <!-- ================================================================= -->
            <div id="viewJuez" class="role-view d-none">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge bg-warning text-dark px-2.5 py-1.5"><i class="bi bi-award-fill"></i> Modo Juez / Evaluador</span>
                    <h2 class="fw-bold mb-0">Mesa de Evaluación y Rúbrica de Proyectos</h2>
                </div>
                <p class="text-muted mb-4">Evalúa las soluciones presentadas por los equipos según los criterios oficiales de la Hackatón UNRN.</p>

                <div class="row g-4">
                    <!-- Rúbrica de Evaluación -->
                    <div class="col-lg-7">
                        <div class="card border-0 shadow-sm rounded-4 p-4">
                            <h5 class="fw-bold mb-3"><i class="bi bi-card-checklist text-warning me-2"></i>Rúbrica de Calificación Oficial</h5>
                            
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">1. Innovación y Originalidad (1 - 10)</label>
                                <input type="range" class="form-range score-slider" min="1" max="10" value="8" id="scoreInnovacion">
                                <div class="d-flex justify-content-between small text-muted"><span>Básico (1)</span><strong class="text-primary score-val" id="valInnovacion">8 / 10</strong><span>Disruptivo (10)</span></div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">2. Calidad Técnica y Arquitectura (1 - 10)</label>
                                <input type="range" class="form-range score-slider" min="1" max="10" value="9" id="scoreTecnica">
                                <div class="d-flex justify-content-between small text-muted"><span>Prototipo frágil (1)</span><strong class="text-primary score-val" id="valTecnica">9 / 10</strong><span>Producción sólida (10)</span></div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-semibold">3. Impacto Regional Patagonia (1 - 10)</label>
                                <input type="range" class="form-range score-slider" min="1" max="10" value="8" id="scoreImpacto">
                                <div class="d-flex justify-content-between small text-muted"><span>Mínimo (1)</span><strong class="text-primary score-val" id="valImpacto">8 / 10</strong><span>Alto impacto (10)</span></div>
                            </div>

                            <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mt-3 border">
                                <span class="fw-semibold">Puntaje Final Ponderado:</span>
                                <span class="fs-4 fw-bold text-success" id="finalScoreDisplay">8.3 / 10</span>
                            </div>

                            <button type="button" class="btn btn-warning fw-semibold mt-3" id="btnSubmitScore">
                                <i class="bi bi-check2-circle me-1"></i> Asignar Calificación al Equipo
                            </button>
                        </div>
                    </div>

                    <!-- Padrón de Equipos en Evaluación -->
                    <div class="col-lg-5">
                        <div class="card border-0 shadow-sm rounded-4 p-4">
                            <h5 class="fw-bold mb-3"><i class="bi bi-trophy text-warning me-2"></i>Equipos en Competencia</h5>
                            <ul class="list-group list-group-flush small" id="judgeTeamsList">
                                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div>
                                        <strong class="d-block">Equipo Alpha (IA Patagonia)</strong>
                                        <span class="text-muted">3 participantes inscriptos</span>
                                    </div>
                                    <span class="badge bg-success">Entregado</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div>
                                        <strong class="d-block">Equipo Verde (AgroTech R.N.)</strong>
                                        <span class="text-muted">4 participantes inscriptos</span>
                                    </div>
                                    <span class="badge bg-success">Entregado</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div>
                                        <strong class="d-block">Equipo GovOpen (Río Negro Digital)</strong>
                                        <span class="text-muted">2 participantes inscriptos</span>
                                    </div>
                                    <span class="badge bg-secondary">En desarrollo</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================================================================= -->
            <!-- VISTA 4: PARTICIPANTE (HACKER)                                    -->
            <!-- ================================================================= -->
            <div id="viewParticipante" class="role-view d-none">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge bg-success px-2.5 py-1.5"><i class="bi bi-terminal-fill"></i> Modo Participante</span>
                    <h2 class="fw-bold mb-0">Mi Portal de Competidor</h2>
                </div>
                <p class="text-muted mb-4">Gestiona tu perfil personal, revisa el estado de tu acreditación y solicita mentoría técnica.</p>

                <div class="row g-4">
                    <!-- Tarjeta Mi Perfil -->
                    <div class="col-lg-5">
                        <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                            <div class="user-avatar mx-auto mb-3" style="width: 72px; height: 72px; font-size: 1.5rem;" id="participantAvatar">LM</div>
                            <h4 class="fw-bold mb-1" id="participantName">Lucía Martínez</h4>
                            <span class="badge bg-light text-secondary border px-3 py-1 mb-2 d-inline-block" id="participantUsername">@LMarti</span>
                            <p class="text-muted small" id="participantEmail">lmartinez@example.com</p>

                            <div class="d-flex justify-content-center gap-2 mb-3">
                                <span class="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5">
                                    <i class="bi bi-check-circle-fill me-1"></i> Acreditada Oficialmente
                                </span>
                            </div>

                            <hr class="my-3">

                            <button type="button" class="btn btn-outline-primary btn-sm fw-semibold w-100" id="btnEditMyProfile">
                                <i class="bi bi-pencil-square me-1"></i> Modificar Mis Datos de Perfil
                            </button>
                            <small class="text-muted d-block mt-2">Como participante solo puedes editar tus propios datos. Tu rol está protegido.</small>
                        </div>
                    </div>

                    <!-- Directorio de Mentores Disponibles -->
                    <div class="col-lg-7">
                        <div class="card border-0 shadow-sm rounded-4 p-4">
                            <h5 class="fw-bold mb-3"><i class="bi bi-headset text-primary me-2"></i>Mentores Disponibles para Ayuda</h5>
                            <div class="row g-3" id="mentorsListContainer">
                                <!-- Poblado desde JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================================================================= -->
            <!-- VISTA 5: VISITANTE ANÓNIMO (LANDING PÚBLICA)                     -->
            <!-- ================================================================= -->
            <div id="viewVisitante" class="role-view d-none">
                <div class="p-4 p-md-5 mb-4 bg-white rounded-4 shadow-sm border text-center">
                    <div class="display-6 fw-bold text-primary mb-2">¡Inscripciones Abiertas para la Hackatón UNRN!</div>
                    <p class="lead text-muted max-w-600 mx-auto mb-4">
                        Forma parte de la mayor competencia de desarrollo y diseño de la región. Arma tu equipo y crea prototipos con impacto real.
                    </p>
                    <div class="d-flex justify-content-center flex-wrap gap-3">
                        <button type="button" class="btn btn-primary btn-lg px-4 fw-semibold" id="btnPublicRegister" data-bs-toggle="modal" data-bs-target="#userCreateModal">
                            <i class="bi bi-pencil-fill me-2"></i> Inscribirme Ahora
                        </button>
                        <button type="button" class="btn btn-outline-primary btn-lg px-4 fw-semibold" id="btnPublicLogin">
                            <i class="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                        </button>
                    </div>
                </div>

                <!-- Padrón Público con Privacidad de Correos -->
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-white py-3 border-0">
                        <h5 class="fw-bold mb-0"><i class="bi bi-shield-lock text-primary me-2"></i>Padrón Público de Participantes</h5>
                        <small class="text-muted">Los correos se encuentran anonimizados por privacidad. Para administrar o editar, selecciona un rol autorizado en la barra superior.</small>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="ps-4">Participante</th>
                                    <th>Nickname</th>
                                    <th>Rol Asignado</th>
                                    <th class="text-end pe-4">Estado</th>
                                </tr>
                            </thead>
                            <tbody id="publicUsersTableBody">
                                <!-- Poblado desde JS con correos ocultos y sin acciones de borrado -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </main>

    