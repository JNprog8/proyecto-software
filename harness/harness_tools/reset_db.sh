#!/usr/bin/env bash
# ==========================================================
# Script de Restauración de Base de Datos (Harness)
# ==========================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SQL_FILE="${DIR}/sql/01_init.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "Error: No se encontró el archivo $SQL_FILE"
    exit 1
fi

# Detectar el nombre del contenedor activo de MariaDB (admite abmc-db-1 o abmc_db_1)
DB_CONTAINER=$(podman ps --filter "name=db" --format "{{.Names}}" | head -n1)

if [ -z "$DB_CONTAINER" ]; then
    echo "Error: No se encontró ningún contenedor activo de MariaDB (abmc-db-1 / abmc_db_1)."
    echo "Asegúrese de ejecutar primero: podman compose up -d"
    exit 1
fi

echo "Restaurando la base de datos app_db en el contenedor '${DB_CONTAINER}'..."

# Restaurar esquema y datos semilla
podman exec -i "${DB_CONTAINER}" mariadb -u app_user -papp_password app_db < "$SQL_FILE"

echo "Base de datos restaurada exitosamente con los datos semilla iniciales."
