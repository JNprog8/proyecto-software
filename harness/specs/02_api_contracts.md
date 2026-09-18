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
  * `search` (opcional, `string`): Término de búsqueda filtrando en nombre, apellido, username o email.
  * `rol_id` (opcional, `int`): ID del rol a filtrar.
* **Respuesta 200 OK**:
  ```json
  {
    "success": true,
    "total": 3,
    "data": [
      {
        "id": 1,
        "nombre": "Joaquín",
        "apellido": "González",
        "nombre_completo": "Joaquín González",
        "username": "joaquin",
        "email": "jgonzalez@unrn.edu.ar",
        "rol_id": 1,
        "rol_nombre": "Administrador",
        "created_at": "2026-09-18 04:39:05",
        "updated_at": "2026-09-18 04:39:05"
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
  * `422 Unprocessable Entity`: Error de validación de campos requeridos o duplicados.

---

### `PUT /api/users/{id}`
Modifica los datos de un usuario existente.

* **Cuerpo de Solicitud (JSON)**: Mismos campos que en el alta.
* **Respuestas**:
  * `200 OK`: Usuario modificado correctamente.
  * `404 Not Found`: Si el ID especificado no existe.
  * `422 Unprocessable Entity`: Error de validación (ej. email ya usado por otro usuario).

---

### `DELETE /api/users/{id}`
Elimina el registro de un usuario (Baja).

* **Respuestas**:
  * `200 OK`: `{"success": true, "message": "El usuario 'username' fue eliminado exitosamente."}`
  * `404 Not Found`: Si el ID no existe en la base de datos.
