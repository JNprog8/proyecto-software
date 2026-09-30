# Proyecto de Software - ABMC

> Desarrollo de un ABMC (Alta - Baja - Modificacion - Consulta) sobre entidades. En particular empezar para una entidad y generalizar.

> Desarrollo de un ABMC (Alta, Baja, Modificación, Consulta) enfocado inicialmente en la entidad `Usuarios` y `Roles`, diseñado con arquitectura escalable para permitir su generalización a futuras entidades.

---

## Stack

- **Backend:** PHP 8 (Vanilla, sin frameworks).
- **Frontend:** PHP, HTML5, CSS3, JavaScript (Vanilla JS).
- **Base de Datos:** MariaDB (Relacional).
- **Servidor Web:** Apache.
- **Infraestructura Local:** Contenedores con Podman / Podman Compose.
- **Arquitectura:** Buttom Up con Patrón Repository (Agnóstico a la base de datos, separando la lógica de negocio del acceso a datos).

---

## Requerimientos Core

- Desarrollar un listado, formulario de alta/edición y eliminación lógica/física de registros de **Usuarios**.
- **Modelo de Datos:**
  - `Usuario`: Nombre, Apellido, Nickname (único), Email (único), ID_Rol.
  - `Rol`: Nombre, Descripción.
- **Regla de Negocio:** Un Usuario tiene un único Rol (1:1 desde la perspectiva del usuario). Un Rol puede estar asignado a múltiples Usuarios (1:N).
- **Formularios**:
  - Formulario de alta/edición de usuarios.
  - Formulario de alta/edicion de roles.
- **Validaciones**:
  - No permitir emails duplicados.
  - No permitir nicknames duplicados.

## Requerimientos Obligatorios

- Se requiere desarrollar un listado, formulario de alta y edición y la funcionalidad de eliminar registros de Usuarios.

- De los Usuarios se conoce su nombre y apellido, su nickname o nombre de usuario, su email y su Rol.

- Un Usuario podrá tener un único Rol mientras que un Rol podría estar relacionado con más de un Usuario.

- De un Rol se conoce su nombre y su descripción.

- Se tienen que desarrollar los siguientes requerimientos:
    - Modelado de entidades.
    - Implementación de Base de Datos.
    - Implementación de BackEnd.
    - Implementación de FrontEnd.

- Se requiere que el ABMC se desarrolle en lenguaje PHP. Ya que es desde el lado del servidor. PHP debe usarse Vanilla sin Frameworks.
- El resto del stack se tiene que hacer con HTML5, CSS3 y JS. Y de ser posible Vanilla JS.

---

## Roles y Responsabilidades

### Product Owner

- visionario del producto y el representante del cliente o del negocio frente al equipo. Su responsabilidad principal es maximizar el valor del software que se desarrolla. Decide qué se va a construir, pero no cómo se va a construir. Diseñar el "Product Requirements Document" + "Software Requirements Specification"

- Define y prioriza el Product Backlog.
- Establece los criterios de aceptación para cada historia de usuario.
- Valida las entregas al final de cada iteración.
- Define el alcance funcional (Ej: determinar si el alta de usuario implica la creación inmediata de credenciales de acceso o solo el registro administrativo).

#### Product Backlog

- Es un artefacto vivo. Consiste en una lista única, centralizada y priorizada de todo lo que el producto necesita (nuevas funcionalidades, corrección de errores, deuda técnica). Backlog Refinement -> evento continuo donde el equipo analiza las necesidades y las desglosa en Historias de Usuario (User Stories)

### Scrum Master

- Es el facilitador y líder al servicio del equipo. No es un jefe de proyecto tradicional que asigna tareas; su trabajo es asegurar que el equipo entienda y aplique Scrum correctamente, eliminar impedimentos que bloqueen el avance técnico y proteger a los desarrolladores de interrupciones externas.

- Responsable de facilitar el proceso, remover bloqueos y desarrollar:
    - Epicas
    - Spikes
    - Historias de usuario

**Épicas:**
1. Gestión Integral de Usuarios (ABMC).
2. Gestión de Roles y Permisos.
3. Arquitectura y Entorno Base.

**Spikes (Investigaciones técnicas):**
- *Spike 1:* Diseñar e implementar la interfaz del Patrón Repository en PHP Vanilla con `mysqli` o `PDO` para aislar MariaDB.
- *Spike 2:* Definir la estrategia de notificaciones asíncronas en el frontend (Ej: Toast notifications con Vanilla JS).

**Historias de Usuario (Ejemplos):**
- *HU-01:* Como administrador, quiero visualizar un listado de usuarios paginado para consultar la base de datos rápidamente.
- *HU-02:* Como administrador, quiero crear un usuario asignándole un rol específico para darle acceso al sistema.
- *HU-03:* Como administrador, quiero evitar registrar correos duplicados para mantener la integridad de los datos.

### Arquitecto de Software / Tech Lead

- Define la estructura técnica general del sistema, los patrones de diseño y toma las decisiones tecnológicas de alto nivel (por ejemplo, definir si el proyecto usará una arquitectura de microservicios o qué lenguajes son los más adecuados según la carga de trabajo).

