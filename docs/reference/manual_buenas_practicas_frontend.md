# Arneses y aspectos de desarrollo Frontend

## HTML5 + CSS3 + JavaScript Vanilla

> **Stack base:** HTML5 + CSS3 + JavaScript moderno (ES6+)
> **Arquitectura:** Vanilla JS modular + Domain/Application/UI separation
> **Estilo:** BEM + Design Tokens + Responsive Design
> **UI opcional:** Bootstrap + Material Design 3
> **Animaciones:** CSS + Animista + Animate.css + Hover.css + CSS Shake
> **Estado:** Vanilla Store / XState / RxJS según necesidad
> **Validación:** HTML Constraint Validation + Zod cuando sea necesario
> **Backend:** PHP 8.2 Vanilla
> **Objetivo:** frontend semántico, accesible, mantenible, testeable, seguro, performante y desacoplado del backend y de la interfaz.

---

# 1. Filosofía general

El frontend no debe considerarse simplemente:

```text
HTML
+
CSS
+
JavaScript
```

sino como una aplicación que tiene diferentes responsabilidades:

```text
                    FRONTEND
                       │
        ┌──────────────┼──────────────┐
        │              │              │
       HTML           CSS             JS
        │              │              │
     Semántica      Presentación     Comportamiento
     Accesibilidad  Diseño           Dominio
     SEO            Layout           Estado
     Estructura     Responsive       Comunicación
```

La regla fundamental es:

> **HTML describe qué es el contenido. CSS describe cómo se presenta. JavaScript describe comportamiento y coordinación.**

No se debe utilizar JavaScript para resolver problemas que HTML o CSS ya resuelven correctamente.

---

# 2. Principios fundamentales

El frontend debe priorizar:

```text
1. Accesibilidad
2. Correctitud semántica
3. Seguridad
4. Usabilidad
5. Mantenibilidad
6. Testabilidad
7. Performance
8. Responsive Design
9. SEO
10. Extensibilidad
```

Una interfaz visualmente atractiva pero inaccesible o difícil de mantener no constituye un frontend profesional.

---

# 3. Separación de responsabilidades

Debe existir una separación conceptual clara:

```text
HTML
│
├── estructura
├── semántica
├── contenido
└── accesibilidad nativa

CSS
│
├── layout
├── apariencia
├── responsive
├── estados visuales
└── animaciones

JavaScript
│
├── interacción
├── estado
├── dominio
├── casos de uso
├── comunicación HTTP
└── coordinación
```

Evitar:

```text
HTML con estilos inline
CSS dependiendo de IDs de JavaScript
JavaScript conteniendo HTML gigantesco
Reglas de negocio dentro de event listeners
```

---

# 4. HTML semántico como primera prioridad

Utilizar siempre el elemento HTML que represente correctamente el significado del contenido.

Preferir:

```html
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
<figure>
<figcaption>
<address>
<time>
<details>
<summary>
<form>
<label>
<button>
```

en lugar de construir toda la interfaz mediante:

```html
<div>
    <div>
        <div>
            ...
        </div>
    </div>
</div>
```

HTML semántico aporta estructura comprensible para navegadores, tecnologías asistivas y motores de búsqueda.

---

# 5. Regla: `div` no es un elemento universal

`<div>` debe utilizarse cuando realmente se necesita un contenedor sin significado semántico propio.

No utilizar:

```html
<div class="button">
    Guardar
</div>
```

Preferir:

```html
<button type="submit">
    Guardar
</button>
```

El `<button>` ya incorpora comportamiento de teclado y semántica accesible.

---

# 6. Diferenciar enlace y botón

Utilizar:

```html
<a href="/usuarios">
    Usuarios
</a>
```

cuando se navega.

Utilizar:

```html
<button type="button">
    Abrir menú
</button>
```

cuando se ejecuta una acción.

No utilizar:

```html
<a href="#" onclick="...">
```

para acciones que no representan navegación.

---

# 7. Estructura HTML5 recomendada

Una página debería comenzar aproximadamente así:

```html
<!doctype html>

<html lang="es">
<head>
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title>Título de la página</title>

    <meta
        name="description"
        content="Descripción clara de la página."
    >

    <link
        rel="stylesheet"
        href="/assets/css/main.css"
    >
</head>

<body>

<header>
    ...
</header>

<nav aria-label="Navegación principal">
    ...
</nav>

<main id="main-content">
    ...
</main>

<footer>
    ...
</footer>

<script
    type="module"
    src="/assets/js/main.js"
></script>

</body>
</html>
```

El atributo `lang` es importante para que tecnologías asistivas interpreten correctamente el idioma del documento.

---

# 8. Metadata

El `<head>` debe tratarse como una parte importante de la aplicación.

Considerar:

```html
<meta charset="utf-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1"
>

<title>...</title>

<meta
    name="description"
    content="..."
>
```

Cuando corresponda:

```html
<meta name="robots" content="index, follow">
```

Open Graph:

```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:type" content="website">
```

Twitter/X metadata cuando el proyecto lo requiera.

También considerar:

```html
<link rel="canonical" href="...">
<link rel="icon" href="/favicon.ico">
```

No agregar metadata simplemente por cantidad: cada elemento debe tener una finalidad.

---

# 9. SEO técnico

Utilizar:

```html
<title>
<meta name="description">
<h1>
<h2>
<h3>
<a>
<nav>
<main>
<article>
```

correctamente.

Evitar:

```html
<h1>
    <span>...</span>
</h1>

<h1>
    <span>...</span>
</h1>

<h1>
    <span>...</span>
</h1>
```

sin una estructura jerárquica real.

---

# 10. Jerarquía de headings

La jerarquía debe representar la estructura del contenido:

```text
h1
 ├── h2
 │    ├── h3
 │    └── h3
 └── h2
      └── h3
```

No elegir un `<h3>` simplemente porque "queda más pequeño".

El tamaño visual corresponde a CSS.

---

# 11. Un `<main>` principal

Una página debería tener un contenido principal claramente identificable:

```html
<main id="main-content">
```

El `main` representa el contenido central de la página.

---

# 12. Skip Link

En páginas con navegación compleja:

```html
<a
    class="skip-link"
    href="#main-content"
>
    Saltar al contenido principal
</a>
```

Esto permite que usuarios de teclado eviten atravesar repetidamente la navegación.

---

# 13. Navegación

