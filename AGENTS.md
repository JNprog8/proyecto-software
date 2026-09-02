# AGENTS.md

## Propósito y Rol

Este archivo define las reglas operativas y metodológicas para agentes de IA que trabajen en este repositorio asumiendo el rol de **Desarrollador Frontend de páginas web**.

El objetivo es desarrollar, optimizar y mantener el portal web corporativo de **Next Corp** cumpliendo con las especificaciones del **Sprint 1** ("Desarrollo de un portal Web" para una empresa dedicada al **Desarrollo de Software** de vanguardia: *Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial*).

El código producido debe ser:

- mantenible y modular;
- extensible;
- portable (ejecutable en cualquier navegador sin compilación obligatoria);
- accesible (cumpliendo pautas WCAG 2.1 AA);
- responsive (mobile-first);
- performante y optimizado;
- visualmente atractivo, profesional y de estándar internacional;
- verificable visual y funcionalmente.

---

## 1. Contexto del Negocio y Secciones del Portal (Sprint 1)

**Next Corp** opera en tres divisiones clave de la ingeniería de software:
1. **Desarrollo Web & Plataformas Cloud SaaS**: Aplicaciones a medida, microservicios, cloud-native y dashboards corporativos.
2. **Aplicaciones Móviles & Multiplataforma**: Soluciones nativas e híbridas de alta concurrencia para iOS y Android.
3. **Inteligencia Artificial, RAG & Data Engineering**: Integración de modelos LLM, agentes autónomos y analítica en tiempo real.

### Estructura de Secciones Requeridas

```text
1. Home (Página Principal)
   ├── Hero / Banner con Imagen destacada o Carrusel ("Quiénes somos y lo que hacemos en Software")
   ├── Tira 1: Resumen de Servicios Tech (Web & Cloud, Mobile, AI & Data)
   ├── Tira 2: Resumen de Trabajos / Proyectos (5 casos de éxito de software)
   └── Tira 3: Resumen de Quiénes Somos (Cultura de ingeniería de Next Corp)

2. El Equipo
   ├── Descripción completa y valores de ingeniería de Next Corp
   └── Fichas de integrantes del equipo tech (mínimo 3 integrantes: CTO, Lead Mobile, Lead AI con foto, rol, biografía y enlaces)

3. Servicios
   └── Descripción completa y detallada de los servicios (mínimo 3: Web & Cloud, Mobile Apps, IA & Data)

4. Trabajos / Clientes
   ├── Showcase de trabajos y proyectos realizados (mínimo 5 proyectos de software con detalle visual y técnico)
   └── Grid / nube de clientes y marcas tech de confianza

5. Contacto
   ├── Ubicación física del hub tecnológico con mapa integrado
   ├── Redes sociales oficiales (GitHub, LinkedIn, Twitter/X)
   ├── Contacto personal directo: correo electrónico corporativo y teléfono
   └── Formulario de contacto interactivo y validado para cotizaciones de software
```

---

## 2. Reglas Prioritarias para el Desarrollador Frontend

Antes de modificar código:

1. Inspecciona la estructura existente.
2. Lee `GEMINI.md` y este archivo (`AGENTS.md`).
3. Consulta la documentación relevante en `docs/`.
4. Comprende los requerimientos funcionales y de diseño.
5. Identifica el menor conjunto de cambios necesario y modular.
6. Implementa incrementalmente.
7. Ejecuta las verificaciones visuales y de interacción.
8. Actualiza la documentación cuando el cambio sea significativo.

No introduzcas complejidad innecesaria ni dependencias pesadas de runtime sin justificación técnica.

---

## 3. Stack Tecnológico

El sitio se ejecuta en el navegador mediante tecnologías web estándares:

- **HTML5**: Estructura semántica, accesibilidad nativa y SEO.
- **CSS3**: Variables CSS (Design Tokens), Grid, Flexbox, media queries y animaciones nativas.
- **JavaScript Vanilla**: Módulos nativos (`type="module"`), APIs estándar del navegador (`IntersectionObserver`, `FormData`, etc.).

---

## 4. Fuentes de Referencia y Ecosistema de Diseño Frontend

El Desarrollador Frontend debe utilizar como referencia e inspiración las siguientes plataformas especializadas:

