# Patrones UX/UI del Portal Web (Next Corp)

## 1. Objetivo y Rol

Este documento compila los patrones de diseño, interacción y experiencia de usuario (UX) que guían al **Desarrollador Frontend de páginas web** en la construcción del portal corporativo para **Next Corp**, empresa especializada en **Desarrollo de Software** (*Desarrollo Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial & Data Engineering*), en cumplimiento estricto del **Sprint 1**.

Los patrones seleccionados combinan la usabilidad y accesibilidad de [Material Design 3](https://m3.material.io/) y [Bootstrap](https://getbootstrap.com/) con la inspiración visual de [Awwwards](https://www.awwwards.com/) y [Dribbble](https://dribbble.com/).

---

## 2. Modelo Narrativo del Portal

El flujo de interacción del usuario está diseñado para generar confianza, credibilidad y conversión:

```text
Atención (Hero / Carrusel Home)
     ↓
Comprensión (Tiras de Servicios Tech y Cultura de Ingeniería)
     ↓
Demostración (Showcase de Proyectos de Software y Métricas)
     ↓
Confianza (Perfiles del Equipo Tech y Clientes)
     ↓
Conversión (Formulario de Cotización Tech y Canales Directos)
```

---

## 3. Catálogo de Patrones del Sprint 1

### 3.1. Patrón 1: Hero con Carrusel Interactivo ("Quiénes Somos y Qué Hacemos")
- **Propósito:** Captar la atención inmediata del visitante comunicando las tres áreas clave de especialidad en software de Next Corp (*Cloud SaaS*, *Apps Móviles*, *IA & Data*).
- **Estructura:**
  - Contenedor de ancho completo o contenido centralizado con slides dinámicos.
  - Título principal (`h1`), subtítulo explicativo y botones de llamada a la acción (CTA) primario ("Conocer Soluciones") y secundario ("Ver Proyectos").
  - Controles de carrusel: flechas anterior/siguiente con iconos de [Lucide Icons](https://lucide.dev/), indicadores de posición paginados y soporte para swipe táctil en dispositivos móviles.
  - Accesibilidad: Posibilidad de pausar la reproducción automática y navegación por teclado.

### 3.2. Patrón 2: Tiras Modulares del Home (3 Tiras del Sprint 1)
- **Tira 1: Resumen de Servicios Tech**
  - Grid de 3 columnas (inspirado en el layout de [Bootstrap](https://getbootstrap.com/)) con tarjetas que sintetizan: *Desarrollo Web & Cloud*, *Apps Móviles* e *Inteligencia Artificial & Data*.
  - Iconos vectoriales de [SVG Repo](https://www.svgrepo.com/) o [Heroicons](https://heroicons.com/) y botón de acceso directo a la sección completa.
- **Tira 2: Resumen de Trabajos**
  - Galería visual horizontal o grid fluido con previews de los proyectos de software más representativos y badges descriptivos.
- **Tira 3: Resumen de Quiénes Somos**
  - Bloque dividido: propuesta de valor sobre la excelencia en ingeniería de software y elemento visual de soporte (fotografía o animación vectorial de [LottieFiles](https://lottiefiles.com/)).

### 3.3. Patrón 3: Team Grid & Perfiles Profesionales (El Equipo)
- **Propósito:** Humanizar la empresa y transmitir transparencia y liderazgo técnico.
- **Estructura:**
  - Descripción general de Next Corp, su cultura de desarrollo ágil y estándares de arquitectura.
  - Grid responsivo de tarjetas de integrantes (mínimo 3 integrantes):
    - Foto profesional optimizada;
    - Nombre y rol dentro de la organización (*CTO & Cloud Architect*, *Lead Frontend & Mobile*, *Lead AI & Data*);
    - Breve semblanza curricular y especialidad técnica;
    - Enlaces a GitHub, LinkedIn y contacto profesional con iconos SVG.
  - Elevación interactiva con sombras M3 al hacer hover.

### 3.4. Patrón 4: Services Showcase (Servicios)
- **Propósito:** Detallar la oferta técnica en cada una de las 3 áreas de desarrollo de software.
- **Estructura:**
  - Bloques alternados o tarjetas detalladas para:
    1. *Desarrollo Web & Plataformas Cloud SaaS* (microservicios, APIs, cloud-native).
    2. *Aplicaciones Móviles & Multiplataforma* (iOS/Android nativo, React Native/Flutter, offline-first).
    3. *Inteligencia Artificial, RAG & Data Engineering* (LLMs, embeddings vectoriales, agentes inteligentes, pipelines).
  - Puntos destacados de valor y botón para solicitar cotización tecnológica.

### 3.5. Patrón 5: Portfolio Showcase & Client Cloud (Trabajos / Clientes)
- **Showcase de Trabajos:**
  - Grid de tarjetas de proyectos de software (mínimo 5 trabajos):
    - Imagen de alta definición del dashboard o mockup del producto;
    - Título del proyecto y cliente beneficiario;
    - Badge de categoría (*Web & Cloud*, *Mobile*, *AI & Data*);
    - Resumen del desafío técnico y la solución implementada.
- **Nube de Clientes (Social Proof):**
  - Fila o grid con logotipos de empresas tech, scale-ups y clientes destacados.
  - Efecto visual sutil con transiciones calculadas en [Cubic-bezier.com](https://cubic-bezier.com/).

### 3.6. Patrón 6: Contact Hub & Formulario Accesible (Contacto)
- **Propósito:** Facilitar la comunicación y captura de prospectos con mínima fricción.
- **Estructura:**
  - **Formulario de Contacto:**
    - Campos: Nombre completo, Correo electrónico, Teléfono (opcional), Servicio de interés tech y Mensaje.
    - Validación accesible en tiempo real con mensajes de error descriptivos.
    - Botón de envío con micro-interacción y estado de carga.
  - **Información Directa y Ubicación:**
    - Dirección física del hub tecnológico.
    - Mapa de ubicación interactivo o embed responsivo.
    - Teléfono de contacto directo y correo electrónico corporativo.
    - Enlaces a redes sociales oficiales con iconos SVG de [Lucide Icons](https://lucide.dev/) o [Heroicons](https://heroicons.com/).

### 3.7. Patrón 7: Header Fijo y Navegación Responsive
- **Estructura:**
  - Barra de navegación superior fija (`sticky`) con efecto glassmorphism o fondo sólido con elevación M3.
  - Logotipo institucional de Next Corp y enlaces directos a las 5 secciones (Home, Equipo, Servicios, Trabajos/Clientes, Contacto).
  - Menú hamburguesa accesible para dispositivos móviles con soporte para tecla Escape y bloqueo de scroll al abrirse.

---

## 4. Animaciones y Transiciones Fluidas

- Utilizar keyframes probados de [Animista](https://animista.net/) para entradas suaves de tarjetas y títulos.
- Transiciones fluidas en hover utilizando las curvas de aceleración de [Cubic-bezier.com](https://cubic-bezier.com/).
- Posibilidad de orquestar transiciones complejas mediante [GreenSock (GSAP)](https://greensock.com/) o `IntersectionObserver`.
- Respeto absoluto de `prefers-reduced-motion` para usuarios con sensibilidad al movimiento.
