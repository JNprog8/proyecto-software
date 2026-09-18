# Instrucciones Operativas para el Agente (Harness Directives)

Este archivo define las reglas estrictas de ingeniería que **Gemini 3.8 Flash** debe respetar en cada interacción sobre este repositorio.

---

## 1. Directivas de Stack y Código

1. **Vanilla PHP 8.2 Estricto**:
   - No instales ni uses frameworks (Laravel, Symfony, Slim, etc.).
   - No utilices Composer ni dependencias externas de Packagist salvo que el usuario lo solicite expresamente.
   - Sigue PSR-12 para formato de código.

2. **Patrón Repository**:
   - Todo acceso a base de datos debe pasar por la capa `src/repositories/`.
   - Ningún controlador ni vista debe ejecutar consultas SQL directas ni interactuar directamente con `PDO`.
   - Las consultas deben usar exclusivamente **Sentencias Preparadas** (`prepare` y `execute`) para prevenir inyecciones SQL.

3. **Gestión de Base de Datos (MariaDB)**:
   - El contenedor de MariaDB corre como `abmc_db_1`.
   - Host interno de red: `db`, puerto interno: `3306`, puerto host: `3307`.
   - Si creas nuevas tablas o campos, debes documentarlo en `harness/specs/01_domain_entities.md` y actualizar `sql/01_init.sql`.

4. **Frontend**:
   - Mantén JavaScript 100% Vanilla (sin jQuery, React, Vue, etc.).
   - Mantén CSS Vanilla con Custom Properties (sin Tailwind, Bootstrap, Sass).
   - Usa modales nativos con la API `<dialog>`.

---

## 2. Protocolo de Verificación Obligatorio

Antes de informar al usuario que una tarea está terminada, el agente DEBE:
1. Ejecutar el script de pruebas de la API:
   ```bash
   bash harness/harness_tools/test_api.sh
   ```
2. Si se modificó la estructura de la base de datos o se requiere un estado limpio para pruebas, ejecutar:
   ```bash
   bash harness/harness_tools/reset_db.sh
   ```
3. Si los tests pasan con código `0`, documentar el resultado de la validación.
