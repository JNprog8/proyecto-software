# Contratos de API REST (SDD)

Todas las rutas de la API devuelven respuestas con formato JSON y cabecera `Content-Type: application/json; charset=utf-8`.

---

## 1. Formato Universal de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... },
  "total": 1,          // Presente en colecciones / listados
  "message": "..."     // Opcional en operaciones mutables (POST, PUT, DELETE)
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Descripción legible del error",
  "errors": {          // Opcional: Desglose por campo en validaciones fallidas
    "email": "El correo electrónico ya existe..."
  }
}
```

---

## 2. Endpoints: Roles

### `GET /api/roles`
Obtiene la lista de todos los roles disponibles en el sistema.
- **Respuesta 200 OK**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nombre": "Administrador",
        "descripcion": "Acceso total al sistema...",
        "created_at": "2026-09-18 04:39:05"
      }
    ]
  }
  ```

---

## 3. Endpoints: Usuarios (ABMC)

### `GET /api/users`
Lista los usuarios registrados, con soporte para búsqueda textual y filtrado por rol.

* **Parámetros de Consulta (Query Params)**:
  * `page` (opcional, `int`, default: 1): Número de página para paginación en base de datos.
  * `limit` (opcional, `int`, default: 10, max: 100): Cantidad de registros por página.
  * `search` / `q` (opcional, `string`): Término de búsqueda filtrando en nombre, apellido, username o email.
  * `rol_id` / `role` (opcional, `int`): ID del rol a filtrar.
* **Respuesta 200 OK**:
  ```json
  {
    "success": true,
    "total": 14,
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 14,
      "total_pages": 2
    },
    "data": [
      {
        "id": 1,
        "nombre": "Joaquín",
        "apellido": "González",
        "nombre_completo": "Joaquín González",
        "username": "joaquin",
        "email": "jgonzalez@unrn.edu.ar",
        "rol_id": 1,
        "rol_nombre": "Organizador",
        "created_at": "2026-09-18 04:39:05",
        "updated_at": "2026-09-18 04:39:05",
        "deleted_at": null
      }
    ]
  }
  ```

---

### `GET /api/users/{id}`
Obtiene el detalle de un usuario específico por su ID.
* **Respuesta 200 OK**: Objeto de usuario en clave `data`.
* **Respuesta 404 Not Found**: Si el usuario no existe.

---

### `POST /api/users`
Crea una nueva cuenta de usuario (Alta).

* **Cuerpo de Solicitud (JSON)**:
  ```json
  {
    "nombre": "Lucía",
    "apellido": "Martínez",
    "username": "lmartinez",
    "email": "lmartinez@unrn.edu.ar",
    "rol_id": 2
  }
  ```
* **Respuestas**:
  * `201 Created`: Usuario creado exitosamente con sus datos persistidos.
  * `400 Bad Request`: Payload vacío o formato JSON inválido.
  * `403 Forbidden`: Acceso denegado si la sesión no posee rol de Organizador.
  * `422 Unprocessable Entity`: Error de validación de campos requeridos o duplicados.

---

### `PUT /api/users/{id}`
Modifica los datos de un usuario existente de forma idempotente.

* **Cuerpo de Solicitud (JSON)**: Mismos campos que en el alta.
* **Respuestas**:
  * `200 OK`: Usuario modificado correctamente.
  * `400 Bad Request`: JSON malformado.
  * `403 Forbidden`: Acceso denegado si la sesión no posee rol de Organizador.
  * `404 Not Found`: Si el ID especificado no existe o fue dado de baja.
  * `422 Unprocessable Entity`: Error de validación (ej. email ya usado por otro usuario).

---

### `DELETE /api/users/{id}`
Ejecuta la baja lógica (*Soft Delete*) de un usuario asignando la marca temporal en `deleted_at`.

* **Respuestas**:
  * `200 OK`: Usuario dado de baja correctamente (`{"success": true, "message": "El usuario 'username' fue dado de baja correctamente."}`).
  * `400 Bad Request`: Intento de eliminar la cuenta raíz de Organizador (ID 1).
  * `403 Forbidden`: Acceso denegado si la sesión no posee rol de Organizador.
  * `404 Not Found`: Si el usuario no existe o ya fue eliminado.
