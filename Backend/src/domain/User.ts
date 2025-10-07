/**
 * Entidad de dominio User (desacoplada de Prisma)
 * Representa un usuario del sistema (tabla: cuentas)
 */
export interface User {
  id: number;
  nombre: string;
  apellido: string | null;
  correo: string;
  usuario: string;
  contrasena: string;
  rol_id: number;
  estado_id: number;
  fecha_registro: Date;
  campus: string | null;
  reputacion: number;
}

/**
 * DTO para crear usuario
 */
export interface CreateUserInput {
  nombre: string;
  apellido?: string;
  correo: string;
  usuario: string;
  contrasena: string;
  rol_id: number;
  estado_id: number;
  campus?: string;
}

/**
 * DTO para actualizar usuario
 */
export interface UpdateUserInput {
  nombre?: string;
  apellido?: string;
  correo?: string;
  usuario?: string;
  contrasena?: string;
  rol_id?: number;
  estado_id?: number;
  campus?: string;
  reputacion?: number;
}

/**
 * Criterios de búsqueda para usuarios
 */
export interface UserWhereInput {
  id?: number;
  correo?: string;
  usuario?: string;
  rol_id?: number;
  estado_id?: number;
  campus?: string;
}
