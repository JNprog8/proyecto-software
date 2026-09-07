# Next Corp — Portal Web Corporativo

**Next Corp** es una empresa de ingeniería especializada en tres divisiones clave del **Desarrollo de Software**:

1. **Desarrollo Web & Plataformas Cloud SaaS:** Aplicaciones a medida, microservicios, cloud-native y dashboards corporativos.
2. **Aplicaciones Móviles & Multiplataforma:** Soluciones nativas e híbridas para iOS y Android de alta concurrencia.
3. **Inteligencia Artificial, RAG & Data Engineering:** Integración de modelos LLM, agentes autónomos y analítica en tiempo real.

---

## Estructura del Portal (5 Secciones)

```text
1. Home (Inicio)
   ├── Hero con Carrusel interactivo
   ├── Tira 1: Resumen de Servicios Tech
   ├── Tira 2: Resumen de Trabajos / Proyectos
   └── Tira 3: Resumen de Quiénes Somos

2. El Equipo
   ├── Descripción institucional y valores de ingeniería de Next Corp
   └── Perfiles profesionales detallados

3. Servicios
   └── Detalle completo de servicios de software

4. Trabajos / Clientes
   ├── Showcase de proyectos realizados
   └── Panel de clientes y marcas asociadas

5. Contacto
   ├── Ubicación física con mapa integrado
   ├── Redes sociales oficiales
   ├── Contacto directo
   └── Formulario de contacto interactivo y validado
```

---

## Stack Tecnológico

- **HTML5**, **CSS3** y **JavaScript**.

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
├── AGENTS.md               # Reglas operativas para agentes de desarrollo frontend
├── GEMINI.md               # Directrices, contexto y estándares para Gemini
├── README.md               # Este documento
│
├── .agents/                # Configuración de habilidades y reglas para IA
│   ├── rules/              # engineering-rules.md
│   └── skills/             # Skills operativas
│
├── docs/                   # Manuales de ingeniería canónicos
│   ├── architecture.md     # Arquitectura general, modelo de datos y flujo
│   ├── design-system.md    # Tokens de diseño, colorimetría y patrones UI
│   ├── javascript.md       # Arquitectura ES Modules y guía de eventos W3C
│   └── standards.md        # Estándares de calidad
│
├── specs/                  # Spec-Driven Development
│   └── sprint-1.md         # Especificación técnica y contratos de UI
│
└── src/                    # Código fuente
    ├── index.html          # Sección 1: Home (Hero Carrusel y Tiras de Resumen)
    ├── equipo.html         # Sección 2: El Equipo Tech (Valores y Perfiles)
    ├── servicios.html      # Sección 3: Servicios de Software (Web, Mobile, IA)
    ├── trabajos.html       # Sección 4: Trabajos y Clientes (Portafolio interactivo)
    ├── contacto.html       # Sección 5: Contacto (Mapa, Redes y Formulario validado)
    ├── css/                # Estilos modulares (variables, base, layout, components, animations)
    ├── js/                 # ES Modules (carousel, navigation, portfolio, form-validation, etc.)
    └── assets/             # Imágenes web optimizadas e iconografía SVG nativa
```

---

## Documentación para Agentes y Desarrolladores

Los desarrolladores y agentes de IA que colaboren en el proyecto deben consultar prioritariamente:

```text
AGENTS.md
GEMINI.md
specs/sprint.md
```

y los manuales temáticos en [`docs/`](docs/) según el alcance de la tarea.
