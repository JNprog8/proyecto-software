<?php
declare(strict_types=1);

/**
 * value object para el nickname / username.
 * protege las invariantes de longitud y caracteres permitidos en toda la aplicacion.
 */
readonly class Username {
    private string $value;

    public function __construct(string $value) {
        $clean = trim($value);
        if ($clean === '') {
            throw new InvalidArgumentException("El nickname no puede estar vacío.");
        }
        if (!preg_match('/^[a-zA-Z0-9._-]{3,30}$/', $clean)) {
            throw new InvalidArgumentException("El nickname '{$clean}' debe tener entre 3 y 30 caracteres alfanuméricos.");
        }
        $this->value = $clean;
    }

    public function getValue(): string {
        return $this->value;
    }

    public function __toString(): string {
        return $this->value;
    }
}
