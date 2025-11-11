/**
 * Interfaz genérica de repositorio (Repository Pattern).
 * Desacoplada del ORM (Prisma) para facilitar testing y cambios futuros.
 * 
 * @template TEntity - Tipo de la entidad del dominio
 * @template TCreateInput - DTO para creación
 * @template TUpdateInput - DTO para actualización
 * @template TWhereInput - Criterios de búsqueda
 */
export interface IRepository<TEntity, TCreateInput, TUpdateInput, TWhereInput = Partial<TEntity>> {
  /**
   * Crear una nueva entidad
   */
  create(data: TCreateInput): Promise<TEntity>;

  /**
   * Buscar por ID
   * @returns entidad o null si no existe
   */
  findById(id: number): Promise<TEntity | null>;

  /**
   * Buscar una entidad que cumpla condiciones
   */
  findOne(where: TWhereInput): Promise<TEntity | null>;

  /**
   * Buscar múltiples entidades con opciones de paginación y orden
   */
  findMany(options?: FindManyOptions<TWhereInput>): Promise<PaginatedResult<TEntity>>;

  /**
   * Actualizar por ID
   */
  update(id: number, data: TUpdateInput): Promise<TEntity>;

  /**
   * Eliminar por ID (hard delete)
   */
  delete(id: number): Promise<void>;

  /**
   * Verificar si existe una entidad con el ID dado
   */
  exists(id: number): Promise<boolean>;

  /**
   * Contar entidades que cumplen condiciones
   */
  count(where?: TWhereInput): Promise<number>;
}

/**
 * Opciones para consultas findMany
 */
export interface FindManyOptions<TWhereInput> {
  where?: TWhereInput;
  limit?: number;
  offset?: number;
  orderBy?: OrderBy;
  cursor?: number;  // Para paginación cursor-based
  take?: number;    // Cantidad de registros (alternativa a limit)
}

/**
 * Orden de resultados
 */
export interface OrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: number;
}
