# Estándares de desarrollo

## 1. Jerarquía de referencias

Las decisiones técnicas deben seguir esta prioridad:

```text
Estándares web
    ↓
WHATWG / W3C
    ↓
MDN
    ↓
W3Schools
    ↓
Convenciones específicas del proyecto
```

W3Schools se utiliza como referencia práctica y educativa.

No debe seguirse un ejemplo de W3Schools si contradice un estándar web, una recomendación de accesibilidad o una buena práctica moderna.

---

# 2. HTML5

## Documento

Todo documento debe utilizar:

```html
<!doctype html>
```

y declarar correctamente:

```html
<html lang="es">
```

cuando el contenido principal esté en español.

---

## Semántica

Preferir elementos semánticos:

```text
header
nav
main
section
article
aside
figure
figcaption
footer
form
button
a
```

Una sección temática debe tener una razón semántica para existir.

No utilizar `<div>` como sustituto automático de elementos semánticos.

---

## Headings

Mantener una jerarquía lógica:

```text
h1
└── h2
    ├── h3
    └── h3
```

No utilizar headings únicamente para conseguir determinado tamaño visual.

El estilo visual pertenece a CSS.

---

## Links y botones

Usar:

```html
<a href="/destino">...</a>
```

para navegación.

Usar:

```html
<button type="button">...</button>
```

para acciones.

No crear controles interactivos utilizando `<div>` o `<span>`.

---

## Imágenes

Las imágenes informativas deben tener texto alternativo descriptivo.

Las imágenes puramente decorativas deben utilizar:

```html
alt=""
```

Cuando sea posible, especificar dimensiones para reducir layout shifts.

---

## Formularios

Los controles deben tener nombres accesibles.

Preferir:

```html
<label for="email">Correo electrónico</label>
<input id="email" name="email" type="email">
```

Utilizar `fieldset` y `legend` cuando se agrupen controles relacionados.

---

# 3. CSS3

## Principios

Preferir:

* cascade;
* inheritance;
* custom properties;
* Flexbox;
* Grid;
* media queries;
* relative units;
* logical properties cuando aporten valor.

---

## Custom Properties

Centralizar valores compartidos:

```css
:root {
    --color-primary: ...;
    --color-text: ...;
    --space-md: ...;
    --radius-md: ...;
}
```

No convertir cada valor CSS en un token.

Un token debe representar una decisión reutilizable.

---

## Responsive

Utilizar enfoque mobile-first.

Base:

```css
.component {
    ...
}
```

Después:

```css
@media (min-width: ...) {
    .component {
        ...
    }
}
```

No diseñar para una única resolución.

---

## Layout

Preferir:

* Grid para estructuras bidimensionales.
* Flexbox para distribución unidimensional.
* `max-width` y contenedores para controlar líneas de lectura.
* `gap` para separación entre elementos.

Evitar posicionamiento absoluto como solución general de layout.

---

## Especificidad

Preferir selectores simples.

Evitar:

```css
main section div.container div.card h3 span {
}
```

Preferir clases con responsabilidades claras.

---

## `!important`

No utilizar `!important` como mecanismo habitual para resolver conflictos.

Si resulta necesario, investigar primero la causa de la especificidad.

---

## Animaciones

Preferir:

* `transform`;
* `opacity`;
* CSS transitions;
* CSS animations.

Respetar:

```css
@media (prefers-reduced-motion: reduce) {
    ...
}
```

---

# 4. JavaScript

## Módulos

Cuando exista suficiente complejidad, utilizar ES Modules:

```html
<script type="module" src="./js/main.js"></script>
```

y:

```js
export function feature() {}
```

```js
import { feature } from "./feature.js";
```

Los módulos proporcionan encapsulación y límites explícitos.

---

## Eventos

Preferir:

```js
element.addEventListener("click", handler);
```

Evitar:

```html
<button onclick="handler()">
```

La lógica de comportamiento debe mantenerse fuera del markup.

---

## DOM

Preferir APIs estándar y selectores claros.

Evitar:

* consultas repetidas innecesarias;
* modificaciones masivas sin necesidad;
* reconstrucción completa del DOM para pequeños cambios.

---

## Estado

Mantener el estado lo más local posible.

No crear un sistema global de estado para una interacción que puede resolverse con una variable o módulo local.

---

## Errores

No ocultar errores silenciosamente.

Cuando una operación pueda fallar, manejar el fallo de forma coherente con el comportamiento esperado de la interfaz.

---

# 5. Accesibilidad

La accesibilidad debe diseñarse desde el HTML.

Considerar:

* navegación por teclado;
* focus visible;
* contraste;
* nombres accesibles;
* headings;
* labels;
* estados;
* reduced motion.

Utilizar HTML nativo antes que ARIA.

ARIA debe complementar, no reemplazar, la semántica HTML.

---

# 6. JavaScript y accesibilidad

Toda interacción creada mediante JavaScript debe tener un equivalente accesible.

Ejemplos:

* menú → teclado + Escape;
* accordion → teclado + estado accesible;
* modal → focus management;
* tabs → navegación mediante teclado;
* formularios → mensajes comprensibles.

No implementar una interacción visual que sea inaccesible mediante teclado.

---

# 7. Performance

Priorizar soluciones simples:

* assets optimizados;
* imágenes apropiadas;
* lazy loading cuando corresponda;
* JavaScript mínimo;
* CSS eficiente;
* evitar listeners de scroll innecesarios.

Para animaciones basadas en viewport, considerar `IntersectionObserver`.

---

# 8. Compatibilidad

Preferir APIs ampliamente soportadas por navegadores modernos.

Cuando se utilice una API reciente, comprobar compatibilidad antes de adoptarla.

No implementar polyfills o fallbacks innecesarios sin una necesidad real.

---

# 9. Convenciones de código

El código debe ser:

* explícito;
* consistente;
* legible;
* predecible.

Los nombres deben expresar intención.

Evitar abreviaturas ambiguas.

Los comentarios deben explicar **por qué**, no repetir lo que el código ya expresa.
