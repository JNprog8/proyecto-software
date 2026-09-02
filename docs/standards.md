# Estándares de Desarrollo Frontend (Next Corp)

## 1. Objetivo y Rol

Este documento establece las normas de codificación, estándares de calidad, accesibilidad y rendimiento web para el **Desarrollador Frontend de páginas web** en el desarrollo del portal corporativo de **Next Corp** (**Desarrollo de Software**: *Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial*), en concordancia con el **Sprint 1**.

---

## 2. Jerarquía de Referencias y Estándares

Las decisiones técnicas y de implementación siguen el siguiente orden de precedencia:

```text
1. Estándares Oficiales Web (WHATWG / W3C)
   ↓
2. MDN Web Docs (Mozilla Developer Network)
   ↓
3. Sistemas de Diseño y Frameworks de Referencia:
   - Material Design 3 (https://m3.material.io/)
   - Bootstrap (https://getbootstrap.com/)
   ↓
4. Herramientas Especializadas de Diseño e Interactividad:
   - Coolors (https://coolors.co/) para colorimetría y contraste
   - Animista (animista.net) y Cubic-bezier.com para movimiento y aceleración
   - GreenSock (greensock.com) y LottieFiles (lottiefiles.com) para animación avanzada
   - Awwwards (awwwards.com) y Dribbble (dribbble.com) para benchmarking visual
   - Lucide (lucide.dev), Heroicons (heroicons.com) y SVG Repo (svgrepo.com) para vectores e iconografía
   ↓
5. W3Schools (como guía práctica y de consulta rápida)
```

---

## 3. Estándares de HTML5

### 3.1. Estructura y Semántica
- Declaración obligatoria de `<!doctype html>` y atributo de idioma `<html lang="es">`.
- Inclusión de metadatos esenciales en `<head>`: `charset="UTF-8"`, `viewport` con `width=device-width, initial-scale=1.0`, `title` descriptivo y `description` optimizada para SEO.
- Utilización rigurosa de elementos semánticos para definir la estructura de las 5 secciones:
  - `<header>` y `<nav>` para la cabecera y el menú de navegación principal.
  - `<main>` para el contenedor del contenido principal.
  - `<section>` para cada una de las 5 secciones (Home, Equipo, Servicios, Trabajos/Clientes, Contacto), identificadas con IDs únicos para anclaje.
  - `<article>` para tarjetas independientes de integrantes, servicios y proyectos.
  - `<footer>` para el pie de página institucional.

### 3.2. Jerarquía de Encabezados y Controles
- Un único `<h1>` por página (en el Hero de la sección Home).
- Encabezados de segundo nivel `<h2>` para los títulos de cada una de las 5 secciones.
- Encabezados `<h3>` para tarjetas de servicios, integrantes y trabajos.
- Uso exclusivo de `<a>` para enlaces de navegación o salto de ancla y `<button>` para acciones del DOM (avanzar carrusel, abrir menú móvil, enviar formulario).

### 3.3. Imágenes y Multimedia
- Dimensiones explícitas (`width` y `height`) o `aspect-ratio` en CSS para evitar saltos de layout (CLS).
- Texto alternativo descriptivo en el atributo `alt` para imágenes de contenido; `alt=""` para imágenes puramente decorativas.
- Carga diferida (`loading="lazy"`) para imágenes ubicadas debajo del primer pliegue de pantalla.

---

## 4. Estándares de CSS3

