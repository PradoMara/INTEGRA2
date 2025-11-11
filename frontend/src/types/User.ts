export type User = {
  id: string;
  email: string;
  nombre: string;
  rol: 'user' | 'admin';
  campus?: string;
  avatar?: string;
}