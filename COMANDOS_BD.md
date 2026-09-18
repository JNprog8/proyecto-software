# Guía de Gestión de Base de Datos y Conexiones (MariaDB + Podman)

Este documento detalla los comandos para encender, apagar y monitorear la base de datos MariaDB con `podman-compose`, así como las buenas prácticas para abrir y cerrar conexiones desde PHP Vanilla.

---

## 1. Comandos de Terminal (Podman Compose)

> Ejecutar estos comandos siempre dentro del directorio del proyecto (`ABMC/`).

### Iniciar la Base de Datos

* **Levantar todo el entorno (Web + MariaDB):**
  ```bash
  podman-compose up -d
  ```

* **Levantar únicamente el servicio de MariaDB (sin el servidor web):**
  ```bash
  podman-compose up -d db
  ```

* **Reanudar contenedores detenidos previamente (sin recrear):**
  ```bash
  podman-compose start db
  ```

---

### Detener la Base de Datos

* **Pausar/Detener únicamente la base de datos (mantiene el contenedor):**
  ```bash
  podman-compose stop db
  ```

* **Detener todo el entorno (Web + MariaDB):**
  ```bash
  podman-compose stop
  ```

* **Bajar y remover contenedores y redes (la información NO se pierde):**
  ```bash
  podman-compose down
  ```
  > **Nota de persistencia:** Los datos de las tablas están guardados en el volumen `mariadb_data`, por lo que al ejecutar `podman-compose up -d` nuevamente, la información seguirá intacta.

---

### Verificación y Diagnóstico

* **Ver el estado de los contenedores:**
  ```bash
  podman ps
  ```

* **Ver los registros (logs) de MariaDB en tiempo real:**
  ```bash
  podman logs -f abmc_db_1
  ```

* **Ingresar a la consola interactiva de MariaDB:**
  ```bash
  podman exec -it abmc_db_1 mariadb -u app_user -papp_password app_db
  ```

---

## 2. Parámetros de Conexión

| Parámetro | Desde la App PHP (Contenedor) | Desde el Host (DBeaver / DataGrip) |
| :--- | :--- | :--- |
| **Host** | `db` | `127.0.0.1` o `localhost` |
| **Puerto** | `3306` | `3307` |
| **Base de Datos** | `app_db` | `app_db` |
| **Usuario** | `app_user` | `app_user` |
| **Contraseña** | `app_password` | `app_password` |

---

## 3. Manejo de Apertura y Cierre de Conexión en PHP

Para evitar agotar el pool de conexiones del servidor MySQL/MariaDB, es fundamental abrir la conexión cuando se necesite y cerrarla cuando concluyan las operaciones.

### Opción A: Con PDO (Recomendada para Arquitectura Repository)

PDO permite preparar sentencias seguras contra inyecciones SQL y desacopla la aplicación del motor de BD.

```php
<?php
// Datos de conexión
$host = 'db';
$db   = 'app_db';
$user = 'app_user';
$pass = 'app_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = null;

try {
    // 1. ABRIR CONEXIÓN
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // 2. EJECUTAR CONSULTAS
    $stmt = $pdo->query("SELECT VERSION()");
    $version = $stmt->fetchColumn();
    echo "Versión de MariaDB: " . $version;

} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
} finally {
    // 3. CERRAR CONEXIÓN
    // En PDO, la conexión se cierra asignando null a la variable del objeto PDO
    $pdo = null;
}
```

---

### Opción B: Con MySQLi (Estilo Orientado a Objetos)

Si se utiliza el driver nativo `mysqli`:

```php
<?php
$host = 'db';
$user = 'app_user';
$pass = 'app_password';
$db   = 'app_db';

// 1. ABRIR CONEXIÓN
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

try {
    // 2. EJECUTAR CONSULTAS
    $result = $conn->query("SELECT DATABASE()");
    $row = $result->fetch_row();
    echo "Base actual: " . $row[0];
} finally {
    // 3. CERRAR CONEXIÓN
    // Es mandatorio invocar el método close()
    $conn->close();
}
```

---

## 4. Resumen Rápido de Comandos

```bash
# Encender entorno completo
podman-compose up -d

# Encender solo base de datos
podman-compose up -d db

# Apagar base de datos
podman-compose stop db

# Apagar todo
podman-compose down
```
