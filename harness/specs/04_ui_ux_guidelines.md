# Directivas de Diseño UI/UX, CSS3 y Accesibilidad (SDD)

Este documento condensa los **Aspectos Visuales, Estándares de HTML5 Semántico, Arquitectura CSS y Accesibilidad (a11y)** para la interfaz de usuario, basados en el principio **KISS** (*Keep It Simple, Stupid*).

---

## 1. Principios Fundamentales de Diseño
- **Filosofía:** HTML estructura y semántica; CSS diseño y layout; JavaScript comportamiento.
- **Sin Frameworks Pesados:** Estilo y maquetación mediante Vanilla CSS moderno. Si se utiliza Bootstrap (por requerimiento de cátedra), se debe preservar la semántica nativa y evitar estilos inline.
- **Mobile First & Responsive:** Maquetado fluido con Flexbox y CSS Grid. Prohibidas las dimensiones rígidas en píxeles para contenedores principales; utilizar unidades relativas (`rem`, `%`, `ch`, `vh/vw`).
- **Respeto a Preferencias del Usuario:** Soporte para `prefers-reduced-motion: reduce` para deshabilitar o suavizar animaciones.

---

## 2. Semántica HTML5 y Estructura
1. **Elementos Estructurales:**
   - Usar `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` en lugar de anidar `<div>` genéricos sin valor semántico.
   - Un único elemento `<main>` representativo por vista.
2. **Botón vs. Enlace (Regla Estricta):**
   - `<button type="button|submit">`: Para cualquier acción que ejecute código JavaScript, abra modales o envíe formularios.
   - `<a href="...">`: Exclusivamente para navegación entre URLs o hipervínculos reales.
3. **Formularios Semánticos:**
   - Todo `<input>`, `<select>` y `<textarea>` debe contar con su etiqueta `<label>` explícitamente vinculada mediante el atributo `for="id_input"`.
   - Utilizar atributos nativos de validación HTML5 (`required`, `type="email"`, `pattern`, `minlength`, `maxlength`).

---

## 3. Arquitectura CSS y Design Tokens

1. **Design Tokens Centralizados (`:root`):**
   - Definir variables CSS reutilizables para paletas de color, tipografía, espaciados y sombras:
     ```css
     :root {
       --color-primary: #2563eb;
       --color-primary-hover: #1d4ed8;
       --color-danger: #dc2626;
       --color-surface: #ffffff;
       --color-background: #f8fafc;
       --color-text-main: #0f172a;
       --color-text-muted: #64748b;
       --font-sans: system-ui, -apple-system, sans-serif;
       --radius-md: 0.5rem;
       --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
     }
     ```
2. **Convención BEM y Baja Especificidad:**
   - Utilizar nomenclatura BEM (`.block`, `.block__element`, `.block--modifier`) para clases reutilizables.
   - **Prohibido:** el uso de `!important` y selectores basados en IDs (`#header`) para aplicar estilos visuales.

---

## 4. Accesibilidad (a11y) y Estados Visuales

1. **Navegación y Foco por Teclado:**
   - Todos los elementos interactivos deben ser operables mediante la tecla `Tab`, `Enter` y `Space`.
   - Mantener siempre un indicador de foco visible y accesible:
     ```css
     :focus-visible {
       outline: 2px solid var(--color-primary);
       outline-offset: 2px;
     }
     ```
2. **Contraste de Color:**
   - Cumplir el ratio de contraste mínimo WCAG 2.1 nivel AA (al menos `4.5:1` para texto estándar). No depender únicamente del color para comunicar estado o error.
3. **ARIA como Complemento:**
   - "La mejor regla de ARIA es no usar ARIA si existe un elemento HTML nativo que ya lo cumple". Utilizar atributos ARIA (`aria-live="polite"`, `aria-expanded`, `aria-label`) solo cuando sea estrictamente indispensable.

---

## 5. Componentes Clave del Sistema

1. **Modales Nativos (`<dialog>`):**
   - Emplear el elemento nativo `<dialog>` de HTML5 con métodos `.showModal()` y `.close()`.
   - Soportar cierre accesible mediante tecla `Escape` y clic sobre el backdrop (`dialog::backdrop` con `backdrop-filter: blur(4px)`).
2. **Validación Visual en Formularios:**
   - Resaltado visual en rojo de campos inválidos con mensaje textual descriptivo debajo.
   - Deshabilitar temporalmente el botón de envío y desplegar indicador de carga (*spinner*) durante operaciones asíncronas para evitar dobles envíos.
3. **Notificaciones Flotantes (Toast):**
   - Ubicadas en la esquina inferior para confirmar acciones exitosas o advertir errores sin interrumpir el flujo del usuario. Desvanecimiento automático a los 4 segundos.
4. **Tabla de Datos y Badges de Rol:**
   - Badges con contraste adecuado para identificar roles en el padrón:
     - **Organizador / Administrador:** Púrpura suave (`#ede9fe`, texto `#6d28d9`).
     - **Mentor / Operador:** Azul suave (`#e0f2fe`, texto `#0369a1`).
     - **Juez / Auditor:** Ámbar suave (`#fef3c7`, texto `#92400e`).
     - **Participante / Invitado:** Gris pizarra (`#f1f5f9`, texto `#475569`).