Utilizar:

```html
<nav aria-label="Navegación principal">
```

cuando representa un bloque de navegación.

No utilizar `<nav>` para cualquier conjunto de enlaces.

---

# 14. Formularios semánticos

Utilizar:

```html
<form>
    <label for="email">
        Correo electrónico
    </label>

    <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
    >

    <button type="submit">
        Registrarse
    </button>
</form>
```

Las etiquetas correctamente asociadas son fundamentales para accesibilidad.

---

# 15. `label` obligatorio

Evitar:

```html
<input
    type="email"
    placeholder="Email"
>
```

como único mecanismo de identificación.

Preferir:

```html
<label for="email">
    Correo electrónico
</label>

<input
    id="email"
    name="email"
    type="email"
>
```

El placeholder no reemplaza al label.

---

# 16. Utilizar atributos HTML nativos

Antes de implementar validación mediante JavaScript:

```html
<input
    type="email"
    required
    minlength="5"
    maxlength="100"
>
```

Utilizar las capacidades nativas del navegador.

---

# 17. `autocomplete`

Utilizar `autocomplete` cuando corresponda:

```html
<input
    type="email"
    autocomplete="email"
>
```

Ejemplos:

```text
name
given-name
family-name
email
tel
street-address
postal-code
country
username
current-password
new-password
```

Esto mejora UX y accesibilidad.

---

# 18. `fieldset` y `legend`

Para grupos de controles relacionados:

```html
<fieldset>
    <legend>
        Preferencias de notificación
    </legend>

    ...
</fieldset>
```

---

# 19. Tablas correctamente estructuradas

Utilizar:

```html
<table>
    <caption>
        Usuarios registrados
    </caption>

    <thead>
        <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Email</th>
        </tr>
    </thead>

    <tbody>
        ...
    </tbody>
</table>
```

No utilizar tablas para construir layouts.

---

# 20. Imágenes

Toda imagen informativa debe tener:

```html
<img
    src="/images/profile.webp"
    alt="Fotografía de Juan Pérez"
>
```

Una imagen puramente decorativa puede utilizar:

```html
<img
    src="/images/decorative.svg"
    alt=""
>
```

El texto alternativo debe comunicar la finalidad de la imagen, no describirla innecesariamente.

---

# 21. Imágenes responsive

Cuando corresponda:

```html
<img
    src="image-800.webp"
    srcset="
        image-400.webp 400w,
        image-800.webp 800w,
        image-1200.webp 1200w
    "
    sizes="
        (max-width: 600px) 100vw,
        50vw
    "
    alt="..."
>
```

Esto permite adaptar recursos al dispositivo.

---

# 22. Lazy loading

Para imágenes fuera del viewport inicial:

```html
<img
    src="..."
    loading="lazy"
    alt="..."
>
```

No aplicar indiscriminadamente `lazy` a todo, especialmente a recursos críticos del primer viewport.

---

# 23. Multimedia

Utilizar elementos nativos:

```html
<video>
<audio>
<track>
```

cuando corresponda.

Proporcionar subtítulos/transcripciones cuando sean necesarios.

---

# 24. Accesibilidad por teclado

Todo elemento interactivo debe poder utilizarse mediante teclado.

Verificar:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow keys
```

según el componente.

---

# 25. Focus visible

Nunca eliminar completamente:

```css
outline: none;
```

sin proporcionar una alternativa accesible.

Preferir:

```css
:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
}
```

---

# 26. ARIA como complemento, no como sustituto

La primera regla debe ser:

> Si HTML nativo ya proporciona la semántica y comportamiento necesarios, utilizar HTML nativo.

ARIA debe utilizarse cuando la semántica requerida no puede expresarse adecuadamente mediante HTML nativo.

Evitar:

```html
<div
    role="button"
    tabindex="0"
>
    Guardar
</div>
```

cuando puede utilizarse:

```html
<button type="button">
    Guardar
</button>
```

---

# 27. Estados ARIA dinámicos

Cuando realmente corresponda:

```html
<button
    aria-expanded="false"
    aria-controls="menu"
>
    Menú
</button>
```

JavaScript debe mantener el estado ARIA sincronizado con el estado visual.

---

# 28. Live regions

Para mensajes dinámicos importantes:

```html
<div
    aria-live="polite"
    aria-atomic="true"
    class="notification"
></div>
```

No utilizar `aria-live` indiscriminadamente.

---

# 29. HTML debe funcionar sin JavaScript cuando sea razonable

Siempre que la arquitectura lo permita:

```text
HTML
 ↓
contenido básico
 ↓
interacción progresiva
 ↓
JavaScript mejora la experiencia
```

Esto se denomina **progressive enhancement**.

---

# 30. CSS: arquitectura

Separar conceptualmente:

```text
CSS
│
├── tokens
├── reset/base
├── layout
├── components
├── utilities
├── states
└── pages
```

Una estructura posible:

```text
assets/
└── css/
    ├── tokens.css
    ├── reset.css
    ├── base.css
    ├── layout.css
    ├── components/
    │   ├── button.css
    │   ├── card.css
    │   ├── modal.css
    │   └── form.css
    ├── utilities.css
    └── main.css
```

---

# 31. BEM

Utilizar BEM para componentes cuando ayude a controlar la complejidad.

```text
.block
.block__element
.block--modifier
```

Ejemplo:

```html
<article class="card card--featured">
    <h2 class="card__title">
        Producto
    </h2>

    <p class="card__description">
        Descripción.
    </p>
