# Especificación Técnica Ejecutable: Sprint

## 1. Alcance General del Sprint

El **Sprint** ("Desarrollo de un portal Web") establece la construcción, optimización y entrega del portal web corporativo para **Next Corp**, empresa dedicada al **Desarrollo de Software**

El portal consta de **5 secciones fundamentales** estructuradas en páginas HTML independientes:

1. **Home (`index.html`):** Hero carrusel cinemático y 3 tiras de resumen (Servicios, Proyectos, Cultura).
2. **El Equipo (`equipo.html`):** Visión de ingeniería, valores corporativos y mínimo 3 líderes técnicos con fichas y redes.
3. **Servicios (`servicios.html`):** Detalle técnico completo de las 3 áreas de software con stacks y llamadas a cotización.
4. **Trabajos & Clientes (`trabajos.html`):** Showcase de 5 casos de éxito con filtrado interactivo y panel de clientes tech.
5. **Contacto (`contacto.html`):** Mapa interactivo embebido, canales directos (redes, email, teléfono) y formulario validado.

---

## 2. Contratos de Interfaz de Usuario (UI Contracts)

### 2.1. Selectores de Comportamiento Declarativos (`data-*`)

| Selector                   | Elemento           | Módulo JS Responsable | Propósito                                                               |
| :------------------------- | :----------------- | :-------------------- | :---------------------------------------------------------------------- |
| `[data-carousel]`          | `<section>`        | `carousel.js`         | Contenedor principal del slider cinemático de Home.                     |
| `[data-carousel-slide]`    | `<article>`        | `carousel.js`         | Diapositiva individual con gestión de `aria-hidden`.                    |
| `[data-carousel-progress]` | `<div>`            | `carousel.js`         | Barra de progreso animada sincronizada a 7.5 segundos.                  |
| `[data-carousel-prev]`     | `<button>`         | `carousel.js`         | Control accesible para retroceder al slide anterior.                    |
| `[data-carousel-next]`     | `<button>`         | `carousel.js`         | Control accesible para avanzar al siguiente slide.                      |
| `[data-carousel-dots]`     | `<div>`            | `carousel.js`         | Contenedor de puntos de navegación directa.                             |
| `[data-nav-toggle]`        | `<button>`         | `navigation.js`       | Botón hamburguesa accesible para desplegar el menú móvil.               |
| `[data-mobile-nav]`        | `<nav>`            | `navigation.js`       | Panel de navegación móvil superpuesto.                                  |
| `[data-nav-link]`          | `<a>`              | `navigation.js`       | Enlaces del menú principal con sincronización de estado.                |
| `[data-portfolio-filters]` | `<div>`            | `portfolio.js`        | Contenedor de filtros donde opera **Event Delegation**.                 |
| `[data-portfolio-filter]`  | `<button>`         | `portfolio.js`        | Botón de filtro de categoría (`all`, `web-cloud`, `mobile`, `ai-data`). |
| `[data-portfolio-item]`    | `<article>`        | `portfolio.js`        | Tarjeta de proyecto con categoría asociada.                             |
| `[data-contact-form]`      | `<form>`           | `form-validation.js`  | Formulario interactivo con validación en tiempo real.                   |
| `[data-error-for]`         | `<p role="alert">` | `form-validation.js`  | Contenedor del mensaje de error accesible (`aria-describedby`).         |
| `[data-form-status]`       | `<div>`            | `form-validation.js`  | Región `aria-live="polite"` para anuncios de estado.                    |
| `[data-form-success-card]` | `<div>`            | `form-validation.js`  | Tarjeta de confirmación revelada tras el envío exitoso.                 |
| `[data-form-new-message]`  | `<button>`         | `form-validation.js`  | Botón para reiniciar el formulario y enviar otra consulta.              |
| `[data-animate]`           | `<any>`            | `animations.js`       | Elemento observado para animación suave con `IntersectionObserver`.     |

### 2.2. Clases de Estado Visual (`.is-*`)

| Clase               | Asignada Por | Consumida Por    | Significado Semántico                                                           |
| :------------------ | :----------- | :--------------- | :------------------------------------------------------------------------------ |
| `.is-active`        | JS           | `components.css` | Elemento activo (slide visible, botón de filtro actual, link de página activa). |
| `.is-open`          | JS           | `layout.css`     | Menú de navegación móvil desplegado.                                            |
| `.is-scrolled`      | JS           | `components.css` | Header fijo con elevación y glassmorphism tras scroll > 20px.                   |
| `.is-invalid`       | JS           | `components.css` | Campo de formulario con error de validación.                                    |
| `.is-valid`         | JS           | `components.css` | Campo de formulario con valor correcto.                                         |
| `.is-loading`       | JS           | `components.css` | Botón ejecutando una operación asíncrona simulada.                              |
| `.is-hidden`        | JS           | `base.css`       | Elemento ocultado del flujo (`display: none !important`).                       |
| `.is-filtered-in`   | JS           | `components.css` | Tarjeta de proyecto revelada con animación fluida al filtrar.                   |
| `.is-page-entering` | JS           | `animations.css` | Contenido principal ingresando suavemente al cargar.                            |
| `.is-page-leaving`  | JS           | `animations.css` | Contenido principal desvaneciéndose antes de transicionar.                      |

