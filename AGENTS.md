# AGENTS.md

## Propósito

Este archivo define las reglas operativas para agentes de IA que trabajen en este repositorio.

El proyecto es una pagina web construida con:

- HTML5
- CSS3
- JavaScript Vanilla moderno

El objetivo es mantener un código:

- mantenible;
- extensible;
- portable;
- accesible;
- responsive;
- performante;
- verificable visual y funcionalmente;
- fácil de comprender.

---

## 1. Reglas prioritarias

Antes de modificar código:

1. Inspecciona la estructura existente.
2. Lee este archivo.
3. Consulta la documentación relevante en `docs/`.
4. Comprende las funcionalidades existentes.
5. Identifica el menor conjunto de cambios necesario.
6. Implementa incrementalmente.
7. Ejecuta las verificaciones correspondientes.
8. Actualiza la documentación cuando el cambio sea significativo.

No reconstruyas el proyecto desde cero salvo que exista una razón técnica documentada.

No elimines funcionalidades existentes sin justificarlo.

No introduzcas complejidad innecesaria.

---

## 2. Stack

### Runtime

El sitio debe ejecutarse únicamente con:

- HTML5
- CSS3
- JavaScript Vanilla

No introducir frameworks frontend como:

- React
- Vue
- Angular
- Svelte
- Astro
- Next.js
- Nuxt
- Bootstrap
- Tailwind

salvo que el proyecto adopte explícitamente una nueva arquitectura.

---

## 3. Fuentes de referencia

Utiliza las siguientes referencias como guía práctica:

- W3Schools HTML Tutorial / HTML Reference.
- W3Schools CSS Tutorial / CSS Reference.
- W3Schools JavaScript Tutorial / JavaScript Reference.

Para cuestiones que dependan de estándares reales de la plataforma web, prioriza:

1. WHATWG / W3C.
2. MDN.
3. W3Schools.

No copies patrones de W3Schools que contradigan buenas prácticas modernas.

La documentación debe servir como referencia, no como motivo para introducir malas prácticas.

---

## 4. HTML

Priorizar HTML semántico y accesible.

Preferir elementos con significado:

- `header`
- `nav`
- `main`
- `section`
- `article`
- `aside`
- `figure`
- `figcaption`
- `footer`
- `form`
- `button`
- `a`

Reglas:

- Utilizar `<a>` para navegación.
- Utilizar `<button>` para acciones.
- Mantener una jerarquía coherente de headings.
- Usar `alt` apropiado en imágenes.
- Utilizar HTML nativo antes que ARIA cuando sea posible.
- No utilizar elementos semánticos únicamente como decoración.
- No utilizar `<div>` como sustituto de controles interactivos.
- Mantener el documento válido y estructurado.

Referencia: `docs/standards.md`.

---

## 5. CSS

Priorizar:

- CSS Custom Properties.
- Mobile-first.
- Flexbox.
- CSS Grid.
- Media queries.
- Unidades relativas.
- `clamp()` cuando aporte valor.
- Selectores simples.
- Bajo nivel de especificidad.

Evitar:

- `!important` sin justificación.
- IDs para estilos.
- Selectores excesivamente específicos.
- CSS duplicado.
- Valores repetidos sin token.
- Hacks dependientes de un navegador.
- JavaScript para resolver problemas que CSS puede resolver correctamente.

Referencia: `docs/design-system.md` y `docs/standards.md`.

---

## 6. JavaScript

Utilizar JavaScript moderno y Vanilla.

Preferir:

- ES Modules.
- `const` y `let`.
- funciones pequeñas;
- dependencias explícitas;
- `addEventListener()`;
- APIs estándar del navegador;
- `IntersectionObserver` cuando corresponda;
- separación entre comportamiento y markup.

Evitar:

- inline event handlers;
- variables globales innecesarias;
- código duplicado;
- selectores frágiles;
- manipulación excesiva del DOM;
- dependencias innecesarias;
- abstracciones prematuras.

Usar `data-*` para conectar comportamiento JS con elementos HTML cuando resulte apropiado.

---

## 7. Arquitectura

La arquitectura debe favorecer:

```text
HTML → estructura y contenido
CSS  → presentación y layout
JS   → comportamiento
Docs  → conocimiento del proyecto
```

No mezclar responsabilidades sin necesidad.

Utilizar módulos JavaScript cuando la cantidad de comportamiento lo justifique.

No hace falta crear una arquitectura similar a un framework para una página web sencilla.

La modularidad debe reducir el acoplamiento, no aumentar la complejidad.

---

## 8. Diseño

La pagina web debe guiar al usuario mediante:

```text
Atención
↓
Comprensión
↓
Demostración
↓
Confianza
↓
Deseo
↓
Conversión
```

Utilizar únicamente los patrones que tengan sentido para el producto.

Referencia: `docs/patterns.md`.

---

## 9. Accesibilidad

Toda funcionalidad interactiva debe ser usable mediante teclado.

Considerar:

- focus visible;
- orden lógico de tabulación;
- contraste;
- nombres accesibles;
- HTML semántico;
- estados interactivos;
- `prefers-reduced-motion`;
- formularios accesibles;
- navegación mediante teclado.

No utilizar ARIA para compensar HTML incorrecto.

---

## 10. Responsive Design

Desarrollar mobile-first.

La interfaz debe funcionar correctamente en:

- mobile;
- tablet;
- desktop;
- pantallas grandes.

No depender de tamaños de viewport específicos para garantizar el funcionamiento.

---

## 11. Performance

Priorizar:

- imágenes optimizadas;
- dimensiones explícitas de imágenes;
- lazy loading cuando corresponda;
- JavaScript mínimo;
- CSS eficiente;
- evitar trabajo innecesario durante scroll;
- evitar dependencias externas innecesarias.

No realizar micro-optimizaciones que perjudiquen la legibilidad.

---

## 12. Cambios

Antes de editar:

- identifica archivos afectados;
- identifica posibles dependencias;
- identifica riesgos de regresión.

Después de editar:

- revisa errores de consola;
- verifica HTML/CSS/JS;
- verifica responsive;
- verifica accesibilidad;
- actualiza documentación significativa.

No modifiques archivos no relacionados con la tarea.

---

## 13. Documentación

Toda documentación generada por el agente debe estar escrita en español.

Actualizar documentación cuando cambie:

- arquitectura;
- estructura;
- sistema visual;
- patrones UX;
- comportamiento;
- estrategia de verificación;
- estándares internos.

No documentar cambios triviales.

La documentación debe explicar principalmente:

**qué existe, por qué existe y qué restricciones debe respetar.**

---

## 15. Regla de simplicidad

Ante dos soluciones técnicamente válidas:

> Preferir la solución más simple que mantenga claridad, accesibilidad, extensibilidad y verificabilidad.

No sobreingenierizar.

No crear abstracciones para problemas que todavía no existen.

---

## 16. Orden de decisión

Cuando existan dudas, priorizar:

1. Estándares web.
2. Accesibilidad.
3. Funcionalidad existente.
4. Mantenibilidad.
5. Extensibilidad.
6. Portabilidad.
7. Performance.
8. UX.
9. Estética.

La estética nunca debe justificar romper semántica, accesibilidad o mantenibilidad.
