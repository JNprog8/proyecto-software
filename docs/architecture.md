# Arquitectura del Sistema y Flujo de Datos

## 1. Visión General y Principios de Ingeniería

Este documento define la arquitectura técnica, la separación de responsabilidades y el flujo de datos del portal web corporativo de **Next Corp** para el **Sprint**, bajo el rol de **Desarrollador Frontend de páginas web**.

Next Corp es una compañía líder en **Desarrollo de Software**, estructurada en tres divisiones clave:

1. **Desarrollo Web & Plataformas Cloud SaaS:** Microservicios, arquitecturas cloud-native y observabilidad distribuida.
2. **Aplicaciones Móviles & Multiplataforma:** Soluciones nativas e híbridas de alta concurrencia para iOS y Android.
3. **Inteligencia Artificial, RAG & Data Engineering:** Agentes autónomos, embeddings semánticos y analítica en tiempo real.

### Principios Arquitectónicos Fundamentales

- **100% Vanilla Stack:** Construido exclusivamente con HTML5 semántico, CSS3 moderno y JavaScript Vanilla ES Modules, ejecutable nativamente en cualquier navegador sin compiladores ni Node.js.
- **Separación Limpia de Responsabilidades (SoC):**
  - **HTML5:** Semántica, contenido, landmarks accesibles y jerarquía estricta.
  - **CSS3:** Presentación visual, tokens de diseño (M3), grid responsivo y micro-animaciones.
  - **JavaScript ES Modules:** Comportamiento, interactividad accesible (W3C), validaciones y transiciones.
- **Arquitectura Multipágina (MPA) con Transiciones Fluidas:** Cinco páginas HTML independientes ([`index.html`](../src/index.html), [`equipo.html`](../src/equipo.html), [`servicios.html`](../src/servicios.html), [`trabajos.html`](../src/trabajos.html), [`contacto.html`](../src/contacto.html)) con barra de carga superior y retención del header fijo.
- **Flujo Unidireccional de Datos:** Los catálogos de servicios, proyectos y equipo fluyen desde modelos estáticos hacia la vista, y los eventos del usuario fluyen hacia los controladores modulares.

---

## 2. Separación de Responsabilidades y Capas

```text
┌────────────────────────────────────────────────────────────────────────┐
│                                HTML5                                   │
│  - Estructura semántica multipágina (header, nav, main, section, etc.) │
│  - Landmarks accesibles y jerarquía única de encabezados (h1 -> h2)    │
│  - Selectores de comportamiento declarativos (data-*)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                                CSS3                                    │
│  - Design Tokens y Custom Properties (variables.css)                   │
│  - Layout responsivo con CSS Grid de 12 columnas y Flexbox (layout.css)│
│  - Anatomía de componentes, elevación M3 y estados .is-*               │
│  - Keyframes y curvas cubic-bezier fluidas (animations.css)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         JavaScript Vanilla ES                          │
│  - Punto de entrada unificado (main.js)                                │
│  - Módulos desacoplados: carousel, navigation, portfolio, validation   │
│  - Utilidades puras: dom.js (Event Delegation), validators.js          │
│  - Manejo de ciclo de vida del formulario y transiciones de página     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Directorios del Repositorio

```text
.
├── README.md               # Presentación general del portal
├── AGENTS.md               # Reglas y metodología para agentes frontend
├── GEMINI.md               # Directrices operativas de Gemini
│
├── docs/                   # Documentación técnica canónica
│   ├── architecture.md     # Arquitectura general y flujo de datos (este documento)
│   ├── design-system.md    # Tokens de diseño (M3), color, tipografía y patrones UI
│   ├── javascript.md       # Arquitectura ES Modules y guía de eventos W3C
│   └── standards.md        # Estándares de calidad, WCAG 2.1 AA y buenas prácticas
│
├── specs/                  # Spec-Driven Development (SDD)
│   └── sprint.md         # Especificación ejecutable y contratos de interfaz
│
├── .agents/                # Configuración de gobernanza para IA
│   ├── rules/              # Reglas de ingeniería (Stack, SDD, WCAG, CWV)
│   └── skills/             # Skills operativas (javascript-dom-events, sdd-verification)
│
└── src/                    # Código fuente ejecutable
    ├── index.html          # Página 1: Home (Hero Carrusel y Tiras de Resumen)
    ├── equipo.html         # Página 2: El Equipo (Visión y Fichas de Líderes)
    ├── servicios.html      # Página 3: Servicios (Web & Cloud, Mobile, IA)
    ├── trabajos.html       # Página 4: Trabajos y Clientes (Portafolio interactivo)
    ├── contacto.html       # Página 5: Contacto (Mapa, Redes y Formulario validado)
    ├── css/                # Hojas de estilo modular
    │   ├── variables.css   # Tokens de diseño, paleta armónica y elevación
    │   ├── base.css        # Reseteo moderno, utilidades (.is-hidden, .sr-only)
    │   ├── layout.css      # Sistema de Grid de 12 columnas y contenedores
    │   ├── components.css  # Anatomía de botones, tarjetas, carrusel y formulario
    │   └── animations.css  # Keyframes, transiciones y @media (prefers-reduced-motion)
    ├── js/                 # JavaScript Vanilla ES Modules
    │   ├── main.js         # Orquestador y punto de entrada DOMContentLoaded
    │   ├── modules/        # Módulos especializados (carousel, navigation, portfolio, etc.)
    │   └── utils/          # Utilidades puras (dom.js con Event Delegation, validators.js)
    └── assets/             # Recursos estáticos
        ├── img/            # Imágenes optimizadas (hero, portfolio, team, clients)
        └── icons/          # Iconografía SVG nativa consistente (Lucide Icons)
