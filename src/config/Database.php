<?php

class Database {
    private static ?PDO $instance = null;

    private static string $host = 'db';
    private static string $dbName = 'app_db';
    private static string $user = 'app_user';
    private static string $pass = 'app_password';
    private static int $port = 3306;
    private static string $charset = 'utf8mb4';

    /**
     * Obtiene una instancia activa de PDO.
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = getenv('DB_HOST') ?: self::$host;
            $db   = getenv('DB_NAME') ?: self::$dbName;
            $user = getenv('DB_USER') ?: self::$user;
            $pass = getenv('DB_PASS') ?: self::$pass;
            $port = getenv('DB_PORT') ?: self::$port;

            $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=" . self::$charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Error de conexión a la base de datos: ' . $e->getMessage()
                ]);
                exit;
            }
        }

        return self::$instance;
    }

    /**
     * Cierra explícitamente la conexión activa a la base de datos.
     */
    public static function closeConnection(): void {
        self::$instance = null;
    }
}
