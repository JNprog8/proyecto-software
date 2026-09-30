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
| `tipo_participante_id` | `INT` | Sí | `FOREIGN KEY` &rarr; `tipos_participante(id)` | Identificador del tipo de participante |
| `estado_usuario_id` | `INT` | No | `FOREIGN KEY` &rarr; `estados_usuario(id)`, Def: 1 | Identificador del estado de aprobación |
| `legajo` | `VARCHAR(50)` | Sí | - | Número de estudiante (condicional) |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de alta en el sistema |
| `updated_at` | `TIMESTAMP` | No | `ON UPDATE CURRENT_TIMESTAMP` | Fecha y hora de última modificación |
| `deleted_at` | `TIMESTAMP` | Sí | `DEFAULT NULL`, Index | Fecha y hora de baja lógica (Soft Delete) |

### Relación entre Entidades
- **Roles y Catálogos &harr; Usuario**: `1 : N` (Un rol, tipo y estado pertenece a muchos usuarios).
- **Soft Delete**: Los usuarios eliminados conservan `deleted_at IS NOT NULL`.

---

## 3. Entidades de Catálogo (Abstracciones de Estado y Tipo)

Para evitar el uso de `ENUMS` y permitir escalabilidad y mantenibilidad, se normalizan los estados y tipos en tablas de diccionario (Lookup Tables):

- **`estados_usuario`**: `id` (PK), `nombre` (Ej: 1=Pendiente, 2=Aprobado, 3=Rechazado).
- **`tipos_participante`**: `id` (PK), `nombre` (Ej: 1=Estudiante, 2=Externo).
- **`estados_proyecto`**: `id` (PK), `nombre` (Ej: 1=Pendiente, 2=Aprobado, 3=Rechazado).

---

## 4. Entidad: Proyecto (`proyectos`)

Representa una idea o proyecto propuesto por un participante para la Hackaton.

### Atributos
| Campo | Tipo de Dato | Nulo | Restricción | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` | No | `AUTO_INCREMENT`, `PRIMARY KEY` | Identificador único |
| `titulo` | `VARCHAR(150)` | No | - | Título del proyecto |
| `descripcion` | `TEXT` | No | - | Detalle y objetivos |
| `autor_id` | `INT` | No | `FOREIGN KEY` &rarr; `usuarios(id)` | Participante que lo propuso |
| `estado_proyecto_id` | `INT` | No | `FOREIGN KEY` &rarr; `estados_proyecto(id)` | Estado de aprobación del proyecto |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | Fecha de creación |

---

## 5. Entidad Pivote: Inscripciones (`inscripciones_proyectos`)

Registra en qué proyecto participa un usuario.

### Atributos
| Campo | Tipo de Dato | Nulo | Restricción | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `usuario_id` | `INT` | No | `FOREIGN KEY` &rarr; `usuarios(id)` | Usuario inscrito |
| `proyecto_id` | `INT` | No | `FOREIGN KEY` &rarr; `proyectos(id)` | Proyecto al que se inscribe |
| `created_at` | `TIMESTAMP` | No | `DEFAULT CURRENT_TIMESTAMP` | Fecha de inscripción |

**Restricción de Negocio Crítica:** `UNIQUE(usuario_id)`. Un participante solo puede inscribirse a **un** proyecto.

---

## 6. Representación en Memoria (POPO / Modelos PHP)

Cada entidad de dominio cuenta con su correspondiente clase en `src/models/`:
- `Role.php`, `EstadoUsuario.php`, `TipoParticipante.php`, `EstadoProyecto.php`
- `User.php`: Incorpora los FK como propiedades.
- `Project.php` y `Enrollment.php`.