</article>
```

BEM busca que los bloques sean independientes y que los nombres comuniquen estructura y estado.

---

# 32. Evitar selectores CSS excesivamente específicos

Evitar:

```css
main section article div.card ul li span.title {
    ...
}
```

Preferir:

```css
.card__title {
    ...
}
```

Esto reduce especificidad y facilita mantenimiento.

---

# 33. Evitar IDs para estilos

Evitar:

```css
#main-button {
}
```

Preferir:

```css
.button {
}
```

Los IDs deberían reservarse principalmente para:

```text
identificación DOM
anclas
relaciones ARIA
JavaScript cuando sea necesario
```

---

# 34. Evitar `!important`

No utilizar:

```css
color: red !important;
```

como solución habitual a problemas de especificidad.

Si se utiliza, debe existir una razón clara y documentada.

---

# 35. Design Tokens

Centralizar decisiones de diseño:

```css
:root {
    --color-primary: ...;
    --color-surface: ...;
    --color-text: ...;

    --space-1: ...;
    --space-2: ...;
    --space-3: ...;

    --radius-sm: ...;
    --radius-md: ...;

    --shadow-sm: ...;

    --font-size-body: ...;
    --font-size-heading: ...;
}
```

Esto permite modificar el sistema visual desde un único lugar.

---

# 36. Material Design 3

Material Design 3 puede utilizarse como fuente de:

```text
componentes
tokens
tipografía
elevación
color
motion
accesibilidad
```

Pero no debería imponerse automáticamente sobre todo el diseño.

La aplicación debería tener su propio **Design System**.

---

# 37. Bootstrap

Bootstrap puede utilizarse para:

```text
grid
responsive utilities
componentes base
spacing
forms
utilities
```

Pero se debe evitar:

```html
<div class="container row col-md-6 mt-3 d-flex ...">
```

cuando una estructura CSS propia sería más clara.

Bootstrap debe reducir trabajo, no convertirse en la arquitectura visual completa.

---

# 38. Bootstrap + Material Design

Evitar mezclar componentes visuales completos de Bootstrap y Material Design indiscriminadamente.

Puede generar:

```text
inconsistencia visual
conflictos CSS
duplicación
mayor bundle
diferentes convenciones
```

Una estrategia más limpia es:

```text
Bootstrap
    ↓
layout/utilidades

Material Design 3
    ↓
principios/tokens/componentes seleccionados

CSS propio
    ↓
identidad visual del proyecto
```

---

# 39. Animaciones

Utilizar animaciones para comunicar:

```text
estado
transición
jerarquía
feedback
causalidad
```

No animar simplemente porque "se ve bonito".

---

# 40. `prefers-reduced-motion`

Toda animación significativa debería considerar:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

# 41. Animista

Animista puede utilizarse para generar animaciones CSS reutilizables.

Regla:

> El resultado debe incorporarse al Design System y no copiarse indiscriminadamente componente por componente.

---

# 42. Animate.css

Puede utilizarse para animaciones genéricas.

Pero evitar:

```html
<div class="animate__animated animate__bounce animate__delay-2s ...">
```

por toda la aplicación.

Las animaciones deben tener significado dentro del sistema de interacción.

---

# 43. Hover.css

Puede utilizarse para microinteracciones.

Pero nunca depender únicamente de `:hover` para transmitir información importante.

Un dispositivo táctil puede no tener hover.

---

# 44. CSS Shake

Utilizar efectos de shake exclusivamente para feedback apropiado, por ejemplo:

```text
campo inválido
credenciales incorrectas
entrada rechazada
```

Nunca utilizar movimiento excesivo.

---

# 45. Responsive Design

Diseñar desde el contenido, no desde dispositivos específicos.

Evitar:

```css
@media (max-width: 768px)
```

como única estrategia conceptual.

Preferir breakpoints determinados por:

```text
contenido
layout
legibilidad
interacción
```

---

# 46. Mobile First

Preferir:

```css
.component {
    ...
}

@media (min-width: 768px) {
    .component {
        ...
    }
}
```

sobre diseñar primero únicamente para escritorio.

---

# 47. Flexbox y Grid

Utilizar:

```text
Flexbox
```

para:

```text
alineación
distribución en una dimensión
componentes
```

y:

```text
CSS Grid
```

para:

```text
layouts bidimensionales
secciones
grillas
```

No utilizar floats para layouts modernos.

---

# 48. Evitar tamaños rígidos

Evitar:

```css
width: 1000px;
height: 700px;
```

Preferir:

```css
width: min(100%, 70rem);
min-height: ...
```

según el caso.

---

# 49. Unidades relativas

Preferir:

```text
rem
em
%
vw
vh
dvh
svh
lvh
```

cuando sean apropiadas.

No significa eliminar `px`: `px` sigue siendo apropiado para determinados detalles.

---

# 50. Container Queries

Cuando el componente deba responder a su contenedor y no al viewport, considerar:

```css
@container ...
```

Esto permite crear componentes realmente reutilizables.

---

# 51. CSS moderno

Considerar funcionalidades modernas como:

```text
CSS Custom Properties
clamp()
min()
max()
minmax()
aspect-ratio
container queries
logical properties
color functions
:has()
```

siempre evaluando compatibilidad y necesidad.

---

# 52. Logical Properties

Para interfaces internacionales:

```css
margin-inline
padding-inline
inset-inline
border-inline
```

pueden ser preferibles a asumir siempre:

```text
left
right
```

---

# 53. Color

Nunca utilizar color como único mecanismo para comunicar información.

Malo:

```text
Rojo = error
Verde = éxito
```

Mejor:

```text
icono
texto
color
estado
```

combinados.

---

# 54. Contraste

El contraste debe permitir que el contenido pueda ser leído correctamente.

No diseñar únicamente pensando:

```text
"se ve bien en mi monitor"
```

---

# 55. Tipografía

Definir:

```text
font-family
font-size
font-weight
line-height
letter-spacing
```

como parte del Design System.

Priorizar legibilidad sobre ornamentación.

---

# 56. `line-height`

No dejar que el navegador sea la única fuente de decisiones tipográficas.

Para texto largo, definir un `line-height` apropiado.

---

# 57. No utilizar texto como imagen

Evitar imágenes que contienen información textual cuando el texto real pueda utilizarse.

El texto HTML es:

```text
seleccionable
traducible
accesible
indexable
responsive
```

---

# 58. CSS de estados

Definir estados claramente:

```text
:hover
:focus-visible
:active
:disabled
:checked
:invalid
[aria-expanded="true"]
```

No depender únicamente de clases JavaScript como:

```text
.active
```

cuando existe un estado nativo apropiado.

---

# 59. JavaScript moderno

Utilizar:

```text
ES Modules
const
let
arrow functions
classes
async/await
Promise
fetch
AbortController
optional chaining
nullish coalescing
```

Evitar código basado en:

```text
var
globals
inline handlers
document.write()
```

---

# 60. ES Modules

Preferir:

```html
<script
    type="module"
    src="/assets/js/main.js"
