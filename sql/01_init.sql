-- ==========================================================
-- Inicialización de Base de Datos para ABMC
-- Motor: MariaDB / MySQL (Compatible con Docker/Podman y XAMPP/WAMP)
-- ==========================================================
CREATE DATABASE IF NOT EXISTS `app_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `app_db`;
-- 0. Limpieza previa para garantizar idempotencia en reinicializaciones
DROP TABLE IF EXISTS `inscripciones_proyectos`;
DROP TABLE IF EXISTS `proyectos`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `estados_usuario`;
DROP TABLE IF EXISTS `tipos_participante`;
DROP TABLE IF EXISTS `estados_proyecto`;
-- 1. Tablas de Catálogo (Lookup Tables)
CREATE TABLE `estados_usuario` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `tipos_participante` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `estados_proyecto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 2. Tabla de Roles
CREATE TABLE `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE,
    `descripcion` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 3. Tabla de Usuarios
CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `rol_id` INT NOT NULL,
    `tipo_participante_id` INT NULL,
    `estado_usuario_id` INT NOT NULL DEFAULT 1,
    `legajo` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    `username_activo` VARCHAR(50) GENERATED ALWAYS AS (IF(`deleted_at` IS NULL, `username`, NULL)) STORED,
    `email_activo` VARCHAR(100) GENERATED ALWAYS AS (IF(`deleted_at` IS NULL, `email`, NULL)) STORED,
    UNIQUE KEY `uq_usuarios_username_activo` (`username_activo`),
    UNIQUE KEY `uq_usuarios_email_activo` (`email_activo`),
    CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_usuarios_tipo_participante` FOREIGN KEY (`tipo_participante_id`) REFERENCES `tipos_participante` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_usuarios_estado_usuario` FOREIGN KEY (`estado_usuario_id`) REFERENCES `estados_usuario` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 4. Tabla de Proyectos
CREATE TABLE `proyectos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `autor_id` INT NOT NULL,
    `estado_proyecto_id` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_proyectos_autor` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_proyectos_estado` FOREIGN KEY (`estado_proyecto_id`) REFERENCES `estados_proyecto` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 5. Tabla Pivote de Inscripciones (1 usuario = 1 proyecto)
CREATE TABLE `inscripciones_proyectos` (
    `usuario_id` INT NOT NULL,
    `proyecto_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`usuario_id`, `proyecto_id`),
    UNIQUE KEY `uq_inscripciones_usuario` (`usuario_id`),
    CONSTRAINT `fk_inscripciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_inscripciones_proyecto` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 6. Índices de optimización de búsqueda
CREATE INDEX `idx_usuarios_nombre_apellido` ON `usuarios` (`nombre`, `apellido`);
CREATE INDEX `idx_usuarios_rol` ON `usuarios` (`rol_id`);
CREATE INDEX `idx_usuarios_deleted_at` ON `usuarios` (`deleted_at`);
-- 7. Inserción de Catálogos Semilla
INSERT INTO `estados_usuario` (`id`, `nombre`)
VALUES (1, 'PENDIENTE'),
    (2, 'APROBADO'),
    (3, 'RECHAZADO');
INSERT INTO `tipos_participante` (`id`, `nombre`)
VALUES (1, 'ESTUDIANTE'),
    (2, 'EXTERNO');
INSERT INTO `estados_proyecto` (`id`, `nombre`)
VALUES (1, 'PENDIENTE'),
    (2, 'APROBADO'),
    (3, 'RECHAZADO');
-- 8. Inserción de Roles Semilla
INSERT IGNORE INTO `roles` (`id`, `nombre`, `descripcion`)
VALUES (
        1,
        'Administrador',
        'Mantenimiento del sistema y CRUD de usuarios/roles'
    ),
    (
        2,
        'Mentor',
        'Revisión y aprobación de proyectos de Hackatón'
    ),
    (
        3,
        'Tutor',
        'Revisión y aprobación de nuevos usuarios (Onboarding)'
    ),
    (
        4,
        'Participante',
        'Usuario general inscripto para participar o proponer proyectos'
    );
-- 9. Inserción de Usuarios Semilla (Para tener datos al arrancar)
INSERT IGNORE INTO `usuarios` (
        `id`,
        `nombre`,
        `apellido`,
        `username`,
        `email`,
        `rol_id`,
        `tipo_participante_id`,
        `estado_usuario_id`,
        `legajo`
    )
VALUES (
        1,
        'Admin',
        'Global',
        'admin',
        'admin@unrn.edu.ar',
        1,
        NULL,
        2,
        NULL
    ),
    (
        2,
        'Carlos',
        'Tutor',
        'ctutor',
        'ctutor@unrn.edu.ar',
        3,
        NULL,
        2,
        NULL
    ),
    (
        3,
        'Mariana',
        'Mentor',
        'mmentora',
        'mmentora@unrn.edu.ar',
        2,
        NULL,
        2,
        NULL
    ),
    (
        4,
        'Juan',
        'Estudiante',
        'juanest',
        'juanest@alumnos.unrn.edu.ar',
        4,
        1,
        1,
        'LEG-12345'
    ),
    (
        5,
        'Ana',
        'Externa',
        'anaext',
        'ana.externa@gmail.com',
        4,
        2,
        2,
        NULL
    );
-- 10. Inserción de Proyecto de Prueba
INSERT IGNORE INTO `proyectos` (
        `id`,
        `titulo`,
        `descripcion`,
        `autor_id`,
        `estado_proyecto_id`
    )
VALUES (
        1,
        'Sistema Inteligente de Riego',
        'Propuesta de IoT para hackaton...',
        5,
        1
    );