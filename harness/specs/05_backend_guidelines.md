# Directivas de Backend y Buenas Prácticas PHP 8.2 (SDD)

Este documento condensa los **Aspectos Arquitectónicos, Estándares de Tipado y Preocupaciones Transversales (Cross-Cutting Concerns)** para el desarrollo profesional en PHP 8.2 Vanilla dentro de este repositorio.

---

## 1. Lenguaje y Tipado Moderno (PHP 8.2)

1. **Tipado Estricto Obligatorio:**
   - Todo archivo PHP ejecutable debe iniciar con:
     ```php
     <?php
     declare(strict_types=1);
     ```
   - Evita conversiones implícitas de tipo y previene bugs sutiles en tiempo de ejecución.

2. **Tipado Fuerte y Exhaustivo:**
   - Declarar siempre tipos en parámetros, retornos de funciones/métodos y propiedades de clase.
   - Evitar el tipo `mixed` salvo extrema necesidad de interoperabilidad con librerías nativas.
   - Usar *Constructor Property Promotion* y propiedades `readonly` para atributos inmutables (ej. identificadores primarios).

3. **Objetos de Dominio vs Arrays Mágicos:**
   - Las entidades deben modelarse mediante clases concretas (POPO) en `src/models/`, nunca pasando arrays asociativos sin tipar entre capas.
   - Utilizar Value Objects cuando un dato posea reglas invariantes (ej. formato de email o regex de username).

---

## 2. Arquitectura de Capas y Responsabilidades

El sistema adopta una arquitectura desacoplada y pragmática (KISS) sin frameworks:

```text
HTTP Request (Front Controller / Router)
       ↓
Controladores Delgados (src/controllers/)
       ↓
Modelos de Dominio (src/models/)
       ↓
Repositorios de Persistencia (src/repositories/)
       ↓
Base de Datos MariaDB (PDO Prepared Statements)
```

1. **Front Controller (`src/index.php`):**
   - Responsabilidad única: capturar la solicitud HTTP, resolver la ruta, instanciar dependencias y delegar al controlador.
   - **Prohibido:** colocar lógica de negocio o consultas SQL en `index.php`.

2. **Controladores Delgados (`src/controllers/`):**
   - Responsabilidad: validar sintaxis del payload de entrada, invocar al repositorio/modelo y formatear la respuesta HTTP.
   - **Prohibido:** instanciar directamente conexiones a base de datos o escribir sentencias SQL en controladores.

3. **Patrón Repository (`src/repositories/`):**
   - Responsabilidad única: abstraer la persistencia y lectura de datos.
   - Toda interacción con la base de datos se realiza a través de métodos explícitos (`findAll()`, `findById()`, `save()`, `delete()`).

---

## 3. Aspectos de Seguridad (Preocupaciones Transversales)

1. **Protección Contra Inyección SQL (Inviolable):**
   - Todas las consultas deben usar sentencias preparadas de PDO (`$pdo->prepare(...)` con parámetros nombrados `:campo` o posicionales `?`).
   - **Prohibido:** concatenar o interpolar variables directamente en cadenas SQL.

2. **Validación vs. Sanitización / Escape:**
   - **En la Entrada (Validación):** Comprobar que los datos cumplan formato, rango y longitud (`filter_var`, `preg_match`). Tratar `$_POST`, `$_GET` y `php://input` como datos no confiables.
   - **En la Salida (Escape):** Al renderizar variables en HTML, escapar siempre usando `htmlspecialchars($str, ENT_QUOTES, 'UTF-8')`.

3. **No Filtrar Información Sensible:**
   - Nunca retornar stack traces, contraseñas de conexión o nombres internos de columnas de BD en respuestas de error al cliente.
   - Registrar errores detallados en el log del servidor y responder al cliente con un mensaje genérico y código HTTP semántico.

---

## 4. Manejo de Errores y Respuestas HTTP / JSON

1. **Respuestas JSON Consistentes:**
   - Todos los endpoints de la API deben retornar encabezado `Content-Type: application/json; charset=UTF-8` y seguir el contrato estandarizado:
     ```json
     {
       "success": true,
       "message": "Operación exitosa",
       "data": {}
     }
     ```
     O en caso de falla:
     ```json
     {
       "success": false,
       "message": "Descripción clara del error",
       "errors": []
     }
     ```

2. **Semántica de Códigos HTTP:**
   - `200 OK`: Consulta o actualización exitosa.
   - `201 Created`: Creación exitosa de un recurso.
   - `400 Bad Request`: Error de validación o parámetros inválidos.
   - `404 Not Found`: Recurso no encontrado.
   - `409 Conflict`: Violación de restricción única (ej. email o username duplicado).
   - `500 Internal Server Error`: Fallo no controlado del servidor.

3. **Uso de Excepciones:**
   - Prohibido el uso de `die()` o `exit()` arbitrario dentro de clases de servicio o repositorios. Lanzar excepciones tipadas (`InvalidArgumentException`, `RuntimeException`, `PDOException`) y capturarlas en el controlador para emitir la respuesta HTTP correspondiente.

---

## 5. Principios de Mantenibilidad y Calidad

- **KISS (Keep It Simple, Stupid):** No incorporar patrones complejos innecesarios (Service Locators complejos, reflexiones pesadas) que comprometan la legibilidad.
- **DRY (Don't Repeat Yourself):** Reutilizar lógica común de validación y acceso a datos.
- **Tell, Don't Ask:** Preferir métodos que encapsulen comportamiento en el objeto en lugar de extraer datos y operar sobre ellos externamente.
- **Inmutabilidad cuando sea viable:** Evitar setters indiscriminados si los atributos no requieren mutar a lo largo del ciclo de vida del objeto.
