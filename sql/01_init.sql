-- ==========================================================
-- Inicialización de Base de Datos para ABMC
-- Motor: MariaDB
-- ==========================================================

USE app_db;

-- 0. Limpieza previa para garantizar idempotencia en reinicializaciones
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;

-- 1. Tabla de Roles
CREATE TABLE `roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL UNIQUE,
    `descripcion` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `rol_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Índices de optimización de búsqueda
CREATE INDEX `idx_usuarios_nombre_apellido` ON `usuarios` (`nombre`, `apellido`);
CREATE INDEX `idx_usuarios_rol` ON `usuarios` (`rol_id`);

-- 4. Inserción de Roles Semilla
INSERT IGNORE INTO `roles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'Acceso total al sistema, configuraciones y administración de usuarios'),
(2, 'Operador', 'Gestión operativa y actualización de registros cotidianos'),
(3, 'Auditor', 'Supervisión y consulta de información sin permisos de modificación'),
(4, 'Invitado', 'Acceso básico de sólo lectura a datos públicos');

-- 5. Inserción de Usuarios Semilla
INSERT IGNORE INTO `usuarios` (`id`, `nombre`, `apellido`, `username`, `email`, `rol_id`) VALUES
(1, 'Joaquín', 'González', 'joaquin', 'jgonzalez@unrn.edu.ar', 1),
(2, 'Mariana', 'López', 'mlopez', 'mlopez@unrn.edu.ar', 2),
(3, 'Carlos', 'Rodríguez', 'crodriguez', 'crodriguez@unrn.edu.ar', 3);
