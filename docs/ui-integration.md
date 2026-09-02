# Especificación de Integración de UI (UI Integration Spec)

## 1. Objetivo y Rol

Este documento define la **estrategia de integración de interfaz de usuario** y el **contrato formal de interacción** entre la estructura (**HTML5**), el sistema visual híbrido (**CSS3**) y la capa de comportamiento (**JavaScript Vanilla**) para el portal corporativo multisectorial (**Desarrollo de Software**, **Arquitectura** y **Logística y Distribución de Paquetes**), en el marco del **Sprint 1** y la metodología **Spec-Driven Development (SDD)**.

---

## 2. Hibridación de Filosofías: Bootstrap (Layout) + Material Design 3 (Visual Tokens)

Bootstrap y Material Design 3 (M3) provienen de paradigmas de diseño diferentes. En este proyecto, se combinan de forma sinérgica y libre de colisiones aplicando una clara división de responsabilidades mediante **CSS3 personalizado y nativo**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ARQUITECTURA VISUAL HÍBRIDA                            │
├──────────────────────────────────────┬──────────────────────────────────────┤
│      BOOTSTRAP (Esqueleto & Layout)  │   MATERIAL DESIGN 3 (Piel & Tokens)  │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Sistema de grilla de 12 columnas   │ • Tokens de color tonal y contraste  │
│ • Contenedores responsivos           │ • Elevación y sombras (Niveles 1 a 5)│
│ • Breakpoints estándar:              │ • Roles de superficie y contenedores │
│   sm (576px), md (768px), lg (992px),│ • Micro-estados de interacción      │
│   xl (1200px), xxl (1400px)          │   (hover, focus-visible, active)     │
│ • Flexbox & Grid utilities           │ • Radios de esquina y tipografía     │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### 2.1. Reglas de Coexistencia e Implementación en CSS Puro

1. **El Layout se rige por Bootstrap:** Las estructuras de página, filas (`.row`), columnas (`.col-*`), espaciados de grilla y adaptabilidad responsiva siguen la lógica matemática de 12 columnas de Bootstrap.
2. **La Estética se rige por Material Design 3:** Todo elemento que habita dentro de la grilla (tarjetas, botones, inputs, diálogos, barras de navegación) aplica los Design Tokens de M3 definidos en `src/css/variables.css`:
   - Superficies (`--md-sys-color-surface`, `--md-sys-color-surface-variant`).
   - Elevación dinámica (`--elevation-level-1` en reposo, `--elevation-level-3` en hover).
   - Colores tonales primarios, secundarios y terciarios para cada sector de negocio.
3. **Cero Dependencias Pesadas:** No se carga el framework Bootstrap CSS completo ni librerías de Material Design externas. Se implementa un CSS modular y limpio con variables nativas.

#### Ejemplo de Combinación Híbrida:

```html
<!-- Grid y Layout estilo Bootstrap (12 columnas) con Tarjetas estilo Material Design 3 -->
<div class="container">
  <div class="row g-4">
    <!-- Columna Bootstrap: 12 en móvil, 4 en desktop -->
    <div class="col-12 col-lg-4">
      <!-- Componente M3: Superficie tonal, esquinas redondeadas y elevación por sombra -->
      <article class="m3-card m3-card--elevated" data-service-card="software">
        <div class="m3-card__icon-container">
          <!-- Icono SVG -->
        </div>
        <h3 class="m3-card__title">Desarrollo de Software</h3>
        <p class="m3-card__text">
          Aplicaciones cloud escalables y soluciones a medida.
        </p>
        <a href="#contacto" class="m3-btn m3-btn--tonal">Consultar</a>
      </article>
    </div>
  </div>
</div>
```

---

## 3. Principio de Desacoplamiento Tripartito

Para mantener la separación estricta de responsabilidades, la integración técnica sigue cinco niveles:

```text
┌─────────────────┬────────────────────────────┬───────────────────────────────────────┐
│ Capa            │ Mecanismo de Enganche      │ Propósito / Responsabilidad           │
├─────────────────┼────────────────────────────┼───────────────────────────────────────┤
│ 1. Estructura   │ Etiquetas HTML5 semánticas │ Jerarquía, significado y contenido    │
│ 2. Layout       │ Clases de Grilla (.container, .row, .col-*) │ Disposición espacial (Bootstrap)     │
│ 3. Estilo / M3  │ Clases de Componente M3    │ Tokens, colores y elevación (M3)      │
│ 4. Estado UI    │ Clases con prefijo .is-*   │ Representación visual de estados      │
│ 5. Comportamiento│ Atributos data-*          │ Selectores para interactividad JS     │
│ 6. Accesibilidad│ Atributos aria-*           │ Semántica para tecnologías asistivas  │
└─────────────────┴────────────────────────────┴───────────────────────────────────────┘
```

