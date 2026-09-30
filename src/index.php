<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/backend/controllers/UserController.php';
require_once __DIR__ . '/backend/controllers/RoleController.php';
require_once __DIR__ . '/backend/controllers/AuthController.php';

// 1. Obtener URI y normalizar método HTTP
$rawUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$requestUri = rawurldecode($rawUri);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// soporte para override de metodos en caso de clientes que no envien PUT/DELETE nativo
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
} elseif ($method === 'POST' && isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
    $method = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
}

// 2. Normalizar directorio base para que funcione tanto en raíz ('/') como en subdirectorios de Apache (ej. '/ABMC' o '/SPRINT 2 - NEGUELÚA JOAQUÍN')
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if ($scriptDir === '/' || $scriptDir === '.') {
    $scriptDir = '';
}

// Extraer la ruta relativa al script principal
$path = $requestUri;
if ($scriptDir !== '' && str_starts_with($path, $scriptDir)) {
    $path = substr($path, strlen($scriptDir));
}
$path = '/' . ltrim($path, '/');
$path = rtrim($path, '/');
if ($path === '' || $path === '/index.php') {
    $path = '/';
}

// enrutador de API REST
if (str_starts_with($path, '/api/')) {
    // 0. autenticacion y simulador de roles
    if ($path === '/api/auth/me' && $method === 'GET') {
        (new AuthController())->me();
        exit;
    }
    if ($path === '/api/auth/switch' && $method === 'POST') {
        (new AuthController())->switch();
        exit;
    }

    // 1. roles: /api/roles
    if ($path === '/api/roles') {
        $controller = new RoleController();
        if ($method === 'GET') {
            $controller->index();
            exit;
        } elseif ($method === 'POST') {
            $controller->store();
            exit;
        }
    }

    if (preg_match('#^/api/roles/(\d+)$#', $path, $matches)) {
        $id = (int)$matches[1];
        $controller = new RoleController();

        if ($method === 'PUT' || $method === 'PATCH') {
            $controller->update($id);
            exit;
        } elseif ($method === 'DELETE') {
            $controller->destroy($id);
            exit;
        }
    }

    // 2. usuarios: /api/users
    if ($path === '/api/users') {
        $controller = new UserController();
        if ($method === 'GET') {
            $controller->index();
            exit;
        } elseif ($method === 'POST') {
            $controller->store();
            exit;
        }
    }

    // 3. usuario especifico: /api/users/{id}
    if (preg_match('#^/api/users/(\d+)$#', $path, $matches)) {
        $id = (int)$matches[1];
        $controller = new UserController();

        if ($method === 'GET') {
            $controller->show($id);
            exit;
        } elseif ($method === 'PUT' || $method === 'PATCH') {
            $controller->update($id);
            exit;
        } elseif ($method === 'DELETE') {
            $controller->destroy($id);
            exit;
        }
    }

    // 4. aprobar usuario: /api/users/{id}/approve
    if (preg_match('#^/api/users/(\d+)/approve$#', $path, $matches)) {
        $id = (int)$matches[1];
        $controller = new UserController();
        
        if ($method === 'POST') {
            $controller->approve($id);
            exit;
        }
    }

    // endpoint API no encontrado
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Endpoint no encontrado o método no soportado: ' . $method . ' ' . $path
    ]);
    exit;
}

// si no es una llamada a la API, renderizar la vista principal del ABMC
require_once __DIR__ . '/frontend/views/main.php';