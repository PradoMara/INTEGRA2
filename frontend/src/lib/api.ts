// Importamos el store para poder leer el token
import { useAuthStore } from '../store/authStore';

// Obtenemos la URL base de las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Un helper de fetch actualizado que inyecta el token
 * y maneja errores de autenticación (401).
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // MEJORA: Obtenemos el token MÁS ACTUALIZADO desde el store
  // Usamos getState() porque esto no es un Hook, es una función normal.
  const token = useAuthStore.getState().token;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // MEJORA: Inyectamos el token si existe
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Construimos la URL completa
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  // MEJORA: Manejo de errores 401/403 (Token expirado / Sin permisos)
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      // Evitamos un bucle de redirección si ya estamos en /login
      if (window.location.pathname !== '/login') {
        console.warn(`Error ${res.status}: Token inválido o expirado. Cerrando sesión.`);
        // Forzamos el logout globalmente
        useAuthStore.getState().logout();
      }
    }

    // Lanzamos el error para que React Query o el 'catch' lo maneje
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Ocurrió un error en la solicitud');
  }

  // Si no hay contenido (ej. en un 204 No Content), devuelve un objeto vacío
  if (res.status === 204) {
    return {};
  }

  return res.json();
}

// Exportamos métodos específicos
export const api = {
  get: <T>(endpoint: string): Promise<T> => apiFetch(endpoint),

  post: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string): Promise<T> =>
    apiFetch(endpoint, {
      method: 'DELETE',
    }),
};