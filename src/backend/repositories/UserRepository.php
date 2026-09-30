<?php
declare(strict_types=1);

require_once __DIR__ . '/BaseRepository.php';
require_once __DIR__ . '/../models/User.php';

/**
 * repositorio de persistencia para la entidad usuario.
 * extiende baserepository e implementa repositoryinterface con soporte para soft delete y paginacion en BD.
 */
class UserRepository extends BaseRepository {
    protected string $table = 'usuarios';

    /**
     * busca un usuario por su ID (excluyendo registros eliminados logicamente).
     */
    public function findById(int $id): ?User {
        $sql = "SELECT u.id, u.nombre, u.apellido, u.username, u.email, u.rol_id, 
                       r.nombre AS rol_nombre, 
                       u.tipo_participante_id, tp.nombre AS tipo_participante_nombre,
                       u.estado_usuario_id, eu.nombre AS estado_usuario_nombre,
                       u.legajo,
                       u.created_at, u.updated_at, u.deleted_at
                FROM usuarios u
                INNER JOIN roles r ON u.rol_id = r.id
                LEFT JOIN tipos_participante tp ON u.tipo_participante_id = tp.id
                INNER JOIN estados_usuario eu ON u.estado_usuario_id = eu.id
                WHERE u.id = :id AND u.deleted_at IS NULL";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return $this->hydrate($row);
    }

    /**
     * alias compatible con versiones previas.
     */
    public function getById(int $id): ?User {
        return $this->findById($id);
    }

    /**
     * obtiene una lista paginada y filtrada de usuarios activos.
     * @param array{search?: ?string, rol_id?: ?int, estado_usuario_id?: ?int} $criteria
     * @return user[]
     */
    public function findAll(array $criteria = [], int $limit = 10, int $offset = 0): array {
        $sql = "SELECT u.id, u.nombre, u.apellido, u.username, u.email, u.rol_id, 
                       r.nombre AS rol_nombre, 
                       u.tipo_participante_id, tp.nombre AS tipo_participante_nombre,
                       u.estado_usuario_id, eu.nombre AS estado_usuario_nombre,
                       u.legajo,
                       u.created_at, u.updated_at, u.deleted_at
                FROM usuarios u
                INNER JOIN roles r ON u.rol_id = r.id
                LEFT JOIN tipos_participante tp ON u.tipo_participante_id = tp.id
                INNER JOIN estados_usuario eu ON u.estado_usuario_id = eu.id
                WHERE u.deleted_at IS NULL";
        
        $params = [];
        $sql .= $this->buildCriteriaSQL($criteria, $params);
        $sql .= " ORDER BY u.id DESC LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val, PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', max(1, $limit), PDO::PARAM_INT);
        $stmt->bindValue(':offset', max(0, $offset), PDO::PARAM_INT);
        $stmt->execute();

        $users = [];
        while ($row = $stmt->fetch()) {
            $users[] = $this->hydrate($row);
        }

        return $users;
    }

    /**
     * alias compatible con controladores existentes.
     * @return user[]
     */
    public function getAll(?string $search = null, ?int $rolId = null, int $limit = 50, int $offset = 0): array {
        return $this->findAll(['search' => $search, 'rol_id' => $rolId], $limit, $offset);
    }

