<?php
declare(strict_types=1);

require_once __DIR__ . '/../factories/RepositoryFactory.php';
require_once __DIR__ . '/../validators/UserValidator.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../dto/UserRegistrationDTO.php';
require_once __DIR__ . '/../services/UserApprovalService.php';
require_once __DIR__ . '/../services/SecurityLogger.php';
require_once __DIR__ . '/BaseController.php';

/**
 * controlador REST para la gestion de usuarios (ABMC).
 * utiliza repositoryfactory para inyeccion de dependencias, uservalidator para reglas de negocio
 * y valida autorizaciones RBAC en el servidor.
 */
class UserController extends BaseController {
    private UserRepository $userRepo;
    private RoleRepository $roleRepo;
    private UserValidator $validator;

    public function __construct(
        ?UserRepository $userRepo = null,
        ?RoleRepository $roleRepo = null,
        ?UserValidator $validator = null
    ) {
        $this->userRepo = $userRepo ?? RepositoryFactory::getUserRepository();
        $this->roleRepo = $roleRepo ?? RepositoryFactory::getRoleRepository();
        $this->validator = $validator ?? new UserValidator();
    }



    /**
     * valida si el usuario activo en la sesion cuenta con permisos de organizador (admin).
     * @param string $action nombre de la accion para el mensaje de justificacion
     */
    private function requireOrganizerRole(string $action): void {
        $currentUserId = $this->getCurrentUserId();

        if ($currentUserId === 0) {
            $this->sendJson(403, [
                'success' => false,
                'error' => "Acceso denegado: El perfil Visitante no tiene autorización para {$action} usuarios."
            ]);
        }

        $activeUser = $this->userRepo->getById((int)$currentUserId);
        $rolNombre = $activeUser ? strtolower($activeUser->getRolNombre() ?? '') : '';

        if (!$activeUser || !str_contains($rolNombre, 'administrador')) {
            $nombreRol = $activeUser ? $activeUser->getRolNombre() : 'No autenticado';
            $this->sendJson(403, [
                'success' => false,
                'error' => "Acceso denegado: Su rol actual ('{$nombreRol}') no posee privilegios de Administrador para {$action} usuarios en el padrón."
            ]);
        }
    }

