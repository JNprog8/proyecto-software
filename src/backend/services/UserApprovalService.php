<?php
declare(strict_types=1);

require_once __DIR__ . '/../repositories/UserRepository.php';
require_once __DIR__ . '/../models/User.php';

/**
 * caso de uso: aprobacion de participantes.
 * esta clase orquesta la logica de negocio, validando reglas antes de persistir en base de datos.
 */
class UserApprovalService
{
    private UserRepository $userRepo;

    public function __construct(UserRepository $userRepo)
    {
        $this->userRepo = $userRepo;
    }

    /**
     * ejecuta el caso de uso de aprobar un participante.
     * 
     * @param int $targetuserid ID del participante a aprobar
     * @param int $actorid ID del usuario que ejecuta la accion
     * @throws exception si las reglas de negocio no se cumplen
     */
    public function execute(int $targetUserId, int $actorId): void
    {
        // 1. validar autorizacion del actor
        if ($actorId === 0) {
            throw new Exception('Acceso denegado: Visitantes no pueden aprobar inscripciones.', 403);
        }

        $actor = $this->userRepo->getById($actorId);
        $rolId = $actor ? $actor->getRolId() : 0;

        // roles permitidos: 1 = organizador, 2 = tutor/mentor
        if ($rolId !== 1 && $rolId !== 2) {
            throw new Exception('Acceso denegado: Solo los Organizadores y Tutores pueden aprobar participantes.', 403);
        }

        // 2. obtener entidad objetivo
        $user = $this->userRepo->getById($targetUserId);
        if (!$user) {
            throw new Exception('Usuario no encontrado o dado de baja.', 404);
        }

        // 3. reglas de invariantes del negocio
        if ($user->getEstadoUsuarioId() !== 1) { // 1 = PENDIENTE
            throw new Exception('Operación no válida: El participante ya fue aprobado previamente.', 400);
        }

        // 4. transformar estado
        $updatedUser = new User(
            $user->getId(),
            $user->getNombre(),
            $user->getApellido(),
            $user->getUsername(),
            $user->getEmail(),
            $user->getRolId(),
            $user->getRolNombre(),
            $user->getTipoParticipanteId(),
            $user->getTipoParticipanteNombre(),
            2, // 2 = APROBADO
            'Aprobado',
            $user->getLegajo()
        );

        // 5. persistir
        $this->userRepo->update($updatedUser);
    }
}
