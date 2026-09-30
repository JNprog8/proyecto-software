<?php
declare(strict_types=1);

/**
 * clase base para controladores REST.
 * provee utilidades comunes para respuestas JSON, manejo de sesiones y parseo de payloads
 * con el objetivo de eliminar codigo duplicado y redundancias (DRY).
 */
abstract class BaseController {
    
    /**
     * envia una respuesta HTTP en formato JSON con soporte UTF-8.
     * @param int $statuscode codigo de estado HTTP (ej. 200, 400, 404)
     * @param array<string, mixed> $data estructura de datos a enviar
     */
    protected function sendJson(int $statusCode, array $data): void {
        http_response_code($statusCode);
        
        // cabeceras de seguridad (security headers)
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        header('Content-Security-Policy: default-src \'self\';');
        
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * helpers funcionales para respuestas estandar
     */
    protected function sendSuccess(mixed $data = null, string $message = '', int $statusCode = 200): void {
        $payload = ['success' => true];
        if ($message !== '') $payload['message'] = $message;
        if ($data !== null) $payload['data'] = $data;
        $this->sendJson($statusCode, $payload);
    }

    protected function sendError(string $error, int $statusCode = 400, array $validationErrors = []): void {
        $payload = ['success' => false, 'error' => $error];
        if (!empty($validationErrors)) $payload['errors'] = $validationErrors;
        $this->sendJson($statusCode, $payload);
    }

    /**
     * wrapper lambda para atrapar excepciones globalmente, 
     * promoviendo el principio DRY y aislando el bloque try-catch.
     */
    protected function executeSafe(callable $action, string $defaultErrorMsg = 'Error interno'): void {
        try {
            $action();
        } catch (Exception $e) {
            $this->sendError($defaultErrorMsg . ': ' . $e->getMessage(), 500);
        }
    }

    /**
     * obtiene el payload JSON de la peticion HTTP o un array vacio si no es valido.
     * @return array<string, mixed>
     */
    protected function getJsonPayload(): array {
        $rawBody = file_get_contents('php://input');
        $input = json_decode($rawBody, true);
        
        if (!is_array($input)) {
            $this->sendJson(400, [
                'success' => false,
                'error' => 'Payload JSON malformado o cuerpo de solicitud vacío.'
            ]);
        }
        
        return $input;
    }

    /**
     * devuelve el ID del usuario actual simulado en sesion.
     * soporta inicio automatico de sesion si no existe, o modo CLI sin errores.
     */
    protected function getCurrentUserId(): int {
        if (session_status() === PHP_SESSION_NONE) {
            // mitigacion contra session hijacking y CSRF
            session_set_cookie_params([
                'lifetime' => 86400,
                'path' => '/',
                'domain' => '',
                'secure' => true, // Requiere HTTPS
                'httponly' => true, // Bloquea acceso a session.id desde JavaScript (Mitiga XSS -> Session Hijacking)
                'samesite' => 'Strict' // Bloquea envío en requests cross-site (Mitiga CSRF)
            ]);
            session_start();
        }
        // retorna el ID guardado, o asume el organizador inicial (ID 1) por defecto
        return (int)($_SESSION['user_id'] ?? 1);
    }
}
