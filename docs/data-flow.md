# Gestión de Estado y Flujo de Datos (Data Flow Spec)

## 1. Objetivo y Rol

Este documento define la **especificación técnica para la gestión del estado, el flujo de datos y las comunicaciones asíncronas** del portal web corporativo multisectorial (**Desarrollo de Software**, **Arquitectura** y **Logística y Distribución de Paquetes**), en concordancia con el **Sprint 1** y la metodología **Spec-Driven Development (SDD)**.

Establece reglas claras e inequívocas para manipular datos y estados en **JavaScript Vanilla**, garantizando previsibilidad, robustez, persistencia controlada y buenas prácticas en peticiones asíncronas sin necesidad de dependencias externas.

---

## 2. Reglas de Gestión del Estado en la Aplicación

Para evitar la contaminación del ámbito global y mantener el desacoplamiento, la gestión de estado se clasifica en tres niveles:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ESTRATEGIA DE GESTIÓN DE ESTADO                        │
├─────────────────────────┬───────────────────────────────────────────────────┤
│ Tipo de Estado          │ Mecanismo de Almacenamiento & Regla               │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 1. Estado Local         │ Variables encapsuladas en el ámbito de cada       │
│    de Módulo            │ módulo (closure / factory instance).              │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 2. Estado de Sesión     │ sessionStorage (datos efímeros, progreso de       │
│    (Efímero)            │ formularios entre navegación de anclas).          │
├─────────────────────────┼───────────────────────────────────────────────────┤
│ 3. Estado Persistente   │ localStorage (preferencias de usuario como        │
│    (Preferencia)        │ movimiento reducido o último filtro seleccionado).│
└─────────────────────────┴───────────────────────────────────────────────────┘
```

### 2.1. Reglas Inquebrantables de Estado

- **PROHIBIDO** el uso de variables globales sueltas en `window` (ej.: `window.currentSlide = 1;`).
- **OBLIGATORIO** encapsular el estado dentro de cada módulo mediante objetos de estado controlados (`let state = { ... }`).
- **OBLIGATORIO** validar y tipificar las lecturas y escrituras en Web Storage mediante funciones utilitarias seguras con manejo de excepciones (`try / catch`).

```javascript
/**
 * Utilidad segura para interactuar con Web Storage
 */
