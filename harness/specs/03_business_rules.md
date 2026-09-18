# Reglas de Negocio y Criterios de Aceptación (SDD)

Este documento condensa los criterios de aceptación obligatorios definidos en [Proyecto Base.md](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/practicas/ABMC/Proyecto%20Base.md).

---

## 1. Reglas de Validación de Usuarios

### BR-01: Obligatoriedad de Campos
Todos los siguientes campos son de carga mandatoria:
- `nombre`: Cadena de 2 a 100 caracteres.
- `apellido`: Cadena de 2 a 100 caracteres.
- `username`: Cadena alfanumérica de 3 a 30 caracteres (`^[a-zA-Z0-9._-]+$`).
- `email`: Cadena que cumpla formato estándar de correo electrónico (`filter_var(..., FILTER_VALIDATE_EMAIL)`).
- `rol_id`: Entero que debe existir previamente en la tabla `roles`.

### BR-02: Unicidad de Correo Electrónico (Criterio Crítico)
- No pueden coexistir dos usuarios con el mismo correo electrónico.
- Si un intento de Alta o Edición provee un email repetido, el sistema debe responder HTTP 422 con el mensaje explícito:
  > *"El correo electrónico '{email}' ya existe. El usuario ya se encuentra registrado."*
- El frontend debe renderizar este mensaje directamente en el formulario junto al campo del correo y en el banner de alerta.

### BR-03: Unicidad de Nombre de Usuario (Nickname)
- No pueden coexistir dos cuentas con el mismo `username`.
- Si el `username` está tomado por otra cuenta, responder HTTP 422 con:
  > *"El nombre de usuario '{username}' ya está en uso por otra cuenta."*

### BR-04: Validación de Rol Existente
- No se puede asignar un `rol_id` que no exista en la base de datos.
- Un usuario sólo puede tener asignado un único rol a la vez.

---

## 2. Reglas de Persistencia y Ciclo de Vida

### BR-05: Integridad Referencial
- La clave foránea `usuarios.rol_id` apunta a `roles.id`.
- La regla en base de datos es `ON DELETE RESTRICT`: no se puede eliminar un rol si aún tiene usuarios asociados.

### BR-06: Baja de Usuarios
- La eliminación de un usuario libera su `email` y `username`, permitiendo que en el futuro puedan ser registrados nuevamente.
- La baja debe ser confirmada explícitamente por el operador en un modal de confirmación antes de disparar la petición `DELETE`.
