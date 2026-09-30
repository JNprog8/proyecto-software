#!/usr/bin/env bash
# ==========================================================
# Script para Ejecutar el Seeder de Usuarios en Podman
# ==========================================================

set -e

CONTAINER_NAME="abmc_web_1"

if command -v podman &> /dev/null && podman ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo "Ejecutando Seeder dentro del contenedor '${CONTAINER_NAME}'..."
    podman exec -it "$CONTAINER_NAME" php /var/www/html/bin/seed.php
elif command -v php &> /dev/null; then
    echo "Ejecutando Seeder en PHP local..."
    php src/bin/seed.php
else
    echo "Error: No se encontró el contenedor '${CONTAINER_NAME}' ni binario local de PHP."
    exit 1
fi
