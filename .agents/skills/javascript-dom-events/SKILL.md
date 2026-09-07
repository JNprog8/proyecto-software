---
name: javascript-dom-events
description: >-
  Guía de referencia y procedimientos para manipular el DOM y gestionar el modelo de eventos en JavaScript (BOM/DOM, Event Flow, addEventListener, Event Delegation, preventDefault, stopPropagation, formularios y temporizadores) basado en la cátedra Proyecto de Software y adaptado a Vanilla ES Modules.
---

# Skill: JavaScript DOM y Modelo de Eventos (Next Corp)

Este skill proporciona al agente las directrices operativas, patrones de diseño y procedimientos paso a paso para interactuar con el **Document Object Model (DOM)** y el **Browser Object Model (BOM)**, y para orquestar el **Modelo de Eventos** de JavaScript en cumplimiento con los estándares académicos de la Universidad Nacional de Río Negro y la arquitectura modular de Next Corp (Vanilla ES Modules).

---

## 1. Cuándo Activar este Skill

Activar este skill cuando el usuario o la tarea requiera:

- Conectar componentes interactivos mediante eventos del DOM (`click`, `submit`, `input`, `blur`, `keydown`, `keyup`, `scroll`, `resize`).
- Implementar o refactorizar el patrón de **Delegación de Eventos** (_Event Delegation_) aprovechando la fase de burbujeo (_Bubbling_).
- Gestionar formularios accesibles: validación interactiva, prevención del envío por defecto (`e.preventDefault()`), recolección de datos y vaciado seguro.
- Manipular el árbol DOM de forma segura sin frameworks (selectores semánticos, `classList`, atributos ARIA, prevención de XSS con `textContent`).
- Coordinar temporizadores asíncronos (`setTimeout`, `setInterval`, `requestAnimationFrame`) y evitar fugas de memoria (_memory leaks_).
- Auditar la conformidad del modelo de eventos respecto a las especificaciones W3C y las notas de cátedra de Proyecto de Software.

---

## 2. Flujo de Procedimientos Paso a Paso

### Paso 1: Localización e Inspección de Elementos del DOM

1. Emplear selectores semánticos desacoplados de clases CSS visuales mediante atributos `data-*`:
   ```javascript
   const botonAccion = document.querySelector('[data-action="toggle-menu"]');
   const formulario = document.querySelector("[data-contact-form]");
   ```
2. Para colecciones de elementos repetitivos, obtener el contenedor padre para delegación:
   ```javascript
   const gridProyectos = document.querySelector("[data-portfolio-grid]");
   ```
3. Comprobar siempre la existencia del elemento antes de suscribir eventos:
   ```javascript
   if (!botonAccion) return;
   ```

---

### Paso 2: Suscripción de Eventos con `addEventListener` (DOM Level 2)

1. **Nunca** utilizar manejadores inline en HTML (`onclick="..."`) ni en código nuevo de producción.
2. Utilizar el estándar `addEventListener(tipo, callback, opciones)`:
   - `tipo`: Nombre en minúsculas sin el prefijo `on` (ej. `'click'`, `'submit'`, `'keydown'`).
   - Por defecto la fase es **Burbujeo** (`capture: false` o tercer argumento omitido/false).
   - Para eventos de scroll o touch, agregar `{ passive: true }` para optimizar INP.
3. Si el listener necesita removerse posteriormente, pasar una función con nombre:
   ```javascript
   function handleKeydown(event) {
     if (event.key === "Escape") cerrarMenu();
   }
   window.addEventListener("keydown", handleKeydown);
   // Para limpiar:
   window.removeEventListener("keydown", handleKeydown);
   ```

---

### Paso 3: Implementación de Delegación de Eventos (Event Delegation)

Aprovecha el **Flujo de Eventos W3C (Fase de Burbujeo)** para registrar un único listener en el ancestro:

```javascript
/**
 * Procedimiento de Delegación de Eventos
 * @param {HTMLElement} contenedor - Elemento padre contenedor
 * @param {string} selectorHijo - Selector del elemento interactivo hijo (ej: '[data-item]')
 * @param {Function} handler - Callback que recibe (evento, elementoObjetivo)
 */
export function delegarEvento(contenedor, tipoEvento, selectorHijo, handler) {
  if (!contenedor) return;

  contenedor.addEventListener(tipoEvento, (event) => {
    // Busca el ancestro más cercano que coincida con el selector
    const item = event.target.closest(selectorHijo);
    // Verificar que pertenezca al contenedor
    if (item && contenedor.contains(item)) {
      handler(event, item);
    }
  });
}
```

