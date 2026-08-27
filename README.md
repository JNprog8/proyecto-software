# Landing Page

Landing page web desarrollada con **HTML5, CSS3 y JavaScript Vanilla**.

El proyecto está diseñado para priorizar:

* mantenibilidad;
* extensibilidad;
* portabilidad;
* accesibilidad;
* responsive design;
* performance;
* verificación visual y funcional simple.

---

## Objetivo

Crear una landing page profesional capaz de comunicar rápidamente:

1. Qué es el producto.
2. Qué problema resuelve.
3. Qué valor proporciona.
4. Por qué debería confiarse en él.
5. Qué acción debe realizar el usuario.

La experiencia debe conducir progresivamente:

**Atención → Comprensión → Demostración → Confianza → Deseo → Conversión**

---

## Stack

### Producción

* HTML5
* CSS3
* JavaScript Vanilla
* ES Modules

No utiliza frameworks frontend ni dependencias de runtime externas. La página debe poder abrirse como archivos estáticos o servirse con un servidor estático simple.

---

## Estructura

```text
.
├── AGENTS.md
├── README.md
│
├── src/
│   ├── index.html
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   └── components.css
│   ├── js/
│   └── assets/
└── docs/
    ├── architecture.md
    ├── standards.md
    ├── design-system.md
    └── patterns.md
```

La estructura puede evolucionar si la complejidad del proyecto lo requiere.

---

## Arquitectura

El proyecto mantiene una separación básica de responsabilidades:

```text
HTML
  └── estructura + contenido + semántica

CSS
  └── presentación + layout + responsive + estados visuales

JavaScript
  └── comportamiento + interacciones

Docs
  └── conocimiento y decisiones del proyecto
```

Detalles: [`docs/architecture.md`](docs/architecture.md).

---

## Estándares

Las decisiones de implementación toman como referencia:

* W3Schools HTML Tutorial / Reference.
* W3Schools CSS Tutorial / Reference.
* W3Schools JavaScript Tutorial / Reference.
* WHATWG / W3C.
* MDN.

Las especificaciones y documentación de estándares tienen prioridad sobre ejemplos educativos que puedan estar simplificados.

Detalles: [`docs/standards.md`](docs/standards.md).

---

## Diseño

La landing utiliza patrones de diseño orientados a:

* jerarquía visual;
* comprensión rápida;
* demostración del producto;
* confianza;
* conversión.

Los patrones se seleccionan según las necesidades reales del producto.

Detalles: [`docs/patterns.md`](docs/patterns.md).

---

## Sistema visual

El proyecto utiliza un sistema visual centralizado basado en CSS Custom Properties.

Los tokens deben concentrar decisiones como:

* colores;
* tipografía;
* espaciado;
* radios;
* sombras;
* tamaños relevantes.

Detalles: [`docs/design-system.md`](docs/design-system.md).

---

## Principios de mantenimiento

Antes de añadir una solución:

1. Comprobar si ya existe una implementación reutilizable.
2. Evitar duplicación.
3. Evitar nuevas dependencias sin necesidad.
4. Mantener las responsabilidades separadas.
5. Preferir APIs estándar del navegador.
6. Mantener el comportamiento accesible.
7. Verificar manualmente los flujos visuales y funcionales relevantes.
8. Actualizar documentación cuando cambien decisiones importantes.

---

## Portabilidad

El sitio debe poder desplegarse como archivos estáticos siempre que sus funcionalidades lo permitan.

No debe depender de:

* un framework frontend;
* un servidor Node en runtime;
* APIs propietarias innecesarias;
* herramientas de build obligatorias para funcionalidades básicas.

La infraestructura de desarrollo puede evolucionar independientemente del runtime del sitio.

---

## Documentación para agentes

Los agentes de IA deben comenzar leyendo:

```text
AGENTS.md
```

y consultar únicamente la documentación relevante para la tarea.

No es necesario leer todos los documentos para modificaciones triviales.
