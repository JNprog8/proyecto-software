# Estándares de Ingeniería, Accesibilidad (WCAG) y Rendimiento

## 1. Misión del Desarrollador Frontend

El rol de **Desarrollador Frontend de páginas web** en **Next Corp** tiene como misión diseñar, implementar y mantener interfaces web de estándar internacional que cumplan con los más altos estándares de:
- **Calidad de Código y Modularidad:** HTML5 semántico, CSS3 estructurado y JavaScript Vanilla desacoplado.
- **Portabilidad Absoluta:** Ejecutable en cualquier navegador moderno sin requerir entornos de compilación ni Node.js.
- **Accesibilidad Universal:** Cumplimiento estricto de las pautas **WCAG 2.1 Nivel AA**.
- **Rendimiento Óptimo:** Excelencia en métricas **Core Web Vitals (CWV)**.

---

## 2. Estándares de Accesibilidad Web (WCAG 2.1 AA)

### 2.1. Operabilidad y Navegación por Teclado
- **Navegabilidad 100% por Teclado:** Todo control interactivo (`<a>`, `<button>`, `<input>`, `<textarea>`, `<select>`) debe ser enfocable mediante la tecla `Tab` y activable con `Enter` o `Space`.
- **Salto al Contenido:** Inclusión obligatoria del enlace accesible `.skip-link` al inicio de cada página para permitir a usuarios de lectores de pantalla saltar la cabecera directamente al contenido principal (`#main`).
- **Foco Visible Inquebrantable:** Todos los elementos interactivos deben contar con un `:focus-visible` distintivo de alto contraste. Queda estrictamente prohibido usar `outline: none` sin un reemplazo accesible.
- **Cierre Accesible con Escape:** Todo componente superpuesto (menú móvil, alertas, modales) debe poder cerrarse con la tecla `Escape` devolviendo el foco al elemento disparador.

### 2.2. Contraste de Color y Legibilidad
- **Ratio de Contraste Mínimo:**
  - **4.5:1** para texto normal y textos informativos.
  - **3:1** para texto grande (encabezados principales) y componentes esenciales de interfaz (bordes de botones y campos de formulario).
- **Semántica de Imágenes:**
  - Imágenes informativas: Atributo `alt` descriptivo y conciso en español.
  - Imágenes puramente decorativas e iconos: Atributo `alt=""` y `aria-hidden="true"`.

### 2.3. Sincronización de Atributos ARIA Dinámicos
- `aria-expanded`: Refleja el estado abierto/cerrado del menú móvil en `[data-nav-toggle]`.
- `aria-hidden`: Oculta paneles no visibles para los lectores de pantalla.
- `aria-invalid` y `aria-describedby`: Asocian los campos erróneos del formulario con sus respectivos mensajes de alerta.
- `aria-live="polite"`: Anuncia cambios de estado asíncronos en el formulario sin interrumpir al usuario.
- `@media (prefers-reduced-motion: reduce)`: Pausa transiciones y autoplay de carruseles si el usuario prefiere movimiento reducido.

---

## 3. Estándares de Rendimiento y Core Web Vitals (CWV)

### 3.1. Largest Contentful Paint (LCP < 2.5s)
- La imagen destacada del Hero carrusel en `index.html` incluye el atributo `fetchpriority="high"` y carga prioritaria sin `loading="lazy"`.
- Todas las imágenes secundarias del portafolio y equipo utilizan `loading="lazy"` para diferir su descarga.

### 3.2. Cumulative Layout Shift (CLS < 0.1)
- Todas las etiquetas `<img>`, `<svg>` e `<iframe>` cuentan con atributos explícitos `width` y `height` o ratios de aspecto CSS (`aspect-ratio`) para reservar el espacio geométrico antes de su renderizado.
- Se previenen saltos visuales en el carrusel mediante contenedores rígidos `overflow: hidden`.

### 3.3. Interaction to Next Paint (INP < 200ms)
- Los listeners de eventos de desplazamiento (`scroll`) y táctiles se registran con `{ passive: true }`.
- Se aplica **Event Delegation** en grillas y listas interactivas para minimizar el consumo de memoria del navegador.

---

## 4. Convenciones de Código y Mantenibilidad

### 4.1. Reglas de HTML5
- Documento siempre válido: `<!doctype html>`, `<html lang="es">`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- Jerarquía estricta: Exactamente un `<h1>` por página, seguido de `<h2>` para secciones y `<h3>` para tarjetas.
- Distinción semántica: `<a>` exclusivamente para navegación y `<button>` para acciones en la vista.

### 4.2. Reglas de CSS3
- Enfoque **Mobile-First**: Reglas base orientadas a dispositivos móviles y ampliación mediante `min-width`.
- Estructura bidimensional con **CSS Grid** (columnas y grillas de proyectos) y unidimensional con **Flexbox** (barras de navegación, chips y formularios).
- Prohibición de `!important` arbitrarios o selectores por ID para estilos. Especificidad baja mediante clases BEM-lite.

### 4.3. Reglas de JavaScript
- Uso estricto de `const` y `let`. Cero variables globales en `window`.
- Vinculación declarativa con markup mediante atributos `data-*` (`[data-carousel]`, `[data-portfolio-filter]`, etc.).
- Funciones de validación puras y reutilizables en `src/js/utils/validators.js`.
