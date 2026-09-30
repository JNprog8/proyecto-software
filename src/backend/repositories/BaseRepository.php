<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/RepositoryInterface.php';

/**
 * clase base abstracta para repositorios de persistencia con PDO.
 * centraliza la inyeccion de conexion, soporte para transacciones y utilidades de base de datos.
 */
abstract class BaseRepository implements RepositoryInterface {
    protected PDO $db;
    protected string $table = '';

    public function __construct(?PDO $db = null) {
        $this->db = $db ?? Database::getConnection();
    }

    public function getDb(): PDO {
        return $this->db;
    }

    /**
     * inicia una transaccion PDO segura.
     */
    public function beginTransaction(): bool {
        if (!$this->db->inTransaction()) {
            return $this->db->beginTransaction();
        }
        return true;
    }

    /**
     * confirma la transaccion activa.
     */
    public function commit(): bool {
        if ($this->db->inTransaction()) {
            return $this->db->commit();
        }
        return true;
    }

    /**
     * revierte la transaccion activa en caso de excepcion.
     */
    public function rollBack(): bool {
        if ($this->db->inTransaction()) {
            return $this->db->rollBack();
        }
        return true;
    }
}
