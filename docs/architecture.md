# Arquitectura del Portal Web

## 1. Objetivo y Rol

Este documento establece la arquitectura técnica y modular para el **Desarrollador Frontend de páginas web** a cargo de la construcción y evolución del portal corporativo de **Next Corp**, empresa especializada de vanguardia en **Desarrollo de Software** (*Desarrollo Web & Plataformas Cloud*, *Aplicaciones Móviles & Multiplataforma* e *Inteligencia Artificial, RAG & Data Engineering*), conforme a los requerimientos del **Sprint 1**.

La arquitectura persigue los siguientes principios:

- **Modularidad:** Separación limpia de responsabilidades en HTML semántico, CSS organizado y JavaScript ES Modules.
- **Portabilidad:** Ejecución 100% nativa en el navegador mediante estándares web modernos, sin requerir compiladores pesados para su visualización.
- **Rendimiento:** Carga ultra rápida, optimización de recursos multimedia e interactividad fluida.
- **Accesibilidad y Responsive:** Cumplimiento de WCAG 2.1 AA y diseño adaptable desde dispositivos móviles hasta pantallas de alta resolución.

---

## 2. Separación de Responsabilidades

```text
┌─────────────────────────────────────────────────────────────┐
│                           HTML5                             │
│  - Estructura semántica del portal corporativo              │
│  - Jerarquía de encabezados (h1, h2, h3)                    │
│  - Accesibilidad nativa (landmarks, labels, aria attributes)│
└──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                           CSS3                              │
│  - Sistema de tokens y variables (Design Tokens)            │
│  - Layout responsivo con CSS Grid y Flexbox                 │
│  - Elevación y estados inspirados en Material Design 3 (M3) │
│  - Curvas de aceleración naturales (Cubic-bezier.com)        │
│  - Micro-animaciones y keyframes (Animista.net)              │
└──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     JavaScript Vanilla                      │
│  - Módulos ES nativos (import/export)                       │
│  - Control del carrusel / slider interactivo                │
│  - Menú de navegación responsive y smooth scroll            │
│  - Validación accesible de formulario de contacto           │
│  - Orquestación de animaciones e IntersectionObserver       │
└──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Verificación y Calidad                      │
│  - Auditorías de accesibilidad y contraste                  │
│  - Pruebas de interacción mediante teclado                  │
│  - Validación multidispositivo y pruebas de rendimiento     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Directorios del Proyecto

```text
.
├── AGENTS.md               # Reglas operativas para agentes de IA
├── GEMINI.md               # Contexto y directrices para el modelo Gemini
├── README.md               # Documentación general del repositorio
│
├── docs/                   # Documentación técnica de arquitectura y diseño (SDD)
│   ├── ROLE_FRONTEND.md    # Arnés de rol y guardrails para el Desarrollador Frontend
│   ├── architecture.md     # Este documento (arquitectura técnica general)
│   ├── js-architecture.md  # Arquitectura JavaScript y modularidad nativa
│   ├── ui-integration.md   # Contratos de integración DOM / CSS / JS y a11y
│   ├── data-flow.md        # Gestión de estado, esquemas de datos y Event Bus
│   ├── design-system.md    # Sistema de diseño, tokens y componentes
│   ├── patterns.md         # Patrones UX/UI del portal y narrativa
│   └── standards.md        # Estándares de codificación y accesibilidad
│
└── src/
    ├── index.html             # Home: Hero Carrusel (7.5s + Motion Blur) + 3 Tiras Tech
    ├── equipo.html            # El Equipo: Cultura de ingeniería y fichas de 3 líderes tech
    ├── servicios.html         # Servicios: Detalle de Web & Cloud, Mobile Apps e IA & Data
    ├── trabajos.html          # Trabajos & Clientes: Showcase de 5 proyectos y filtros tech
    ├── contacto.html          # Contacto: Formulario POST/Action con reset y ocultamiento, mapa
    │
    ├── css/
    │   ├── variables.css      # Paleta UX/UI (#28536B, #C2948A, #7EA8BE, #F6F0ED, #BBB193)
    │   ├── base.css           # Reset, tipografía global, estilos base y accesibilidad
    │   ├── layout.css         # Grid de 12 columnas inspirado en Bootstrap, contenedores y tiras
    │   ├── components.css     # Componentes visuales (carrusel, cards, forms, botones, badges)
    │   └── animations.css     # Motion Blur, Curtain Page Transitions y scroll reveal
    │
    ├── js/
    │   ├── main.js            # Punto de entrada e inicialización de módulos
    │   ├── modules/
    │   │   ├── page-transitions.js # Gestión de cortina fluida entre páginas (Curtain Transition)
    │   │   ├── navigation.js       # Menú móvil, sticky header y active page tracking
    │   │   ├── carousel.js         # Hero slider con temporizador 7.5s y motion blur
    │   │   ├── form-validation.js  # Validación POST, reset y ocultamiento animado
    │   │   ├── portfolio.js        # Filtros y showcase de 5 proyectos de software
    │   │   └── animations.js       # IntersectionObserver y micro-interacciones
    │   └── utils/
    │       ├── dom.js              # Helpers para manipulación segura del DOM
    │       └── validators.js       # Funciones puras de validación (email, teléfono, texto)
    │
    └── assets/
        ├── img/
        │   ├── hero/          # Imágenes tech para el carrusel de Home (Cloud, Mobile, AI)
        │   ├── team/          # Fotografías del equipo tech (mínimo 3 integrantes)
        │   ├── services/      # Gráficos de Desarrollo Web/Cloud, Mobile y AI/Data
        │   ├── portfolio/     # Mockups de proyectos de software (5 casos de éxito)
        │   └── clients/       # Logos vectoriales de empresas y clientes tech
        ├── icons/             # Iconografía SVG (Lucide, Heroicons, SVG Repo)
        └── lottie/            # Animaciones vectoriales ligeras (LottieFiles)
