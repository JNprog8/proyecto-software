---
name: abmc-entity-generator
description: Guía paso a paso para crear, extender o generalizar entidades en el sistema ABMC siguiendo la arquitectura de PHP Vanilla, Patrón Repository, MariaDB y Frontend reactivo KISS. Activar cuando se solicite crear una nueva entidad, agregar tablas o implementar un nuevo módulo CRUD.
---

# Generador de Entidades ABMC (Workflow y Convenciones)

Esta skill define el procedimiento estricto para crear una nueva entidad dentro del proyecto asegurando consistencia arquitectónica y cero regresiones.

---

## Flujo de Trabajo en 6 Pasos

```
1. Base de Datos (SQL) ──> 2. Modelo (POPO) ──> 3. Repository (PDO)
         │
         └──> 4. Controller (REST) ──> 5. Router & View ──> 6. Harness Test
```

---

### Paso 1: Base de Datos y Migración (`sql/01_init.sql`)
1. Define la tabla con `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`.
2. Incluye `id INT AUTO_INCREMENT PRIMARY KEY`, `created_at TIMESTAMP` y `updated_at TIMESTAMP`.
3. Aplica restricciones de integridad (`UNIQUE` en identificadores únicos y `FOREIGN KEY ... ON DELETE RESTRICT`).
4. Documenta la nueva entidad en `harness/specs/01_domain_entities.md`.
5. Ejecuta la migración en el contenedor:
   ```bash
   podman exec -i abmc_db_1 mariadb -u app_user -papp_password app_db < sql/01_init.sql
   ```

---

### Paso 2: Modelo de Dominio (`src/models/{Entity}.php`)
1. Clase plana con propiedades privadas y tipadas.
2. Implementar `JsonSerializable` para que `json_encode($entity, JSON_UNESCAPED_UNICODE)` funcione de manera transparente.
3. Métodos accesores (`getId()`, `get...()`) sin lógica de persistencia.

---

### Paso 3: Patrón Repository (`src/repositories/{Entity}Repository.php`)
1. Inyecta la conexión PDO desde `Database::getConnection()`.
2. Métodos obligatorios:
   - `getAll(?string $search = null): array`
   - `getById(int $id): ?Entity`
   - `create(Entity $entity): int` (devuelve el ID autoincremental)
   - `update(Entity $entity): bool`
   - `delete(int $id): bool`
   - Métodos de unicidad (`findByField($val, ?int $excludeId = null)`).
3. **Regla de oro:** Todas las consultas SQL deben usar sentencias preparadas con parámetros nombrados (`:nombre`, `:id`).

---

### Paso 4: Controlador REST (`src/controllers/{Entity}Controller.php`)
1. Métodos: `index()`, `show($id)`, `store()`, `update($id)`, `destroy($id)`.
2. Validación exhaustiva de entradas:
   - Campos requeridos no vacíos.
   - Longitudes mínimas y máximas.
   - Unicidad contra el repositorio (devolviendo HTTP 422 con mensaje descriptivo si ya existe).
3. Utilizar el helper `private function sendJson(int $statusCode, array $data): void` con `JSON_UNESCAPED_UNICODE`.

---

### Paso 5: Enrutador y Frontend
1. **Router (`src/index.php`)**:
   - Registrar la ruta base `/api/{entities}` para `GET` y `POST`.
   - Registrar la ruta por ID `/api/{entities}/{id}` para `GET`, `PUT` y `DELETE`.
2. **Frontend (`src/views/main.php` o vista específica)**:
   - Utilizar modales `<dialog>` nativos.
   - Mantener el diseño KISS con CSS variables de `styles.css`.
   - Manejar errores con feedback visual en pantalla (inputs en rojo, alerta descriptiva).
   - Modal de confirmación para bajas.

---

### Paso 6: Verificación en el Harness (`harness/harness_tools/test_api.sh`)
1. Agregar pruebas automatizadas con `curl` para la nueva entidad en el script de test suite.
2. Ejecutar y certificar salida con código `0`:
   ```bash
   bash harness/harness_tools/test_api.sh
   ```
