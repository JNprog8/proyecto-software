# Especificación de Diseño UI/UX: Wireframes y Mockups
> Documento de diseño previo y arquitectura de interfaz para el sistema ABMC Hackatón UNRN 2026.
> Principio de diseño: **KISS (Keep It Simple, Stupid)** con **Bootstrap 5.3**.

---

## 1. Wireframe: Vista Principal y Listado de Participantes

```text
+---------------------------------------------------------------------------------------+
| [CPU UNRN] Hackatón 2026      Inicio   Desafíos   Gestión ABMC   Roles   [Adminer BD] | [+ Inscribir] |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   ⚡ 48 Horas de Innovación Tecnológica                                               |
|   Hackatón UNRN Patagonia Digital                                                     |
|   El evento insignia de la UNRN para desarrollar soluciones regionales...             |
|                                                                                       |
|   [ Ir al Panel ABMC ]   [ Nuevo Registro ]              +--------------------------+ |
|                                                          | ESTADO DEL PADRÓN        | |
|                                                          | [ 4 ] Registrados        | |
|                                                          | [ 4 ] Roles Activos      | |
|                                                          | [ 48 hs ] Duración       | |
|                                                          +--------------------------+ |
+---------------------------------------------------------------------------------------+
| DESAFÍOS DE INNOVACIÓN:                                                               |
|   [ 🤖 Inteligencia Artificial ]    [ 🌲 Sostenibilidad ]    [ 🛡️ GovTech / Edu ]     |
+---------------------------------------------------------------------------------------+
|                                                                                       |
| PADRÓN DE PARTICIPANTES Y ROLES                                    [+ Inscribir]      |
| Alta, Baja, Modificación y Consulta en tiempo real                                    |
|                                                                                       |
| +-----------------------------------------------------------------------------------+ |
| | [🔍 Buscar por nombre, nickname o email...    [x]] | [Todos los Roles v] | [4 users] |
| +-----------------------------------------------------------------------------------+ |
|                                                                                       |
| +-----------------------------------------------------------------------------------+ |
| | PARTICIPANTE      | NICKNAME    | EMAIL                 | ROL ASIGNADO | ALTA     | ACCIONES|
| |-------------------|-------------|-----------------------|--------------|----------|---------|
| | (JG) Joaquín G.   | @joaquin    | jgonzalez@unrn.edu.ar | [Organizador]| 22/09/26 | [✎] [🗑] |
| | (ML) Mariana L.   | @mlopez     | mlopez@unrn.edu.ar    | [Mentor]     | 22/09/26 | [✎] [🗑] |
| | (CR) Carlos R.    | @crodriguez | crodriguez@unrn.edu.ar| [Juez/Eval.] | 22/09/26 | [✎] [🗑] |
| | (SP) Sofía P.     | @sperez     | sperez@unrn.edu.ar    | [Participant]| 22/09/26 | [✎] [🗑] |
| +-----------------------------------------------------------------------------------+ |
|                                                                                       |
+---------------------------------------------------------------------------------------+
| ROLES Y PERMISOS DE LA HACKATÓN:                                                      |
|   [ Organizador: Admin global ]       [ Mentor: Soporte técnico a equipos ]           |
|   [ Juez: Evaluación de entregables]  [ Participante: Hacker competidor ]             |
+---------------------------------------------------------------------------------------+
| Universidad Nacional de Río Negro — Proyecto de Software — ABMC Hackatón              |
+---------------------------------------------------------------------------------------+
```

---

## 2. Mockup: Formulario de Alta y Modificación (Modal Bootstrap)

```text
+-------------------------------------------------------------+
| Inscribir Nuevo Participante                            [X] |
+-------------------------------------------------------------+
|                                                             |
|  [ ! ] Alerta de error (ej: El correo ya existe)           |
|                                                             |
|  Nombre *                         Apellido *                |
|  +---------------------------+    +-----------------------+ |
|  | Lucía                     |    | Martínez              | |
|  +---------------------------+    +-----------------------+ |
|                                                             |
|  Nickname (Usuario) *             Correo Electrónico *      |
|  +---------------------------+    +-----------------------+ |
|  | @ | lmartinez             |    | lmartinez@unrn.edu.ar | |
|  +---------------------------+    +-----------------------+ |
|                                                             |
|  Rol Asignado en la Hackatón *                              |
|  +--------------------------------------------------------+ |
|  | [ Mentor                                             v]| |
|  +--------------------------------------------------------+ |
|  ℹ️ Asesoramiento técnico, guía en arquitectura y apoyo a     |
|     los equipos en competencia.                             |
|                                                             |
+-------------------------------------------------------------+
|                             [ Cancelar ] [ Registrar Part. ]|
+-------------------------------------------------------------+
```

---

## 3. Mockup: Confirmación de Baja / Eliminación (Modal Peligro)