### 4.1. Arquitectura y Enfoque Mobile-First
- Organización basada en Custom Properties (`src/css/variables.css`), reglas base (`base.css`), layout de 12 columnas (`layout.css`), componentes (`components.css`) y animaciones (`animations.css`).
- Estilos base diseñados para dispositivos móviles y escalados progresivamente mediante `@media (min-width: ...)` utilizando los breakpoints estándar de [Bootstrap](https://getbootstrap.com/):
  - `sm`: ≥ 576px
  - `md`: ≥ 768px
  - `lg`: ≥ 992px
  - `xl`: ≥ 1200px
  - `xxl`: ≥ 1400px

### 4.2. Sistema de Diseño, Sombras y Elevación
- Aplicación de tokens de elevación y roles de superficie de [Material Design 3](https://m3.material.io/) para crear profundidad visual (`--elevation-level-1` a `--elevation-level-5`).
- Control de proporciones tipográficas y espaciados mediante `clamp()` para lograr fluidez visual sin saturar de media queries.
- Especificidad baja: evitar IDs en CSS, selectores anidados profundos y el uso injustificado de `!important`.

### 4.3. Movimiento y Animación
- Curvas de aceleración naturales generadas con [Cubic-bezier.com](https://cubic-bezier.com/) (`cubic-bezier(0.4, 0, 0.2, 1)`).
- Micro-animaciones CSS probadas provenientes de [Animista](https://animista.net/) aplicadas a propiedades de bajo costo de renderizado (`transform`, `opacity`).
- Integración de secuencias de movimiento [GreenSock (GSAP)](https://greensock.com/) o micro-interacciones vectoriales de [LottieFiles](https://lottiefiles.com/).
- Soporte obligatorio para reducción de movimiento:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

---

## 5. Estándares de Iconografía y Gráficos Vectoriales

- Utilizar iconos SVG consistentes de [Lucide Icons](https://lucide.dev/), [Heroicons](https://heroicons.com/) o [SVG Repo](https://www.svgrepo.com/).
- Atributo `aria-hidden="true"` y `focusable="false"` en iconos decorativos acompañados de texto.
- Atributo `aria-label` en iconos que actúan de forma interactiva autónoma (botones de redes sociales o controles de carrusel).
- Dimensiones inline controladas vía clases CSS o atributos `width="24" height="24"`.

---

## 6. Estándares de JavaScript Vanilla

### 6.1. Modularidad y Buenas Prácticas
- Estructuración obligatoria en **ES Modules** (`<script type="module" src="./js/main.js"></script>`).
- Uso estricto de `const` y `let`; prohibido el uso de `var` y variables globales en `window`.
- Inicialización centralizada en `main.js` una vez que el DOM está listo (`DOMContentLoaded`).
- Desacoplamiento de markup y estilos utilizando atributos `data-*` para selectores de comportamiento JS (ej.: `[data-carousel]`, `[data-menu-toggle]`).

### 6.2. Validación de Formularios Accesible
- Validación en tiempo de interacción y antes del envío (`submit`).
- Verificación de campos obligatorios, formato válido de email y longitud mínima de mensaje.
- Anuncios de error accesibles (`aria-describedby` y `aria-invalid="true"`) y foco automático en el primer campo inválido.

---

## 7. Accesibilidad Web (WCAG 2.1 Nivel AA)

- **Contraste de Color:** Ratios de contraste verificados con [Coolors](https://coolors.co/) (mínimo 4.5:1 para texto normal y 3:1 para texto grande o componentes interactivos).
- **Navegación por Teclado:** Todo control interactivo debe poder seleccionarse mediante `Tab` y activarse mediante `Enter` o `Space`.
- **Foco Visible:** Indicador `:focus-visible` claramente visible y con alto contraste en todos los botones, enlaces y campos de formulario.
- **Modales y Menús:** Cierre accesible con tecla `Escape` y retorno de foco al elemento desencadenante.

---

## 8. Rendimiento Web (Core Web Vitals)

- **LCP (Largest Contentful Paint):** Optimización y precarga prioritaria de la imagen principal del Hero / Carrusel (`fetchpriority="high"`).
- **CLS (Cumulative Layout Shift):** Definición explícita de dimensiones en imágenes, avatares e iframes de mapas.
- **INP (Interaction to Next Paint):** Listeners de eventos pasivos (`{ passive: true }`) para eventos de scroll o touch, y delegación eficiente de eventos.