export const storage = {
  get(key, storageType = "localStorage") {
    try {
      const item = window[storageType].getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn(`[Storage] No se pudo leer la clave: ${key}`, e);
      return null;
    }
  },
  set(key, value, storageType = "localStorage") {
    try {
      window[storageType].setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] No se pudo guardar la clave: ${key}`, e);
    }
  },
};
```

---

## 3. Peticiones Asíncronas y Buenas Prácticas con `fetch` API

Las comunicaciones con servicios externos o endpoints de formulario deben cumplir con el siguiente protocolo de calidad:

### 3.1. Abstracción del Cliente HTTP

Toda petición de red debe estructurarse mediante funciones asíncronas con soporte de:

1. **Control de Tiempo de Espera (Timeout con `AbortController`):** Evitar peticiones colgadas de forma indefinida.
2. **Validación de Respuesta HTTP (`response.ok`):** Detectar estados 4xx y 5xx.
3. **Manejo de Estados de UI:** Transición clara de `idle` → `loading` → `success` / `error`.
4. **Modo Mock / Fallback:** Respuesta simulada transparente para desarrollo local sin backend.

```javascript
/**
 * Envía datos del formulario de contacto mediante Fetch API nativo
 * @param {string} endpoint - URL del servicio receptor
 * @param {FormData|Object} payload - Datos del formulario
 * @param {number} [timeoutMs=8000] - Tiempo límite en milisegundos
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendContactRequest(endpoint, payload, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Si no hay endpoint real configurado, simula el envío (Mock Mode)
    if (!endpoint || endpoint === "#") {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message:
          "¡Gracias por comunicarte! Tu mensaje ha sido enviado exitosamente.",
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      headers:
        payload instanceof FormData
          ? {}
          : { "Content-Type": "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Error en el servidor: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Mensaje enviado correctamente.",
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "La solicitud superó el tiempo de espera. Por favor, intenta de nuevo.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

## 4. Modelo de Flujo Unidireccional de Datos

El ciclo de vida de cualquier interacción sigue cuatro etapas estrictamente ordenadas:

```text
┌──────────────┐      ┌─────────────────┐      ┌───────────────┐      ┌─────────────┐
│  Disparador  │ ---> │     Handler     │ ---> │ Actualización │ ---> │ Renderizado │
│   (Evento)   │      │    (Acción)     │      │  del Estado   │      │ / Sync DOM  │
└──────────────┘      └─────────────────┘      └───────────────┘      └─────────────┘
  - Click en dot        - carousel.goTo()        - state.slide = 2      - .is-active
  - Submit form         - submitContact()        - state.status = ...   - feedback UI
  - Click filtro        - filterPortfolio()      - state.filter = ...   - cards reveal
```

---

## 5. Esquemas de Datos del Sprint 1

### 5.1. Catálogo de Servicios (`SERVICES_DATA`)

```javascript
export const SERVICES_DATA = [
  {
    id: "web-cloud",
    title: "Desarrollo Web & Plataformas Cloud SaaS",
    category: "Cloud & Arquitectura",
    icon: "code-xml",
    summary:
      "Construcción de arquitecturas distribuidas, microservicios resilientes, APIs de alta disponibilidad y portales web modernos.",
    features: [
      "Desarrollo Frontend y Backend de alto rendimiento (Serverless & Microservicios)",
      "Arquitectura Cloud nativa (AWS, GCP, Kubernetes) y observabilidad",
      "Modernización de sistemas legacy y migración cloud segura",
    ],
    ctaText: "Consultar por Web & Cloud",
    ctaLink: "#contacto",
  },
  {
    id: "mobile",
    title: "Aplicaciones Móviles & Multiplataforma",
    category: "Mobile Engineering",
    icon: "smartphone",
    summary:
      "Desarrollo de aplicaciones nativas y multiplataforma de alta concurrencia para iOS y Android con experiencias fluidas y offline-first.",
    features: [
      "Desarrollo nativo (Swift, Kotlin) y multiplataforma (Flutter, React Native)",
      "Diseño UX/UI interactivo con micro-animaciones y soporte offline",
      "Integración de pagos seguros, biometría y notificaciones push",
    ],
    ctaText: "Consultar por Apps Móviles",
    ctaLink: "#contacto",
  },
  {
    id: "ai-data",
    title: "Inteligencia Artificial, RAG & Data Engineering",
    category: "AI & Machine Learning",
    icon: "sparkles",
    summary:
      "Integración de modelos LLM avanzados, agentes inteligentes autónomos, pipelines de datos en tiempo real y búsqueda semántica con vectores.",
    features: [
      "Implementación de arquitecturas RAG empresariales y embeddings vectoriales",
      "Orquestación de agentes autónomos y automatización de flujos con IA",
      "Pipelines de datos analíticos en tiempo real y dashboards predictivos",
    ],
    ctaText: "Consultar por Inteligencia Artificial",
    ctaLink: "#contacto",
  },
];
```

### 5.2. Perfiles del Equipo (`TEAM_DATA` - Mínimo 3 Integrantes)

```javascript
export const TEAM_DATA = [
  {
    id: "team-1",
    name: "Ing. Sofía Valenzuela",
    role: "Chief Technology Officer (CTO) & Cloud Architect",
    bio: "Especialista en sistemas distribuidos, microservicios y arquitectura cloud con más de 12 años liderando equipos de ingeniería.",
    image: "./assets/img/team/team_cto_cloud.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "sofia.valenzuela@nextcorp.com",
    },
  },
  {
    id: "team-2",
    name: "Lic. Lucas Albarracín",
    role: "Lead Frontend & Mobile Engineer",
    bio: "Ingeniero de interfaz y mobile especializado en arquitecturas reactivas, accesibilidad web profunda y rendimiento extremo.",
    image: "./assets/img/team/team_lead_mobile.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "lucas.albarracin@nextcorp.com",
    },
  },
  {
    id: "team-3",
    name: "Dr. Mateo Rossi",
    role: "Lead AI & Systems Engineer",
    bio: "Doctor en Ciencias de la Computación con foco en procesamiento de lenguaje natural, modelos RAG y arquitecturas multi-agente.",
    image: "./assets/img/team/team_lead_ai.jpg",
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      email: "mateo.rossi@nextcorp.com",
    },
  },
];
```

### 5.3. Showcase de Trabajos (`PROJECTS_DATA` - Mínimo 5 Proyectos)

```javascript
export const PROJECTS_DATA = [
  {
    id: "proj-1",
    title: "CloudScale Analytics",
    category: "web-cloud",
    client: "DataFlow Inc",
    image: "./assets/img/portfolio/project_cloud_analytics.jpg",
    summary:
      "Plataforma SaaS en tiempo real para observabilidad distribuida, telemetría y monitoreo de microservicios de alto tráfico.",
    tags: ["Cloud", "Kubernetes", "WebSockets", "SaaS"],
  },
  {
    id: "proj-2",
    title: "FinSecure Pay",
    category: "mobile",
    client: "NeoBank Global",
    image: "./assets/img/portfolio/project_fintech_app.jpg",
    summary:
      "Billetera digital móvil con biometría avanzada, pagos sin contacto instantáneos y gestión de activos financieros en tiempo real.",
    tags: ["Fintech", "iOS/Android", "Biometría", "Seguridad"],
  },
  {
    id: "proj-3",
    title: "Nexus AI Copilot",
    category: "ai-data",
    client: "LegalLex Enterprise",
    image: "./assets/img/portfolio/project_ai_copilot.jpg",
    summary:
      "Asistente inteligente con arquitectura RAG y base de datos vectorial para análisis y síntesis de contratos de alta complejidad.",
    tags: ["LLM", "RAG", "Vector DB", "Multi-Agent"],
  },
  {
    id: "proj-4",
    title: "OmniCommerce Engine",
    category: "web-cloud",
    client: "RetailMax Group",
    image: "./assets/img/portfolio/project_ecommerce.jpg",
    summary:
      "Motor distribuido de comercio electrónico capaz de procesar más de 20,000 transacciones por segundo con tolerancia a fallos.",
    tags: ["High Throughput", "Event-Driven", "Microservicios"],
  },
  {
    id: "proj-5",
    title: "HealthPulse Telemed",
    category: "ai-data",
    client: "Global Care Systems",
    image: "./assets/img/portfolio/project_telemed.jpg",
    summary:
      "Plataforma de telemedicina segura con historia clínica electrónica interoperable y asistencia diagnóstica potenciada por IA.",
    tags: ["HealthTech", "Telemedicina", "AI Diagnostics", "HIPAA"],
  },
];
```

---

## 6. Comunicación Desacoplada: Event Bus Nativo

Para comunicar módulos sin acoplar sus dependencias directas, se emplean `CustomEvent` nativos sobre el objeto `window`:

```javascript
export const emitEvent = (eventName, detail = {}) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

