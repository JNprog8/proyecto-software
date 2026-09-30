# Directivas de Arquitectura Frontend y JavaScript Vanilla (SDD)

Este documento condensa los **Aspectos de Arquitectura JavaScript, Comunicación HTTP y Gestión del DOM** para el desarrollo Frontend en el sistema ABMC.

---

## 1. Filosofía y Principios de Arquitectura en Cliente

1. **El DOM no es la Base de Datos:**
   - La interfaz de usuario refleja el estado; no debe utilizarse el árbol DOM como almacén de datos o lógica de negocio.
   - Separar conceptualmente la capa de presentación (event listeners, renderizado) de la lógica de dominio (validación de reglas) y de infraestructura (cliente API).

2. **Vanilla JS Modular (ES6+):**
   - Utilizar sintaxis moderna (`const`/`let`, arrow functions, `async`/`await`, template literals).
   - Evitar variables en el ámbito global (`window`). Modularizar mediante funciones puras o ES Modules cuando la escala lo requiera.

3. **Regla Anti-Sobreingeniería (Vanilla First):**
   - Si una funcionalidad puede resolverse con APIs nativas del navegador (HTML Constraint Validation, `<dialog>`, `fetch`, `AbortController`), **está prohibido** instalar librerías externas o frameworks pesados.

---

## 2. Desacoplamiento entre CSS, HTML y JavaScript

1. **Atributos `data-*` para Comportamiento:**
   - Para seleccionar elementos o capturar eventos desde JavaScript, utilizar exclusivamente atributos de datos semánticos (ej: `data-action="delete"`, `data-user-id="4"`, `data-target="modal-user"`).
   - **Prohibido:** utilizar clases CSS de estilo visual (ej: `.btn-primary`, `.text-danger`) como selectores en `querySelector()` para lógica de negocio.

2. **Separación de Responsabilidades en Estilos:**
   - JavaScript no debe inyectar estilos inline (`element.style.color = ...`) salvo para cálculos dinámicos de posición. Para cambios de estado visual, alternar clases CSS predefinidas o atributos `aria-*` / `hidden`.

---

## 3. Comunicación con la API y Asincronía

1. **Cliente HTTP Centralizado con `fetch`:**
   - Todas las llamadas a los endpoints REST de PHP deben realizarse a través de un módulo o helper centralizado.
   - Verificar siempre la propiedad `response.ok` antes de procesar el JSON:
     ```javascript
     const response = await fetch(url, options);
     const result = await response.json();
     if (!response.ok) {
       throw new Error(result.message || 'Error en la petición');
     }
     return result;
     ```

2. **Cancelación de Peticiones y Control de Carreras (`AbortController`):**
   - En filtros en vivo, búsquedas instantáneas o cambios rápidos de pestañas, utilizar `AbortController` para abortar peticiones previas pendientes y evitar condiciones de carrera (*race conditions*).

3. **Optimización con Debounce:**
   - Aplicar `debounce` (retraso mínimo recomendado: 250ms–300ms) a las entradas de texto en tiempo real para evitar saturar el backend con peticiones HTTP redundantes por cada pulsación de tecla.

4. **Delegación de Eventos (`Event Delegation`):**
   - Para tablas dinámicas o listados con múltiples filas, asignar un único *event listener* en el elemento contenedor padre (`<tbody>` o `<table>`) e interceptar la acción mediante `event.target.closest('[data-action]')`.

---

## 4. Seguridad en el Frontend (Aspectos Transversales)

1. **El Frontend no es Autoridad de Seguridad:**
   - Las validaciones en cliente mejoran la experiencia de usuario (UX inmediata), pero **nunca** garantizan integridad ni seguridad. La autoridad definitiva reside exclusivamente en el Backend PHP.

2. **Prevención Estricta de Cross-Site Scripting (XSS):**
   - Preferir siempre `.textContent` o la creación nativa de nodos (`document.createElement()`) para renderizar cadenas provenientes del usuario o de la base de datos.
   - Evitar `.innerHTML` con interpolación de variables no sanitizadas.

3. **Gestión de Almacenamiento:**
   - No almacenar contraseñas, secretos de infraestructura ni datos sensibles en `localStorage` o `sessionStorage`.

---

## 5. Gestión de Estados de la Interfaz (UI States)

Toda interacción asíncrona debe reflejar de forma determinista uno de los siguientes estados:

1. **Estado de Carga (*Loading State*):**
   - Deshabilitar el botón que originó la acción y mostrar un indicador visual (*spinner* o texto "Guardando...") para prevenir peticiones concurrentes.
2. **Estado Vacío (*Empty State*):**
   - Si una tabla o búsqueda no retorna registros, mostrar un mensaje claro con orientación al usuario (ej: *"No se encontraron participantes que coincidan con la búsqueda"*).
3. **Estado de Error (*Error State*):**
   - Presentar mensajes de error claros al usuario, indicando qué campo falló sin exponer detalles internos del servidor.
4. **Estado Exitoso (*Success State*):**
   - Notificar al usuario mediante un Toast flotante temporal y refrescar la tabla de forma reactiva sin recargar la página completa.