```

---

## 4. Arquitectura de las 5 Secciones del Portal (Sprint 1)

Conforme a las especificaciones del Sprint 1, el portal se divide en 5 secciones claramente delimitadas:

### 4.1. Home (Inicio)

- **Hero / Carrusel Principal:** Presentación visual de alto impacto que explica quién es Next Corp y su propuesta de valor en software mediante slides interactivos con controles accesibles (anterior, siguiente, indicadores):
  1. *Plataformas Cloud & Arquitectura Web Escalable.*
  2. *Aplicaciones Móviles & Experiencias Multiplataforma.*
  3. *Inteligencia Artificial, Modelos RAG & Agentes Autónomos.*
- **Tira 1 (Resumen de Servicios):** Vista sintetizada de las tres áreas tecnológicas de Next Corp con llamados a la acción.
- **Tira 2 (Resumen de Trabajos):** Muestra destacada de los proyectos de software más recientes con badges de especialidad.
- **Tira 3 (Resumen de Quiénes Somos):** Síntesis de la cultura de ingeniería de Next Corp, enfoque en calidad de código y enlace hacia la sección de Equipo.

### 4.2. El Equipo

- Descripción de la visión técnica, estándares de calidad y cultura ágil de Next Corp.
- Grid de perfiles profesionales tech (mínimo 3 integrantes):
  1. *Ing. Sofía Valenzuela* (CTO & Lead Cloud Architect).
  2. *Lic. Lucas Albarracín* (Lead Frontend & Mobile Engineer).
  3. *Dr. Mateo Rossi* (Lead AI & Systems Engineer).
- Cada integrante incluye foto optimizada, rol, bio técnica y accesos a GitHub, LinkedIn o email.

### 4.3. Servicios

- Descripción técnica profunda de cada una de las 3 áreas de especialidad en software:
  1. _Desarrollo Web & Plataformas Cloud SaaS:_ Microservicios, arquitecturas serverless, APIs de alto rendimiento y dashboards interactivos.
  2. _Aplicaciones Móviles & Multiplataforma:_ Soluciones nativas (iOS/Android) y cross-platform con rendimiento óptimo y offline-first.
  3. _Inteligencia Artificial, RAG & Data Engineering:_ Integración de LLMs, bases de datos vectoriales, agentes autónomos y pipelines de analítica.
- Cada servicio incluye propuesta de valor, stack tecnológico y botón de consulta directa.

### 4.4. Trabajos / Clientes

- **Showcase de Proyectos:** Presentación de mínimo 5 trabajos de software destacados con ficha técnica, cliente beneficiario, stack y métricas de impacto:
  1. *CloudScale Analytics* (Plataforma SaaS de observabilidad en tiempo real).
  2. *FinSecure Pay* (App móvil fintech y billetera digital de alta concurrencia).
  3. *Nexus AI Copilot* (Asistente inteligente empresarial con arquitectura RAG).
  4. *OmniCommerce Engine* (Motor de e-commerce distribuido de alta disponibilidad).
  5. *HealthPulse Telemed* (Plataforma integral de telemedicina con IA clínica).
- **Nube de Clientes:** Grid de marcas, startups y corporaciones tech de referencia (Social Proof).

### 4.5. Contacto

- **Información Directa:** Dirección física de oficinas tecnológicas, números telefónicos de atención y correos electrónicos corporativos.
- **Mapa de Ubicación:** Integración de mapa interactivo con la localización exacta.
- **Redes Sociales:** Canales oficiales (GitHub, LinkedIn, Twitter/X) con iconografía SVG accesible.
- **Formulario de Contacto:** Campos para nombre, correo electrónico, área de interés tecnológico y mensaje, con validación accesible y estados de envío.

---

## 5. Ecosistema de Referencia y Herramientas Frontend

El Desarrollador Frontend basa sus decisiones técnicas y estéticas en:

- **[Material Design 3 (M3)](https://m3.material.io/):** Anatomía de componentes, elevación de capas (`surface`, `surface-container`), tokens de color y micro-estados.
- **[Bootstrap](https://getbootstrap.com/):** Sistema de layout de 12 columnas y utilidades responsivas.
- **[Awwwards](https://www.awwwards.com/) y [Dribbble](https://dribbble.com/):** Inspiración de layouts contemporáneos, micro-interacciones y narrativa visual para agencias y empresas corporativas.
- **[Coolors](https://coolors.co/):** Armonía y contraste accesible de paletas cromáticas.
- **[Animista](https://animista.net/) y [Cubic-bezier.com](https://cubic-bezier.com/):** Keyframes CSS y curvas de aceleración suaves y naturales.
- **[GreenSock (GSAP)](https://greensock.com/) y [LottieFiles](https://lottiefiles.com/):** Animaciones fluidas, secuencias y gráficos vectoriales animados.
- **[Lucide Icons](https://lucide.dev/), [Heroicons](https://heroicons.com/) y [SVG Repo](https://www.svgrepo.com/):** Iconografía SVG moderna, ligera y completamente accesible.