```text
+-------------------------------------------------------------+
| [⚠️] Confirmar Eliminación                              [X] |
+-------------------------------------------------------------+
|                                                             |
|  ¿Confirmas la eliminación del siguiente participante       |
|  del padrón?                                                |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Lucía Martínez                                        |  |
|  | lmartinez@unrn.edu.ar                                 |  |
|  +-------------------------------------------------------+  |
|                                                             |
|  Esta acción no se puede deshacer y liberará el nickname    |
|  y el correo para nuevas inscripciones.                     |
|                                                             |
+-------------------------------------------------------------+
|                             [ Cancelar ] [ Sí, Eliminar ]   |
+-------------------------------------------------------------+
```

---

## 4. Principios y Decisiones UI/UX (KISS)

1. **Flujo en una sola página (SPA-Feel):**
   - Sin recargas de página completas (`window.location`). Todo el filtrado, paginación visual y mutaciones CRUD operan asíncronamente con `fetch()` y modales nativos de Bootstrap 5.
2. **Claridad Inmediata de Roles:**
   - Cada rol asignado despliega automáticamente su descripción en el formulario para que el operador conozca las responsabilidades del perfil seleccionado antes de guardar.
   - Uso de badges cromáticos armoniosos en la tabla:
     - **Organizador:** Rojo suave (`--badge-organizador-bg`).
     - **Mentor:** Azul cielo suave (`--badge-mentor-bg`).
     - **Juez / Evaluador:** Ámbar cálido (`--badge-juez-bg`).
     - **Participante:** Verde esmeralda suave (`--badge-participante-bg`).
3. **Validación Defensiva y Accesible:**
   - Feedback en tiempo real ante errores de negocio (ej. duplicados de email o username con borde rojo y texto de ayuda).
   - Botones con estado de carga animado (*spinners*) para evitar dobles envíos accidentales.
4. **Diseño Responsivo:**
   - Adaptable desde dispositivos móviles de 360px hasta monitores ultrawide mediante el sistema de grillas de Bootstrap 5.

## 5. Notas

### Paleta de Colores — Sistema Visual Institucional

La interfaz adopta una paleta inspirada en la identidad visual contemporánea de la
Universidad Nacional de Río Negro (UNRN), priorizando una apariencia institucional,
académica y tecnológica.

La estrategia cromática establece una jerarquía clara:

1. Los tonos azules constituyen la base estructural de la interfaz.
2. El rojo institucional se utiliza como color de identidad y acento.
3. Los tonos neutros permiten mantener legibilidad y reducir la fatiga visual.
4. Los colores semánticos se reservan exclusivamente para estados del sistema.

La paleta está diseñada para funcionar tanto en interfaces públicas como en
paneles administrativos y sistemas de gestión.

---

#### Colores Base

| Token | HEX | Uso |
|---|---|---|
| `--color-primary-900` | `#123B5D` | Azul institucional profundo. Navbar, encabezados y elementos estructurales. |
| `--color-primary-700` | `#1F5F8B` | Azul principal. Links, navegación activa y componentes interactivos. |
| `--color-primary-500` | `#4D8DB5` | Azul secundario. Iconos, estados hover y elementos de apoyo. |
| `--color-primary-100` | `#E8F1F6` | Fondos azules suaves y estados seleccionados. |
| `--color-accent` | `#C1121F` | Rojo institucional. Identidad UNRN, acciones importantes y acentos visuales. |
| `--color-accent-dark` | `#8F0D17` | Variante oscura del rojo para hover y estados activos. |

---

#### Modo Claro — Light Mode

El modo claro utiliza fondos neutros y blancos para priorizar la lectura del
contenido, mientras que el azul institucional define la estructura visual.

| Token | HEX | Uso |
|---|---|---|
| `--color-background` | `#F6F8FA` | Fondo general de la aplicación. |
| `--color-surface` | `#FFFFFF` | Tarjetas, formularios, paneles y modales. |
| `--color-surface-muted` | `#EEF2F5` | Superficies secundarias y elementos de agrupación. |
| `--color-navbar` | `#123B5D` | Navbar principal. |
| `--color-navbar-hover` | `#1F5F8B` | Hover de elementos de navegación. |
| `--color-text-primary` | `#172B3A` | Texto principal. |
| `--color-text-secondary` | `#536575` | Texto secundario y descripciones. |
| `--color-text-muted` | `#71808D` | Texto auxiliar y metadatos. |
| `--color-border` | `#D9E1E7` | Bordes y separadores. |
| `--color-primary` | `#1F5F8B` | Acciones primarias e interacción. |
| `--color-accent` | `#C1121F` | Identidad institucional y acentos. |

---

#### Modo Oscuro — Dark Mode

El modo oscuro conserva la identidad azul institucional, reemplazando los fondos
claros por superficies azuladas de baja luminosidad.

No se utiliza negro absoluto (`#000000`) como fondo principal para evitar un
contraste excesivamente agresivo y conservar continuidad visual con la identidad
institucional.

