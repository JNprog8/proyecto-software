# Arquitectura JavaScript y Modelo de Eventos W3C

## 1. Fundamentos y Arquitectura ES Modules

La lógica del portal corporativo de **Next Corp** se implementa íntegramente en **JavaScript Vanilla nativo**, organizado mediante **ES Modules** (`type="module"`), sin frameworks, compiladores ni dependencias de runtime.

### Principios de Implementación:

1. **Punto de Entrada Único:** [`src/js/main.js`](../src/js/main.js) orquesta e inicializa todos los módulos una vez disparado el evento `DOMContentLoaded`.
2. **Modularidad Estricta:** Cada módulo en `src/js/modules/` encapsula una responsabilidad única (carrusel, navegación, portafolio, validación de formularios, transiciones).
3. **Funciones Puras:** En `src/js/utils/validators.js` residen algoritmos puros sin efectos colaterales en el DOM, permitiendo validaciones determinísticas.
4. **Utilidades DOM y Delegación:** En `src/js/utils/dom.js` se provee la función `delegate()` para suscripción eficiente de eventos.

---

## 2. El Ecosistema del Navegador: BOM vs. DOM

En el entorno del navegador existen dos jerarquías principales de objetos:

### 2.1. Browser Object Model (BOM)

Expone las APIs y capacidades del entorno de ejecución (la ventana del navegador):

- `window`: Objeto raíz global en el cliente.
- `window.location`: Representa la URL actual y permite extraer parámetros (`URLSearchParams`) para auto-seleccionar servicios.
- `window.history`: Historial de navegación de la sesión.
- `window.navigator`: Información sobre el navegador y preferencias del usuario (geolocalización, conexión, etc.).
- `window.matchMedia`: Consulta de media queries en JavaScript (ej. `window.matchMedia('(prefers-reduced-motion: reduce)')`).

### 2.2. Document Object Model (DOM)

Representación en árbol de nodos en memoria del documento HTML:

- Cada elemento, atributo y fragmento de texto es un objeto `Node` navegable y manipulable.
- Métodos canónicos de consulta: `document.querySelector()` y `document.querySelectorAll()`.
- Modificación de clases mediante la API `classList`:
  - `element.classList.add('is-active')`
  - `element.classList.remove('is-hidden')`
  - `element.classList.toggle('is-open', condition)`

---

## 3. El Modelo de Eventos W3C (Event Flow)

El estándar del W3C define el ciclo de propagación de eventos en tres fases consecutivas:

```text
               1. FASE DE CAPTURA (Capturing Phase)
          ┌──────────────────────────────────────────────┐
          │  window ──► document ──► html ──► body ...   │
          └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
                    2. FASE DE DESTINO (Target Phase)
          ┌──────────────────────────────────────────────┐
          │           Elemento Objetivo (e.target)        │
          └──────────────────────┬───────────────────────┘
                                 │
                                 ▼
               3. FASE DE BURBUJEO (Bubbling Phase)
          ┌──────────────────────────────────────────────┐
          │   ... body ◄── html ◄── document ◄── window  │
          └──────────────────────────────────────────────┘
```

1. **Fase de Captura:** El evento desciende desde el objeto raíz (`window`) hasta el ancestro directo del elemento interactuado.
2. **Fase de Destino:** El evento alcanza el elemento específico donde ocurrió la interacción (`event.target`).
3. **Fase de Burbujeo:** El evento asciende hacia arriba en el árbol DOM hasta alcanzar nuevamente el objeto `window`. Por defecto, los listeners registrados con `addEventListener` escuchan en esta fase.

---

## 4. Registro y Gestión de Eventos (`addEventListener`)

La suscripción a eventos se realiza exclusivamente mediante la API estándar del W3C:

```javascript
target.addEventListener(tipo, listener, opciones);
```

### Opciones del Tercer Parámetro:

- `capture` (`boolean`): Si es `true`, ejecuta el manejador en la fase de captura. Si es `false` (por defecto), escucha en fase de burbujeo.
- `once` (`boolean`): Si es `true`, el listener se ejecuta una sola vez y se desuscribe automáticamente.
- `passive` (`boolean`): Si es `true`, indica que el manejador nunca llamará a `preventDefault()`. **Fundamental para eventos de alta frecuencia como `scroll` y `touchstart` para garantizar 60 FPS y optimizar el Core Web Vital INP**.

```javascript
// Ejemplo de listener pasivo para sticky header
window.addEventListener("scroll", handleScroll, { passive: true });
```

---

## 5. Control de la Propagación y Acciones por Defecto

### 5.1. `event.preventDefault()`

Cancela la acción nativa asociada al evento si este es cancelable (`event.cancelable === true`).

- **En Formularios:** Impide la recarga síncrona de la página al enviar un formulario para procesar la validación y el envío asíncrono con JavaScript:
  ```javascript
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Validación y envío asíncrono simulado
  });
  ```
- **En Enlaces:** Intercepta la navegación estándar para ejecutar transiciones suaves entre páginas.

### 5.2. `event.stopPropagation()`

Detiene la propagación del evento a lo largo de las fases de captura o burbujeo, evitando que ancestros en el DOM reciban la notificación.

- Se utiliza en componentes modales o menús desplegables para contener los clics dentro del contenedor y evitar que se cierre al hacer clic en su contenido interno.

---

## 6. Patrón de Delegación de Eventos (Event Delegation)

En lugar de registrar múltiples listeners en elementos individuales dentro de una lista o grilla (lo cual consume memoria y degrada el rendimiento), se registra **un único listener en el contenedor padre común**, aprovechando la fase de burbujeo:

### Implementación en Next Corp (`src/js/utils/dom.js`):

```javascript
export function delegate(
  container,
  eventType,
  selector,
  handler,
  options = false,
) {
  if (!container || typeof handler !== "function") return () => {};

  const listener = (event) => {
    const target = event.target ? event.target.closest(selector) : null;
    if (target && container.contains(target)) {
      handler.call(target, event, target);
    }
  };

  container.addEventListener(eventType, listener, options);
  return () => container.removeEventListener(eventType, listener, options);
}
```

### Aplicación en el Portafolio (`src/js/modules/portfolio.js`):

```javascript
// Un solo listener gestiona todos los botones de filtro actuales y futuros
delegate(filterContainer, "click", "[data-portfolio-filter]", (event, btn) => {
  const category = btn.getAttribute("data-portfolio-filter");
  filtrarProyectos(category);
});
```

---

## 7. Temporizadores y Ciclo de Vida Asíncrono

### 7.1. Temporizadores Nativos

- `setTimeout(fn, delay)`: Ejecuta una función tras un retraso en milisegundos.
- `clearTimeout(id)`: Cancela una ejecución pendiente.
- `requestAnimationFrame(callback)`: Sincroniza animaciones con la tasa de refresco del monitor (60/120 Hz). Usado en `carousel.js` para animar la barra de carga continua de 7.5s.

### 7.2. Fases de Carga del Documento

- `DOMContentLoaded`: Se dispara cuando el HTML inicial ha sido completamente analizado y el árbol DOM está listo, sin esperar por imágenes o estilos pesados. Es el momento canónico para ejecutar `main.js`.
- `load`: Se dispara cuando todo el documento y sus recursos asociados (imágenes, iframes) han terminado de cargar.
- `pageshow`: Se dispara tras la carga o al navegar mediante el caché hacia adelante/atrás del navegador (BFCache).
