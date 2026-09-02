# Design System del Portal Web (Next Corp)

## 1. Objetivo y Rol

El presente Sistema de Diseño proporciona un lenguaje visual coherente, escalable y accesible para el **Desarrollador Frontend de páginas web**. Su propósito es garantizar la excelencia estética y funcional en todas las páginas del portal corporativo de **Next Corp** (**Desarrollo de Software**, abarcando *Desarrollo Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial & Data Engineering*), conforme a los requerimientos del **Sprint 1** y la metodología **Spec-Driven Development (SDD)**.

---

## 2. Paleta de Colores UX/UI y Roles Tonales

La identidad cromática se basa en una paleta armónica refinada de cinco colores esenciales:

| Token | Código HEX | Rol Semántico en la Interfaz |
| :--- | :--- | :--- |
| `--color-primary` | `#28536B` | **Azul Petróleo / Navy Profundo:** Identidad de marca, solidez técnica, encabezados y botones de acción principal. |
| `--color-secondary` | `#C2948A` | **Dusty Rose / Arcilla Cálida:** Color de acento cálido, botones secundarios, badges de Apps Móviles y elementos destacados. |
| `--color-tertiary` | `#7EA8BE` | **Azul Aero / Celeste Suave:** Enlaces, bordes de foco interactivo, badges de Cloud y detalles luminosos. |
| `--color-light` | `#F6F0ED` | **Blanco Alabastro / Lino Suave:** Tipografía principal de alto contraste, superficies limpias y fondos claros. |
| `--color-sand` | `#BBB193` | **Sage Arena / Dorado Suave:** Bordes tenues, badges de Inteligencia Artificial & Data y marcadores sutiles. |

### 2.1. Tokens en CSS (`src/css/variables.css`)

```css
:root {
  --color-primary: #28536B;
  --color-secondary: #C2948A;
  --color-tertiary: #7EA8BE;
  --color-light: #F6F0ED;
  --color-sand: #BBB193;

  /* Superficies en Dark Mode Elegante */
  --md-sys-color-background: #0f1c24;
  --md-sys-color-surface: #152632;
  --md-sys-color-surface-container: #1b3140;
  --md-sys-color-on-surface: var(--color-light);
  --md-sys-color-outline: rgba(187, 177, 147, 0.28);
}
```

---

## 3. Movimiento, Transiciones y Micro-Interacciones (Inspirado en Lando Norris)

### 3.1. Hero Motion Blur
Durante la rotación de diapositivas en el Hero, la imagen activa ejecuta un keyframe cinemático de desenfoque y escala:
```css
@keyframes heroMotionBlur {
  0% {
    opacity: 0.15;
    filter: blur(8px);
    transform: scale(1.06) translateX(12px);
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: scale(1) translateX(0);
  }
}
```

### 3.2. Transición Fluida de Página y Barra Superior (Estilo High-End)
Inspirado en los principios de movimiento de `landonorris.com`:
1. **Header Inmutable y Estable:** El Top Bar (`.site-header`) permanece fijo y estable (`z-index: var(--z-header)`), libre de parpadeos o animaciones duplicadas al navegar entre páginas.
2. **Top Progress Bar (`.page-progress-bar`):** Una línea ultra-fina (3px) con gradiente `--color-secondary` a `--color-tertiary` viaja por la parte superior para dar feedback inmediato de carga.
3. **Smooth Content Reveal (`.page-content`):** El contenedor principal `<main id="main">` se desvanece suavemente al salir (`is-page-leaving`) y entra con un reveal cinemático (`is-page-entering`) con curva fluida `cubic-bezier(0.65, 0.05, 0, 1)` y ligero desenfoque inicial (`filter: blur(2px) -> 0`).

---

## 4. Componentes y Patrones UI del Portal

1. **Header y Menú Responsivo:** Barra fija superior con efecto glassmorphism, indicador de página activa (`is-active`) y menú hamburguesa accesible para dispositivos móviles.
2. **Hero Carrusel:** Slider con temporizador automático configurado en **7.5 a 8 segundos** (`AUTOPLAY_DELAY = 7500ms`), pausa automática al posar el mouse o ganar foco (WCAG 2.1 AA) y navegación por teclado.
3. **Showcase de Proyectos y Filtros:** Grilla de 12 columnas con tarjetas elevadas M3 y filtrado dinámico (`all`, `web-cloud`, `mobile`, `ai-data`).
4. **Formulario de Contacto Interactivo:**
   - Atributos `method="post"` y `action="/api/contact"`.
   - Validación accesible de campos en tiempo real.
   - Envío asíncrono con estado de carga.
   - Vaciado total de inputs (`form.reset()`).
   - Ocultamiento suave del formulario (`.form-fade-out`) y revelación del panel de confirmación (`.contact-success-card`) con opción interactiva para enviar otra consulta.