```

---

## 4. Flujo de Información y Ciclo de Vida

### 4.1. Flujo de Navegación y Transición de Páginas

```text
[ Clic en <a href="*.html"> ]
         │
         ▼
[ Interceptor en page-transitions.js ]
         │
         ├─► Activa .page-progress-bar.is-active (Barra superior fluida)
         ├─► Aplica .is-page-leaving en <main> (Fade-out 220ms)
         └─► Mantiene el <header> fijo e inmune a parpadeos
         │
         ▼
[ Carga de la nueva página HTML ]
         │
         ├─► page-transitions.js aplica .is-page-entering en <main>
         ├─► Remueve la barra de progreso
         └─► main.js inicializa los módulos según los elementos presentes en el DOM
```

### 4.2. Flujo del Formulario de Cotización y Contacto

```text
[ Usuario completa campos en contacto.html ]
         │
         ▼
[ Eventos 'blur' e 'input' en tiempo real ]
         │
         ├─► Ejecuta funciones puras de validators.js (isValidEmail, isValidPhone, etc.)
         ├─► Sincroniza clases (.is-invalid / .is-valid)
         └─► Actualiza atributos accesibles (aria-invalid, aria-describedby)
         │
         ▼
[ Evento 'submit' interceptado con event.preventDefault() ]
         │
         ├─► Valida todos los campos en bloque
         ├─► Si hay error: enfoca el primer campo inválido y muestra alerta
         └─► Si es válido:
                 ├─► Deshabilita el botón y agrega spinner .is-loading
                 ├─► Simula envío asíncrono (1200ms)
                 ├─► Oculta el formulario con animación suave
                 ├─► Revela la tarjeta de éxito [data-form-success-card]
                 └─► Enfoca la tarjeta de confirmación accesible (WCAG 2.1 AA)
```

---

## 5. Modelos de Datos del Dominio

Aunque el sitio es estático, los datos están estructurados conceptualmente bajo esquemas consistentes:

### 5.1. Catálogo de Servicios (`ServiceItem`)

```javascript
{
  id: "web-cloud", // "web-cloud" | "mobile" | "ai-data"
  title: "Desarrollo Web & Plataformas Cloud SaaS",
  category: "Cloud Engineering",
  features: ["Microservicios Serverless", "Arquitecturas Cloud Nativa", "Observabilidad"],
  ctaText: "Solicitar Presupuesto Web & Cloud",
  ctaLink: "contacto.html?service=web-cloud"
}
```

### 5.2. Líderes del Equipo (`TeamMember`)

```javascript
{
  id: "lead-cloud",
  name: "Dr. Emmett Brown",
  role: "Chief Technology Officer & Cloud Architect",
  bio: "Especialista en arquitecturas distribuidas de alta concurrencia y resiliencia en la nube.",
  skills: ["Kubernetes", "Go", "AWS/GCP", "Microservicios"],
  social: { github: "https://github.com", linkedin: "https://linkedin.com" }
}
```

### 5.3. Casos de Éxito de Software (`ProjectItem`)

```javascript
{
  id: "cloudscale",
  title: "CloudScale Analytics",
  category: "web-cloud", // Coincide con data-portfolio-item
  client: "DataFlow Inc",
  summary: "Plataforma SaaS para observabilidad de clústeres Kubernetes con alertas en tiempo real.",
  techStack: ["Kubernetes", "WebSockets", "Go", "Serverless"]
}
```

### 5.4. Carga Útil del Formulario (`ContactPayload`)

```javascript
{
  name: "Jane Doe",                // Mínimo 3 caracteres alfabéticos
  email: "jane.doe@enterprise.com",// Formato corporativo válido
  phone: "+541148901234",          // Opcional, 7 a 15 dígitos
  service: "web-cloud",            // "web-cloud" | "mobile" | "ai-data" | "consulting"
  message: "Requerimos consultoría para migración de microservicios...",
  timestamp: "2026-09-07T14:00:00Z"
}
```
