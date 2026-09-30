<?php
declare(strict_types=1);

/**
 * servicio de auditoria de seguridad (audit logging).
 * registra eventos sensibles para trazabilidad y respuesta ante incidentes (SIEM).
 */
class SecurityLogger {
    private const LOG_FILE = __DIR__ . '/../logs/audit.log';

    public static function logEvent(string $action, int $userId, string $details = ''): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN_IP';
        $timestamp = date('Y-m-d H:i:s');
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN_UA';
        
        // sanitizar input para evitar "log forging"
        $safeAction = str_replace(["\n", "\r"], ' ', $action);
        $safeDetails = str_replace(["\n", "\r"], ' ', $details);

        $logEntry = sprintf(
            "[%s] IP: %s | UserID: %d | Action: %s | Details: %s | UA: %s\n",
            $timestamp,
            $ip,
            $userId,
            $safeAction,
            $safeDetails,
            $userAgent
        );

        // uso de FILE_APPEND y bloqueo estricto LOCK_EX para prevenir condiciones de carrera
        file_put_contents(self::LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
    }
}
