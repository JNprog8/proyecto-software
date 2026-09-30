<?php

class Database
{
    private static ?PDO $instance = null;

    private static string $host = 'db';
    private static string $dbName = 'app_db';
    private static string $user = 'app_user';
    private static string $pass = 'app_password';
    private static int $port = 3306;
    private static string $charset = 'utf8mb4';

    /**
     * Obtiene una instancia singleton de PDO con detección inteligente de entorno
     * (Contenedores Podman/Docker vs. Apache Nativo/XAMPP/WAMP en Windows 10).
     */
    public static function getConnection(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // 1. Cargar archivo de configuración local opcional si existe
        $localConfigFile = __DIR__ . '/config.local.php';
        $localConfig = file_exists($localConfigFile) ? (require $localConfigFile) : [];

        // 2. Parámetros explícitos (Variables de entorno o configuración local)
        $envHost = getenv('DB_HOST') ?: ($localConfig['host'] ?? null);
        $dbName  = getenv('DB_NAME') ?: ($localConfig['dbname'] ?? self::$dbName);
        $user    = getenv('DB_USER') ?: ($localConfig['user'] ?? null);
        $pass    = getenv('DB_PASS') !== false && getenv('DB_PASS') !== null ? getenv('DB_PASS') : ($localConfig['pass'] ?? null);
        $port    = (int)(getenv('DB_PORT') ?: ($localConfig['port'] ?? self::$port));
        $charset = self::$charset;

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        // 3. Estrategia de conexión con fallback inteligente
        $candidates = [];

        if ($envHost !== null) {
            // Si hay un host explícito en variables de entorno o config.local.php
            $candidates[] = [
                'host' => $envHost,
                'port' => $port,
                'user' => $user ?? self::$user,
                'pass' => $pass ?? self::$pass,
            ];
        } else {
            // Si el nombre de host de contenedor 'db' es resoluble por DNS (Entorno Podman/Docker)
            $resolvedIp = @gethostbyname('db');
            if ($resolvedIp !== 'db') {
                $candidates[] = [
                    'host' => 'db',
                    'port' => 3306,
                    'user' => $user ?? self::$user,
                    'pass' => $pass ?? self::$pass,
                ];
            }

            // Entorno Nativo / Windows 10 (WAMP / XAMPP / MariaDB / MySQL)
            // WampServer instala concurrentemente MySQL y MariaDB en puertos 3306, 3307 o 3308.
            $wampPorts = array_values(array_unique([(int)$port, 3306, 3307, 3308]));
            $wampCredentials = [
                ['user' => $user ?? self::$user, 'pass' => $pass ?? self::$pass], // app_user / app_password
                ['user' => 'root', 'pass' => ''],                                // root sin contraseña (WAMP estándar)
                ['user' => 'root', 'pass' => 'root'],                            // root con contraseña root
            ];

            foreach ($wampPorts as $p) {
                foreach ($wampCredentials as $cred) {
                    $candidates[] = [
                        'host' => '127.0.0.1',
                        'port' => $p,
                        'user' => $cred['user'],
                        'pass' => $cred['pass'],
                    ];
                    $candidates[] = [
                        'host' => 'localhost',
                        'port' => $p,
                        'user' => $cred['user'],
                        'pass' => $cred['pass'],
                    ];
                }
            }
        }

        $lastException = null;
        foreach ($candidates as $c) {
            $cHost = $c['host'];
            $cPort = $c['port'];
            $cUser = $c['user'];
            $cPass = $c['pass'];
            $dsn = "mysql:host={$cHost};port={$cPort};dbname={$dbName};charset={$charset}";

            try {
                self::$instance = new PDO($dsn, $cUser, $cPass, $options);
                return self::$instance;
            } catch (PDOException $e) {
                $lastException = $e;
                continue;
            }
        }

        // Si ninguna combinación logró establecer conexión
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error' => 'Error de conexión a la base de datos: ' . ($lastException ? $lastException->getMessage() : 'No se pudo conectar.'),
            'hint' => 'Asegúrese de que el servicio MySQL o MariaDB esté activo en WampServer (ícono verde) y que la base "app_db" haya sido importada desde sql/01_init.sql en phpMyAdmin. Si sus motores usan un puerto o clave diferente, puede configurarlo en backend/config/config.local.php.'
        ]);
        exit;
    }

    /**
     * Cierra explícitamente la conexión activa a la base de datos.
     */
    public static function closeConnection(): void
    {
        self::$instance = null;
    }
}