></script>
```

y:

```js
import { UserService } from './application/UserService.js';
```

Esto permite dividir el código por responsabilidad.

---

# 61. Evitar JavaScript global

Evitar:

```js
window.user = ...
window.app = ...
window.service = ...
```

Preferir módulos.

---

# 62. Arquitectura JavaScript

Una estructura recomendada:

```text
assets/js/
│
├── main.js
│
├── domain/
│   ├── entities/
│   ├── valueObjects/
│   └── rules/
│
├── application/
│   └── useCases/
│
├── infrastructure/
│   ├── api/
│   ├── storage/
│   └── services/
│
├── state/
│   ├── store.js
│   └── machines/
│
└── presentation/
    ├── components/
    ├── controllers/
    └── views/
```

---

# 63. Dominio independiente del DOM

Una regla fundamental:

> El dominio no debe saber que existe HTML.

Evitar:

```js
class UserService {
    createUser() {
        document.querySelector('#message').textContent =
            'Usuario creado';
    }
}
```

Esto mezcla:

```text
dominio
+
presentación
```

---

# 64. Separación correcta

Preferir:

```text
User
 ↓
CreateUser
 ↓
UserRepository
 ↓
Controller
 ↓
DOM
```

El caso de uso devuelve un resultado.

La interfaz decide cómo mostrarlo.

---

# 65. Entidades

Las entidades pueden implementarse mediante clases ES6:

```js
export class User {
    constructor({ id, name, email }) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    displayName() {
        return this.name;
    }
}
```

La entidad no necesita conocer:

```text
document
window
HTMLElement
fetch
Bootstrap
CSS
```

---

# 66. Value Objects

Ejemplo:

```js
export class Email {
    constructor(value) {
        if (!value.includes('@')) {
            throw new Error('Invalid email');
        }

        this.value = value;
    }
}
```

Para reglas más complejas puede utilizarse Zod.

---

# 67. Casos de uso

Representar operaciones del sistema:

```js
export class CreateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(data) {
        // Regla de aplicación.
    }
}
```

Esto hace que el caso de uso sea independiente de la interfaz.

---

# 68. Dependency Injection

Preferir:

```js
const service = new UserService(repository);
```

en lugar de:

```js
class UserService {
    constructor() {
        this.repository = new ApiUserRepository();
    }
}
```

La composición debe ocurrir fuera de la clase.

---

# 69. Composition Root

Por ejemplo:

```text
main.js
   │
   ├── ApiClient
   ├── UserRepository
   ├── UserService
   ├── Store
   └── Controllers
```

`main.js` puede encargarse de ensamblar la aplicación.

---

# 70. Servicios

Los servicios encapsulan infraestructura o cálculos complejos.

Ejemplo:

```js
class UserApi {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    findAll() {
        return this.httpClient.get('/api/users');
    }
}
```

El servicio no debería manipular directamente el DOM.

---

# 71. API Client

Centralizar comunicación HTTP:

```text
UI
 ↓
Use Case
 ↓
Repository
 ↓
ApiClient
 ↓
fetch()
 ↓
PHP
```

No distribuir `fetch()` por todos los componentes.

---

# 72. Fetch

`fetch()` no rechaza automáticamente una Promise simplemente porque el servidor haya respondido `404` o `500`; se debe comprobar `response.ok` o `response.status`.

Patrón:

```js
const response = await fetch('/api/users');

if (!response.ok) {
    throw new Error(
        `HTTP ${response.status}`
    );
}

const data = await response.json();
```

---

# 73. AbortController

Las peticiones cancelables deben utilizar:

```js
const controller = new AbortController();

fetch('/api/users', {
    signal: controller.signal
});

// cancelar
controller.abort();
```

Esto es especialmente útil para:

```text
búsquedas
autocomplete
navegación
componentes desmontados
peticiones reemplazadas
```

---

# 74. Evitar race conditions

Ejemplo:

```text
usuario escribe:

a
ab
abc
```

No queremos que la respuesta de:

```text
a
```

llegue después de:

```text
abc
```

y sobrescriba el resultado actual.

Soluciones:

```text
AbortController
debounce
request IDs
estado explícito
```

---

# 75. Debounce

Utilizar debounce para operaciones como:

```text
búsqueda
autocomplete
validación remota
filtros
```

No lanzar una petición por cada tecla si no es necesario.

---

# 76. Throttle

Utilizar throttle para eventos de alta frecuencia:

```text
scroll
resize
mousemove
pointermove
```

cuando corresponda.

---

# 77. Event delegation

Para listas dinámicas:

```js
container.addEventListener(
    'click',
    (event) => {
        const button = event.target.closest(
            '[data-action="delete"]'
        );

        if (!button) {
            return;
        }

        // ...
    }
);
```

Esto evita registrar cientos de listeners individuales.

---

# 78. `data-*` para comportamiento

Puede utilizarse:

```html
<button
    type="button"
    data-action="delete"
    data-user-id="42"
>
    Eliminar
</button>
```

Esto permite conectar comportamiento sin acoplar JavaScript a clases visuales.

---

# 79. CSS no debe depender de clases JS

Evitar que JavaScript seleccione:

```js
document.querySelector('.blue-button')
```

si `.blue-button` solamente representa diseño.

Preferir:

```html
<button
    class="button button--primary"
    data-action="save"
>
```

---

# 80. Estado

No todo necesita un store global.

Primero determinar:

```text
¿El estado pertenece a un componente?
```

Si sí:

```text
estado local
```

Si múltiples partes necesitan compartirlo:

```text
store
```

Si existe un workflow complejo:

```text
state machine
```

---

# 81. Zustand Vanilla

Zustand puede utilizarse como store independiente de React mediante su API Vanilla.

Su responsabilidad debería ser:

```text
estado global
+
acciones
```

No debería convertirse automáticamente en la ubicación de todas las reglas de negocio.

---

# 82. MobX

MobX puede utilizarse cuando interesa un modelo reactivo observable.

Conceptualmente:

```text
Observable state
      ↓
Computed values
      ↓
Reactions
```

Es una solución válida, pero puede resultar innecesaria si el proyecto solamente necesita un store pequeño.

---

# 83. RxJS

RxJS es especialmente útil para secuencias de eventos y operaciones asíncronas.

Su modelo gira alrededor de:

```text
Observable
Observer
Subscription
Operators
Subject
Schedulers
```

Ejemplos apropiados:

```text
autocomplete
event streams
WebSockets
polling
composición de requests
cancelación
eventos complejos
```

---

# 84. No utilizar RxJS para todo

No convertir:

```js
button.addEventListener(...)
```

en:

```js
fromEvent(button, 'click')
```

simplemente porque RxJS está instalado.

La abstracción debe justificar su coste conceptual.

---

# 85. XState

XState es especialmente apropiado cuando existe una máquina de estados explícita.

Ejemplo:

```text
idle
 ↓