---

### Paso 4: Control de Flujo y Cancelación

1. **Cancelar acción predeterminada del navegador (`preventDefault`):**
   - En envíos de formulario (`submit`): evita recarga de página.
   - En enlaces (`click` en `<a>`): evita saltos de ancla bruscos o recargas cuando se maneja navegación SPA/modal.
   ```javascript
   form.addEventListener("submit", (e) => {
     e.preventDefault();
     // Lógica de validación y consumo asíncrono
   });
   ```
2. **Detener la propagación en el árbol (`stopPropagation`):**
   - Evita que el evento suba hacia contenedores superiores que también tengan listeners:
   ```javascript
   modalContenido.addEventListener("click", (e) => {
     e.stopPropagation(); // Evita que el clic cierre el backdrop del modal
   });
   ```

---

### Paso 5: Validación y Ciclo de Vida de Formularios

1. **Eventos a escuchar:**
   - `blur`: Validar campo cuando el usuario sale de él (feedback oportuno sin molestar mientras escribe).
   - `input`: Re-validar en tiempo real si el campo ya fue marcado con error (`is-invalid`).
   - `submit`: Validación completa de todos los campos. Si hay error, detener con `e.preventDefault()` y hacer foco en el primer campo inválido (`primerInvalido.focus()`).
   - `reset`: Restaurar estados de error y atributos `aria-invalid`.
2. **Sincronización accesible obligatoria:**
   ```javascript
   campo.classList.toggle("is-invalid", !esValido);
   campo.setAttribute("aria-invalid", String(!esValido));
   ```

---

### Paso 6: Temporizadores y Prevención de Fugas de Memoria

1. **Regla de oro:** Todo `setInterval` o `setTimeout` debe guardar su identificador numérico y cancelarse con `clearInterval` / `clearTimeout`.
2. En componentes de vista o carruseles:

   ```javascript
   let autoplayId = null;

   export function startAutoplay(intervaloMs = 7500) {
     stopAutoplay();
     autoplayId = window.setInterval(siguienteSlide, intervaloMs);
   }

   export function stopAutoplay() {
     if (autoplayId) {
       window.clearInterval(autoplayId);
       autoplayId = null;
     }
   }
   ```

3. Pausar en interacción de usuario (`mouseenter`, `focusin`) y reanudar en salida (`mouseleave`, `focusout`).

---

## 3. Matriz de Propiedades Clave del Objeto `event`

| Propiedad             | Tipo      | Utilidad en el Proyecto                                                     |
| :-------------------- | :-------- | :-------------------------------------------------------------------------- |
| `event.target`        | `Element` | Nodo más interno donde ocurrió la interacción física. Clave en delegación.  |
| `event.currentTarget` | `Element` | Nodo donde está registrado el listener activo (padre receptor).             |
| `event.type`          | `string`  | Nombre del evento (`click`, `submit`, `keydown`).                           |
| `event.key`           | `string`  | Nombre legible de tecla presionada (`'Escape'`, `'Enter'`, `'ArrowRight'`). |
| `event.clientX / Y`   | `number`  | Coordenadas en píxeles relativas al viewport visible.                       |
| `event.pageX / Y`     | `number`  | Coordenadas en píxeles relativas al documento completo (con scroll).        |
| `event.button`        | `number`  | Botón del ratón: `0` (izquierdo), `1` (central), `2` (derecho).             |

---

## 4. Referencias y Documentos Canónicos

- Documento de arquitectura y eventos: [`docs/javascript.md`](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/Proyectos/Pagina%20Web/ZZ/docs/javascript.md)
- Manual de estándares y accesibilidad: [`docs/standards.md`](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/Proyectos/Pagina%20Web/ZZ/docs/standards.md)
- Contratos de interfaz DOM/CSS/JS: [`specs/sprint.md`](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/Proyectos/Pagina%20Web/ZZ/specs/sprint.md)
