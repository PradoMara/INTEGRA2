import { api } from '@/lib/api'; // Importamos nuestro helper de API de la Tarea 1
import type { User } from '@/types/User'; // Importamos el tipo de Usuario global
import type { Credentials } from '../use-cases/LoginUser';

// Definimos la respuesta que esperamos del endpoint real (según routes/auth.js)
export interface AuthResponse {
  token: string;
  user: User;
}

// Esta es la función que llamará nuestro formulario
export async function login(credentials: Credentials): Promise<AuthResponse> {
  // Ya no simulamos, llamamos a la API real.
  // api.post se encarga de la URL base, JSON, etc.
  // El endpoint (según routes/auth.js) es /api/auth/login
  try {
    const response = await api.post<AuthResponse, Credentials>(
      '/auth/login', // Ruta relativa (api.ts añade /api)
      credentials
    );
    return response;
  } catch (error: any) {
    // Si la API devuelve un error (ej. 401), lo relanzamos
    // para que la página de login pueda mostrarlo.
    throw new Error(error.message || 'Error al iniciar sesión');
  }
}