loading
 ↓
success
```

o:

```text
idle
 ├── submit
 ↓
loading
 ├── success → completed
 ├── failure → error
 └── cancel → idle
```

XState permite modelar lógica basada en eventos, máquinas de estado, statecharts y actores.

---

# 86. Cuándo utilizar XState

Especialmente útil para:

```text
formularios complejos
checkout
autenticación
subidas de archivos
wizards
procesos multi-step
modales complejos
workflows
```

No utilizar una máquina de estados para:

```text
botón simple
toggle simple
mostrar/ocultar un elemento
```

si CSS/JS sencillo es suficiente.

---

# 87. Selección de herramientas de estado

Una regla práctica:

```text
Estado local
    ↓
JavaScript normal

Estado compartido simple
    ↓
Zustand Vanilla

Modelo observable
    ↓
MobX

Streams/eventos complejos
    ↓
RxJS

Estados/workflows complejos
    ↓
XState
```

No significa que nunca puedan coexistir.

Significa que cada herramienta debe tener un propósito explícito.

---

# 88. Zod

Zod puede utilizarse para validar estructuras de datos.

Por ejemplo:

```js
import * as z from 'zod';

const UserSchema = z.object({
    name: z.string().min(1),
    email: z.email()
});
```

Zod permite definir esquemas y validarlos en JavaScript moderno, además de TypeScript.

---

# 89. Validar datos externos

Todo dato proveniente de:

```text
API
localStorage
sessionStorage
URL
postMessage
formularios
backend
```

debe considerarse no confiable.

Puede pasar por:

```text
HTML validation
        ↓
Zod
        ↓
caso de uso
```

cuando el nivel de complejidad lo justifique.

---

# 90. Frontend ≠ autoridad de seguridad

La validación JavaScript mejora UX.

Pero:

> **PHP debe volver a validar todo dato recibido.**

Nunca confiar en:

```text
HTML
JavaScript
Zod
TypeScript
```

como mecanismo definitivo de seguridad.

El backend continúa siendo la autoridad.

---

# 91. No insertar HTML sin necesidad

Evitar:

```js
element.innerHTML = userInput;
```

cuando el contenido no es confiable.

Preferir:

```js
element.textContent = userInput;
```

para texto.

---

# 92. XSS

Tratar como peligrosos los datos provenientes de:

```text
API
URL
formularios
localStorage
backend
third-party content
```

No confiar en ellos.

---

# 93. `localStorage`

No almacenar información sensible como:

```text
contraseñas
tokens altamente sensibles
datos privados
```

sin evaluar cuidadosamente el modelo de seguridad.

Recordar que JavaScript de la misma origin puede acceder a `localStorage`.

---

# 94. Cookies

Si una cookie contiene información de autenticación sensible, preferir mecanismos gestionados por el servidor con atributos de seguridad apropiados, especialmente:

```text
HttpOnly
Secure
SameSite
```

cuando corresponda.

---

# 95. CSRF

Si PHP utiliza autenticación mediante cookies, el frontend debe participar correctamente en el mecanismo CSRF definido por el backend.

Por ejemplo:

```text
PHP
 ↓
genera CSRF token
 ↓
HTML/API
 ↓
JavaScript
 ↓
envía token
```

---

# 96. No confiar en CORS como mecanismo de autenticación

CORS controla qué orígenes pueden realizar determinados accesos desde navegadores.

No reemplaza:

```text
autenticación
autorización
CSRF
validación
```

---

# 97. Gestión de errores

Separar:

```text
error técnico
error de dominio
error de validación
error de autorización
error de red
```

Ejemplo:

```js
try {
    await createUser.execute(data);
} catch (error) {
    // Traducir el error a una representación de UI.
}
```

El caso de uso no debería modificar:

```text
DOM
CSS
toasts
modals
```

---

# 98. Error Boundary conceptual

Vanilla JS no proporciona un Error Boundary como algunos frameworks.

Pero puede implementarse una estrategia de manejo:

```text
main.js
 ↓
bootstrap
 ↓
global error handling
 ↓
logging
 ↓
UI fallback
```

Utilizar:

```js
window.addEventListener(
    'error',
    handleError
);

window.addEventListener(
    'unhandledrejection',
    handlePromiseError
);
```

sin utilizar estos handlers para ocultar errores de programación.

---

# 99. Logging frontend

Registrar eventos útiles:

```text
errores
fallos de API
errores de parsing
errores de inicialización
```

Evitar:

```js
console.log(userPassword);
```

Nunca registrar información sensible.

---

# 100. Inicialización de la aplicación

Con módulos:

```js
import { bootstrap } from './bootstrap.js';

bootstrap();
```

El módulo puede cargarse mediante:

```html
<script
    type="module"
    src="/assets/js/main.js"
></script>
```

Los scripts `type="module"` se integran con el ciclo de parsing del documento; no es necesario añadir `DOMContentLoaded` indiscriminadamente.

---

# 101. DOMContentLoaded

Utilizarlo cuando realmente sea necesario.

No:

```js
document.addEventListener(
    'DOMContentLoaded',
    () => {
        // absolutamente todo
    }
);
```

si el script ya se carga apropiadamente como módulo.

---

# 102. No ejecutar lógica de dominio en listeners

Evitar:

```js
button.addEventListener('click', async () => {
    const email = input.value;

    if (...) {
        ...
    }

    await fetch(...);

    ...
});
```

El listener debería ser un adaptador:

```text
DOM event
 ↓
Controller
 ↓
Use Case
 ↓
Result
 ↓
View
```

---

# 103. Patrón Controller

Por ejemplo:

```js
class UserController {
    constructor(createUser, view) {
        this.createUser = createUser;
        this.view = view;
    }

