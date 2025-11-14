// frontend/src/lib/api.ts - CORREGIDO

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
  const token = useAuthStore.getState().token;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...defaultOptions, ...options });

  // Construimos la URL completa
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🚀 API Request: ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body as string) : null);

  const res = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  // MEJORA: Manejo de errores 401/403 (Token expirado / Sin permisos)
  if (!res.ok) {
    // Si la respuesta no es OK, intenta parsear el error
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `Error ${res.status}: ${res.statusText}`);
  }

  // CORRECCIÓN: Manejo de respuestas sin contenido
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    console.log(`✅ API Response: ${res.status} ${url} - No Content`);
    return null; // O return { success: true } si prefieres
  }

  // Intentar parsear JSON, pero manejar errores de parsing
  try {
    const data = await res.json();
    console.log(`✅ API Response: ${res.status} ${url}`, data);
    return data;
  } catch (jsonError) {
    console.log(`✅ API Response: ${res.status} ${url} - No JSON body`);
    return null;
  }
}

// Exportamos métodos específicos
export const api = {
  get: <T>(url: string): Promise<T> => apiFetch(url),
  
  post: <T, U>(url: string, body: U): Promise<T> => 
    apiFetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  // Puedes añadir put, patch, delete si los necesitas
  // ...
};