> [!IMPORTANT]
> **Regla de Oro:** JavaScript **NUNCA** debe seleccionar elementos mediante clases visuales (`.row`, `.col-lg-4`, `.btn-primary`, `.m3-card`). Toda interacción se asocia exclusivamente mediante atributos `[data-*]`.

---

## 4. Diccionario de Clases de Estado y Atributos de Datos

### 4.1. Atributos de Datos para JS (`data-*`)

- `[data-nav-toggle]`: Disparador del menú móvil accesible.
- `[data-nav-menu]`: Contenedor de la navegación principal.
- `[data-carousel]`: Contenedor principal del slider de Home.
- `[data-carousel-item]`: Slide individual del carrusel.
- `[data-carousel-prev]`, `[data-carousel-next]`: Controles de navegación anterior / siguiente.
- `[data-carousel-indicator]`: Puntos de paginación interactivos.
- `[data-filter-btn]`: Botones de categoría en Trabajos/Clientes (`all`, `web-cloud`, `mobile`, `ai-data`).
- `[data-portfolio-item]`: Tarjeta de proyecto individual.
- `[data-form-contact]`: Formulario principal de contacto.
- `[data-form-status]`: Contenedor de feedback accesible con `aria-live`.
- `[data-animate]`: Elemento marcado para animación mediante `IntersectionObserver`.

### 4.2. Clases de Estado de CSS (`.is-*`)

- `.is-open`: Menú móvil desplegado.
- `.is-active`: Slide, filtro o indicador actualmente seleccionado.
- `.is-scrolled`: Header fijado con sombra de elevación M3 tras scroll.
- `.is-hidden`: Elemento filtrado u oculto de la vista.
- `.is-visible`: Elemento que ha ingresado al viewport y activó su animación.
- `.is-loading`: Botón o contenedor en estado de espera asíncrona.
- `.is-invalid`: Campo de formulario con error de validación.
- `.is-valid`: Campo de formulario validado correctamente.

---

## 5. Contratos de Integración por Componente (Sprint 1)

### 5.1. Componente: Header y Navegación Responsive

```html
<header class="site-header" id="site-header">
  <div class="container site-header__inner">
    <a href="#home" class="site-logo" aria-label="Next Corp, ir al inicio">
      <span class="logo__mark" aria-hidden="true">N</span>
      <span>Next<span class="logo__accent">Corp</span></span>
    </a>

    <!-- Botón Hamburguesa -->
    <button
      class="nav-toggle"
      type="button"
      data-nav-toggle
      aria-expanded="false"
      aria-controls="primary-nav"
      aria-label="Abrir menú de navegación"
    >
      <span class="nav-toggle__icon" aria-hidden="true"></span>
    </button>

    <!-- Menú Principal -->
    <nav
      id="primary-nav"
      class="nav-menu"
      data-nav-menu
      aria-label="Navegación principal"
    >
      <ul class="nav-menu__list">
        <li><a href="#home" class="nav-menu__link" data-nav-link>Inicio</a></li>
        <li>
          <a href="#equipo" class="nav-menu__link" data-nav-link>El Equipo</a>
        </li>
        <li>
          <a href="#servicios" class="nav-menu__link" data-nav-link
            >Servicios</a
          >
        </li>
        <li>
          <a href="#trabajos" class="nav-menu__link" data-nav-link>Trabajos & Clientes</a>
        </li>
        <li>
          <a href="#contacto" class="nav-menu__link" data-nav-link>Contacto</a>
        </li>
      </ul>
    </nav>
  </div>
</header>
```

### 5.2. Componente: Hero Carousel ("Quiénes somos y lo que hacemos")