    async submit(data) {
        const result =
            await this.createUser.execute(data);

        this.view.showSuccess(result);
    }
}
```

El controller conecta interfaz y aplicación.

---

# 104. Patrón View

La View debería encargarse de:

```text
renderizar
actualizar elementos
mostrar estados
mostrar errores
```

No debería contener reglas de negocio.

---

# 105. Renderizado

Preferir funciones pequeñas:

```js
function renderUser(user) {
    const element = document.createElement('article');

    element.textContent = user.name;

    return element;
}
```

Cuando se construyan nodos dinámicos, evitar insertar directamente contenido no confiable mediante `innerHTML`.

---

# 106. Templates HTML

Para estructuras repetitivas puede utilizarse:

```html
<template id="user-template">
    <article class="user-card">
        <h2 class="user-card__name"></h2>
    </article>
</template>
```

JavaScript puede clonar el template.

Esto mantiene parte de la estructura visual en HTML.

---

# 107. Custom Elements

En proyectos grandes puede evaluarse:

```text
Web Components
Custom Elements
Shadow DOM
HTML Templates
```

pero no es necesario construir todos los componentes como Web Components.

Utilizarlos cuando aporten encapsulamiento real.

---

# 108. Progressive Enhancement

La arquitectura ideal puede ser:

```text
HTML funcional
      ↓
CSS mejora presentación
      ↓
JS mejora interacción
      ↓
APIs mejoran experiencia
```

No:

```text
JavaScript carga absolutamente todo
      ↓
sin JS nada existe
```

cuando el caso de uso no lo requiere.

---

# 109. Accesibilidad dinámica

Cada vez que JavaScript cambia el estado visual, debe preguntarse:

```text
¿Puede un usuario de teclado percibirlo?
¿Puede un lector de pantalla percibirlo?
¿El focus permanece correcto?
¿ARIA refleja el estado?
¿El movimiento respeta prefers-reduced-motion?
```

---

# 110. Modales

Un modal profesional debe gestionar:

```text
focus inicial
focus trap
Escape
restauración del focus
aria-modal
nombre accesible
estado abierto/cerrado
```

Cuando sea apropiado, utilizar el elemento nativo:

```html
<dialog>
```

en lugar de construir un modal completamente desde cero.

---

# 111. Menús

No construir un menú interactivo como:

```html
<div onclick="...">
```

Preferir:

```html
<button
    type="button"
    aria-expanded="false"
    aria-controls="menu"
>
    Menú
</button>
```

y mantener correctamente el estado.

---

# 112. Loading states

Toda operación asíncrona importante debería tener estados explícitos:

```text
idle
loading
success
error
```

En procesos complejos puede utilizarse XState.

---

# 113. Skeletons

Los skeleton loaders deben utilizarse cuando realmente mejoren la percepción de carga.

No sustituir contenido indefinidamente por skeletons.

---

# 114. Estado vacío

Toda colección debería considerar:

```text
loading
success con datos
success sin datos
error
```

Ejemplo:

```text
Usuarios
├── cargando
├── usuarios encontrados
├── no hay usuarios
└── error
```

---

# 115. Estado offline

Cuando corresponda:

```js
window.addEventListener(
    'online',
    ...
);

window.addEventListener(
    'offline',
    ...
);
```

La interfaz puede comunicar el estado de conectividad.

No asumir que:

```text
navigator.onLine === servidor disponible
```

---

# 116. Performance

Optimizar primero lo que realmente afecta al usuario.

Considerar:

```text
HTML
CSS
JS
imágenes
fuentes
requests
rendering
layout
```

---

# 117. JavaScript mínimo

No convertir una página estática en una aplicación JavaScript completa sin necesidad.

Si HTML y CSS resuelven algo:

```text
utilizar HTML/CSS
```

antes de añadir JS.

---

# 118. Code splitting

En aplicaciones grandes:

```text
cargar únicamente lo necesario
```

mediante módulos dinámicos:

```js
const module = await import('./feature.js');
```

---

# 119. Lazy loading de funcionalidades

Cargar funcionalidades pesadas cuando el usuario realmente las necesita.

Por ejemplo:

```text
editor
charts
mapas
PDF viewer
```

---

# 120. Evitar layout thrashing

No alternar constantemente:

```text
leer layout
escribir layout
leer layout
escribir layout
```

Ejemplo:

```js
element.offsetHeight;
element.style.height = ...;
element.offsetHeight;
```

Agrupar lecturas y escrituras.

---

# 121. Animaciones con `transform` y `opacity`

Para animaciones frecuentes, preferir propiedades que puedan ser manejadas eficientemente por el navegador:

```css
transform
opacity
```

sobre modificar repetidamente:

```text
top
left
width
height
```

cuando sea posible.

---

# 122. CSS performance

Evitar selectores excesivamente complejos y CSS innecesariamente grande.

La complejidad de las reglas puede afectar el trabajo de cálculo de estilos y rendering.

---

# 123. Fonts

No cargar:

```text
10 familias
20 pesos
5 variantes
```

si solamente se necesitan:

```text
1 familia
2 pesos
```

Optimizar fuentes y considerar `font-display`.

---

# 124. Recursos críticos

Priorizar:

```text
HTML
CSS crítico
fuentes realmente necesarias
imágenes del primer viewport
```

No bloquear innecesariamente el rendering.

---

# 125. Accesibilidad responsive

Responsive no significa únicamente:

```text
desktop → mobile
```

También debe contemplar:

```text
zoom
fuentes grandes
orientación
touch
teclado
lectores de pantalla
motion preferences
contraste
```

web.dev destaca que responsive design y accesibilidad están directamente relacionados.

---

# 126. Arquitectura completa

Una arquitectura frontend recomendada:

```text
                         FRONTEND
                            │
                  ┌─────────┴─────────┐
                  │                   │
                HTML                 CSS
                  │                   │
             Semántica           Design System
             Accesibilidad       Layout
             SEO                 Responsive
                  │                   │
                  └─────────┬─────────┘
                            │
                           JS
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
      Domain            Application       Infrastructure
        │                   │                   │
    Entities            Use Cases           API
    Value Objects        Services            Storage
    Rules                                    Browser APIs
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                       Presentation
                            │
                     Controllers
                     Views
                     Components
                            │
                            ▼
                           DOM
```

---

# 127. Flujo de una interacción

Ejemplo: crear usuario.

```text
Usuario
   │
   ▼
<form>
   │
   ▼
DOM Event
   │
   ▼
Controller
   │
   ▼
Validation
   │
   ▼
CreateUser Use Case
   │
   ▼
User Entity
   │
   ▼
UserRepository
   │
   ▼
