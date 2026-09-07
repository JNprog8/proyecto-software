---
description: Reglas fundamentales de ingeniería, stack Vanilla, accesibilidad WCAG 2.1 AA y Core Web Vitals para Next Corp.
---

# Reglas de Ingeniería Frontend (Next Corp)

Toda intervención en este repositorio debe cumplir de forma irrestricta con las siguientes cuatro directrices:

## 1. Stack Tecnológico 100% Vanilla (Guardrails)
- **HTML5:** Estructura semántica, sin preprocesadores (Pug, Handlebars).
- **CSS3:** Variables CSS nativas, Grid y Flexbox. Sin TailwindCSS ni preprocesadores (Sass, Less).
- **JavaScript Vanilla:** ES Modules (`type="module"`), selectores estándar y W3C Event Flow.
- **PROHIBICIÓN ESTRICTA:** No instalar dependencias de Node.js, npm, bundlers (Webpack, Vite) ni librerías externas. No crear archivos `package.json` ni scripts de prueba con Node.js.

## 2. Metodología Spec-Driven Development (SDD)
- Toda modificación debe respetar la Única Fuente de Verdad definida en [`specs/sprint-1.md`](../../specs/sprint-1.md).
- Los selectores de comportamiento deben utilizar atributos `data-*` y clases de estado `.is-*` según el contrato de interfaz.
- La lógica de negocio y validación debe implementarse en funciones puras desacopladas en `src/js/utils/`.

## 3. Accesibilidad Web Universal (WCAG 2.1 AA)
- **Operabilidad 100% por Teclado:** Todo control interactivo (`<a>`, `<button>`, inputs) debe poder navegarse con `Tab` y activarse con `Enter` o `Space`.
- **Foco Visible:** Prohibido usar `outline: none` sin proveer `:focus-visible` de alto contraste.
- **Sincronización ARIA:** Reflejar estados dinámicos (`aria-expanded`, `aria-invalid`, `aria-describedby`, `aria-live="polite"`).
- **Contraste y Semántica:** Ratios de contraste mínimos de 4.5:1 (texto normal) y 3:1 (texto grande y componentes). Atributos `alt` descriptivos en imágenes informativas y `alt=""` en decorativas.
- **Movimiento:** Respetar `@media (prefers-reduced-motion: reduce)` desactivando animaciones y pausando carruseles.

## 4. Rendimiento y Core Web Vitals (CWV)
- **LCP (< 2.5s):** Hero del carrusel con carga prioritaria (`fetchpriority="high"`).
- **CLS (< 0.1):** Dimensiones explícitas (`width` y `height`) o `aspect-ratio` en todas las imágenes e iframes.
- **INP (< 200ms):** Listeners de scroll registrados con `{ passive: true }` y Event Delegation en grillas y listas interactivas.