---

## 3. Criterios de Aceptación por Sección (Escenarios Gherkin)

### 3.1. Sección 1: Home (`index.html`)

- **Escenario: Rotación Automática y Barra de Carga**
  - **Dado** que el usuario ingresa a la página Home,
  - **Entonces** el Hero Carrusel inicia con una barra de progreso que se completa en **7.5 segundos (`7500ms`)**, cambiando automáticamente al siguiente slide.
- **Escenario: Pausa Accesible por Hover o Foco (WCAG 2.1 AA)**
  - **Dado** que el carrusel está en reproducción automática,
  - **Cuando** el usuario posa el cursor sobre el carrusel o navega con `Tab` enfocando un control interno,
  - **Entonces** la animación de la barra y la transición automática deben pausarse indefinidamente hasta que el cursor o foco se retiren.
- **Escenario: Navegación por Teclado**
  - **Dado** que el usuario enfoca los controles del carrusel,
  - **Cuando** presiona `ArrowRight` o `ArrowLeft`,
  - **Entonces** debe avanzar o retroceder de diapositiva actualizando `aria-hidden` en tiempo real.
- **Escenario: Tiras de Resumen**
  - **Dado** el scroll por el documento Home,
  - **Entonces** deben presentarse en orden: Tira 1 (Resumen de 3 Servicios Tech), Tira 2 (Resumen de 5 Casos de Éxito) y Tira 3 (Resumen de Quiénes Somos / Cultura).

### 3.2. Sección 2: El Equipo (`equipo.html`)

- **Escenario: Fichas Profesionales de Líderes Tech**
  - **Dado** el acceso a `equipo.html`,
  - **Entonces** deben mostrarse mínimo 3 perfiles técnicos de alto rango (CTO, Lead Mobile, Lead AI) con fotografía optimizada, nombre, rol, biografía, stack tecnológico y enlaces funcionales a GitHub y LinkedIn.

### 3.3. Sección 3: Servicios (`servicios.html`)

- **Escenario: Catálogo de Software y Enlace con Pre-selección**
  - **Dado** el catálogo detallado de servicios (Web & Cloud SaaS, Mobile Apps, IA & Data),
  - **Cuando** el usuario pulsa un botón de cotización (ej. _"Solicitar Presupuesto Web & Cloud"_),
  - **Entonces** debe navegar a `contacto.html?service=web-cloud`, donde el formulario pre-seleccionará automáticamente dicha área tecnológica.

### 3.4. Sección 4: Trabajos & Clientes (`trabajos.html`)

- **Escenario: Filtrado por Especialidad con Event Delegation**
  - **Dado** que el usuario interactúa con la barra `[data-portfolio-filters]`,
  - **Cuando** hace clic en _"Apps Móviles"_ (`[data-portfolio-filter="mobile"]`),
  - **Entonces** el botón seleccionado recibe `.is-active`, las tarjetas no coincidentes reciben `.is-hidden` y las tarjetas de categoría móvil reciben `.is-filtered-in`.
- **Escenario: Filtro Universal "Todos"**
  - **Cuando** el usuario pulsa _"Todos"_ (`[data-portfolio-filter="all"]`),
  - **Entonces** todas las 5 tarjetas de proyectos deben removerse la clase `.is-hidden` y exhibirse en el grid.

### 3.5. Sección 5: Contacto (`contacto.html`)

- **Escenario: Integración de Hub y Canales Oficiales**
  - **Dado** el acceso a `contacto.html`,
  - **Entonces** deben exhibirse la dirección física corporativa, mapa interactivo (iframe con `loading="lazy"`), teléfonos directos, correos de ingeniería y canales de redes oficiales (GitHub, LinkedIn, Twitter/X).
- **Escenario: Validación en Tiempo Real y Envío Simulado**
  - **Dado** el formulario `[data-contact-form]`,
  - **Cuando** un campo obligatorio pierde el foco estando vacío o con formato inválido,
  - **Entonces** el campo recibe `.is-invalid`, `aria-invalid="true"` y el mensaje de error se publica en el contenedor con `role="alert"`.
  - **Cuando** todos los campos son válidos y se envía el formulario,
  - **Entonces** el botón muestra spinner `.is-loading`, se simula un envío asíncrono, el formulario se oculta suavemente y se revela con foco accesible la tarjeta de confirmación exitosa (`[data-form-success-card]`).
