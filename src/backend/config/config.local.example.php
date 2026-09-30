<?php
/**
 * Configuración local opcional para la Base de Datos.
 * 
 * Si utiliza WampServer (o XAMPP) con el usuario predeterminado 'root' sin contraseña,
 * NO necesita crear este archivo ya que la aplicación detecta automáticamente la conexión
 * y prueba los puertos estándar de WampServer (3306 para MySQL y 3307/3308 para MariaDB).
 * 
 * Si su instalación de WAMP requiere credenciales específicas, copie este archivo
 * con el nombre "config.local.php" en este mismo directorio y ajuste los valores:
 */
return [
    'host'   => '127.0.0.1', // Servidor de base de datos (127.0.0.1 o localhost)
    'port'   => 3306,        // Puerto (3306 para MySQL o 3307 para MariaDB en WAMP)
    'dbname' => 'app_db',    // Nombre de la base de datos importada
    'user'   => 'root',      // Usuario de la base de datos ('root' por defecto en WAMP)
    'pass'   => '',          // Contraseña ('vacía' por defecto en WAMP)
];
