<!-- 2. Hero Section: Presentación de la Hackatón -->
    <header id="inicio" class="hero-section py-5 text-white position-relative">
        <div class="container py-3">
            <div class="row align-items-center g-4">
                <div class="col-lg-7">
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3 d-inline-flex align-items-center gap-2">
                        <i class="bi bi-lightning-charge-fill text-warning"></i> 48 Horas de Innovación Tecnológica
                    </span>
                    <h1 class="display-4 fw-extrabold lh-tight mb-3">
                        UNRN - Hackatón <span class="text-gradient">Patagonia Digital</span>
                    </h1>
                    <p class="lead text-light opacity-90 mb-4">
                        Resuelve los problemas más importantes de la provincia en materia de Energias Renovables, Salud, Educacion Digital e Inteligencia Artificial. Abiertos a todos los interesados. Compite junto a millones de desarrolladores e investigadores para impulsar los avances en la provincia de Rio Negro.
                    </p>
                    <div class="d-flex flex-wrap gap-3">
                        <a href="#panelPrincipal" class="btn btn-primary btn-lg px-4 fw-semibold shadow">
                            <i class="bi bi-arrow-down-circle me-2"></i> Ir a Mi Panel
                        </a>
                        <button type="button" class="btn btn-outline-light btn-lg px-4" id="btnHeroRegister" data-bs-toggle="modal" data-bs-target="#userCreateModal">
                            <i class="bi bi-person-plus me-2"></i> Inscribir Participante
                        </button>
                    </div>
                </div>

                <div class="col-lg-5 d-none" id="eventStatusCard">
                    <div class="card bg-dark text-white border-secondary shadow-lg rounded-4 overflow-hidden">
                        <div class="card-header bg-secondary bg-opacity-25 border-secondary py-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold small text-uppercase tracking-wider text-primary">Estado del Evento</span>
                                <span class="badge bg-success-subtle text-success border border-success-subtle"><i class="bi bi-broadcast me-1"></i> En Vivo</span>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <div class="row g-3 text-center">
                                <div class="col-6">
                                    <div class="p-3 bg-body-tertiary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                                        <div class="fs-2 fw-bold text-primary" id="heroUserCount">0</div>
                                        <div class="text-muted small">Registrados</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-body-tertiary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                                        <div class="fs-2 fw-bold text-info" id="heroRoleCount">4</div>
                                        <div class="text-muted small">Roles Activos</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-body-tertiary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                                        <div class="fs-2 fw-bold text-warning">48 hs</div>
                                        <div class="text-muted small">Duración</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-3 bg-body-tertiary bg-opacity-10 rounded-3 border border-secondary border-opacity-25">
                                        <div class="fs-2 fw-bold text-success">100%</div>
                                        <div class="text-muted small">Acreditados</div>
                                    </div>
                                </div>
                            </div>
                            <hr class="border-secondary my-3">
                            <div class="small text-muted d-flex align-items-center justify-content-between">
                                <span><i class="bi bi-shield-lock me-1"></i> Control RBAC Activo</span>
                                <span><i class="bi bi-database-check me-1"></i> MariaDB LTS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    