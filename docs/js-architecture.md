# Arquitectura JavaScript (Next Corp - Vanilla ES Modules)

## 1. Objetivo y Rol

Este documento define la arquitectura técnica, patrones de diseño y estrictas directrices operativas que el sistema debe seguir para el desarrollo de JavaScript en el portal web corporativo de **Next Corp** (empresa especializada en **Desarrollo de Software**: *Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial & Data*), en concordancia con el **Sprint 1** y la metodología **Spec-Driven Development (SDD)**.

Su propósito es delimitar con exactitud el comportamiento interactivo, garantizando rendimiento, accesibilidad y cero dependencias de frameworks no autorizados.

---

## 2. Stack Tecnológico Permitido (Ground Rules)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STACK JAVASCRIPT PERMITIDO                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Lenguaje: ECMAScript 2022+ nativo.                                       │
│ 2. Módulos: ES Modules nativos (<script type="module" src="./js/main.js">). │
│ 3. DOM: Manipulación nativa segura (querySelector, classList, setAttribute).│
│ 4. Asincronía: Promesas, async/await y Fetch API nativa.                    │
│ 5. Estado: Encapsulado en closures de módulo / Factory pattern.             │
│ 6. PROHIBIDO: React, Vue, Angular, Svelte, Alpine.js, jQuery o bundlers     │
│    obligatorios en runtime/desarrollo local (Vite, Webpack, Babel).         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura Modular de Carpetas

La arquitectura en `src/js/` responde al principio de responsabilidad única (SRP):

```text
src/js/
├── main.js                     # Entry point y orquestador tras DOMContentLoaded
│
├── modules/                    # Módulos funcionales de UI e interactividad
│   ├── navigation.js           # Menú móvil, sticky navbar y active link tracking
│   ├── carousel.js             # Hero slider con swipe táctil, teclado y autoplay seguro
│   ├── portfolio.js            # Showcase de 5 proyectos tech y filtrado por categoría
│   ├── form-validation.js      # Validación accesible en tiempo real y envío simulado
│   └── animations.js           # Scroll reveal con IntersectionObserver y micro-animaciones
│
└── utils/                      # Funciones puras y utilidades reutilizables
    ├── dom.js                  # Selectores seguros, delegación de eventos y trapFocus
    └── validators.js           # Validadores puros (email, teléfono, longitud)
```

---

## 4. Principios de Diseño e Implementación

### 4.1. Desacoplamiento DOM-Lógica
La lógica JavaScript se asocia exclusivamente mediante **atributos de datos (`data-*`)**, nunca mediante clases de presentación visual:
```html
<!-- Contrato explícito -->
<button data-carousel-next aria-label="Siguiente diapositiva">›</button>
<div data-portfolio-item data-category="web-cloud">...</div>
```

### 4.2. Clases de Estado (`.is-*`)
CSS gestiona la apariencia visual; JS únicamente añade o remueve clases de estado:
```javascript
element.classList.add('is-active');
element.classList.remove('is-hidden');
```

### 4.3. Delegación de Eventos (Event Delegation)
Evitar registrar listeners múltiples en elementos repetitivos; registrar en el contenedor común:
```javascript
// Correcto: Event delegation eficiente
document.querySelector('[data-portfolio-grid]').addEventListener('click', (event) => {
  const card = event.target.closest('[data-portfolio-item]');
  if (card) {
    handleProjectSelection(card.dataset.portfolioItem);
  }
});
```

---

## 5. Orquestación y Punto de Entrada (`main.js`)

```javascript
/**
 * Punto de entrada principal de Next Corp
 * @module main
 */
import { initNavigation } from './modules/navigation.js';
import { initCarousel } from './modules/carousel.js';
import { initPortfolio } from './modules/portfolio.js';
import { initFormValidation } from './modules/form-validation.js';
import { initAnimations } from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initNavigation();
    initCarousel();
    initPortfolio();
    initFormValidation();
    initAnimations();
  } catch (error) {
    console.error('[NextCorp Init Error]: Fallo al inicializar módulos', error);
  }
});
```

---

## 6. Rendimiento y Optimización de Eventos

### 6.1. Debounce & Throttle
```javascript
export function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function throttle(func, limit = 16) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 6.2. Core Web Vitals (CWV)
- **LCP:** La imagen del slide activo del Hero debe tener `fetchpriority="high"`.
- **INP:** Utilizar listeners pasivos (`{ passive: true }`) en eventos de scroll y táctiles.
- **CLS:** Evitar saltos de layout fijando `aspect-ratio` o `width`/`height` explícitos.
