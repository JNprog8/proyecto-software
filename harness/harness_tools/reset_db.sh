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

echo "Restaurando la base de datos app_db en el contenedor abmc_db_1..."

# Restaurar esquema y datos semilla
podman exec -i abmc_db_1 mariadb -u app_user -papp_password app_db < "$SQL_FILE"

echo "Base de datos restaurada exitosamente con los datos semilla iniciales."
