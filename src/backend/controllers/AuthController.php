<?php

require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../repositories/RoleRepository.php';
require_once __DIR__ . '/../services/SecurityLogger.php';
require_once __DIR__ . '/BaseController.php';

/**
 * controlador de autenticacion y conmutacion de roles (RBAC)
 * gestiona la identidad del usuario activo en la sesion para el simulador de roles.
 */
class AuthController extends BaseController {
    private UserRepository $userRepo;
    private RoleRepository $roleRepo;

    public function __construct() {
        $this->userRepo = new UserRepository();
        $this->roleRepo = new RoleRepository();
    }



    public function me(): void {
        $this->executeSafe(function() {
            $userId = $this->getCurrentUserId();

            if ($userId === 0) {
                return $this->sendSuccess([
                    'id' => 0, 'nombre' => 'Visitante', 'apellido' => 'Anónimo',
                    'nombre_completo' => 'Visitante Público', 'username' => 'visitante',
                    'email' => 'publico@unrn.edu.ar', 'rol_id' => 0, 'rol_nombre' => 'Visitante'
                ]);
            }

            $user = $this->userRepo->getById($userId) ?: $this->userRepo->getById(1);
            if (!$user) {
                $_SESSION['user_id'] = 1;
            }

            $this->sendSuccess($user);
        }, 'Error al cargar identidad');
    }

    public function switch(): void {
        $this->executeSafe(function() {
            $input = $this->getJsonPayload();

            if (!isset($input['user_id'])) {
                $this->sendError('Debe proveer el parámetro user_id.', 400);
            }

            $targetUserId = (int)$input['user_id'];

            if ($targetUserId === 0) {
                $_SESSION['user_id'] = 0;
                return $this->sendSuccess([
                    'id' => 0, 'rol_id' => 0, 'rol_nombre' => 'Visitante', 'nombre_completo' => 'Visitante Público'
                ], 'Sesión conmutada a Visitante Público.');
            }

            $user = $this->userRepo->getById($targetUserId);
            if (!$user) {
                $this->sendError("El usuario con ID {$targetUserId} no existe.", 404);
            }

            $_SESSION['user_id'] = $targetUserId;
            SecurityLogger::logEvent('AUTH_SWITCH', $targetUserId, "Identidad conmutada a rol: {$user->getRolNombre()}");

            $this->sendSuccess($user, "Identidad activa conmutada a '{$user->getNombreCompleto()}' ({$user->getRolNombre()}).");
        }, 'Error al conmutar rol');
    }
}