| Token | HEX | Uso |
|---|---|---|
| `--color-background` | `#0B1822` | Fondo general. |
| `--color-surface` | `#102532` | Tarjetas, paneles y formularios. |
| `--color-surface-elevated` | `#163447` | Componentes elevados y modales. |
| `--color-navbar` | `#0A2435` | Navbar principal. |
| `--color-navbar-hover` | `#123B5D` | Hover y estados activos. |
| `--color-text-primary` | `#F3F7FA` | Texto principal. |
| `--color-text-secondary` | `#B9C9D5` | Texto secundario. |
| `--color-text-muted` | `#879BA9` | Texto auxiliar. |
| `--color-border` | `#284252` | Bordes y separadores. |
| `--color-primary` | `#4D8DB5` | Acciones e interacción. |
| `--color-accent` | `#E04752` | Acento institucional adaptado para dark mode. |

---

### Colores Semánticos

Los colores semánticos no deben confundirse con los colores de identidad
institucional.

| Token | HEX | Significado |
|---|---|---|
| `--color-success` | `#218739` | Operación exitosa, aprobado o disponible. |
| `--color-warning` | `#B26A00` | Advertencia o situación que requiere atención. |
| `--color-danger` | `#C1121F` | Error, eliminación, rechazo o acción destructiva. |
| `--color-info` | `#1F5F8B` | Información general del sistema. |

Los colores semánticos deben utilizarse únicamente cuando exista una
correspondencia funcional con su significado. No deben emplearse simplemente
como decoración.

---

### Jerarquía Cromática de la Navbar

La Navbar constituye uno de los elementos principales de identificación de la
aplicación y debe mantener una jerarquía visual consistente.

#### Estructura recomendada

- **Fondo:** `--color-navbar`
- **Texto principal:** `--color-text-primary`
- **Iconos:** `--color-primary-500`
- **Elemento activo:** `--color-primary-500`
- **Hover:** `--color-navbar-hover`
- **Marca/acento UNRN:** `--color-accent`
- **Separadores:** `--color-border`
- **Selector de rol:** superficie ligeramente elevada respecto de la Navbar
- **Acciones administrativas:** utilizar el color primario, evitando competir
  visualmente con el acento institucional.

La Navbar no debe utilizar simultáneamente múltiples colores saturados para
diferenciar cada elemento. La diferenciación debe realizarse principalmente
mediante jerarquía, contraste, tipografía, iconografía y estados de interacción.

---

### Principios de Uso del Color

#### 1. El azul representa la estructura

Los azules constituyen el lenguaje visual predominante de la aplicación.

Deben utilizarse para:

- navegación;
- encabezados;
- enlaces;
- controles;
- elementos activos;
- componentes institucionales;
- superficies estructurales.

#### 2. El rojo representa identidad y atención

El rojo institucional (`#C1121F`) debe utilizarse de manera controlada.

Usos apropiados:

- logotipo o marca UNRN;
- elementos de identidad;
- acciones especialmente relevantes;
- indicadores de error o peligro;
- pequeños acentos visuales.

Debe evitarse utilizar el rojo como color predominante de la interfaz.

#### 3. Los neutros proporcionan espacio visual

Los fondos y superficies deben permanecer principalmente dentro de la escala
neutra.

Esto permite que los colores institucionales tengan mayor impacto sin generar
una interfaz visualmente saturada.

#### 4. El color no debe ser el único indicador de estado

Los estados importantes deben combinar color con:

- iconografía;
- texto;
- contraste;
- patrones o indicadores visuales.

Esto mejora la accesibilidad para usuarios con dificultades para distinguir
determinados colores.

---

### Accesibilidad Cromática

Todos los textos y controles interactivos deben mantener un contraste suficiente
respecto de su fondo.

Los colores institucionales no deben utilizarse directamente cuando produzcan
un contraste insuficiente.

Cuando sea necesario, se utilizará una variante más clara u oscura del mismo
color para conservar la identidad visual sin comprometer la legibilidad.

La paleta debe validarse mediante herramientas de contraste siguiendo las
recomendaciones WCAG 2.x.

---

### Implementación del Tema

El sistema soporta Light Mode y Dark Mode mediante el atributo:

`data-bs-theme`

El tema seleccionado se almacena mediante `localStorage`.

La prioridad de selección será:

1. Preferencia almacenada explícitamente por el usuario.
2. Preferencia del sistema mediante `prefers-color-scheme`.
3. Light Mode como fallback.

El cambio de tema debe realizarse sin recargar la página.

Las transiciones cromáticas deben ser suaves, pero no deben afectar negativamente
la percepción de interacción o accesibilidad.

---

### Switch UX

El control de cambio de tema utiliza los iconos Sol/Luna.

Características:

- debe ser claramente identificable;
- debe poseer `aria-label`;
- debe proporcionar un estado visual activo;
- debe mantener suficiente contraste en ambos temas;
- debe conservar la preferencia mediante `localStorage`;
- debe respetar `prefers-color-scheme` cuando el usuario todavía no haya
  establecido una preferencia explícita.

El control debe considerarse una acción secundaria de configuración y no competir
visualmente con las acciones principales de la aplicación.