# Guía de Diseño y Experiencia de Usuario (UI/UX - SDD)

Este documento establece las directivas visuales y de interacción para la interfaz de usuario. Sigue el principio **KISS** (*Keep It Simple, Stupid*) con una estética moderna, formal y pulida.

---

## 1. Principios de Diseño
- **Stack:** HTML5 semántico, CSS3 moderno con variables (Custom Properties) y Vanilla JavaScript.
- **Sin Frameworks:** Prohibido el uso de Bootstrap, Tailwind o React en este proyecto para mantener la arquitectura Vanilla solicitada.
- **Responsividad Nativa:** La interfaz debe operar fluidamente tanto en pantallas de escritorio (1200px+) como en dispositivos móviles (<768px).

---

## 2. Componentes Clave

### 2.1 Modales Nativos (`<dialog>`)
- Usar el elemento nativo `<dialog>` de HTML5 en lugar de librerías externas o divs absolutos pesados.
- Soporte para cierre mediante la tecla `Escape` y haciendo clic fuera del contenido (backdrop).
- Efecto de desenfoque de fondo: `backdrop-filter: blur(4px)`.

### 2.2 Validación Visual en Formularios
- Feedback de error inmediato: si una validación falla (ej: correo duplicado), se resalta el borde del input en color de peligro y se despliega el mensaje de error inmediatamente debajo.
- Indicador de carga: al presionar "Guardar Usuario" o "Eliminar", el botón muestra un spinner animado y se deshabilita temporalmente para evitar peticiones duplicadas.

### 2.3 Notificaciones Toast
- Notificaciones flotantes tipo *Toast* en la esquina inferior derecha para confirmar altas, modificaciones y eliminaciones exitosas.
- Desvanecimiento automático a los 4 segundos.

### 2.4 Tabla de Datos y Badges de Rol
- Cada rol posee un identificador visual diferenciado mediante badges con colores armónicos:
  - **Administrador:** Púrpura suave (`#ede9fe`, texto `#6d28d9`).
  - **Operador:** Azul cielo suave (`#e0f2fe`, texto `#0369a1`).
  - **Auditor:** Ámbar suave (`#fef3c7`, texto `#92400e`).
  - **Invitado:** Gris pizarra (`#f1f5f9`, texto `#475569`).