ApiClient
   │
   ▼
PHP Backend
   │
   ▼
Response
   │
   ▼
Application Result
   │
   ▼
Controller
   │
   ▼
View
   │
   ▼
DOM
```

---

# 128. Frontera entre frontend y backend

La frontera debe ser explícita:

```text
┌───────────────────────────────┐
│            FRONTEND           │
│                               │
│ UX                            │
│ estado de UI                  │
│ validación preliminar         │
│ presentación                  │
│ interacción                   │
│                               │
└───────────────┬───────────────┘
                │
             HTTP/API
                │
┌───────────────▼───────────────┐
│            BACKEND            │
│                               │
│ autoridad                     │
│ autenticación                 │
│ autorización                  │
│ validación definitiva         │
│ reglas críticas               │
│ persistencia                  │
│ seguridad                     │
│                               │
└───────────────────────────────┘
```

---

# 129. Contrato API

Frontend y PHP deberían compartir contratos explícitos.

Por ejemplo:

```json
{
    "data": {
        "id": 10,
        "name": "Juan"
    }
}
```

y errores:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid email."
    }
}
```

Esto evita que JavaScript dependa de respuestas ambiguas.

---

# 130. No acoplar frontend a SQL

El frontend nunca debería conocer:

```text
tablas
columnas
joins
queries
```

Debe conocer:

```text
recursos
casos de uso
contratos API
```

---

# 131. No acoplar frontend a PHP

El frontend no debería depender de:

```php
<?php
echo ...
?>
```

para lógica de cliente.

PHP proporciona:

```text
HTML inicial
API
datos
sesión
seguridad
```

JavaScript proporciona comportamiento del cliente.

---

# 132. Testing

El frontend debería probar:

```text
Domain
Application
Infrastructure
Presentation
```

de forma diferenciada.

---

# 133. Unit tests

Probar:

```text
Entities
Value Objects
Rules
Use Cases
pure functions
```

sin necesidad de navegador cuando sea posible.

---

# 134. Integration tests

Probar:

```text
Use Case
+
Repository
+
API Client
```

cuando corresponda.

---

# 135. UI tests

Probar:

```text
formularios
interacciones
modales
navegación
estados
```

---

# 136. Accessibility testing

Comprobar:

```text
keyboard
focus
screen reader
contrast
labels
ARIA
headings
landmarks
```

y utilizar herramientas automáticas como complemento, no como sustituto de pruebas manuales.

---

# 137. Linting

Utilizar un linter JavaScript como:

```text
ESLint
```

y mantener reglas consistentes.

---

# 138. Formatting

Utilizar:

```text
Prettier
```

o una alternativa equivalente.

El equipo no debería discutir manualmente:

```text
comillas
indentación
espacios
line breaks
```

en cada Pull Request.

---

# 139. Type checking opcional

Aunque el proyecto sea JavaScript Vanilla, puede utilizarse:

```text
JSDoc
TypeScript incremental
```

si el tamaño del proyecto lo justifica.

Vanilla JS no obliga a renunciar a herramientas de análisis estático.

---

# 140. JSDoc

Puede utilizarse:

```js
/**
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    ...
}
```

Esto aporta información a IDEs y herramientas de análisis.

---

# 141. Dependencias

No instalar una librería para cada pequeña funcionalidad.

Antes de añadir una dependencia:

```text
¿Lo resuelve HTML?
¿Lo resuelve CSS?
¿Lo resuelve Web API?
¿Realmente necesitamos la librería?
¿Cuánto agrega al bundle?
¿Tiene mantenimiento?
¿Es compatible?
```

---

# 142. Estrategia recomendada para las librerías indicadas

No utilizar todas simultáneamente.

Una combinación razonable sería:

```text
HTML5
   │
   ├── Semántica
   └── Accessibility

CSS3
   │
   ├── BEM
   ├── Design Tokens
   ├── Bootstrap → layout/utilidades seleccionadas
   ├── Material Design 3 → principios/componentes seleccionados
   └── Animaciones → Animista / Animate.css / Hover.css según necesidad

JavaScript
   │
   ├── ES Modules
   ├── Domain/Application
   ├── Fetch
   ├── Zod → validación compleja
   │
   ├── Zustand → estado compartido simple
   ├── RxJS → streams/eventos complejos
   ├── XState → workflows complejos
   └── MobX → modelos reactivos cuando exista una razón concreta
```

---

# 143. Regla para evitar sobrearquitectura

Antes de instalar una librería:

```text
¿Existe un problema concreto?
        │
        ├── No → No instalar.
        │
        └── Sí
             ↓
¿HTML/CSS/Web API lo resuelve?
             │
        ┌────┴────┐
       Sí         No
        │          │
   utilizarlo   evaluar librería
```

---

# 144. Estructura final del proyecto

Una posible estructura profesional:

