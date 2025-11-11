/**
 * Índice principal de repositorios
 * Facilita las importaciones en toda la aplicación
 */

// Interfaces
export type {
  IRepository,
  FindManyOptions,
  PaginatedResult,
  OrderBy,
} from './interfaces/IRepository';

// Base
export { BaseRepository } from './base/BaseRepository';
export type { BaseRepositoryConfig } from './base/BaseRepository';

// Repositorios concretos
export { UserRepository } from './UserRepository';

// Cliente Prisma
export { prisma, disconnectPrisma } from './prismaClient';

// Entidades de dominio
export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserWhereInput,
} from '../domain/User';
