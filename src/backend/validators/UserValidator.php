<?php
declare(strict_types=1);

/**
 * validador de dominio para la entidad usuario.
 * desacopla las reglas de negocio, formato e invariantes del controlador y del repositorio.
 */
class UserValidator {
    /**
     * valida los datos recibidos para alta o actualizacion de un usuario.
     * @param array<string, mixed> $data datos de entrada
     * @param int|null $ignoreid ID del usuario a ignorar en comprobaciones de unicidad (en caso de actualizacion)
     * @param userrepository|null $userrepo repositorio para validar unicidad si corresponde
     * @return array{valid: bool, errors: string[]}
     */
    public function validate(array $data, ?int $ignoreId = null, ?UserRepository $userRepo = null): array {
        $errors = [];

        // 1. nombre
        if (!isset($data['nombre']) || trim((string)$data['nombre']) === '') {
            $errors['nombre'] = 'El campo nombre es obligatorio.';
        } elseif (mb_strlen(trim((string)$data['nombre'])) < 2 || mb_strlen(trim((string)$data['nombre'])) > 100) {
            $errors['nombre'] = 'El nombre debe tener entre 2 y 100 caracteres.';
        }

        // 2. apellido
        if (!isset($data['apellido']) || trim((string)$data['apellido']) === '') {
            $errors['apellido'] = 'El campo apellido es obligatorio.';
        } elseif (mb_strlen(trim((string)$data['apellido'])) < 2 || mb_strlen(trim((string)$data['apellido'])) > 100) {
            $errors['apellido'] = 'El apellido debe tener entre 2 y 100 caracteres.';
        }

        // 3. username / nickname
        if (!isset($data['username']) || trim((string)$data['username']) === '') {
            $errors['username'] = 'El nickname de usuario es obligatorio.';
        } else {
            $username = trim((string)$data['username']);
            if (!preg_match('/^[a-zA-Z0-9._-]{3,30}$/', $username)) {
                $errors['username'] = 'El nickname debe tener entre 3 y 30 caracteres alfanuméricos (letras, números, ., -, _).';
            } elseif ($userRepo !== null && $userRepo->usernameExists($username, $ignoreId)) {
                $errors['username'] = "El nombre de usuario '{$username}' ya está en uso por otra cuenta.";
            }
        }

        // 4. correo electronico
        if (!isset($data['email']) || trim((string)$data['email']) === '') {
            $errors['email'] = 'El correo electrónico es obligatorio.';
        } else {
            $email = trim((string)$data['email']);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'El correo electrónico no posee un formato válido.';
            } elseif ($userRepo !== null && $userRepo->emailExists($email, $ignoreId)) {
                $errors['email'] = "El correo electrónico '{$email}' ya existe. El usuario ya se encuentra registrado.";
            }
        }

        // 5. rol asignado
        if (!isset($data['rol_id']) || !is_numeric($data['rol_id']) || (int)$data['rol_id'] <= 0) {
            $errors['rol_id'] = 'Debe seleccionar un rol válido para el participante.';
        }

        // 6. validacion cruzada de legajo para estudiantes
        if (isset($data['tipo_participante_id']) && (int)$data['tipo_participante_id'] === 1) {
            if (!isset($data['legajo']) || trim((string)$data['legajo']) === '') {
                $errors['legajo'] = 'El número de legajo es obligatorio para los estudiantes universitarios.';
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
