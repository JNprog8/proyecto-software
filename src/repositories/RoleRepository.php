<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Role.php';

class RoleRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Devuelve todos los roles ordenados por id.
     * @return Role[]
     */
    public function findAll(): array {
        $sql = "SELECT id, nombre, descripcion, created_at FROM roles ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        $roles = [];

        while ($row = $stmt->fetch()) {
            $roles[] = new Role(
                (int)$row['id'],
                $row['nombre'],
                $row['descripcion'],
                $row['created_at']
            );
        }

        return $roles;
    }

    /**
     * Busca un rol por su ID.
     */
    public function findById(int $id): ?Role {
        $sql = "SELECT id, nombre, descripcion, created_at FROM roles WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return new Role(
            (int)$row['id'],
            $row['nombre'],
            $row['descripcion'],
            $row['created_at']
        );
    }
}