```text
project/
│
├── public/
│   ├── index.php
│   └── assets/
│       ├── css/
│       │   ├── tokens.css
│       │   ├── reset.css
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── components/
│       │   └── main.css
│       │
│       ├── js/
│       │   ├── main.js
│       │   ├── domain/
│       │   ├── application/
│       │   ├── infrastructure/
│       │   ├── state/
│       │   └── presentation/
│       │
│       ├── images/
│       └── fonts/
│
├── src/
│   └── PHP Backend
│
├── tests/
│   ├── frontend/
│   └── backend/
│
├── docs/
│   ├── frontend/
│   ├── backend/
│   ├── architecture.md
│   ├── accessibility.md
│   ├── design-system.md
│   ├── security.md
│   └── testing.md
│
├── package.json
├── composer.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

# 145. Checklist HTML5

```text
[ ] <!doctype html>
[ ] <html lang="...">
[ ] charset UTF-8
[ ] viewport
[ ] title
[ ] description
[ ] metadata necesaria
[ ] HTML semántico
[ ] headings jerárquicos
[ ] main
[ ] navegación semántica
[ ] formularios correctamente estructurados
[ ] labels asociados
[ ] botones reales
[ ] enlaces reales
[ ] imágenes con alt apropiado
[ ] tablas semánticas
[ ] skip link cuando corresponda
[ ] ARIA solamente cuando sea necesaria
[ ] teclado funcional
```

---

# 146. Checklist CSS3

```text
[ ] Design Tokens
[ ] BEM o convención equivalente
[ ] baja especificidad
[ ] sin !important innecesario
[ ] responsive
[ ] mobile first
[ ] Flexbox/Grid
[ ] container queries cuando corresponda
[ ] variables CSS
[ ] focus-visible
[ ] contraste adecuado
[ ] estados visuales
[ ] prefers-reduced-motion
[ ] animaciones justificadas
[ ] componentes reutilizables
[ ] sin estilos inline innecesarios
[ ] CSS organizado por responsabilidad
```

---

# 147. Checklist JavaScript

```text
[ ] ES Modules
[ ] sin globals innecesarios
[ ] const/let
[ ] strict equality
[ ] async/await
[ ] fetch centralizado
[ ] response.ok verificado
[ ] AbortController cuando corresponda
[ ] debounce/throttle cuando corresponda
[ ] event delegation cuando corresponda
[ ] dominio independiente del DOM
[ ] casos de uso
[ ] dependency injection
[ ] estado explícito
[ ] errores controlados
[ ] sin innerHTML inseguro
[ ] sin datos sensibles en logs
[ ] validación de datos externos
[ ] tests
```

---

# 148. Checklist de arquitectura

```text
[ ] HTML no contiene lógica de negocio
[ ] CSS no contiene lógica de aplicación
[ ] JS de presentación no contiene reglas de dominio complejas
[ ] dominio independiente del DOM
[ ] casos de uso independientes de UI
[ ] API encapsulada
[ ] estado centralizado solamente cuando corresponde
[ ] dependencias inyectadas
[ ] composición centralizada
[ ] frontend desacoplado del backend
[ ] contratos API definidos
```

---

# 149. Checklist de accesibilidad

```text
[ ] Navegación mediante teclado
[ ] Focus visible
[ ] Labels
[ ] Alt
[ ] Headings correctos
[ ] Landmarks
[ ] Contraste
[ ] No depender únicamente del color
[ ] No depender únicamente del hover
[ ] Reduced motion
[ ] Estados anunciados
[ ] Modales accesibles
[ ] Menús accesibles
[ ] Formularios accesibles
[ ] Touch targets adecuados
[ ] Orden del DOM correcto
```

---

# 150. Checklist de seguridad

```text
[ ] Nunca confiar en datos del cliente
[ ] Validación frontend
[ ] Validación backend
[ ] XSS controlado
[ ] textContent preferido para texto
[ ] innerHTML controlado
[ ] CSRF cuando corresponda
[ ] CORS correctamente configurado
[ ] HTTPS
[ ] Cookies seguras
[ ] No almacenar secretos
[ ] No exponer tokens innecesariamente
[ ] No registrar información sensible
[ ] Dependencias actualizadas
```

---

# 151. Checklist de performance

```text
[ ] JS mínimo necesario
[ ] CSS optimizado
[ ] imágenes optimizadas
[ ] formatos modernos de imagen
[ ] lazy loading cuando corresponda
[ ] fuentes optimizadas
[ ] evitar requests innecesarios
[ ] debounce/throttle
[ ] AbortController
[ ] evitar layout thrashing
[ ] animaciones eficientes
[ ] code splitting cuando corresponda
[ ] medir antes de optimizar
```

---

# 152. Principio arquitectónico final

La aplicación completa debería poder entenderse así:

```text
                       USUARIO
                          │
                          ▼
                     ┌─────────┐
                     │  HTML   │
                     └────┬────┘
                          │
                 Semántica / A11y
                          │
                          ▼
                     ┌─────────┐
                     │   CSS   │
                     └────┬────┘
                          │
                Design System / UI
                          │
                          ▼
                     ┌─────────┐
                     │   DOM   │
                     └────┬────┘
                          │
                     eventos
                          │
                          ▼
                  ┌──────────────┐
                  │ Presentation │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Application  │
                  │  Use Cases   │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    Domain    │
                  │ Entities     │
                  │ Rules        │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │Infrastructure│
                  │ API / Fetch  │
                  └──────┬───────┘
                         │
                         │ HTTP
                         ▼
                  ┌──────────────┐
                  │ PHP 8.2      │
                  │ Backend      │
                  └──────────────┘
```

---

# 153. Regla de oro del Frontend

Ante cualquier funcionalidad nueva, preguntar:

```text
1. ¿Esto es contenido o comportamiento?

2. ¿HTML tiene un elemento semántico para esto?

3. ¿Puedo resolverlo con HTML nativo?

4. ¿Necesito JavaScript realmente?

5. ¿La regla pertenece a la UI o al dominio?

6. ¿Puedo probar la regla sin navegador?

7. ¿Estoy acoplando lógica al DOM?

8. ¿Estoy modificando estado o solamente presentación?

9. ¿Necesito realmente un store?

10. ¿Necesito realmente RxJS?

11. ¿Necesito realmente XState?

12. ¿Necesito realmente una librería?

13. ¿La interfaz funciona con teclado?

14. ¿Qué ocurre con un lector de pantalla?

15. ¿Qué ocurre con reduced motion?

16. ¿Qué ocurre sin conexión?

17. ¿Qué ocurre si la API devuelve un error?

18. ¿Qué ocurre si la petición tarda?

19. ¿Qué ocurre si llegan respuestas fuera de orden?

20. ¿Estoy exponiendo información sensible?

21. ¿El backend vuelve a validar?

22. ¿El componente puede reutilizarse?

23. ¿El CSS depende de detalles accidentales del DOM?

24. ¿El código seguirá siendo comprensible dentro de seis meses?
```

---

# 154. Resultado esperado

Un frontend profesional basado en este estándar debería cumplir:

```text
HTML
    ↓
Semántico
Accesible
SEO-friendly
Progresivamente mejorable

CSS
    ↓
Modular
Responsive
Consistente
Mantenible
Performante

JavaScript
    ↓
Modular
Desacoplado
Testeable
Orientado a dominio
Reactivo cuando corresponde

Backend PHP
    ↓
Autoridad
Seguridad
Persistencia
Reglas críticas
```

La idea central es:

> **El navegador presenta la aplicación; JavaScript coordina su comportamiento; el dominio define qué debe ocurrir; PHP mantiene la autoridad sobre las reglas críticas y los datos.**

Este diseño permite mantener un frontend completamente **Vanilla** sin caer en un proyecto monolítico de archivos HTML con cientos de líneas de JavaScript y CSS acoplado a la interfaz.
