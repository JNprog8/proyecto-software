# Checklists de Aceptación y Quality Gate (Harness Tools)

Este documento contiene los **Checklists Operativos del Arnés** extraídos de los estándares de ingeniería de Backend y Frontend del proyecto.
El agente o desarrollador debe auditar estos puntos antes de marcar cualquier tarea o refactorización como completada.

---

## 1. Quality Gate Automatizado (Obligatorio)

Antes de considerar una tarea finalizada, debe cumplirse la siguiente secuencia de verificación:

```text
[ ] 1. Base de datos reseteada a estado limpio:
       bash harness/harness_tools/reset_db.sh
[ ] 2. Suite de pruebas de API pasando al 100% (código de salida 0):
       bash harness/harness_tools/test_api.sh
[ ] 3. Sin errores de sintaxis PHP en los archivos modificados:
       php -l <archivo.php>
[ ] 4. Sin sentencias de debugging residuales (var_dump, print_r, console.log).
[ ] 5. Sin credenciales ni secretos hardcodeados en el código.
```

---

## 2. Checklist de Arquitectura Backend

Verificar que la solución respete los límites arquitectónicos del sistema:

- [ ] **Front Controller:** `src/index.php` actúa únicamente como despachador de rutas; sin lógica de negocio ni SQL.
- [ ] **Controladores Delgados:** No ejecutan consultas SQL ni acceden a PDO directamente.
- [ ] **Patrón Repository:** Toda persistencia y consulta a MariaDB está encapsulada en `src/repositories/`.
- [ ] **Modelos de Dominio:** Clases POPO en `src/models/` representando fielmente el estado y las invariantes.
- [ ] **Frontend Desacoplado:** La interfaz consume la API mediante JSON (`fetch`), sin PHP incrustado para renderizar tablas dinámicas.
- [ ] **KISS:** Sin sobreingeniería ni patrones complejos no justificados.

---

## 3. Checklist de Seguridad Backend

Verificar que la implementación no introduzca vulnerabilidades:

- [ ] **Consultas Preparadas:** 100% de las consultas SQL parametrizadas mediante PDO (`prepare` / `execute`). Cero interpolación de variables.
- [ ] **Validación de Entradas:** Validación rigurosa de formato, rangos y tipos en datos recibidos del cliente.
- [ ] **Escape de Salidas:** Salidas HTML renderizadas por servidor protegidas con `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')`.
- [ ] **Respuestas Seguras:** Errores de base de datos (`PDOException`) capturados sin exponer detalles internos, credenciales o stack traces al cliente.
- [ ] **Integridad Referencial:** Restricciones de clave foránea respetadas (`ON DELETE RESTRICT`).

---

## 4. Checklist de Calidad de Código Backend (PHP 8.2)

- [ ] `declare(strict_types=1);` declarado al inicio de cada archivo PHP.
- [ ] Tipado explícito en parámetros y retornos de métodos.
- [ ] Nombres de métodos y variables semánticos y en formato `camelCase`.
- [ ] Clases con alta cohesión y responsabilidad única (SRP).
- [ ] Métodos pequeños y enfocados.
- [ ] Especificaciones de dominio en `harness/specs/` actualizadas si se modificaron tablas o contratos.

---

## 5. Checklist de Calidad Frontend (HTML5, CSS3 y JS Vanilla)

- [ ] **HTML5 Semántico:** Uso de `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` en lugar de `<div>` anidados indiscriminadamente.
- [ ] **Botones vs Enlaces:** `<button>` para acciones interactivas y modales; `<a>` únicamente para URLs o navegación.
- [ ] **Formularios Semánticos:** Etiquetas `<label>` vinculadas por `for`/`id` a sus inputs correspondientes; atributos nativos de validación (`required`, `type`, `minlength`).
- [ ] **CSS con Design Tokens:** Colores, tipografía y radios centralizados en variables CSS (`:root`).
- [ ] **Sin Selectores Peligrosos:** Prohibido el uso de `!important` y selectores de ID (`#`) para estilos visuales.
- [ ] **Desacoplamiento de Eventos:** Eventos y selectores JavaScript mediados exclusivamente por atributos `data-*` (`data-action`, `data-target`), nunca por clases CSS de diseño.
- [ ] **JavaScript Modular:** Sin variables globales (`window`); uso de `const`/`let` y funciones puras.

---

## 6. Checklist de Accesibilidad (a11y) y Experiencia de Usuario

- [ ] **Navegación por Teclado:** Toda la interfaz y formularios son completamente operables con `Tab`, `Enter` y `Space`.
- [ ] **Foco Visible:** `:focus-visible` claramente visible y diferenciado en todos los controles interactivos.
- [ ] **Contraste de Color:** Ratios de contraste cumpliendo estándar WCAG AA (mínimo 4.5:1 para texto normal).
- [ ] **Modales Accesibles:** Empleo del elemento nativo `<dialog>` con cierre accesible mediante tecla `Escape` y backdrop.
- [ ] **Reduced Motion:** Animaciones respetan la directiva `@media (prefers-reduced-motion: reduce)`.

---

## 7. Checklist de Seguridad y Performance Frontend

- [ ] **XSS Controlado:** Inserción de datos mediante `.textContent` o creación nativa de nodos; evitar `.innerHTML` con variables no sanitizadas.
- [ ] **Almacenamiento Seguro:** No almacenar secretos, contraseñas ni tokens en `localStorage` o `sessionStorage`.
- [ ] **Peticiones Robustas:** Comprobación estricta de `response.ok` antes de parsear JSON en `fetch`.
- [ ] **Control de Concurrencia:** Empleo de `AbortController` o debouncing para evitar peticiones duplicadas o desordenadas en búsquedas.
- [ ] **Estados de Interfaz Deterministas:** Loading state con botón deshabilitado durante peticiones; feedback inmediato de éxito (Toast) o error descriptivo.
