<?php
declare(strict_types=1);

/**
 * value object para el correo electronico.
 * encapsula la invariante de formato valido y elimina la obsesion por primitivos.
 */
readonly class Email {
    private string $value;

    public function __construct(string $value) {
        $clean = trim($value);
        if (!filter_var($clean, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("El formato del correo electrónico '{$clean}' es inválido.");
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
