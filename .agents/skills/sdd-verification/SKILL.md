---
name: sdd-verification
description: >-
  Procedimiento de verificación y auditoría para Spec-Driven Development (SDD) en Next Corp.
  Úsalo cuando necesites validar que una implementación cumpla con las especificaciones de specs/,
  verificar contratos de interfaz (ui-contracts.md) y realizar comprobaciones visuales y de accesibilidad
  en el navegador de forma 100% nativa y sin frameworks ni Node.js.
---

# Skill: Verificación Spec-Driven Development (SDD)

Este skill provee al agente las instrucciones paso a paso para verificar rigurosamente el cumplimiento de las especificaciones y contratos de interfaz del portal corporativo de **Next Corp**, sin utilizar Node.js ni herramientas de compilación externas.

---

## 1. Cuándo Activar este Skill

Activar este skill cuando:

- Hayas finalizado la maquetación o codificación de una pantalla o módulo y necesites certificar que cumple con su especificación en `specs/sprint/`.
- Vayas a auditar la consistencia entre los selectores `[data-*]` del HTML y los listeners de JavaScript.
- Necesites validar los criterios de aceptación (Acceptance Criteria) antes de marcar una tarea como concluida en Antigravity IDE.

---

## 2. Protocolo de Verificación en 4 Pasos

### Paso 1: Matriz de Trazabilidad de Requerimientos

1. Abrir la especificación única del Sprint:
   - [`specs/sprint.md`](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/Proyectos/Pagina%20Web/ZZ/specs/sprint.md)
2. Contrastar los escenarios de Criterios de Aceptación (Home, Equipo, Servicios, Trabajos, Contacto) con el marcado HTML y la lógica JS:
   - ¿Están presentes todos los elementos requeridos?
   - ¿Los enlaces relativos (`href="equipo.html"`, etc.) son consistentes y navegan a archivos existentes?

---

### Paso 2: Auditoría del Contrato de Interfaz

Revisar contra la sección de Contratos de Interfaz en [`specs/sprint.md`](file:///home/joaco/Documentos/UNRN/Proyecto%20Software/Proyectos/Pagina%20Web/ZZ/specs/sprint.md#2-contratos-de-interfaz-de-usuario-ui-contracts):

1. **Comprobar Selectores `data-*`:**
   - Verificar que los selectores que busca JavaScript (ej. `[data-contact-form]`, `[data-carousel]`, `[data-nav-toggle]`) existan exactamente con ese nombre en el marcado HTML correspondiente.
2. **Comprobar Clases de Estado `.is-*`:**
   - Verificar que los módulos JS solo manipulen clases con prefijo `.is-*` (`.is-active`, `.is-open`, `.is-invalid`, etc.) y que `components.css` / `animations.css` tengan reglas de estilo para ellas.
3. **Comprobar Sincronización ARIA:**
   - Asegurarse de que `aria-expanded`, `aria-hidden`, `aria-invalid` y `aria-describedby` se sincronicen adecuadamente.

---

### Paso 3: Verificación Visual e Interactiva en Navegador

Utilizar las herramientas de navegador integradas en Antigravity IDE (`browser_subagent`) para:

1. **Abrir y renderizar la página:**
   - Confirmar que el layout se dibuje sin desbordamientos horizontales ni colapsos.
2. **Probar Interacciones Clave:**
   - **Carrusel:** Verificar que avance automáticamente a los 7.5s, se pause al pasar el ratón (`mouseenter`) y responda a clics en flechas e indicadores.
   - **Menú Móvil:** Probar que el botón hamburguesa conmute `aria-expanded` y que la tecla `Escape` cierre el menú.
   - **Filtros de Proyectos:** Probar los botones de filtro en `trabajos.html` y comprobar que las tarjetas no coincidentes reciban `.is-hidden`.
   - **Formulario de Contacto:** Enviar el formulario vacío para comprobar que el primer campo inválido reciba el foco y se muestre el error accesible; luego simular un envío válido para observar la tarjeta de confirmación y el botón de nueva consulta.

---

### Paso 4: Lista de Comprobación Final (Definition of Done)

Antes de dar por aprobada cualquier entrega, verificar:

- [ ] **Zero Node.js:** ¿El código funciona directamente en el navegador sin dependencias de backend?
- [ ] **HTML Semántico:** ¿Existe un único `<h1>` por página y los encabezados `<h2>`/`<h3>` están jerarquizados?
- [ ] **Accesibilidad (a11y):** ¿Todos los controles son operables con teclado (`Tab`, `Enter`, `Space`) y tienen `:focus-visible`?
- [ ] **Responsive:** ¿La página es fluida y adaptable desde pantallas móviles de 320px hasta desktop?
- [ ] **Event Delegation:** ¿Se aprovechó el flujo de eventos W3C y delegación en contenedores padre?
