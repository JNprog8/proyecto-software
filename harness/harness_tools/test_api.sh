#!/usr/bin/env bash
# ==========================================================
# Test Suite Automatizada para API REST ABMC (Harness)
# ==========================================================

set -e

BASE_URL="http://localhost:8080"
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

echo -e "${BLUE}=== Iniciando Suite de Pruebas de API REST ===${NC}"

# 1. Comprobar conectividad general
echo -n "1. Verificando conectividad con el servidor web... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/")
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}[OK]${NC} (HTTP 200)"
else
    echo -e "${RED}[FALLO]${NC} Código HTTP: $HTTP_CODE"
    exit 1
fi

# 2. Listar roles
echo -n "2. Probando GET /api/roles... "
ROLES_RESP=$(curl -s "${BASE_URL}/api/roles")
if echo "$ROLES_RESP" | grep -q '"success":true'; then
    echo -e "${GREEN}[OK]${NC} Roles cargados correctamente."
else
    echo -e "${RED}[FALLO]${NC} Respuesta inesperada: $ROLES_RESP"
    exit 1
fi

# 3. Listar usuarios
echo -n "3. Probando GET /api/users... "
USERS_RESP=$(curl -s "${BASE_URL}/api/users")
if echo "$USERS_RESP" | grep -q '"success":true'; then
    echo -e "${GREEN}[OK]${NC} Listado obtenido."
else
    echo -e "${RED}[FALLO]${NC} Respuesta: $USERS_RESP"
    exit 1
fi

# 4. Filtro por búsqueda
echo -n "4. Probando filtro de búsqueda (?search=joaquin)... "
SEARCH_RESP=$(curl -s "${BASE_URL}/api/users?search=joaquin")
if echo "$SEARCH_RESP" | grep -q 'Joaquín'; then
    echo -e "${GREEN}[OK]${NC} Búsqueda operativa."
else
    echo -e "${RED}[FALLO]${NC} No se encontró el registro: $SEARCH_RESP"
    exit 1
fi

# 5. Alta de usuario (POST)
RANDOM_SUFFIX=$((RANDOM % 9000 + 1000))
TEST_USER="test_${RANDOM_SUFFIX}"
TEST_EMAIL="test_${RANDOM_SUFFIX}@unrn.edu.ar"

echo -n "5. Probando POST /api/users (Alta de usuario)... "
CREATE_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/users" \
    -H "Content-Type: application/json" \
    -d "{\"nombre\":\"Test\",\"apellido\":\"Harness\",\"username\":\"${TEST_USER}\",\"email\":\"${TEST_EMAIL}\",\"rol_id\":2}")

HTTP_STATUS=$(echo "$CREATE_RESP" | tail -n1)
BODY=$(echo "$CREATE_RESP" | sed '$d')

if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}[OK]${NC} Usuario creado (HTTP 201)."
    # Extraer ID creado
    USER_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | head -n1 | cut -d':' -f2)
else
    echo -e "${RED}[FALLO]${NC} HTTP $HTTP_STATUS: $BODY"
    exit 1
fi

# 6. Validación de duplicados (Email repetido)
echo -n "6. Probando validación de email duplicado... "
DUP_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/users" \
    -H "Content-Type: application/json" \
    -d "{\"nombre\":\"Otro\",\"apellido\":\"Usuario\",\"username\":\"otro_${RANDOM_SUFFIX}\",\"email\":\"${TEST_EMAIL}\",\"rol_id\":1}")

DUP_STATUS=$(echo "$DUP_RESP" | tail -n1)
DUP_BODY=$(echo "$DUP_RESP" | sed '$d')

if [ "$DUP_STATUS" -eq 422 ] && echo "$DUP_BODY" | grep -q 'ya existe'; then
    echo -e "${GREEN}[OK]${NC} Rechazado correctamente con HTTP 422."
else
    echo -e "${RED}[FALLO]${NC} Se esperaba HTTP 422 pero se obtuvo HTTP $DUP_STATUS: $DUP_BODY"
    exit 1
fi

# 7. Modificación de usuario (PUT)
if [ -n "$USER_ID" ]; then
    echo -n "7. Probando PUT /api/users/${USER_ID} (Modificación)... "
    UPDATE_RESP=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/api/users/${USER_ID}" \
        -H "Content-Type: application/json" \
        -d "{\"nombre\":\"Test Modificado\",\"apellido\":\"Harness Act\",\"username\":\"${TEST_USER}\",\"email\":\"${TEST_EMAIL}\",\"rol_id\":1}")

    UPDATE_STATUS=$(echo "$UPDATE_RESP" | tail -n1)
    if [ "$UPDATE_STATUS" -eq 200 ]; then
        echo -e "${GREEN}[OK]${NC} Modificado exitosamente (HTTP 200)."
    else
        echo -e "${RED}[FALLO]${NC} HTTP $UPDATE_STATUS"
        exit 1
    fi

    # 8. Baja de usuario (DELETE)
    echo -n "8. Probando DELETE /api/users/${USER_ID} (Baja)... "
    DEL_RESP=$(curl -s -w "\n%{http_code}" -X DELETE "${BASE_URL}/api/users/${USER_ID}")
    DEL_STATUS=$(echo "$DEL_RESP" | tail -n1)

    if [ "$DEL_STATUS" -eq 200 ]; then
        echo -e "${GREEN}[OK]${NC} Eliminado exitosamente (HTTP 200)."
    else
        echo -e "${RED}[FALLO]${NC} HTTP $DEL_STATUS"
        exit 1
    fi

    # 9. Verificar que ya no existe (404)
    echo -n "9. Verificando que GET /api/users/${USER_ID} devuelva 404... "
    GET_DEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/users/${USER_ID}")
    if [ "$GET_DEL_STATUS" -eq 404 ]; then
        echo -e "${GREEN}[OK]${NC} 404 Not Found verificado."
    else
        echo -e "${RED}[FALLO]${NC} Código HTTP: $GET_DEL_STATUS"
        exit 1
    fi
fi

# 10. Adminer
echo -n "10. Comprobando servicio de base de datos Adminer (:8081)... "
ADMINER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8081/")
if [ "$ADMINER_STATUS" -eq 200 ]; then
    echo -e "${GREEN}[OK]${NC} Adminer respondiendo."
else
    echo -e "${RED}[FALLO]${NC} Adminer código: $ADMINER_STATUS"
    exit 1
fi

echo -e "\n${GREEN}=== TODAS LAS PRUEBAS DEL HARNESS PASARON SATISFACTORIAMENTE ===${NC}"
exit 0
