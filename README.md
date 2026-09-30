# ABMC de Usuarios y Roles - Hackatón UNRN

Aplicación web académica para administrar usuarios y roles mediante operaciones ABMC (Alta, Baja, Modificación y Consulta). Todo el entorno se ejecuta en contenedores: no es necesario instalar PHP, Apache ni MariaDB en la computadora del profesor.

## Funcionalidades

- Padrón de usuarios con búsqueda, filtro por rol y paginación.
- Alta y modificación de usuarios con nombre, apellido, nickname, email, rol y datos condicionales de participante.
- Validación de nickname y email únicos entre cuentas activas, con mensajes asociados a los campos.
- Baja lógica con confirmación; los registros se conservan en la base de datos.
- Administración de roles y sus descripciones.
- Perfiles de demostración para Administrador, Tutor, Mentor, Participante y Visitante.
- Persistencia en MariaDB y acceso a datos mediante PDO y Repository.

El sistema usa PHP Vanilla en el servidor y HTML, CSS y JavaScript en el cliente. No requiere Composer ni Node.js.

## Componentes

| Servicio  | Tecnología       | Uso local                                    |
| --------- | ---------------- | -------------------------------------------- |
| `web`     | PHP 8.2 + Apache | Aplicación y API REST, puerto `8080`         |
| `db`      | MariaDB LTS      | Persistencia, puerto `3307` del equipo       |
| `adminer` | Adminer          | Administración web de MariaDB, puerto `8081` |

La definición está en [`compose.yaml`](compose.yaml), la imagen web en [`Dockerfile`](Dockerfile) y el esquema/semillas en [`sql/01_init.sql`](sql/01_init.sql).

## Requisitos Para Windows 10

La opción recomendada para este proyecto es **Podman Desktop con WSL 2**, que ejecuta los contenedores Linux definidos por Compose. Según la guía vigente de Podman Desktop, se requiere Windows 10 de 64 bits, compilación 19043 o posterior, WSL 2 y virtualización habilitada en BIOS/UEFI. Se recomienda disponer de al menos 8 GB de memoria RAM.

Docker Desktop también puede ejecutar el Compose, pero su soporte para Windows 10 depende de que la edición y compilación del equipo sigan dentro de los requisitos oficiales vigentes. Windows 10 finalizó su soporte general de Microsoft el 14 de octubre de 2025; para una computadora Windows 10 estándar, utilizar Podman Desktop o actualizar Windows antes de depender de Docker Desktop.

Enlaces oficiales:

- [Instalar Podman Desktop en Windows](https://podman-desktop.io/docs/installation/windows-install)
- [Instalar Docker Desktop en Windows y revisar requisitos](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Instalar WSL](https://learn.microsoft.com/windows/wsl/install)

## Instalación y Arranque en Windows 10

### 1. Preparar WSL 2

Abrir **PowerShell como administrador** y ejecutar:

```powershell
wsl --update
wsl --install --no-distribution
```

Reiniciar Windows si lo solicita. Luego comprobar WSL:

```powershell
wsl --status
```

Si el comando `wsl` no existe o la instalación falla, comprobar que Windows esté actualizado (compilación 19043 o posterior), habilitar la virtualización en BIOS/UEFI y volver a ejecutar PowerShell como administrador.

### 2. Instalar Podman Desktop

1. Descargar e instalar Podman Desktop desde el [sitio oficial](https://podman-desktop.io/downloads/windows).
2. Completar el asistente de inicio (_Onboarding_): instalar Podman, el proveedor de Compose y crear la máquina Podman usando WSL 2.
3. Esperar hasta que Podman Desktop indique que la máquina está iniciada.

### 3. Obtener y abrir el proyecto

Clonar el repositorio que entregue el alumno o extraer el ZIP del proyecto. La carpeta debe contener `compose.yaml`, `Dockerfile` y las carpetas `src/` y `sql/`.

Abrir PowerShell en esa carpeta. Por ejemplo:

```powershell
cd "C:\Users\Profesor\Desktop\ABMC"
```

Verificar que el cliente y el proveedor Compose estén disponibles:

```powershell
podman --version
podman compose version
```

Si se utiliza Docker Desktop en una instalación compatible, reemplazar `podman` por `docker` en los comandos siguientes.

### 4. Construir e iniciar los servicios

Desde la raíz del proyecto:

```powershell
podman compose up --build -d
podman compose ps
```

La primera ejecución puede demorar porque descarga las imágenes y construye Apache/PHP. MariaDB también inicializa el esquema y las cuentas semilla. Para ver el progreso de la base, ejecutar:

```powershell
podman compose logs -f db
```

Cuando MariaDB indique que está lista para aceptar conexiones, salir de la vista de logs con `Ctrl+C`. Esto no detiene los contenedores. Si la página muestra temporalmente un error de conexión durante el primer arranque, esperar unos segundos y recargarla.

### 5. Abrir la aplicación

- Aplicación ABMC: [http://localhost:8080](http://localhost:8080)
- Adminer: [http://localhost:8081](http://localhost:8081)

No hay que publicar ni mapear puertos adicionales. Apache y PHP corren en `web`; MariaDB y Adminer también están dentro de Compose.

## Instalación y Arranque en Linux

Se necesita Podman y un proveedor compatible con Compose. Los paquetes exactos pueden variar según la distribución; estos son ejemplos para las más comunes:

```bash
# Fedora
sudo dnf install podman podman-compose

# Debian o Ubuntu
sudo apt update
sudo apt install podman podman-compose
```

Desde la raíz del proyecto, comprobar que Compose está disponible:

```bash
podman --version
podman compose version
```

Si `podman compose` indica que no encuentra un proveedor, instalar `podman-compose` o el proveedor Compose documentado para la distribución. En sistemas rootless, si el proveedor informa que no puede conectarse al servicio Podman, iniciar el socket del usuario:

```bash
systemctl --user enable --now podman.socket
systemctl --user status podman.socket
```

Construir la imagen web e iniciar los tres servicios:

```bash
podman compose up --build -d
podman compose ps
podman compose logs -f db
```

Esperar a que MariaDB indique que está lista y salir de los logs con `Ctrl+C`; los contenedores siguen ejecutándose. Luego abrir la aplicación en [http://localhost:8080](http://localhost:8080) y Adminer en [http://localhost:8081](http://localhost:8081). El sufijo `:z` de los volúmenes en `compose.yaml` permite el montaje en Linux con SELinux; conservarlo.

## Perfiles de Demostración

La aplicación no implementa autenticación con contraseñas. El selector **Rol** de la barra superior conmuta entre perfiles semilla para evaluar las vistas y permisos; no son credenciales de acceso.

| ID  | Perfil semilla              | Rol           | Estado inicial |
| --- | --------------------------- | ------------- | -------------- |
| `1` | Admin Global (`admin`)      | Administrador | Aprobado       |
| `2` | Carlos Tutor (`ctutor`)     | Tutor         | Aprobado       |
| `3` | Mariana Mentor (`mmentora`) | Mentor        | Aprobado       |
| `4` | Juan Estudiante (`juanest`) | Participante  | Pendiente      |
| `5` | Ana Externa (`anaext`)      | Participante  | Aprobado       |
| `0` | Visitante Público           | Visitante     | Sin cuenta     |

El Administrador gestiona usuarios y roles; el Tutor trabaja con aprobaciones de usuarios; el Mentor tiene su vista de mentoría; el Participante accede a su perfil; el Visitante puede consultar el padrón público e inscribirse como Participante. Al registrarse públicamente, el usuario queda pendiente de aprobación.

## Acceso a La Base de Datos

En Adminer (`http://localhost:8081`) ingresar:

| Campo         | Valor          |
| ------------- | -------------- |
| Sistema       | MySQL          |
| Servidor      | `db`           |
| Usuario       | `app_user`     |
| Contraseña    | `app_password` |
| Base de datos | `app_db`       |

La conexión desde el equipo anfitrión utiliza `127.0.0.1:3307`. Dentro de Compose, el host de MariaDB es `db` y el puerto es `3306`.

Estas credenciales son valores de desarrollo para una demostración local, no deben reutilizarse en producción.

La aplicación PHP obtiene su conexión PDO desde [`Database.php`](src/backend/config/Database.php); dentro de Compose debe conectarse a `db:3306`, no al puerto publicado `3307`.

## Persistencia y Comandos Habituales

Compose crea un volumen llamado `mariadb_data`. Los datos sobreviven a reinicios y a `podman compose down`; los scripts de `sql/` se ejecutan automáticamente cuando MariaDB inicializa un volumen vacío, no cada vez que se inicia el proyecto. Los siguientes comandos funcionan desde PowerShell, Bash o una terminal Linux, siempre desde la raíz del proyecto.

Ejecutar en PowerShell, desde la raíz del proyecto:

```powershell
# Ver el estado de los servicios
podman compose ps

# Ver registros de Apache/PHP o MariaDB
podman compose logs -f web
podman compose logs -f db

# Detener y conservar los datos
podman compose stop

# Quitar contenedores y red, conservando el volumen de MariaDB
podman compose down

# Volver a construir la imagen web y arrancar
podman compose up --build -d
```

**No ejecutar `podman compose down -v` si se quieren conservar los datos.** La opción `-v` elimina también el volumen de MariaDB.

### Comandos de MariaDB

```bash
# Iniciar todo el entorno o solo MariaDB
podman compose up -d
podman compose up -d db

# Reanudar o detener solo MariaDB
podman compose start db
podman compose stop db

# Estado y logs
podman compose ps
podman compose logs -f db

# Abrir la consola interactiva de MariaDB
podman compose exec db mariadb -u app_user -papp_password app_db
```

En la consola de MariaDB se pueden ejecutar consultas como `SHOW TABLES;` o `SELECT VERSION();`. Salir con `\q` o `exit`. Para conectar desde herramientas instaladas en el host (por ejemplo, DBeaver), usar `127.0.0.1`, puerto `3307`, base `app_db`, usuario `app_user` y contraseña `app_password`.

### Restablecer o Poblar la Base

Los scripts del arnés son Bash y están pensados para Linux, WSL o Git Bash con el cliente `podman` accesible:

```bash
bash harness/harness_tools/reset_db.sh
bash harness/harness_tools/seed.sh
```

`reset_db.sh` es destructivo: vuelve a ejecutar [`sql/01_init.sql`](sql/01_init.sql), que elimina y recrea las tablas y restaura las cuentas semilla. Se perderán los datos cargados desde la aplicación. `seed.sh` agrega registros de prueba para revisar el listado y la paginación.

## Pruebas Automatizadas

Con los contenedores iniciados, desde Bash (Linux, WSL o Git Bash) y la carpeta raíz del proyecto:

```bash
bash harness/harness_tools/test_api.sh
```

La suite comprueba disponibilidad, roles y usuarios, búsqueda, alta, duplicados, modificación, baja lógica, errores HTTP, paginación y autorización. Al finalizar correctamente informa `TODAS LAS PRUEBAS DEL HARNESS (15/15) PASARON SATISFACTORIAMENTE`. Las pruebas crean y dan de baja un usuario temporal.

## Solución de Problemas

- **`podman compose` no se reconoce:** completar el _Onboarding_ de Podman Desktop e instalar el proveedor/CLI Compose; verificar con `podman compose version`.
- **No conecta con el motor Podman:** abrir Podman Desktop y comprobar que la máquina WSL 2 esté iniciada.
- **MariaDB aún no acepta conexiones:** revisar `podman compose logs -f db`, esperar a que complete la inicialización y recargar `http://localhost:8080`.
- **Un puerto ya está ocupado:** liberar `8080` (web), `8081` (Adminer) o `3307` (MariaDB) o modificar el puerto del lado izquierdo en `compose.yaml`; si se cambian los puertos web o Adminer, actualizar también las URLs indicadas.
- **No aparecen tablas o datos iniciales:** los scripts SQL se ejecutan solo al crear el volumen vacío. Si se necesita empezar desde cero, hacer primero una copia de seguridad y utilizar el restablecimiento destructivo descrito arriba.
- **Permisos de montaje en Linux con SELinux:** conservar el sufijo `:z` de los volúmenes de `compose.yaml`.

## Estructura Principal

```text
src/
├── backend/
│   ├── config/         Conexión PDO
│   ├── controllers/    Endpoints REST
│   ├── dto/            Datos de entrada
│   ├── factories/      Construcción de repositorios
│   ├── models/         Entidades y objetos de valor
│   ├── repositories/   Persistencia SQL
│   ├── services/       Servicios de negocio
│   └── validators/     Reglas de validación
├── frontend/
│   ├── public/         CSS y JavaScript
│   └── views/          Vistas PHP
└── index.php           Front controller y router

sql/                    Esquema y datos iniciales
harness/                Especificaciones y pruebas
compose.yaml            Servicios y puertos
Dockerfile              Imagen de Apache y PHP
```

## Documentación

El documento [`Proyecto Base.md`](Proyecto%20Base.md) conserva los requisitos originales del trabajo. Las especificaciones de dominio y los criterios técnicos están en `harness/specs/`; las pruebas y utilidades operativas están en `harness/harness_tools/`.
