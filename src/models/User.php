<?php

class User implements JsonSerializable {
    private ?int $id;
    private string $nombre;
    private string $apellido;
    private string $username;
    private string $email;
    private int $rolId;
    private ?string $rolNombre;
    private ?string $createdAt;
    private ?string $updatedAt;

    public function __construct(
        ?int $id,
        string $nombre,
        string $apellido,
        string $username,
        string $email,
        int $rolId,
        ?string $rolNombre = null,
        ?string $createdAt = null,
        ?string $updatedAt = null
    ) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->username = $username;
        $this->email = $email;
        $this->rolId = $rolId;
        $this->rolNombre = $rolNombre;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getNombre(): string {
        return $this->nombre;
    }

    public function getApellido(): string {
        return $this->apellido;
    }

    public function getNombreCompleto(): string {
        return $this->nombre . ' ' . $this->apellido;
    }

    public function getUsername(): string {
        return $this->username;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function getRolId(): int {
        return $this->rolId;
    }

    public function getRolNombre(): ?string {
        return $this->rolNombre;
    }

    public function getCreatedAt(): ?string {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?string {
        return $this->updatedAt;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'nombre_completo' => $this->getNombreCompleto(),
            'username' => $this->username,
            'email' => $this->email,
            'rol_id' => $this->rolId,
            'rol_nombre' => $this->rolNombre,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
