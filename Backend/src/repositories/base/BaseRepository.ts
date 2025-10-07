import type {
  IRepository,
  FindManyOptions,
  PaginatedResult,
  OrderBy,
} from '../interfaces/IRepository';
// RepositoryError se implementará en archivo separado (errors.ts)
import { RepositoryError, RepositoryErrorCode } from '../errors'; // path adjusted if needed

/**
 * Configuración del BaseRepository
 */
export interface BaseRepositoryConfig<TEntity, TDelegate, TIdField extends keyof any = 'id'> {
  modelDelegate: TDelegate; // Delegate (e.g., prisma.cuentas o stub)
  entityName: string;       // Nombre para mensajes de error
  defaultOrderBy?: OrderBy;
  idField?: string;         // Nombre del campo ID (por defecto 'id')
  cursorField?: string;     // Campo usado para cursor pagination (default idField)
  mapper?: {
    toDomain?: (ormEntity: any) => TEntity;
    toOrm?: (domainEntity: Partial<TEntity>) => any;
  };
  logger?: (meta: { action: string; entity: string; durationMs: number; ok: boolean; error?: unknown }) => void;
}

/**
 * Implementación base del patrón Repository desacoplado de Prisma.
 * Usa un "model delegate" de Prisma internamente pero expone interfaz limpia.
 * 
 * Criterios de implementación:
 * - CRUD genérico (create, find, update, delete)
 * - Paginación offset y cursor
 * - Desacoplamiento del ORM mediante mappers opcionales
 * - Manejo de errores centralizado
 * 
 * @template TEntity - Entidad del dominio
 * @template TCreateInput - Input para crear
 * @template TUpdateInput - Input para actualizar
 * @template TWhereInput - Criterios de búsqueda
 */
export class BaseRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TWhereInput = Partial<TEntity>,
  TDelegate = any,
  TId extends number = number
> implements IRepository<TEntity, TCreateInput, TUpdateInput, TWhereInput> {
  protected readonly model: TDelegate;
  protected readonly entityName: string;
  protected readonly defaultOrderBy: OrderBy;
  protected readonly mapper?: {
    toDomain?: (ormEntity: any) => TEntity;
    toOrm?: (domainEntity: Partial<TEntity>) => any;
  };
  protected readonly idField: string;
  protected readonly cursorField: string;
  protected readonly logger?: BaseRepositoryConfig<TEntity, TDelegate>['logger'];

  constructor(config: BaseRepositoryConfig<TEntity, TDelegate>) {
    this.model = config.modelDelegate;
    this.entityName = config.entityName;
    this.defaultOrderBy = config.defaultOrderBy || { field: 'id', direction: 'asc' };
    this.mapper = config.mapper;
    this.idField = config.idField || 'id';
    this.cursorField = config.cursorField || this.idField;
    this.logger = config.logger;
  }

  /**
   * Mapea entidad de Prisma a dominio (si hay mapper)
   */
  protected mapToDomain(ormEntity: any): TEntity {
    return this.mapper?.toDomain ? this.mapper.toDomain(ormEntity) : ormEntity;
  }

  /**
   * Mapea entidad de dominio a Prisma (si hay mapper)
   */
  protected mapToOrm(domainEntity: Partial<TEntity>): any {
    return this.mapper?.toOrm ? this.mapper.toOrm(domainEntity) : domainEntity;
  }
  private wrapError(action: string, error: any): never {
    // Se pueden mapear códigos específicos de Prisma aquí
    // Ejemplo placeholder: unique violation (P2002)
    if (error?.code === 'P2002') {
      throw new RepositoryError(RepositoryErrorCode.CONFLICT, `${this.entityName} unique constraint violation`, { action, meta: error.meta });
    }
    if (error?.code === 'P2025') {
      throw new RepositoryError(RepositoryErrorCode.NOT_FOUND, `${this.entityName} not found`, { action });
    }
    throw new RepositoryError(RepositoryErrorCode.UNKNOWN, `Error ${action} ${this.entityName}`, { cause: error });
  }

  private async timed<T>(action: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      this.logger?.({ action, entity: this.entityName, durationMs: Date.now() - start, ok: true });
      return result;
    } catch (error) {
      this.logger?.({ action, entity: this.entityName, durationMs: Date.now() - start, ok: false, error });
      this.wrapError(action, error);
    }
  }

  async create(data: TCreateInput): Promise<TEntity> {
    return this.timed('create', async () => {
      const ormData = this.mapToOrm(data as any);
      const created: any = await (this as any).model.create({ data: ormData });
      return this.mapToDomain(created);
    });
  }

  async findById(id: TId): Promise<TEntity | null> {
    return this.timed('findById', async () => {
      const where: any = { [this.idField]: id };
      const found: any = await (this as any).model.findUnique({ where });
      return found ? this.mapToDomain(found) : null;
    });
  }

  async findOne(where: TWhereInput): Promise<TEntity | null> {
    return this.timed('findOne', async () => {
      const found: any = await (this as any).model.findFirst({ where });
      return found ? this.mapToDomain(found) : null;
    });
  }

  async findMany(options: FindManyOptions<TWhereInput> = {}): Promise<PaginatedResult<TEntity>> {
    return this.timed('findMany', async () => {
      const { where, limit, offset, orderBy, cursor, take } = options;

      if (cursor !== undefined && offset !== undefined) {
        throw new RepositoryError(RepositoryErrorCode.INVALID_PAGINATION, 'No se puede combinar cursor y offset');
      }

      const query: any = { where: where || {} };
      const order = orderBy || this.defaultOrderBy;
      query.orderBy = { [order.field]: order.direction };

      const effectiveTake = take || limit;
      if (cursor !== undefined) {
        query.cursor = { [this.cursorField]: cursor };
        query.skip = 1;
        query.take = effectiveTake || 10;
      } else {
        if (offset !== undefined) query.skip = offset;
        if (effectiveTake !== undefined) query.take = effectiveTake;
      }

      const [data, total] = await Promise.all([
        (this as any).model.findMany(query),
        (this as any).model.count({ where: where || {} }),
      ]);

      const mappedData = data.map((item: any) => this.mapToDomain(item));
      const hasMore = cursor !== undefined
        ? mappedData.length === (effectiveTake || 10)
        : (offset || 0) + mappedData.length < total;

      const last = mappedData[mappedData.length - 1] as any;
      const nextCursor = cursor !== undefined && last ? last[this.cursorField] : undefined;

      return { data: mappedData, total, hasMore, nextCursor };
    });
  }

  async update(id: TId, data: TUpdateInput): Promise<TEntity> {
    return this.timed('update', async () => {
      const ormData = this.mapToOrm(data as any);
      const updated: any = await (this as any).model.update({
        where: { [this.idField]: id },
        data: ormData,
      });
      return this.mapToDomain(updated);
    });
  }

  async delete(id: TId): Promise<void> {
    return this.timed('delete', async () => {
      await (this as any).model.delete({ where: { [this.idField]: id } });
    });
  }

  async exists(id: TId): Promise<boolean> {
    return this.timed('exists', async () => {
      const where: any = { [this.idField]: id };
      const found = await (this as any).model.findUnique({ where, select: { [this.idField]: true } });
      return !!found;
    });
  }

  async count(where?: TWhereInput): Promise<number> {
    return this.timed('count', async () => {
      return await (this as any).model.count({ where: where || {} });
    });
  }
}
