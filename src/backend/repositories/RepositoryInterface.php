<?php
declare(strict_types=1);

/**
 * interfaz generica para el patron repository.
 * define las operaciones CRUD y de consulta primitivas para cualquier entidad del dominio.
 */
interface RepositoryInterface {
    /**
     * busca una entidad por su identificador primario.
     */
    public function findById(int $id): ?object;

    /**
     * obtiene una coleccion paginada y filtrada de entidades.
     * @param array<string, mixed> $criteria criterios de filtrado (busqueda, rol, etc.)
     * @param int $limit cantidad de registros por pagina
     * @param int $offset desplazamiento inicial
     * @return array<object>
     */
    public function findAll(array $criteria = [], int $limit = 10, int $offset = 0): array;

    /**
     * cuenta el total de entidades activas que coinciden con los criterios.
     * @param array<string, mixed> $criteria
     */
    public function count(array $criteria = []): int;

    /**
     * persiste una entidad (crea si no tiene ID o actualiza si ya existe).
     * @return int|bool retorna el ID insertado o true en actualizacion.
     */
    public function save(object $entity): int|bool;

    /**
     * ejecuta una baja (fisica o logica segun la configuracion de la entidad).
     */
    public function delete(int $id): bool;
}
