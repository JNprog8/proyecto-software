<?php
declare(strict_types=1);

require_once __DIR__ . '/../factories/RepositoryFactory.php';
require_once __DIR__ . '/../models/User.php';

/**
 * seeder de base de datos para demostraciones y defensas orales.
 * inserta 10 usuarios con nombres verosimiles y correos de la UNRN.
 */
echo "=== Ejecutando Seeder de Usuarios para Hackatón UNRN ===\n";

$userRepo = RepositoryFactory::getUserRepository();

$seedUsers = [
    ['nombre' => 'Mateo', 'apellido' => 'Rossi', 'username' => 'mrossi', 'email' => 'mrossi@unrn.edu.ar', 'rol_id' => 4],
    ['nombre' => 'Valentina', 'apellido' => 'Benítez', 'username' => 'vbenitez', 'email' => 'vbenitez@unrn.edu.ar', 'rol_id' => 2],
    ['nombre' => 'Facundo', 'apellido' => 'Morales', 'username' => 'fmorales', 'email' => 'fmorales@unrn.edu.ar', 'rol_id' => 3],
    ['nombre' => 'Lucía', 'apellido' => 'Martínez', 'username' => 'lmartinez', 'email' => 'lmartinez@unrn.edu.ar', 'rol_id' => 4],
    ['nombre' => 'Agustín', 'apellido' => 'Fernández', 'username' => 'afernandez', 'email' => 'afernandez@unrn.edu.ar', 'rol_id' => 4],
    ['nombre' => 'Camila', 'apellido' => 'Romero', 'username' => 'cromero', 'email' => 'cromero@unrn.edu.ar', 'rol_id' => 2],
    ['nombre' => 'Tomás', 'apellido' => 'Navarro', 'username' => 'tnavarro', 'email' => 'tnavarro@unrn.edu.ar', 'rol_id' => 4],
    ['nombre' => 'Florencia', 'apellido' => 'Castro', 'username' => 'fcastro', 'email' => 'fcastro@unrn.edu.ar', 'rol_id' => 3],
    ['nombre' => 'Nicolás', 'apellido' => 'Giménez', 'username' => 'ngimenez', 'email' => 'ngimenez@unrn.edu.ar', 'rol_id' => 4],
    ['nombre' => 'Martina', 'apellido' => 'Soria', 'username' => 'msoria', 'email' => 'msoria@unrn.edu.ar', 'rol_id' => 1],
];

$insertedCount = 0;
foreach ($seedUsers as $u) {
    if ($userRepo->emailExists($u['email']) || $userRepo->usernameExists($u['username'])) {
        echo " - Saltando usuario existente: {$u['username']} ({$u['email']})\n";
        continue;
    }

    try {
        $newUser = new User(
            null,
            $u['nombre'],
            $u['apellido'],
            new Username($u['username']),
            new Email($u['email']),
            $u['rol_id'],
            null, // rol_nombre
            null, // tipo_participante_id
            null, // tipo_participante_nombre
            2     // estado_usuario_id (APROBADO)
        );
        $id = $userRepo->create($newUser);
        echo " + Usuario creado [ID: {$id}]: {$u['nombre']} {$u['apellido']} (@{$u['username']}) - Rol {$u['rol_id']}\n";
        $insertedCount++;
    } catch (Exception $e) {
        echo " ! Error al crear {$u['username']}: " . $e->getMessage() . "\n";
    }
}

echo "\nSeeder finalizado exitosamente. Usuarios incorporados: {$insertedCount}.\n";
echo "Total de usuarios activos en padrón: " . $userRepo->count() . "\n";
