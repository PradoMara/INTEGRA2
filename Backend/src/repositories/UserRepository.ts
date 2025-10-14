import { BaseRepository } from '../base/BaseRepository';
import type { IRepository } from '../interfaces/IRepository';
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserWhereInput,
} from '../../domain/User';
import { prisma } from '../prismaClient';

/**
 * Repositorio para entidad User (tabla: cuentas).
 * Implementa IRepository usando BaseRepository como base.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const userRepo = new UserRepository();
 * 
 * // Crear usuario
 * const user = await userRepo.create({
 *   nombre: 'Juan',
 *   apellido: 'Pérez',
 *   correo: 'juan@uct.cl',
 *   usuario: 'jperez',
 *   contrasena: 'hash123',
 *   rol_id: 1,
 *   estado_id: 1,
 * });
 * 
 * // Buscar por ID
 * const found = await userRepo.findById(user.id);
 * 
 * // Buscar por email
 * const byEmail = await userRepo.findOne({ correo: 'juan@uct.cl' });
 * 
 * // Actualizar
 * await userRepo.update(user.id, { nombre: 'Juan Carlos' });
 * 
 * // Eliminar
 * await userRepo.delete(user.id);
 * ```
 */
export class UserRepository
  extends BaseRepository<User, CreateUserInput, UpdateUserInput, UserWhereInput>
  implements IRepository<User, CreateUserInput, UpdateUserInput, UserWhereInput>
{
  constructor() {
    super({
      modelDelegate: prisma.cuentas,
      entityName: 'User',
      defaultOrderBy: { field: 'fecha_registro', direction: 'desc' },
      // Opcional: mapper para transformar entre Prisma y dominio
      mapper: {
        toDomain: (prismaUser: any) => ({
          id: prismaUser.id,
          nombre: prismaUser.nombre,
          apellido: prismaUser.apellido,
          correo: prismaUser.correo,
          usuario: prismaUser.usuario,
          contrasena: prismaUser.contrasena,
          rol_id: prismaUser.rol_id,
          estado_id: prismaUser.estado_id,
          fecha_registro: prismaUser.fecha_registro,
          campus: prismaUser.campus,
          reputacion: Number(prismaUser.reputacion),
        }),
        toOrm: (domainUser: Partial<User>) => ({
          ...domainUser,
          reputacion: domainUser.reputacion !== undefined ? domainUser.reputacion : undefined,
        }),
      },
    });
  }

  /**
   * Método adicional específico de User: buscar por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ correo: email });
  }

  /**
   * Método adicional: buscar por username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({ usuario: username });
  }

  /**
   * Buscar usuarios por campus con paginación
   */
  async findByCampus(campus: string, limit = 10, offset = 0) {
    return this.findMany({
      where: { campus },
      limit,
      offset,
    });
  }
}
