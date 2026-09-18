<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/User.php';

class UserRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Obtiene el listado de usuarios con soporte para filtros de búsqueda y rol.
     * @return User[]
     */
    public function getAll(?string $search = null, ?int $rolId = null): array {
        $sql = "SELECT u.id, u.nombre, u.apellido, u.username, u.email, u.rol_id, 
                       r.nombre AS rol_nombre, u.created_at, u.updated_at
                FROM usuarios u
                INNER JOIN roles r ON u.rol_id = r.id
                WHERE 1=1";
        
        $params = [];

        if ($search !== null && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $sql .= " AND (u.nombre LIKE :term1 
                        OR u.apellido LIKE :term2 
                        OR u.username LIKE :term3 
                        OR u.email LIKE :term4)";
            $params['term1'] = $term;
            $params['term2'] = $term;
            $params['term3'] = $term;
            $params['term4'] = $term;
        }

        if ($rolId !== null && $rolId > 0) {
            $sql .= " AND u.rol_id = :rol_id";
            $params['rol_id'] = $rolId;
        }

        $sql .= " ORDER BY u.id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $users = [];

        while ($row = $stmt->fetch()) {
            $users[] = new User(
                (int)$row['id'],
                $row['nombre'],
                $row['apellido'],
                $row['username'],
                $row['email'],
                (int)$row['rol_id'],
                $row['rol_nombre'],
                $row['created_at'],
                $row['updated_at']
            );
        }

        return $users;
    }

    /**
     * Obtiene un usuario por ID.
     */
    public function getById(int $id): ?User {
        $sql = "SELECT u.id, u.nombre, u.apellido, u.username, u.email, u.rol_id, 
                       r.nombre AS rol_nombre, u.created_at, u.updated_at
                FROM usuarios u
                INNER JOIN roles r ON u.rol_id = r.id
                WHERE u.id = :id";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int)$row['id'],
            $row['nombre'],
            $row['apellido'],
            $row['username'],
            $row['email'],
            (int)$row['rol_id'],
            $row['rol_nombre'],
            $row['created_at'],
            $row['updated_at']
        );
    }

    /**
     * Crea un nuevo registro de usuario.
     */
    public function create(User $user): int {
        $sql = "INSERT INTO usuarios (nombre, apellido, username, email, rol_id) 
                VALUES (:nombre, :apellido, :username, :email, :rol_id)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'nombre'   => $user->getNombre(),
            'apellido' => $user->getApellido(),
            'username' => $user->getUsername(),
            'email'    => $user->getEmail(),
            'rol_id'   => $user->getRolId()
        ]);

        return (int)$this->db->lastInsertId();
    }

    /**
     * Actualiza un usuario existente.
     */
    public function update(User $user): bool {
        $sql = "UPDATE usuarios 
                SET nombre = :nombre, 
                    apellido = :apellido, 
                    username = :username, 
                    email = :email, 
                    rol_id = :rol_id
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'id'       => $user->getId(),
            'nombre'   => $user->getNombre(),
            'apellido' => $user->getApellido(),
            'username' => $user->getUsername(),
            'email'    => $user->getEmail(),
            'rol_id'   => $user->getRolId()
        ]);
    }

    /**
     * Elimina un usuario por ID.
     */
    public function delete(int $id): bool {
        $sql = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }

    /**
     * Busca usuario por email para validación de unicidad.
     */
    public function findByEmail(string $email, ?int $excludeId = null): ?User {
        $sql = "SELECT id, nombre, apellido, username, email, rol_id FROM usuarios WHERE email = :email";
        $params = ['email' => $email];

        if ($excludeId !== null) {
            $sql .= " AND id != :exclude_id";
            $params['exclude_id'] = $excludeId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int)$row['id'],
            $row['nombre'],
            $row['apellido'],
            $row['username'],
            $row['email'],
            (int)$row['rol_id']
        );
    }

    /**
     * Busca usuario por nickname/username para validación de unicidad.
     */
    public function findByUsername(string $username, ?int $excludeId = null): ?User {
        $sql = "SELECT id, nombre, apellido, username, email, rol_id FROM usuarios WHERE username = :username";
        $params = ['username' => $username];

        if ($excludeId !== null) {
            $sql .= " AND id != :exclude_id";
            $params['exclude_id'] = $excludeId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return new User(
            (int)$row['id'],
            $row['nombre'],
            $row['apellido'],
            $row['username'],
            $row['email'],
            (int)$row['rol_id']
        );
    }
}
