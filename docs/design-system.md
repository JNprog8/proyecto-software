# Sistema de Diseño y Patrones UI (Next Corp)

## 1. Fundamentos y Filosofía Visual

El sistema de diseño de **Next Corp** está inspirado en **Material Design 3 (M3)**, referencias contemporáneas de **Awwwards** y paletas cromáticas verificadas en **Coolors** para garantizar contraste accesible (**WCAG 2.1 AA**), sofisticación tecnológica y micro-interacciones fluidas.

---

## 2. Paleta Cromática y Design Tokens

Todos los colores se centralizan en variables CSS nativas dentro de [`src/css/variables.css`](../src/css/variables.css):

### 2.1. Colores Principales del Ecosistema
| Token CSS | Valor Hexadecimal | Rol en el Sistema |
| :--- | :--- | :--- |
| `--color-primary` | `#28536B` | **Azul Petróleo:** Color principal corporativo para headers, botones primarios y branding. |
| `--color-secondary` | `#C2948A` | **Dusty Rose:** Acento cálido para badges de Apps Móviles, botones secundarios y foco. |
| `--color-tertiary` | `#7EA8BE` | **Azul Aero:** Celeste de contraste para enlaces, bordes activos y highlights. |
| `--color-light` | `#F6F0ED` | **Blanco Alabastro:** Superficie clara para tipografía de alto contraste y fondos neutros. |
| `--color-sand` | `#BBB193` | **Sage Arena:** Tono terroso para etiquetas, líneas divisorias y detalles sutiles. |

### 2.2. Superficies High-Tech Dark Mode (M3 Tonal Surfaces)
| Token CSS | Valor | Uso |
| :--- | :--- | :--- |
| `--md-sys-color-background` | `#0f1c24` | Fondo global de la aplicación. |
| `--md-sys-color-surface` | `#152632` | Fondo base de tarjetas y barras. |
| `--md-sys-color-surface-container` | `#1b3140` | Contenedores intermedios e inputs. |
| `--md-sys-color-surface-container-high` | `#243e50` | Elementos flotantes y modales. |
| `--md-sys-color-outline` | `rgba(187, 177, 147, 0.28)` | Bordes sutiles con contraste WCAG. |

---

## 3. Tipografía Fluida (Fluid Typography)

El sistema combina dos fuentes de Google Fonts:
- **Títulos y Encabezados:** **Outfit** (moderna, geométrica, de alto impacto).
- **Cuerpo y Controles:** **Inter** (alta legibilidad en cualquier escala y dispositivo).

```css
/* Escalas fluidas mediante clamp() */
--font-size-display: clamp(2.5rem, 5vw + 1rem, 4.25rem);
--font-size-h1: clamp(2rem, 3vw + 1rem, 3.25rem);
--font-size-h2: clamp(1.5rem, 2vw + 0.75rem, 2.25rem);
--font-size-h3: clamp(1.25rem, 1vw + 0.5rem, 1.75rem);
--font-size-body: 1rem;
--font-size-small: 0.875rem;
--font-size-caption: 0.75rem;
```

---

## 4. Elevación y Sombras (M3 Elevation Tokens)

El sistema utiliza niveles de elevación para transmitir jerarquía y profundidad:
- `--elevation-1`: `0 1px 3px rgba(0, 0, 0, 0.25)` (Botones y tarjetas en reposo).
- `--elevation-2`: `0 4px 8px rgba(0, 0, 0, 0.35)` (Hover de botones).
- `--elevation-3`: `0 8px 24px rgba(0, 0, 0, 0.45)` (Header sticky y dropdowns).
- `--elevation-4`: `0 16px 40px rgba(0, 0, 0, 0.55)` (Hover de tarjetas de proyectos y modales).

---

## 5. Micro-Animaciones y Curvas de Aceleración

Inspiradas en **Animista.net** y curvas calibradas en **Cubic-bezier.com**:
- **Curva Suave Estándar:** `cubic-bezier(0.4, 0, 0.2, 1)` (Transición uniforme de interfaces).
- **Curva de Rebote Sutil:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (Interacción de botones y micro-indicadores).
- **Duraciones:**
  - Rápida (`--transition-fast`): `150ms` (Hover de botones y enlaces).
  - Normal (`--transition-normal`): `300ms` (Transformaciones de cards y dropdowns).
  - Lenta (`--transition-slow`): `500ms` (Fade de diapositivas y cambios de página).

> [!IMPORTANT]
> **Accesibilidad de Movimiento:** Si el usuario activa `prefers-reduced-motion: reduce`, todas las animaciones keyframe se desactivan y las transiciones se acortan a `0.01ms`.

---

## 6. Patrones de Componentes UI

### 6.1. Hero Carrusel Cinemático (Home)
- **Temporizador:** Barra de progreso lineal sincronizada a **7.5 segundos (`7500ms`)**.
- **Pausa Inteligente:** Pausa indefinida en hover o cuando un elemento interno gana foco mediante teclado.
- **Navegación:** Botones Anterior / Siguiente, puntos de salto directo y atajos de teclado (`ArrowLeft`, `ArrowRight`).

### 6.2. Tarjetas de Servicios y Proyectos (Card Pattern)
- Contenedores con fondo glassmorphism (`backdrop-filter: blur(16px)`).
- Elevación reactiva en hover con `transform: translateY(-6px)`.
- Badges de colores por especialidad:
  - `.badge`: Web & Cloud (Azul Aero / Celeste).
  - `.badge--orange`: Apps Móviles (Dusty Rose).
  - `.badge--teal`: IA & Data (Sage Arena).

### 6.3. Barra de Navegación Sticky & Top Progress
- Encabezado fijo con detección de scroll (`.is-scrolled`).
- Barra de progreso superior ultra-fina (`.page-progress-bar`) que guía visualmente las transiciones entre páginas sin saltos bruscos.

### 6.4. Formulario Accesible con Estado
- Campos con etiquetas explícitas `<label for="...">`.
- Contenedores de error con `role="alert"` asociados con `aria-describedby`.
- Estados visuales claros:
  - `.form-control.is-invalid`: Borde rojo con mensaje explicativo.
  - `.form-control.is-valid`: Borde verde de confirmación.
  - `.btn.is-loading`: Spinner rotatorio que bloquea múltiples envíos accidentales.
