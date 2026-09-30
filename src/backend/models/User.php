<?php
declare(strict_types=1);

require_once __DIR__ . '/ValueObjects/Email.php';
require_once __DIR__ . '/ValueObjects/Username.php';

/**
 * modelo de dominio: usuario
 * representa una cuenta de participante o rol dentro del sistema hackaton.
 */
class User implements JsonSerializable {
    private ?int $id;
    private string $nombre;
    private string $apellido;
    private Username $username;
    private Email $email;
    private int $rolId;
    private ?string $rolNombre;
    
    // nuevos campos
    private ?int $tipoParticipanteId;
    private ?string $tipoParticipanteNombre;
    private int $estadoUsuarioId;
    private ?string $estadoUsuarioNombre;
    private ?string $legajo;
    
    private ?string $createdAt;
    private ?string $updatedAt;
    private ?string $deletedAt;

    public function __construct(
        ?int $id,
        string $nombre,
        string $apellido,
        Username $username,
        Email $email,
        int $rolId,
        ?string $rolNombre = null,
        ?int $tipoParticipanteId = null,
        ?string $tipoParticipanteNombre = null,
        int $estadoUsuarioId = 1,
        ?string $estadoUsuarioNombre = null,
        ?string $legajo = null,
        ?string $createdAt = null,
        ?string $updatedAt = null,
        ?string $deletedAt = null
    ) {
        $this->id = $id;
        $this->nombre = trim($nombre);
        $this->apellido = trim($apellido);
        $this->username = $username;
        $this->email = $email;
        $this->rolId = $rolId;
        $this->rolNombre = $rolNombre;
        
        $this->tipoParticipanteId = $tipoParticipanteId;
        $this->tipoParticipanteNombre = $tipoParticipanteNombre;
        $this->estadoUsuarioId = $estadoUsuarioId;
        $this->estadoUsuarioNombre = $estadoUsuarioNombre;
        $this->legajo = $legajo ? trim($legajo) : null;
        
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    public function getId(): ?int { return $this->id; }
    public function getNombre(): string { return $this->nombre; }
    public function getApellido(): string { return $this->apellido; }
    public function getNombreCompleto(): string { return $this->nombre . ' ' . $this->apellido; }
    public function getUsername(): Username { return $this->username; }
    public function getEmail(): Email { return $this->email; }
    
    public function getRolId(): int { return $this->rolId; }
    public function getRolNombre(): ?string { return $this->rolNombre; }

    public function getTipoParticipanteId(): ?int { return $this->tipoParticipanteId; }
    public function getTipoParticipanteNombre(): ?string { return $this->tipoParticipanteNombre; }
    public function getEstadoUsuarioId(): int { return $this->estadoUsuarioId; }
    public function getEstadoUsuarioNombre(): ?string { return $this->estadoUsuarioNombre; }
    public function getLegajo(): ?string { return $this->legajo; }

    public function getCreatedAt(): ?string { return $this->createdAt; }
    public function getUpdatedAt(): ?string { return $this->updatedAt; }
    public function getDeletedAt(): ?string { return $this->deletedAt; }
    public function isDeleted(): bool { return $this->deletedAt !== null; }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id !== null ? (int)$this->id : null,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'nombre_completo' => $this->getNombreCompleto(),
            'username' => $this->username->getValue(),
            'email' => $this->email->getValue(),
            'rol_id' => (int)$this->rolId,
            'rol_nombre' => $this->rolNombre,
            'tipo_participante_id' => $this->tipoParticipanteId,
            'tipo_participante_nombre' => $this->tipoParticipanteNombre,
            'estado_usuario_id' => $this->estadoUsuarioId,
            'estado_usuario_nombre' => $this->estadoUsuarioNombre,
            'legajo' => $this->legajo,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'deleted_at' => $this->deletedAt,
        ];
    }
}
