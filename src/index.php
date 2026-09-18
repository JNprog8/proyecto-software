<?php

require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/RoleController.php';

// Obtener URI y método HTTP
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Soporte para override de métodos en caso de clientes que no envíen PUT/DELETE nativo
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
} elseif ($method === 'POST' && isset($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'])) {
    $method = strtoupper($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']);
}

// Normalizar la ruta eliminando barras finales repetidas
$path = rtrim($requestUri, '/');
if ($path === '') {
    $path = '/';
}

// Enrutador de API REST
if (str_starts_with($path, '/api/')) {
    // 1. Roles: /api/roles
    if ($path === '/api/roles' && $method === 'GET') {
        (new RoleController())->index();
        exit;
    }

    // 2. Usuarios: /api/users
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

    // 3. Usuario específico: /api/users/{id}
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

    // Endpoint API no encontrado
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Endpoint no encontrado o método no soportado: ' . $method . ' ' . $path
    ]);
    exit;
}

// Si no es una llamada a la API, renderizar la vista principal del ABMC
require_once __DIR__ . '/views/main.php';