export const onEvent = (eventName, handler) => {
  window.addEventListener(eventName, (e) => handler(e.detail));
};
```

### Catálogo Oficial de Eventos Globales

| Evento                    | Payload (`detail`)                    | Módulo Emisor        | Módulo Receptor         |
| :------------------------ | :------------------------------------ | :------------------- | :---------------------- |
| `app:carousel:change`     | `{ slideIndex: number }`              | `carousel.js`        | Analítica / Indicadores |
| `app:portfolio:filter`    | `{ category: string, count: number }` | `portfolio.js`       | Región Live ARIA        |
| `app:form:submit-start`   | `{ formData: FormData }`              | `form-validation.js` | Botón Loader            |
| `app:form:submit-success` | `{ message: string }`                 | `form-validation.js` | Feedback Alert          |
| `app:form:submit-error`   | `{ error: string }`                   | `form-validation.js` | Panel de Errores        |

---

## 7. Ciclo de Vida y Máquina de Estados del Formulario

```text
 ┌────────┐      Validación OK      ┌────────────┐
 │  IDLE  │ ──────────────────────> │ SUBMITTING │
 └────────┘                         └────────────┘
     ▲                                 │        │
     │ Reset                          Éxito   Error
     │                                 │        │
     │                                 ▼        ▼
     │                          ┌─────────┐  ┌───────┐
     └───────────────────────── │ SUCCESS │  │ ERROR │
                                └─────────┘  └───────┘
```
