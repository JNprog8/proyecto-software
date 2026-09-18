<?php

class Role implements JsonSerializable {
    private ?int $id;
    private string $nombre;
    private ?string $descripcion;
    private ?string $createdAt;

    public function __construct(
        ?int $id,
        string $nombre,
        ?string $descripcion = null,
        ?string $createdAt = null
    ) {
        $this->id = $id;
        $this->nombre = $nombre;
        $this->descripcion = $descripcion;
        $this->createdAt = $createdAt;
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getNombre(): string {
        return $this->nombre;
    }

    public function getDescripcion(): ?string {
        return $this->descripcion;
    }

    public function getCreatedAt(): ?string {
        return $this->createdAt;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'created_at' => $this->createdAt,
        ];
    }
}
