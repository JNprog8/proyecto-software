<?php

require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/RoleRepository.php';
require_once __DIR__ . '/../models/User.php';

class UserController {
    private UserRepository $userRepo;
    private RoleRepository $roleRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->roleRepo = new RoleRepository();
    }

    /**
     * Envía una respuesta HTTP en formato JSON con soporte UTF-8 sin escapar caracteres unicode.
     */
    private function sendJson(int $statusCode, array $data): void {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Listado y búsqueda de usuarios.
     * GET /api/users?search=...&rol_id=...
     */
    public function index(): void {
        try {
            $search = isset($_GET['search']) ? trim($_GET['search']) : null;
            $rolId = isset($_GET['rol_id']) && is_numeric($_GET['rol_id']) ? (int)$_GET['rol_id'] : null;

            $users = $this->userRepo->getAll($search, $rolId);
            $this->sendJson(200, [
                'success' => true,
                'total' => count($users),
                'data' => $users
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al listar usuarios: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtiene un usuario específico.
     * GET /api/users/{id}
     */
    public function show(int $id): void {
        try {
            $user = $this->userRepo->getById($id);
            if (!$user) {
                $this->sendJson(404, [
                    'success' => false,
                    'error' => 'Usuario no encontrado.'
                ]);
            }

            $this->sendJson(200, [
                'success' => true,
                'data' => $user
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al obtener usuario: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Alta de un nuevo usuario.
     * POST /api/users
     */
    public function store(): void {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            $this->sendJson(400, [
                'success' => false,
                'error' => 'Datos inválidos o cuerpo de solicitud vacío.'
            ]);
        }

        $validationErrors = $this->validateUserData($input);
        if (!empty($validationErrors)) {
            $this->sendJson(422, [
                'success' => false,
                'errors' => $validationErrors,
                'error' => implode(' ', $validationErrors)
            ]);
        }

        try {
            $user = new User(
                null,
                trim($input['nombre']),
                trim($input['apellido']),
                trim($input['username']),
                trim(strtolower($input['email'])),
                (int)$input['rol_id']
            );

            $id = $this->userRepo->create($user);
            $createdUser = $this->userRepo->getById($id);

            $this->sendJson(201, [
                'success' => true,
                'message' => 'Usuario registrado exitosamente.',
                'data' => $createdUser
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al crear el usuario: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Modificación de usuario existente.
     * PUT /api/users/{id}
     */
    public function update(int $id): void {
        $existing = $this->userRepo->getById($id);

        if (!$existing) {
            $this->sendJson(404, [
                'success' => false,
                'error' => 'El usuario a modificar no existe.'
            ]);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $this->sendJson(400, [
                'success' => false,
                'error' => 'Datos inválidos o cuerpo de solicitud vacío.'
            ]);
        }

        $validationErrors = $this->validateUserData($input, $id);
        if (!empty($validationErrors)) {
            $this->sendJson(422, [
                'success' => false,
                'errors' => $validationErrors,
                'error' => implode(' ', $validationErrors)
            ]);
        }

        try {
            $user = new User(
                $id,
                trim($input['nombre']),
                trim($input['apellido']),
                trim($input['username']),
                trim(strtolower($input['email'])),
                (int)$input['rol_id']
            );

            $this->userRepo->update($user);
            $updatedUser = $this->userRepo->getById($id);

            $this->sendJson(200, [
                'success' => true,
                'message' => 'Usuario actualizado correctamente.',
                'data' => $updatedUser
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al actualizar el usuario: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Baja de usuario.
     * DELETE /api/users/{id}
     */
    public function destroy(int $id): void {
        try {
            $existing = $this->userRepo->getById($id);
            if (!$existing) {
                $this->sendJson(404, [
                    'success' => false,
                    'error' => 'El usuario a eliminar no existe.'
                ]);
            }

            $deleted = $this->userRepo->delete($id);
            if ($deleted) {
                $this->sendJson(200, [
                    'success' => true,
                    'message' => "El usuario '{$existing->getUsername()}' fue eliminado exitosamente."
                ]);
            } else {
                $this->sendJson(500, [
                    'success' => false,
                    'error' => 'No se pudo eliminar el registro.'
                ]);
            }
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al eliminar usuario: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Valida los datos del usuario para alta o edición.
     */
    private function validateUserData(array $data, ?int $excludeId = null): array {
        $errors = [];

        // 1. Nombre
        if (empty($data['nombre']) || trim($data['nombre']) === '') {
            $errors['nombre'] = 'El nombre es obligatorio.';
        } elseif (strlen(trim($data['nombre'])) < 2) {
            $errors['nombre'] = 'El nombre debe tener al menos 2 caracteres.';
        }

        // 2. Apellido
        if (empty($data['apellido']) || trim($data['apellido']) === '') {
            $errors['apellido'] = 'El apellido es obligatorio.';
        } elseif (strlen(trim($data['apellido'])) < 2) {
            $errors['apellido'] = 'El apellido debe tener al menos 2 caracteres.';
        }

        // 3. Username / Nickname
        if (empty($data['username']) || trim($data['username']) === '') {
            $errors['username'] = 'El nombre de usuario (nickname) es obligatorio.';
        } else {
            $username = trim($data['username']);
            if (!preg_match('/^[a-zA-Z0-9._-]{3,30}$/', $username)) {
                $errors['username'] = 'El usuario debe tener entre 3 y 30 caracteres alfanuméricos (letras, números, puntos, guiones).';
            } else {
                $duplicateUser = $this->userRepo->findByUsername($username, $excludeId);
                if ($duplicateUser) {
                    $errors['username'] = "El nombre de usuario '{$username}' ya está en uso por otra cuenta.";
                }
            }
        }

        // 4. Email
        if (empty($data['email']) || trim($data['email']) === '') {
            $errors['email'] = 'El correo electrónico es obligatorio.';
        } else {
            $email = trim(strtolower($data['email']));
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'El correo electrónico no tiene un formato válido.';
            } else {
                $duplicateEmail = $this->userRepo->findByEmail($email, $excludeId);
                if ($duplicateEmail) {
                    $errors['email'] = "El correo electrónico '{$email}' ya existe. El usuario ya se encuentra registrado.";
                }
            }
        }

        // 5. Rol
        if (empty($data['rol_id']) || !is_numeric($data['rol_id'])) {
            $errors['rol_id'] = 'Debe seleccionar un rol válido.';
        } else {
            $role = $this->roleRepo->findById((int)$data['rol_id']);
            if (!$role) {
                $errors['rol_id'] = 'El rol seleccionado no existe en el sistema.';
            }
        }

        return $errors;
    }
}