### 4.1. Sistemas de Diseño, Layout e Inspiración Visual
- **[Material Design 3 (M3)](https://m3.material.io/)**: Tokens de diseño, elevación de capas, paletas dinámicas, estados interactivos (`hover`, `focus`, `pressed`) y componentes.
- **[Bootstrap](https://getbootstrap.com/)**: Patrones de grid responsivo (12 columnas), contenedores, flexbox utilities y breakpoints estándar (`sm`, `md`, `lg`, `xl`, `xxl`).
- **[Awwwards](https://www.awwwards.com/)**: Inspiración estética de clase mundial, diseño editorial interactivo y micro-interacciones.
- **[Dribbble](https://dribbble.com/)**: Referencias visuales contemporáneas para portales corporativos, agencias creativas y exhibición de proyectos.

### 4.2. Color y Tipografía
- **[Coolors](https://coolors.co/)**: Paletas cromáticas profesionales y verificación de ratios de contraste WCAG accesibles.

### 4.3. Animación, Motion y Curvas
- **[Animista](https://animista.net/)**: Colección de micro-animaciones CSS y keyframes listos para aplicar.
- **[GreenSock (GSAP)](https://greensock.com/)**: Referencia para animaciones coordinadas, secuencias fluidas y scroll interactivo.
- **[Cubic-bezier.com](https://cubic-bezier.com/)**: Definición y ajuste de curvas de aceleración y timing functions para transiciones suaves y naturales.
- **[LottieFiles](https://lottiefiles.com/)**: Animaciones vectoriales ligeras para enriquecer estados visuales, loaders y feedback interactivo.

### 4.4. Iconografía y Recursos Vectoriales
- **[Lucide Icons](https://lucide.dev/)**: Set de iconos SVG modernos, limpios y consistentes.
- **[Heroicons](https://heroicons.com/)**: Iconografía de alta calidad en estilos outline y solid.
- **[SVG Repo](https://www.svgrepo.com/)**: Repositorio de vectores e ilustraciones libres en formato SVG optimizado.

### 4.5. Estándares y Documentación Web
- **WHATWG / W3C** y **MDN Web Docs** como fuentes canónicas de especificaciones.
- **W3Schools** como referencia práctica y pedagógica.

---

## 5. Directrices de HTML

- Utilizar etiquetas semánticas con significado estructural: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<figure>`, `<figcaption>`, `<footer>`, `<form>`, `<button>`, `<a>`.
- Emplear `<a>` exclusivamente para navegación y `<button>` para acciones interactivas.
- Mantener una jerarquía estricta de encabezados (`h1` único por página, seguido de `h2`, `h3`, etc.).
- Proporcionar atributos `alt` descriptivos en imágenes informativas y `alt=""` en decorativas.
- Priorizar controles nativos de formulario con etiquetas asociadas mediante `<label for="...">`.
- Documento válido y estructurado (`<!doctype html>`, `<html lang="es">`).

---

## 6. Directrices de CSS

- Centralizar el sistema de diseño en Custom Properties dentro de `src/css/variables.css`.
- Enfoque **Mobile-First**: estilos base para mobile y media queries progresivas (`min-width`).
- Utilizar **CSS Grid** para estructuras bidimensionales (secciones, grids de servicios y proyectos) y **Flexbox** para componentes y alineaciones unidimensionales.
- Utilizar `clamp()` para tipografía fluida y espaciados responsivos cuando mejore la experiencia.
- Mantener especificidad baja con selectores simples basados en clases; evitar `!important` e IDs para estilos.
- Curvas de transición calculadas mediante `cubic-bezier()` y animaciones respetuosas con `@media (prefers-reduced-motion: reduce)`.

---

## 7. Directrices de JavaScript

- Estructurar el código en **ES Modules** (`import` / `export`).
- Mantener `src/js/main.js` como punto central de inicialización y composición.
- Utilizar `const` y `let`, evitando variables globales.
- Conectar markup y comportamiento mediante atributos `data-*` (ejemplo: `data-carousel-next`, `data-nav-toggle`).
- Utilizar `addEventListener` y APIs nativas como `IntersectionObserver` para lazy loading y animaciones al hacer scroll.
- Validación de formularios del lado del cliente con feedback visual y accesible en tiempo real.

---

## 8. Arquitectura

La arquitectura mantiene una clara separación de responsabilidades:

```text
HTML → Estructura, contenido y semántica
CSS  → Presentación, diseño visual, responsive y animaciones
JS   → Comportamiento modular e interactividad
Docs → Conocimiento, decisiones de diseño y arquitectura
```

---

## 9. Accesibilidad (a11y)

- Navegación completa mediante teclado (Tab, Shift+Tab, Enter, Space, Escape).
- Indicadores de foco visibles y con buen contraste (`:focus-visible`).
- Contraste cromático validado según WCAG 2.1 AA (mínimo 4.5:1 para texto normal y 3:1 para texto grande/componentes).
- Iconos decorativos con `aria-hidden="true"` e interactivos con `aria-label` o texto alternativo visible.

---

## 10. Documentación

Toda la documentación técnica producida debe redactarse en **español**.
Mantener actualizados los archivos de `docs/` (`architecture.md`, `design-system.md`, `patterns.md`, `standards.md`) ante cualquier cambio de diseño, arquitectura o componentes.
