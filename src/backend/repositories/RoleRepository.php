<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseRepository.php';
require_once __DIR__ . '/../models/Role.php';

/**
 * repositorio de persistencia para la entidad rol.
 * extiende baserepository e implementa repositoryinterface.
 */
class RoleRepository extends BaseRepository {
    protected string $table = 'roles';

    /**
     * devuelve una coleccion de roles.
     * @param array<string, mixed> $criteria
     * @return role[]
     */
    public function findAll(array $criteria = [], int $limit = 100, int $offset = 0): array {
        $sql = "SELECT id, nombre, descripcion, created_at FROM roles ORDER BY id ASC LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':limit', max(1, $limit), PDO::PARAM_INT);
        $stmt->bindValue(':offset', max(0, $offset), PDO::PARAM_INT);
        $stmt->execute();

        $roles = [];
        while ($row = $stmt->fetch()) {
            $roles[] = new Role(
                (int)$row['id'],
                (string)$row['nombre'],
                $row['descripcion'] !== null ? (string)$row['descripcion'] : null,
                $row['created_at'] !== null ? (string)$row['created_at'] : null
            );
        }

        return $roles;
    }

    /**
     * busca un rol por su ID.
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
            (string)$row['nombre'],
            $row['descripcion'] !== null ? (string)$row['descripcion'] : null,
            $row['created_at'] !== null ? (string)$row['created_at'] : null
        );
    }

    public function count(array $criteria = []): int {
        $sql = "SELECT COUNT(*) FROM roles";
        $stmt = $this->db->query($sql);
        return (int)$stmt->fetchColumn();
    }

    /**
     * Guarda o actualiza un rol en la base de datos.
     */
    public function save(object $entity): int|bool {
        if (!$entity instanceof Role) {
            throw new InvalidArgumentException('Se esperaba una instancia de Role');
        }

        if ($entity->id > 0) {
            return $this->update($entity);
        }

        $sql = "INSERT INTO roles (nombre, descripcion) VALUES (:nombre, :descripcion)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            'nombre' => $entity->nombre,
            'descripcion' => $entity->descripcion
        ]);

        if ($result) {
            $entity->id = (int)$this->db->lastInsertId();
            return $entity->id;
        }

        return false;
    }

    /**
     * Actualiza un rol existente.
     */
    protected function update(Role $entity): bool {
        $sql = "UPDATE roles SET nombre = :nombre, descripcion = :descripcion WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            'nombre' => $entity->nombre,
            'descripcion' => $entity->descripcion,
            'id' => $entity->id
        ]);
    }

    /**
     * Elimina un rol físicamente (no tiene borrado lógico en db_init.sql).
     */
    public function delete(int $id): bool {
        // Validar que no haya usuarios usándolo
        $sqlCheck = "SELECT COUNT(*) FROM usuarios WHERE rol_id = :id";
        $stmtCheck = $this->db->prepare($sqlCheck);
        $stmtCheck->execute(['id' => $id]);
        $count = (int)$stmtCheck->fetchColumn();

        if ($count > 0) {
            throw new LogicException('No se puede eliminar el rol porque está asignado a uno o más usuarios.');
        }

        $sql = "DELETE FROM roles WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }
}
