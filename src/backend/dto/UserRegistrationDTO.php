<?php
declare(strict_types=1);

/**
 * data transfer object (DTO) para la creacion de usuarios.
 * aisla la capa de red del modelo de dominio asegurando tipado fuerte.
 */
readonly class UserRegistrationDTO {
    public function __construct(
        public string $nombre,
        public string $apellido,
        public string $username,
        public string $email,
        public int $rol_id,
        public ?int $tipo_participante_id = null,
        public ?string $legajo = null
    ) {}

    /**
     * factoria para construir el DTO a partir del payload JSON (array) crudo.
     * aqui se aplican aserciones basicas de tipo perimetrales para sanitizar.
     */
    public static function fromArray(array $data): self {
        // funcion auxiliar para sanitizar (prevencion de XSS - defensa en profundidad)
        $sanitize = fn($value) => htmlspecialchars(strip_tags(trim((string)($value ?? ''))), ENT_QUOTES, 'UTF-8');

        return new self(
            $sanitize($data['nombre'] ?? ''),
            $sanitize($data['apellido'] ?? ''),
            $sanitize($data['username'] ?? ''),
            $sanitize($data['email'] ?? ''),
            isset($data['rol_id']) ? (int)$data['rol_id'] : 0,
            isset($data['tipo_participante_id']) ? (int)$data['tipo_participante_id'] : null,
            isset($data['legajo']) && trim((string)$data['legajo']) !== '' ? $sanitize($data['legajo']) : null
        );
    }
    
    /**
     * convierte el DTO nuevamente a array para compatibilidad con validadores antiguos.
     */
    public function toArray(): array {
        return [
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'username' => $this->username,
            'email' => $this->email,
            'rol_id' => $this->rol_id,
            'tipo_participante_id' => $this->tipo_participante_id,
            'legajo' => $this->legajo
        ];
    }
}
