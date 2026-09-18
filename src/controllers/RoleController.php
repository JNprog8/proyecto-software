<?php

require_once __DIR__ . '/../repositories/RoleRepository.php';

class RoleController {
    private RoleRepository $roleRepo;

    public function __construct() {
        $this->roleRepo = new RoleRepository();
    }

    public function index(): void {
        header('Content-Type: application/json; charset=utf-8');
        try {
            $roles = $this->roleRepo->findAll();
            echo json_encode([
                'success' => true,
                'data' => $roles
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Error al obtener roles: ' . $e->getMessage()
            ]);
        }
    }
}
