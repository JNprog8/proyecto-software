<?php
/**
 * Punto de entrada raíz para despliegues en servidores Apache nativos (XAMPP / WAMP / Apache estándar en Windows/Linux).
 * Si el servidor web apunta a la raíz del repositorio en lugar de a /src/, redirige automáticamente a /src/.
 */
$scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
$target = ($scriptDir !== '' ? $scriptDir : '') . '/src/';

if (!empty($_SERVER['QUERY_STRING'])) {
    $target .= '?' . $_SERVER['QUERY_STRING'];
}

header("Location: " . $target, true, 302);
exit;
