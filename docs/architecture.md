# Arquitectura

## 1. Objetivo

La arquitectura busca mantener una pagina web:

- simple;
- modular;
- extensible;
- portable;
- fácil de verificar visual y funcionalmente;
- fácil de comprender.

No se requiere reproducir la arquitectura de un framework frontend.

La complejidad debe crecer únicamente cuando crezcan las necesidades del proyecto.

---

## 2. Separación de responsabilidades

```text
┌──────────────────────────────┐
│            HTML              │
│ estructura / contenido       │
│ semántica / accesibilidad    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│             CSS              │
│ layout / diseño / responsive │
│ estados visuales             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          JavaScript          │
│ comportamiento / interacción │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Verificación          │
│ visual / funcional / manual  │
└──────────────────────────────┘
```

No utilizar JavaScript para resolver problemas que pertenecen naturalmente a HTML o CSS.

---

## 3. Estructura de código actual

```text
src/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│
├── js/
│   ├── main.js
│   ├── modal.js
│   ├── form-validation.js
│   ├── catalog.js
│   ├── cart.js
│   ├── checkout.js
│   ├── smooth-scroll.js
│   ├── header.js
│   ├── state.js
│   ├── validators.js
│   └── format.js
│
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

Esta estructura es una guía.

No es necesario crear archivos adicionales a menos que los requerimientos lo demanden.

---

## 4. HTML

`index.html` representa la estructura semántica de la página.

Las secciones principales deben poder identificarse claramente.

Ejemplo conceptual:

```text
header
└── nav

main
├── hero
├── social-proof
├── problem-solution
├── features
├── how-it-works
├── product-demo
├── testimonials
├── pricing
├── faq
└── final-cta

footer
```

Todas las páginas actuales o generadas deben contener las secciones más óptimas para su función.

---

## 5. CSS

La organización recomendada es:

### `variables.css`

Valores compartidos del sistema visual.

### `base.css`

Reglas globales, tipografía y comportamiento base.

### `components.css`

Componentes reutilizables, secciones, grids, modales y estados visuales.

---

## 6. JavaScript

Utilizar ES Modules cuando la cantidad de comportamiento lo justifique.

Ejemplo:

```text
main.js
 ├── navigation.js
 ├── faq.js
 └── animations.js
```

`main.js` debe actuar como punto de inicialización y composición.

Los módulos deben tener responsabilidades claras.

Evitar módulos gigantes.

Evitar módulos de una sola línea creados artificialmente.

---

## 7. Selectores de comportamiento

Cuando sea apropiado, utilizar atributos `data-*` para conectar HTML y JavaScript.

Ejemplo conceptual:

```html
<button data-menu-toggle></button>
```

```js
const menuButton = document.querySelector("[data-menu-toggle]");
```

Esto evita acoplar el comportamiento JS a clases creadas exclusivamente para presentación.

---

## 8. Flujo de inicialización

La inicialización debe ser predecible.

Conceptualmente:

```text
HTML cargado
      ↓
main.js
      ↓
inicialización de módulos
      ↓
event listeners
      ↓
interacciones
```

Cada módulo debe comprobar que los elementos necesarios existan cuando la página pueda ejecutarse en distintos contextos.

---

## 9. Assets

Los assets deben mantenerse separados del código.

Organización:

```text
assets/
├── images/
├── icons/
└── fonts/
```

Evitar duplicar imágenes o iconos.

Emplear un nombre descriptivo y breve en snake case.

Optimizar assets antes de introducir soluciones JavaScript para compensar recursos excesivamente pesados.

---

## 10. Verificación

El proyecto no incorpora Node ni un runner automatizado de tests.

La verificación actual se realiza manualmente sobre el sitio, revisando:

1. carga visual de la página web, donde la página principal es una landing page;
2. navegación por anclas;
3. apertura y cierre de modales;
4. registro demo;
5. habilitación del carrito;
6. agregado y eliminación de productos;
7. checkout demo;
8. responsive en mobile, tablet y desktop;
9. uso básico mediante teclado.

---

## 11. Principios arquitectónicos

### Bajo acoplamiento

Un cambio en una sección no debería requerir modificaciones innecesarias en otras.

### Alta cohesión

Cada módulo debe tener una responsabilidad relacionada y comprensible.

### Simplicidad

No introducir capas de abstracción hasta que exista una necesidad real.

### Reutilización

Extraer lógica únicamente cuando exista reutilización real o una responsabilidad claramente independiente.

### Portabilidad

Preferir APIs estándar del navegador.

### Extensibilidad

La incorporación de una nueva sección o interacción debería requerir cambios localizados.

---

## 12. Evolución

Si el proyecto aumenta significativamente de complejidad, la arquitectura puede evolucionar.

Cualquier cambio estructural importante debe:

1. justificarse;
2. verificarse;
3. documentarse.

La arquitectura actual no debe considerarse un contrato inmutable.
