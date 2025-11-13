import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AdminUser } from '../types/adminUser';

// Definimos el "query key" para que sea reutilizable
export const adminUserKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (query: string) => [...adminUserKeys.lists(), { query }] as const,
};

// Definimos la función de fetching
const fetchUsers = async (query: string): Promise<AdminUser[]> => {
  const params = new URLSearchParams();
  if (query) {
    params.append('q', query);
  }
  const queryString = params.toString();

  // --- ¡CORRECCIÓN AQUÍ! ---
  // La ruta no debe incluir /api, porque api.ts ya lo tiene.
  const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
  // -------------------------
  
  // Usamos nuestro api.get() global que ya incluye el token
  // El backend (según admin.js) devuelve { users: [...] }
  const res = await api.get<{ users: AdminUser[] }>(url);
  return res.users; // Devolvemos solo el array de usuarios
};

// Creamos el hook
export function useAdminUsers(query: string) {
  return useQuery<AdminUser[], Error>({
    queryKey: adminUserKeys.list(query),
    queryFn: () => fetchUsers(query),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    // placeholderData: [], // Deshabilitado temporalmente para ver el estado 'loading'
  });
}