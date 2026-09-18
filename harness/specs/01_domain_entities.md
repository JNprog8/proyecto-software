# Especificación de Entidades de Dominio (SDD)

Este documento define el modelo conceptual y relacional de datos para el sistema ABMC. Representa la fuente de verdad (*Single Source of Truth*) para la persistencia y las capas del backend.

---

## 1. Entidad: Rol (`roles`)

Representa la clasificación o perfil de permisos que puede tener asignado un usuario.

### Atributos

| Campo | Tipo de Dato | Nulo | Restricción | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` | No | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único del rol |
| `nombre` | `VARCHAR(50)` | No | `UNIQUE` | Nombre legible del rol (ej: Administrador, Operador) |
| `descripcion` | `TEXT` | Sí | - | Detalle de las responsabilidades o alcance del rol |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de creación del registro |

### Invariantes
- El nombre del rol no puede repetirse.
- Un rol no puede eliminarse si tiene usuarios vinculados (Integridad Referencial: `ON DELETE RESTRICT`).

---

## 2. Entidad: Usuario (`usuarios`)

Representa una cuenta de usuario dentro del sistema.

### Atributos

| Campo | Tipo de Dato | Nulo | Restricción | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` | No | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador numérico único |
| `nombre` | `VARCHAR(100)` | No | Min: 2 chars | Nombre de pila de la persona |
| `apellido` | `VARCHAR(100)` | No | Min: 2 chars | Apellido de la persona |
| `username` | `VARCHAR(50)` | No | `UNIQUE`, regex `^[a-zA-Z0-9._-]{3,30}$` | Nombre de usuario o nickname para login/identificación |
| `email` | `VARCHAR(100)` | No | `UNIQUE`, validación RFC 5322 | Correo electrónico principal |
| `rol_id` | `INT` | No | `FOREIGN KEY` &rarr; `roles(id)` | Identificador del rol asignado |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de alta en el sistema |
| `updated_at` | `TIMESTAMP` | No | `ON UPDATE CURRENT_TIMESTAMP` | Fecha y hora de última modificación |

### Relación entre Entidades
- **Relación Rol &harr; Usuario**: `1 : N` (Un rol puede pertenecer a muchos usuarios, un usuario posee exactamente un único rol obligatorio).

---

## 3. Representación en Memoria (POPO / Modelos PHP)

Cada entidad de dominio cuenta con su correspondiente clase en `src/models/`:
- `Role.php`: Métodos accesores (`getId()`, `getNombre()`, `getDescripcion()`, `getCreatedAt()`) e implementación de `JsonSerializable`.
- `User.php`: Métodos accesores, método calculado `getNombreCompleto()` e implementación de `JsonSerializable`.
