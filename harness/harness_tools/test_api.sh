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
echo -n "4. Probando filtro de búsqueda (?search=juan)... "
SEARCH_RESP=$(curl -s "${BASE_URL}/api/users?search=juan")
if echo "$SEARCH_RESP" | grep -q 'Juan'; then
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

# 11. Edge Case: Payload JSON malformado
echo -n "11. Probando Edge Case: Payload malformado (debe ser HTTP 400)... "
MALFORMED_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/users" \
    -H "Content-Type: application/json" \
    -d "{invalid_json:")
MALFORMED_STATUS=$(echo "$MALFORMED_RESP" | tail -n1)
if [ "$MALFORMED_STATUS" -eq 400 ]; then
    echo -e "${GREEN}[OK]${NC} HTTP 400 rechazado adecuadamente."
else
    echo -e "${RED}[FALLO]${NC} Se esperaba 400 pero se obtuvo HTTP $MALFORMED_STATUS"
    exit 1
fi

# 12. Edge Case: Ataque de inyección XSS / Caracteres inválidos en nickname
echo -n "12. Probando Edge Case: Intento de inyección de script en nickname... "
INJECTION_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/api/users" \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Hacker","apellido":"Test","username":"<script>alert(1)</script>","email":"hacker@unrn.edu.ar","rol_id":4}')
INJECTION_STATUS=$(echo "$INJECTION_RESP" | tail -n1)
if [ "$INJECTION_STATUS" -eq 422 ]; then
    echo -e "${GREEN}[OK]${NC} HTTP 422 Sanidad de entrada validada."
else
    echo -e "${RED}[FALLO]${NC} Se esperaba 422 pero se obtuvo HTTP $INJECTION_STATUS"
    exit 1
fi

# 13. Edge Case: ID inexistente
echo -n "13. Probando Edge Case: Consulta de ID inexistente (/api/users/999999)... "
NOTFOUND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/users/999999")
if [ "$NOTFOUND_STATUS" -eq 404 ]; then
    echo -e "${GREEN}[OK]${NC} HTTP 404 manejado limpiamente."
else
    echo -e "${RED}[FALLO]${NC} Se esperaba 404 pero se obtuvo HTTP $NOTFOUND_STATUS"
    exit 1
fi

# 14. Paginación en Base de Datos
echo -n "14. Probando Paginación en BD (?page=1&limit=5)... "
PAGE_RESP=$(curl -s "${BASE_URL}/api/users?page=1&limit=5")
if echo "$PAGE_RESP" | grep -q '"pagination"' && echo "$PAGE_RESP" | grep -q '"limit":5'; then
    echo -e "${GREEN}[OK]${NC} Metadatos de paginación verificados."
else
    echo -e "${RED}[FALLO]${NC} Respuesta de paginación inválida: $PAGE_RESP"
    exit 1
fi

# 15. RBAC en Servidor: Rechazo a perfil sin permisos
COOKIE_JAR=$(mktemp)
echo -n "15. Probando RBAC en Servidor: Conmutar a Visitante e intentar baja... "
curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" -X POST "${BASE_URL}/api/auth/switch" \
    -H "Content-Type: application/json" \
    -d '{"user_id":0}' > /dev/null

FORBIDDEN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -X DELETE "${BASE_URL}/api/users/2")

# Restaurar identidad a Organizador
curl -s -c "$COOKIE_JAR" -b "$COOKIE_JAR" -X POST "${BASE_URL}/api/auth/switch" \
    -H "Content-Type: application/json" \
    -d '{"user_id":1}' > /dev/null
rm -f "$COOKIE_JAR"

if [ "$FORBIDDEN_STATUS" -eq 403 ]; then
    echo -e "${GREEN}[OK]${NC} HTTP 403 Forbidden garantizado por el backend."
else
    echo -e "${RED}[FALLO]${NC} Se esperaba 403 pero se obtuvo HTTP $FORBIDDEN_STATUS"
    exit 1
fi

echo -e "\n${GREEN}=== TODAS LAS PRUEBAS DEL HARNESS (15/15) PASARON SATISFACTORIAMENTE ===${NC}"
exit 0
