<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/RoleRepository.php';

/**
 * fabrica para la instanciacion de repositorios (factory pattern).
 * permite desacoplar y mockear la conexion PDO o los repositorios para testing.
 */
class RepositoryFactory {
    /**
     * instancia un userrepository con la conexion PDO inyectada.
     */
    public static function getUserRepository(?PDO $db = null): UserRepository {
        return new UserRepository($db ?? Database::getConnection());
    }

    /**
     * instancia un rolerepository con la conexion PDO inyectada.
     */
    public static function getRoleRepository(?PDO $db = null): RoleRepository {
        return new RoleRepository($db ?? Database::getConnection());
    }
}