```html
<section
  id="home"
  class="hero-section"
  data-carousel
  aria-roledescription="carrusel"
  aria-label="Áreas de especialidad en desarrollo de software"
>
  <div class="carousel__track">
    <!-- Slide 1: Web & Cloud -->
    <article
      class="carousel__slide is-active"
      data-carousel-item="0"
      aria-roledescription="diapositiva"
      aria-label="1 de 3: Plataformas Web & Cloud"
    >
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-6 carousel__content">
            <span class="m3-badge m3-badge--primary">Cloud & Microservicios</span>
            <h1 class="hero__title">Plataformas Cloud y Software a Medida</h1>
            <p class="hero__subtitle">
              Diseñamos arquitecturas distribuidas de alta disponibilidad, APIs robustas y aplicaciones web empresariales.
            </p>
            <div class="hero__cta-group">
              <a href="#servicios" class="btn btn--primary">Nuestros Servicios</a>
              <a href="#trabajos" class="btn btn--outline">Ver Proyectos</a>
            </div>
          </div>
          <div class="col-12 col-lg-6 carousel__media">
            <img
              src="assets/img/hero/hero_web_cloud.jpg"
              alt="Arquitectura cloud y monitor con código en Next Corp"
              width="800"
              height="500"
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </article>

    <!-- Slide 2: Mobile Apps -->
    <article
      class="carousel__slide"
      data-carousel-item="1"
      aria-roledescription="diapositiva"
      aria-label="2 de 3: Aplicaciones Móviles"
      aria-hidden="true"
    >
      <!-- Contenido Mobile Apps -->
    </article>

    <!-- Slide 3: AI & Data -->
    <article
      class="carousel__slide"
      data-carousel-item="2"
      aria-roledescription="diapositiva"
      aria-label="3 de 3: Inteligencia Artificial & Data"
      aria-hidden="true"
    >
      <!-- Contenido AI & Data -->
    </article>
  </div>

  <!-- Controles -->
  <div class="carousel__controls">
    <button
      type="button"
      class="carousel__btn"
      data-carousel-prev
      aria-label="Diapositiva anterior"
    >
      ‹
    </button>
    <div
      class="carousel__indicators"
      role="tablist"
      aria-label="Seleccionar diapositiva"
    >
      <button
        type="button"
        role="tab"
        class="carousel__dot is-active"
        data-carousel-indicator="0"
        aria-selected="true"
        aria-label="Ir a diapositiva 1"
      ></button>
      <button
        type="button"
        role="tab"
        class="carousel__dot"
        data-carousel-indicator="1"
        aria-selected="false"
        aria-label="Ir a diapositiva 2"
      ></button>
      <button
        type="button"
        role="tab"
        class="carousel__dot"
        data-carousel-indicator="2"
        aria-selected="false"
        aria-label="Ir a diapositiva 3"
      ></button>
    </div>
    <button
      type="button"
      class="carousel__btn"
      data-carousel-next
      aria-label="Diapositiva siguiente"
    >
      ›
    </button>
  </div>
</section>
```

### 5.3. Componente: Showcase de Trabajos y Filtros

```html
<section id="trabajos" class="portfolio-section" data-portfolio>
  <div class="container">
    <div
      class="portfolio__filter-bar"
      role="toolbar"
      aria-label="Filtrar proyectos por especialidad de software"
    >
      <button
        type="button"
        class="filter-btn is-active"
        data-filter-btn="all"
        aria-pressed="true"
      >
        Todos
      </button>
      <button
        type="button"
        class="filter-btn"
        data-filter-btn="web-cloud"
        aria-pressed="false"
      >
        Web & Cloud
      </button>
      <button
        type="button"
        class="filter-btn"
        data-filter-btn="mobile"
        aria-pressed="false"
      >
        Apps Móviles
      </button>
      <button
        type="button"
        class="filter-btn"
        data-filter-btn="ai-data"
        aria-pressed="false"
      >
        IA & Datos
      </button>
    </div>

    <!-- Región live para lectores de pantalla -->
    <div class="sr-only" aria-live="polite" data-portfolio-status>
      Mostrando 5 proyectos
    </div>

    <!-- Grilla de 12 columnas Bootstrap con tarjetas M3 -->
    <div class="row g-4" data-portfolio-grid>
      <!-- Proyecto 1: CloudScale Analytics -->
      <div
        class="col-12 col-md-6 col-lg-4"
        data-portfolio-item
        data-category="web-cloud"
      >
        <article class="portfolio-card m3-card m3-card--elevated">
          <div class="portfolio-card__media">
            <img
              src="assets/img/portfolio/project_cloud_analytics.jpg"
              alt="Dashboard de observabilidad SaaS CloudScale Analytics"
              loading="lazy"
              width="600"
              height="400"
            />
            <span class="m3-badge m3-badge--software">Web & Cloud</span>
          </div>
          <div class="portfolio-card__body">
            <h3>CloudScale Analytics</h3>
            <p class="portfolio-card__client">Cliente: DataFlow Inc</p>
            <p>
              Plataforma SaaS distribuida para observabilidad en tiempo real y telemetría de microservicios.
            </p>
          </div>
        </article>
      </div>
      <!-- 4 proyectos adicionales (Fintech Pay, AI Copilot, E-commerce, Telemed) -->
    </div>
  </div>
</section>
```

---

## 6. Matriz de Teclado y Accesibilidad Interactiva

| Tecla / Combinación        | Contexto de Uso       | Comportamiento Esperado                                                                       |
| :------------------------- | :-------------------- | :-------------------------------------------------------------------------------------------- |
| `Tab` / `Shift + Tab`      | Global                | Navegación secuencial respetando el orden lógico del DOM. Indicador `:focus-visible` visible. |
| `Enter` / `Space`          | Botones y Enlaces     | Ejecución de la acción (abrir menú, cambiar slide, activar filtro, enviar formulario).        |
| `Escape`                   | Menú Móvil / Diálogos | Cierra el componente abierto y retorna el foco al elemento disparador.                        |
| `ArrowLeft` / `ArrowRight` | Hero Carrusel         | Navegación hacia diapositiva anterior o siguiente cuando el foco está dentro del carrusel.    |
| `ArrowLeft` / `ArrowRight` | Filtros de Portafolio | Desplazamiento fluido del foco entre botones de categoría en la barra de herramientas.        |