### Desarrollador Backend

- Construye la lógica del servidor, la gestión de bases de datos y las APIs. Suelen trabajar fuertemente con lenguajes de alto rendimiento (como Java, C#, Rust o Python) y tecnologías de contenerización.

### Desarrollador Frontend

- Se encarga de traducir el diseño visual a código interactivo en el navegador o dispositivo móvil, conectando la interfaz con las APIs del backend.

### DevOps / SRE (Site Reliability Engineer)

- Unifica el desarrollo con la operación de los sistemas. Automatizan los despliegues (CI/CD), gestionan la infraestructura de servidores (generalmente administrando entornos Linux y contenedores Docker) y monitorean que el sistema en producción sea estable y escalable.

### QA (Quality Assurance) / Automation Engineer

- Diseña y ejecuta planes de pruebas. Su objetivo no es solo encontrar errores manuales, sino programar scripts automatizados que validen la calidad del código constantemente antes de cada lanzamiento.

### Diseñador UX/UI

- Investiga las necesidades del usuario final (User Experience) y diseña la interfaz gráfica (User Interface) para asegurar que el software sea intuitivo, accesible y resuelva el problema real.

---

## Criterios de Requerimientos

Definir criterios minimos de aceptacion:
- que espera el usuario del sistema: condiciones minimas del sistema
- una vez que el usuario quede dado de alta, que quede persistido en la BD
- validar que no existe el usuario, es decir, que no exista usuarios duplicados.
- Notificar al usuario que puede hacer con ese Rol asignado.
- Si el mail esta repetido mostrar en pantalla que el usuario ya existe
- Dar alta implica crear una cuenta

Definir regla base del **sprint 0**:
- configuramos los ambientes
- definir arquitectura en base a su solucion

-- patrron repositori que abra cierre la conexion a la BD agnostica de la bd usada.

- encarar harnees -> skills -> utilidades o issues

armame un harnes con las skills necesarios con las directivas para comenzar el proyecto.

---

## Definir con criterio 2/2

- Actividades UX 

- Que sea Responsibe

- usabilidad de frontend apto para toda gente y sensillo, elementos claros y simples pero formal en cuanto al diseño KISS

- Mockups 
- Wireframes para UI/UX y validacion de lo que se pide de frontend


- Todo en una pantalla? Lineal? o aplicar algun ordenamiento? Eliminar me pregunta si quiero eliminar el usuario?

- Formulario con carga de documentos? Ej Fotos? Imagen de perfil?

## Features - incrementos funcionales

## Expertiz de cada campo de BD / Back / Front

-- controlador con vista de usuarios , agregar, listar, modificar, eliminar
-- ABMC generalizado
-- filtros de consulta

---

## Product Backlog & Features (Incrementos)

1. Setup de entorno Podman (PHP + Apache + MariaDB).
2. Script de inicialización de Base de Datos (DDL de Usuarios y Roles).
3. Estructura de carpetas y ruteo básico en PHP Vanilla.
4. Implementación de Conexión a BD y Patrón Repository.
5. Endpoint/Controlador para listar usuarios (Consulta).
6. UI Frontend: Grid/Tabla de usuarios con filtros de búsqueda.
7. Endpoint/Controlador para Alta de usuario con validaciones.
8. UI Frontend: Formulario de Alta/Modificación.
9. Endpoint/Controlador para Modificación y Baja.
10. UI Frontend: Modales de confirmación para acciones destructivas.

---

## Criterios de Aceptación y Definición de Terminado (DoD)

- **Persistencia:** Todo registro, modificación o eliminación debe reflejarse correctamente en MariaDB.
- **Integridad de Datos:** Validar en Backend (PHP) y Frontend (JS) la inexistencia de usuarios duplicados (Nickname y Email únicos). Mostrar mensaje claro si el email ya existe.
- **UX/Notificaciones:** El sistema debe notificar al usuario el resultado de su acción (éxito, error, advertencia) mediante alertas visuales no intrusivas.
- **Acciones Destructivas:** La eliminación de un registro debe requerir confirmación explícita (Modal de confirmación: "¿Está seguro que desea eliminar este usuario?").
- **Validación de Roles:** Validar desde el backend qué acciones puede realizar el usuario activo según su rol (Autorización).

--- 

## Fase Inicial: UX/UI y Diseño

- **Responsividad:** El diseño debe adaptarse a dispositivos móviles y escritorio usando CSS puro (Media Queries o CSS Grid/Flexbox).
- **Usabilidad (KISS - Keep It Simple, Stupid):** Interfaz limpia, formal y directa. Sin elementos distractores.
- **Navegación:** 
  - *Decisión de Arquitectura UI:* Implementar un esquema de "Single Page Application (SPA) feel" usando modales para los formularios de Alta/Edición, o mantener vistas separadas para simplificar el ruteo en PHP Vanilla. Se recomienda vista principal de Lista con formulario lateral o modal.
- **Entregables previos al código:**
  - Wireframes de la vista de listado.
  - Mockups del formulario de creación/edición.