---
name: database-ops
description: Operaciones de diagnóstico, mantenimiento, restauración e inspección de la base de datos MariaDB contenerizada con Podman. Usar cuando se requiera ejecutar consultas SQL directas, reiniciar la base de datos o verificar logs.
---

# Operaciones de Base de Datos MariaDB (Podman)

Esta skill reúne los comandos y procedimientos operativos para interactuar con el contenedor `abmc_db_1`.

---

## 1. Parámetros de Conexión

| Parámetro | Valor Contenedor | Valor Host Local |
| :--- | :--- | :--- |
| **Host** | `db` | `127.0.0.1` |
| **Puerto** | `3306` | `3307` |
| **Base de Datos** | `app_db` | `app_db` |
| **Usuario** | `app_user` | `app_user` |
| **Contraseña** | `app_password` | `app_password` |
| **Root Password** | `root_password` | `root_password` |

---

## 2. Comandos Frecuentes de Mantenimiento

### Restaurar base de datos a estado inicial
Ejecuta el script del arnés que limpia y vuelve a cargar los roles y usuarios semilla:
```bash
bash harness/harness_tools/reset_db.sh
```

### Ejecutar una consulta directa desde terminal
```bash
podman exec abmc_db_1 mariadb -u app_user -papp_password app_db -e "SELECT id, nombre, email, rol_id FROM usuarios;"
```

### Abrir consola interactiva de MariaDB
```bash
podman exec -it abmc_db_1 mariadb -u app_user -papp_password app_db
```

### Ver registros (logs) del motor de base de datos
```bash
podman logs --tail 50 abmc_db_1
```

---

## 3. Gestor Gráfico Web (Adminer)
- Acceso directo en el navegador: `http://localhost:8081`
- **Sistema:** `MySQL` *(protocolo de red compartido)*
- **Servidor:** `db`
- **Usuario:** `app_user`
- **Contraseña:** `app_password`
- **Base de Datos:** `app_db`