    /**
     * listado y busqueda paginada de usuarios en base de datos.
     * GET /api/users?page=1&limit=10&search=...&rol_id=...
     */
    public function index(): void {
        $this->executeSafe(function() {
            $page   = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
            $limit  = isset($_GET['limit']) && is_numeric($_GET['limit']) ? min(100, max(1, (int)$_GET['limit'])) : 50;
            $offset = ($page - 1) * $limit;

            $search = isset($_GET['search']) ? trim((string)$_GET['search']) : (isset($_GET['q']) ? trim((string)$_GET['q']) : null);
            $rolId  = isset($_GET['rol_id']) && is_numeric($_GET['rol_id']) ? (int)$_GET['rol_id'] : (isset($_GET['role']) && is_numeric($_GET['role']) ? (int)$_GET['role'] : null);

            $criteria = [
                'search' => $search !== '' ? $search : null,
                'rol_id' => $rolId && $rolId > 0 ? $rolId : null
            ];

            $total = $this->userRepo->count($criteria);
            $users = $this->userRepo->findAll($criteria, $limit, $offset);

            $this->sendJson(200, [
                'success' => true,
                'total' => $total,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'total_pages' => $total > 0 ? (int)ceil($total / $limit) : 1
                ],
                'data' => $users
            ]);
        }, 'Error del servidor al obtener usuarios');
    }

    /**
     * obtiene un usuario especifico por ID.
     * GET /api/users/{id}
     */
    public function show(int $id): void {
        $this->executeSafe(function() use ($id) {
            $user = $this->userRepo->getById($id);
            if (!$user) {
                $this->sendError('Usuario no encontrado o dado de baja.', 404);
            }
            $this->sendSuccess($user);
        }, 'Error al consultar usuario');
    }

    /**
     * alta de un nuevo usuario en el padron.
     * POST /api/users
     */
    public function store(): void {
        $this->executeSafe(function() {
            $currentUserId = $this->getCurrentUserId();
            $input = $this->getJsonPayload();

            if ($currentUserId === 0) {
                if (!isset($input['rol_id']) || (int)$input['rol_id'] !== 4) {
                    return $this->sendError('Acceso denegado: Los visitantes solo pueden registrarse como Participantes.', 403);
                }
            } else {
                $this->requireOrganizerRole('dar de alta');
            }

            $dto = UserRegistrationDTO::fromArray($input);
            $validation = $this->validator->validate($dto->toArray(), null, $this->userRepo);
            if (!$validation['valid']) {
                return $this->sendError(implode(' ', $validation['errors']), 422, $validation['errors']);
            }

            $role = $this->roleRepo->findById((int)$input['rol_id']);
            if (!$role) {
                return $this->sendError('El rol seleccionado no existe en el catálogo.', 422);
            }

            $newUser = new User(
                null, $dto->nombre, $dto->apellido, new Username($dto->username),
                new Email($dto->email), $dto->rol_id, $role->getNombre(),
                $dto->tipo_participante_id, null, 1, null, $dto->legajo
            );

            $insertedId = $this->userRepo->create($newUser);
            $createdUser = $this->userRepo->getById($insertedId);

            SecurityLogger::logEvent('USER_CREATE', $currentUserId, "Registró al usuario ID: {$insertedId} ({$dto->email})");

            $this->sendSuccess($createdUser, 'Participante registrado exitosamente en la Hackatón.', 201);
        }, 'Error interno al persistir usuario');
    }

    /**
     * modificacion completa o parcial de un usuario existente (idempotente).
     * PUT /api/users/{id}
     */
    public function update(int $id): void {
        $this->executeSafe(function() use ($id) {
            $this->requireOrganizerRole('modificar');

            $existingUser = $this->userRepo->getById($id);
            if (!$existingUser) {
                return $this->sendError('El usuario que intenta modificar no existe o fue dado de baja.', 404);
            }

            $input = $this->getJsonPayload();
            $mergedData = [
                'nombre'               => $input['nombre'] ?? $existingUser->getNombre(),
                'apellido'             => $input['apellido'] ?? $existingUser->getApellido(),
                'username'             => $input['username'] ?? $existingUser->getUsername()->getValue(),
                'email'                => $input['email'] ?? $existingUser->getEmail()->getValue(),
                'rol_id'               => $input['rol_id'] ?? $existingUser->getRolId(),
                'tipo_participante_id' => array_key_exists('tipo_participante_id', $input) ? $input['tipo_participante_id'] : $existingUser->getTipoParticipanteId(),
                'estado_usuario_id'    => $input['estado_usuario_id'] ?? $existingUser->getEstadoUsuarioId(),
                'legajo'               => array_key_exists('legajo', $input) ? $input['legajo'] : $existingUser->getLegajo()
            ];

            $dto = UserRegistrationDTO::fromArray($mergedData);

            $validation = $this->validator->validate($dto->toArray(), $id, $this->userRepo);
            if (!$validation['valid']) {
                return $this->sendError(implode(' ', $validation['errors']), 422, $validation['errors']);
            }

            $role = $this->roleRepo->findById((int)$mergedData['rol_id']);
            if (!$role) {
                return $this->sendError('El rol especificado no existe.', 422);
            }

            $updatedUser = new User(
                $id, $dto->nombre, $dto->apellido, new Username($dto->username),
                new Email($dto->email), $dto->rol_id, $role->getNombre(),
                $dto->tipo_participante_id, null, (int)$mergedData['estado_usuario_id'],
                null, $dto->legajo
            );

            $this->userRepo->update($updatedUser);
            $persisted = $this->userRepo->getById($id);

            SecurityLogger::logEvent('USER_UPDATE', $this->getCurrentUserId(), "Modificó al usuario ID: {$id}");

            $this->sendSuccess($persisted, 'Participante actualizado exitosamente.');
        }, 'Error al actualizar usuario');
    }

    /**
     * baja logica de usuario (soft delete).
     * DELETE /api/users/{id}
     */
    public function destroy(int $id): void {
        $this->executeSafe(function() use ($id) {
            $this->requireOrganizerRole('dar de baja');

            if ($id === 1) {
                return $this->sendError('Operación denegada: No está permitido eliminar la cuenta raíz de Organizador.', 400);
            }

            $user = $this->userRepo->getById($id);
            if (!$user) {
                return $this->sendError('El usuario que desea eliminar no existe o ya ha sido dado de baja.', 404);
            }

            if ($this->userRepo->delete($id)) {
                SecurityLogger::logEvent('USER_DELETE', $this->getCurrentUserId(), "Dio de baja al usuario ID: {$id} ({$user->getEmail()->getValue()})");
                $this->sendSuccess(null, "El usuario '{$user->getNombreCompleto()}' fue dado de baja correctamente.");
            } else {
                $this->sendError('No se pudo completar la baja del usuario.', 500);
            }
        }, 'Error al procesar la baja');
    }

    public function approve(int $id): void {
        try {
            $currentUserId = $this->getCurrentUserId();
            $approvalService = new UserApprovalService($this->userRepo);
            $approvalService->execute($id, (int)$currentUserId);
            $this->sendSuccess(null, 'El participante fue aprobado exitosamente.');
        } catch (Exception $e) {
            $code = $e->getCode();
            $status = ($code >= 400 && $code < 600) ? $code : 500;
            $this->sendError($e->getMessage(), $status);
        }
    }
}
