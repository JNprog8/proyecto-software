# Design System

## 1. Objetivo

El sistema visual debe proporcionar coherencia entre todas las secciones de la landing.

Debe facilitar:

- consistencia;
- mantenimiento;
- extensión;
- responsive design;
- cambios globales.

Las decisiones visuales compartidas deben centralizarse.

---

# 2. Design Tokens

Los valores reutilizables deben definirse mediante CSS Custom Properties.

Ejemplo conceptual:

```css
:root {
  --color-primary: ...;
  --color-primary-contrast: ...;

  --color-background: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-muted: ...;

  --font-family-base: ...;
  --font-family-heading: ...;

  --space-xs: ...;
  --space-sm: ...;
  --space-md: ...;
  --space-lg: ...;
  --space-xl: ...;

  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;

  --shadow-sm: ...;
  --shadow-md: ...;

  --content-max-width: ...;
}
```

Los valores reales deben reflejar la identidad visual del producto.

---

# 3. Colores

El sistema debe distinguir conceptualmente:

- brand;
- background;
- surface;
- text;
- muted text;
- border;
- success;
- warning;
- error.

No utilizar colores arbitrarios directamente dentro de cada componente cuando exista un token adecuado.

---

# 4. Tipografía

Definir:

- familia principal;
- familia de headings si corresponde;
- tamaños;
- pesos;
- line-height;
- letter-spacing cuando sea necesario.

La escala debe proporcionar jerarquía clara:

```text
Display
H1
H2
H3
Body
Small
Caption
```

Los tamaños responsive pueden utilizar `clamp()` cuando mejore la adaptación.

---

# 5. Espaciado

Utilizar una escala consistente.

Ejemplo conceptual:

```text
xs
sm
md
lg
xl
2xl
```

Evitar introducir un valor nuevo para cada componente sin necesidad.

---

# 6. Contenedores

Las secciones deben utilizar un contenedor común cuando corresponda.

Ejemplo conceptual:

```css
.container {
  width: min(100% - 2rem, var(--content-max-width));
  margin-inline: auto;
}
```

El valor final debe adaptarse al diseño real.

---

# 7. Botones

Los botones deben tener estados claramente diferenciados:

```text
default
hover
focus-visible
active
disabled
```

Deben mantener:

- contraste;
- área táctil razonable;
- feedback visual;
- accesibilidad mediante teclado.

Tipos recomendados:

```text
Primary
Secondary
Ghost
```

No crear variantes adicionales hasta que exista una necesidad real.

---

# 8. Cards

Las cards deben utilizarse cuando realmente exista una agrupación conceptual.

No convertir toda sección en un conjunto de cards.

Una card puede representar:

- feature;
- testimonio;
- pricing plan;
- contenido relacionado.

---

# 9. Formularios

Los campos deben tener:

- label;
- estado normal;
- focus;
- error;
- disabled cuando corresponda.

Los mensajes de error deben ser claros y útiles.

---

# 10. Navegación

La navegación debe proporcionar:

- identidad del sitio;
- acceso a secciones relevantes;
- CTA principal cuando corresponda;
- comportamiento responsive;
- focus visible.

El menú móvil debe mantener comportamiento accesible.

---

# 11. Iconografía

Preferir iconos consistentes.

Los iconos decorativos no deben generar ruido para tecnologías asistivas.

Cuando un icono sea informativo, debe existir una alternativa textual accesible.

---

# 12. Imágenes

Las imágenes deben:

- tener propósito claro;
- estar optimizadas;
- conservar proporciones;
- utilizar `alt` apropiado;
- evitar desplazamientos de layout.

---

# 13. Responsive Design

El sistema visual debe funcionar desde mobile hacia desktop.

No crear variantes completamente independientes para cada viewport.

Preferir componentes fluidos.

Utilizar breakpoints cuando exista un cambio real de layout, no para cada tamaño de dispositivo.

---

# 14. Motion

Las animaciones deben reforzar:

- jerarquía;
- feedback;
- continuidad;
- comprensión.

No deben distraer.

Respetar:

```css
@media (prefers-reduced-motion: reduce);
```

---

# 15. Componentes

Los componentes visuales deben compartir tokens.

Ejemplo conceptual:

```text
Button
Card
Badge
Navigation
Accordion
Testimonial
PricingCard
SectionHeader
```

Crear un componente conceptual solamente cuando exista una responsabilidad visual reutilizable.

No crear abstracciones JavaScript para componentes puramente visuales.

---

# 16. Regla de consistencia

Antes de introducir un nuevo:

- color;
- tamaño;
- spacing;
- radius;
- shadow;
- componente;

comprobar si el sistema existente ya posee una alternativa adecuada.

La consistencia tiene prioridad sobre la variedad.
