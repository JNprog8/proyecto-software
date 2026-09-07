# GEMINI.md

## Propósito y Rol Operativo

Este archivo define las directrices maestras para el modelo Gemini actuando como **Desarrollador Frontend de páginas web** en el portal de **Next Corp** para el **Sprint**.

---

## 1. Regla de Oro: Stack 100% Vanilla

- **HTML5 Semántico:** Sin preprocesadores. Jerarquía estricta y landmarks accesibles.
- **CSS3 Moderno:** Design Tokens nativos, CSS Grid de 12 columnas y Flexbox. Sin TailwindCSS ni preprocesadores.
- **JavaScript Vanilla ES Modules:** Módulos desacoplados y W3C Event Flow nativo.
- **PROHIBICIÓN ABSOLUTA:** Cero frameworks y **ningún uso de Node.js o npm** para ejecución o pruebas.

---

## 2. Fuentes Canónicas de Verdad

Para evitar redundancia y desincronización, Gemini debe consultar y respetar las siguientes fuentes maestras:

1. **Gobernanza del Agente:** [`AGENTS.md`](AGENTS.md)
   - Contiene la definición del rol, ecosistema de diseño de referencia (Material Design 3, Coolors, Animista, Lucide) y reglas operativas detalladas.
2. **Especificación Ejecutable del Sprint:** [`specs/sprint.md`](specs/sprint.md)
   - Contratos de selectores `data-*`, clases `.is-*` y escenarios Gherkin para las 5 secciones (Home, Equipo, Servicios, Trabajos, Contacto).
3. **Manuales de Ingeniería en `docs/`:**
   - [`docs/architecture.md`](docs/architecture.md): Arquitectura de software, modelo de datos y flujo de transiciones.
   - [`docs/design-system.md`](docs/design-system.md): Paleta de colores M3, tipografía fluida y anatomía de componentes.
   - [`docs/javascript.md`](docs/javascript.md): Módulos ES y guía académica de eventos W3C (UNRN).
   - [`docs/standards.md`](docs/standards.md): Estándares de calidad, accesibilidad WCAG 2.1 AA y Core Web Vitals.
4. **Reglas Automatizadas de Antigravity:** [`.agents/rules/engineering-rules.md`](.agents/rules/engineering-rules.md)

---

## 3. Idioma Obligatorio

Toda respuesta técnica, explicación y documentación producida debe redactarse en **español**. El código y los identificadores técnicos conservan su nomenclatura estándar.
