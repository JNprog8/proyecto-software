<?php

require_once __DIR__ . '/../repositories/RoleRepository.php';
require_once __DIR__ . '/BaseController.php';

class RoleController extends BaseController {
    private RoleRepository $roleRepo;

    public function __construct() {
        $this->roleRepo = new RoleRepository();
    }

    public function index(): void {
        try {
            $roles = $this->roleRepo->findAll();
            $this->sendJson(200, [
                'success' => true,
                'data' => $roles
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, [
                'success' => false,
                'error' => 'Error al obtener roles: ' . $e->getMessage()
            ]);
        }
    }

    public function store(): void {
        $data = $this->getJsonInput();
        if (!isset($data['nombre']) || trim($data['nombre']) === '') {
            $this->sendJson(400, ['success' => false, 'error' => 'El nombre del rol es obligatorio.']);
            return;
        }

        try {
            // Verificar duplicados (simple check)
            $roles = $this->roleRepo->findAll();
            foreach ($roles as $r) {
                if (strtolower($r->nombre) === strtolower(trim($data['nombre']))) {
                    $this->sendJson(400, ['success' => false, 'error' => 'Ya existe un rol con ese nombre.']);
                    return;
                }
            }

            $role = new Role(0, trim($data['nombre']), $data['descripcion'] ?? null, null);
            $id = $this->roleRepo->save($role);

            $this->sendJson(201, [
                'success' => true,
                'message' => 'Rol creado correctamente.',
                'data' => ['id' => $id]
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, ['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function update(int $id): void {
        $data = $this->getJsonInput();
        if (!isset($data['nombre']) || trim($data['nombre']) === '') {
            $this->sendJson(400, ['success' => false, 'error' => 'El nombre del rol es obligatorio.']);
            return;
        }

        try {
            $role = $this->roleRepo->findById($id);
            if (!$role) {
                $this->sendJson(404, ['success' => false, 'error' => 'Rol no encontrado.']);
                return;
            }

            // Verificar duplicados
            $roles = $this->roleRepo->findAll();
            foreach ($roles as $r) {
                if ($r->id !== $id && strtolower($r->nombre) === strtolower(trim($data['nombre']))) {
                    $this->sendJson(400, ['success' => false, 'error' => 'Ya existe un rol con ese nombre.']);
                    return;
                }
            }

            $role->nombre = trim($data['nombre']);
            $role->descripcion = $data['descripcion'] ?? null;
            
            $this->roleRepo->save($role);

            $this->sendJson(200, [
                'success' => true,
                'message' => 'Rol actualizado correctamente.'
            ]);
        } catch (Exception $e) {
            $this->sendJson(500, ['success' => false, 'error' => $e->getMessage()]);
        }
    }

    public function destroy(int $id): void {
        try {
            if (in_array($id, [1, 2, 3, 4])) {
                $this->sendJson(400, ['success' => false, 'error' => 'No se pueden eliminar los roles base del sistema.']);
                return;
            }

            $this->roleRepo->delete($id);
            $this->sendJson(200, [
                'success' => true,
                'message' => 'Rol eliminado correctamente.'
            ]);
        } catch (Exception $e) {
            $this->sendJson(400, ['success' => false, 'error' => $e->getMessage()]);
        }
    }
}
