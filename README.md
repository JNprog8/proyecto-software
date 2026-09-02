# Next Corp — Portal Web Corporativo (Desarrollo de Software)

Portal web corporativo de alto rendimiento desarrollado con **HTML5, CSS3 y JavaScript Vanilla**, diseñado según las especificaciones del **Sprint 1** ("Desarrollo de un portal Web").

**Next Corp** es una empresa de ingeniería especializada en tres divisiones clave de **Desarrollo de Software**:

1. **Desarrollo Web & Plataformas Cloud SaaS:** Aplicaciones a medida, microservicios, cloud-native y dashboards corporativos.
2. **Aplicaciones Móviles & Multiplataforma:** Soluciones nativas e híbridas para iOS y Android de alta concurrencia.
3. **Inteligencia Artificial, RAG & Data Engineering:** Integración de modelos LLM, agentes autónomos y analítica en tiempo real.

El proyecto está diseñado bajo el rol de **Desarrollador Frontend de páginas web** y metodología **Spec-Driven Development (SDD)**, priorizando:

- mantenibilidad y modularidad;
- extensibilidad y bajo acoplamiento;
- portabilidad (ejecutable como sitio estático sin dependencias de compilación);
- accesibilidad web (WCAG 2.1 AA);
- responsive design (mobile-first);
- rendimiento y Core Web Vitals;
- excelencia estética basada en referencias visuales contemporáneas.

---

## Estructura del Portal (5 Secciones)

```text
1. Home (Inicio)
   ├── Hero con Carrusel interactivo ("Quiénes somos y lo que hacemos en Software")
   ├── Tira 1: Resumen de Servicios Tech (Web/Cloud, Mobile, AI/Data)
   ├── Tira 2: Resumen de Trabajos / Proyectos (5 casos de éxito)
   └── Tira 3: Resumen de Quiénes Somos (Cultura de ingeniería Next Corp)

2. El Equipo
   ├── Descripción institucional y valores de ingeniería de Next Corp
   └── Perfiles profesionales detallados (mínimo 3 integrantes: CTO, Lead Mobile, Lead AI con foto, rol y redes)

3. Servicios
   └── Detalle completo de servicios de software (Web & Cloud, Mobile Apps, IA & Data)

4. Trabajos / Clientes
   ├── Showcase de proyectos realizados (mínimo 5 trabajos de software destacados)
   └── Panel de clientes y marcas asociadas

5. Contacto
   ├── Ubicación física con mapa integrado
   ├── Redes sociales oficiales (GitHub, LinkedIn, Twitter/X)
   ├── Contacto directo (email corporativo y teléfono)
   └── Formulario de contacto interactivo y validado
```

---

## Stack Tecnológico

- **HTML5 Semántico:** Estructura limpia y accesible.
- **CSS3 Moderno:** Design Tokens con CSS Custom Properties, Flexbox, CSS Grid de 12 columnas y animaciones nativas.
- **JavaScript Vanilla (ES Modules):** Módulos nativos (`type="module"`), APIs estándar del navegador (`IntersectionObserver`, `FormData`).

---

## Ecosistema de Diseño y Referencias Frontend

- **Sistemas de Diseño y Layout:** [Material Design 3 (M3)](https://m3.material.io/) y [Bootstrap](https://getbootstrap.com/).
- **Inspiración y Benchmarking:** [Awwwards](https://www.awwwards.com/) y [Dribbble](https://dribbble.com/).
- **Colorimetría:** [Coolors](https://coolors.co/).
- **Animaciones y Curvas:** [Animista](https://animista.net/), [GreenSock (GSAP)](https://greensock.com/), [Cubic-bezier.com](https://cubic-bezier.com/) y [LottieFiles](https://lottiefiles.com/).
- **Iconografía y Vectores:** [Lucide Icons](https://lucide.dev/), [Heroicons](https://heroicons.com/) y [SVG Repo](https://www.svgrepo.com/).
- **Estándares:** WHATWG, W3C, MDN y W3Schools.

---

## Estructura del Repositorio

```text
.
├── AGENTS.md               # Reglas operativas para agentes de IA
├── GEMINI.md               # Directrices y contexto para Gemini
├── README.md               # Este documento
│
├── docs/                   # Documentación técnica
│   ├── architecture.md     # Arquitectura de componentes y módulos
│   ├── design-system.md    # Design Tokens, elevación y guías visuales
│   ├── patterns.md         # Patrones UX/UI y modelo narrativo
│   └── standards.md        # Estándares de codificación y accesibilidad
│
└── src/
    ├── index.html          # Estructura del portal
    ├── css/                # Estilos modulares
    ├── js/                 # Módulos JavaScript Vanilla
    └── assets/             # Imágenes, iconos SVG y animaciones
```

---

## Documentación para Agentes

Los agentes de IA que colaboren en el proyecto deben consultar prioritariamente:

```text
AGENTS.md
GEMINI.md
```

y profundizar en la carpeta [`docs/`](docs/) según el alcance de la tarea.