    /**
     * cuenta el total de usuarios activos segun los criterios provistos.
     */
    public function count(array $criteria = []): int {
        $sql = "SELECT COUNT(*) FROM usuarios u WHERE u.deleted_at IS NULL";
        $params = [];
        $sql .= $this->buildCriteriaSQL($criteria, $params);

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    /**
     * helper parametrico que unifica la logica DRY de filtros WHERE.
     */
    private function buildCriteriaSQL(array $criteria, array &$params): string {
        $sql = '';
        $search = $criteria['search'] ?? null;
        $rolId  = isset($criteria['rol_id']) && (int)$criteria['rol_id'] > 0 ? (int)$criteria['rol_id'] : null;
        $estadoId = isset($criteria['estado_usuario_id']) && (int)$criteria['estado_usuario_id'] > 0 ? (int)$criteria['estado_usuario_id'] : null;

        if ($search !== null && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $sql .= " AND (u.nombre LIKE :term1 OR u.apellido LIKE :term2 OR u.username LIKE :term3 OR u.email LIKE :term4 OR u.legajo LIKE :term5)";
            $params['term1'] = $term; $params['term2'] = $term; $params['term3'] = $term; $params['term4'] = $term; $params['term5'] = $term;
        }

        if ($rolId !== null) {
            $sql .= " AND u.rol_id = :rol_id";
            $params['rol_id'] = $rolId;
        }
        
        if ($estadoId !== null) {
            $sql .= " AND u.estado_usuario_id = :estado_id";
            $params['estado_id'] = $estadoId;
        }

        return $sql;
    }

    /**
     * guarda o actualiza un usuario utilizando transacciones explicitas.
     */
    public function save(object $entity): int|bool {
        if (!($entity instanceof User)) {
            throw new InvalidArgumentException('La entidad debe ser una instancia de User.');
        }

        if ($entity->getId() === null || $entity->getId() <= 0) {
            return $this->create($entity);
        }

        return $this->update($entity);
    }

    /**
     * inserta un nuevo usuario en la base de datos dentro de una transaccion.
     */
    public function create(User $user): int {
        $this->beginTransaction();
        try {
            $sql = "INSERT INTO usuarios (nombre, apellido, username, email, rol_id, tipo_participante_id, estado_usuario_id, legajo) 
                    VALUES (:nombre, :apellido, :username, :email, :rol_id, :tipo_participante_id, :estado_usuario_id, :legajo)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                'nombre'               => $user->getNombre(),
                'apellido'             => $user->getApellido(),
                'username'             => $user->getUsername(),
                'email'                => $user->getEmail(),
                'rol_id'               => $user->getRolId(),
                'tipo_participante_id' => $user->getTipoParticipanteId(),
                'estado_usuario_id'    => $user->getEstadoUsuarioId(),
                'legajo'               => $user->getLegajo()
            ]);

            $newId = (int)$this->db->lastInsertId();
            $this->commit();
            return $newId;
        } catch (Exception $e) {
            $this->rollBack();
            throw $e;
        }
    }

    /**
     * actualiza un usuario existente dentro de una transaccion.
     */
    public function update(User $user): bool {
        $this->beginTransaction();
        try {
            $sql = "UPDATE usuarios 
                    SET nombre = :nombre, 
                        apellido = :apellido, 
                        username = :username, 
                        email = :email, 
                        rol_id = :rol_id,
                        tipo_participante_id = :tipo_participante_id,
                        estado_usuario_id = :estado_usuario_id,
                        legajo = :legajo
                    WHERE id = :id AND deleted_at IS NULL";
            
            $stmt = $this->db->prepare($sql);
            $success = $stmt->execute([
                'id'                   => $user->getId(),
                'nombre'               => $user->getNombre(),
                'apellido'             => $user->getApellido(),
                'username'             => $user->getUsername(),
                'email'                => $user->getEmail(),
                'rol_id'               => $user->getRolId(),
                'tipo_participante_id' => $user->getTipoParticipanteId(),
                'estado_usuario_id'    => $user->getEstadoUsuarioId(),
                'legajo'               => $user->getLegajo()
            ]);

            $this->commit();
            return $success;
        } catch (Exception $e) {
            $this->rollBack();
            throw $e;
        }
    }

    /**
     * ejecuta una baja logica (soft delete) marcando deleted_at con la fecha actual.
     */
    public function delete(int $id): bool {
        $this->beginTransaction();
        try {
            $sql = "UPDATE usuarios SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['id' => $id]);
            $affected = $stmt->rowCount() > 0;

            $this->commit();
            return $affected;
        } catch (Exception $e) {
            $this->rollBack();
            throw $e;
        }
    }

    /**
     * verifica si un correo electronico ya esta registrado por un usuario activo.
     */
    public function emailExists(string $email, ?int $ignoreId = null): bool {
        $sql = "SELECT COUNT(*) FROM usuarios WHERE email = :email AND deleted_at IS NULL";
        $params = ['email' => strtolower(trim($email))];

        if ($ignoreId !== null) {
            $sql .= " AND id != :ignore_id";
            $params['ignore_id'] = $ignoreId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn() > 0;
    }

    /**
     * verifica si un nickname ya esta registrado por un usuario activo.
     */
    public function usernameExists(string $username, ?int $ignoreId = null): bool {
        $sql = "SELECT COUNT(*) FROM usuarios WHERE username = :username AND deleted_at IS NULL";
        $params = ['username' => strtolower(trim($username))];

        if ($ignoreId !== null) {
            $sql .= " AND id != :ignore_id";
            $params['ignore_id'] = $ignoreId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn() > 0;
    }

    /**
     * hidrata una fila asociativa de la BD en un objeto user.
     * @param array<string, mixed> $row
     */
    private function hydrate(array $row): User {
        return new User(
            (int)$row['id'],
            (string)$row['nombre'],
            (string)$row['apellido'],
            new Username((string)$row['username']),
            new Email((string)$row['email']),
            (int)$row['rol_id'],
            $row['rol_nombre'] ?? null,
            isset($row['tipo_participante_id']) ? (int)$row['tipo_participante_id'] : null,
            $row['tipo_participante_nombre'] ?? null,
            isset($row['estado_usuario_id']) ? (int)$row['estado_usuario_id'] : 1,
            $row['estado_usuario_nombre'] ?? null,
            $row['legajo'] ?? null,
            $row['created_at'] ?? null,
            $row['updated_at'] ?? null,
            $row['deleted_at'] ?? null
        );
    }
}
