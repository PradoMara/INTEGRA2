export type User = {
  id: number;
  email: string;
  nombre: string;
  rol: 'Administrador' | 'Vendedor' | 'Cliente'; // Cambiar a español
  rol_id: number;
  estado_id: number;
  campus?: string;
  avatar?: string;
  fecha_registro?: Date;
  reputacion?: number;
  apellido?: string;
  usuario?: string;
  estado?: string; // "ACTIVO", "BANEADO"
}

export type BackendUser = {
  id: number;
  correo: string;
  usuario: string;
  nombre: string;
  apellido: string;
  role: string;
  estado: string;
  campus: string;
  reputacion: number;
  fechaRegistro: string;
}