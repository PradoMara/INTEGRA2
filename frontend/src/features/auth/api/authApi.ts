// frontend/src/features/auth/api/authApi.ts

import { api } from '@/lib/api';
// 1. Este es el tipo de USUARIO de TU STORE (el que espera 'rol' con 'l')
import type { User as ClientUser } from '@/types/User'; 
import type { Credentials } from '../use-cases/LoginUser';

// -----------------------------------------------------------------
// 2. TAREA: DEFINIR LA RESPUESTA *REAL* DE LA API
// -----------------------------------------------------------------

// Basado en tu log: { ..., role: 'ADMINISTRADOR' }
// Este es el tipo de usuario que envía el BACKEND
interface ApiUser {
  id: number | string; // (Usamos 'number | string' para ser flexibles)
  nombre: string;
  apellido: string;
  email: string;
  role: 'ADMINISTRADOR' | 'VENDEDOR' | 'CLIENTE' | string; // <-- Propiedad del backend (con 'e')
  // ...cualquier otro campo que envíe el backend
}

// Esta es la forma completa de la respuesta de la API
interface ApiResponse {
  token: string;
  user: ApiUser;
}

// -----------------------------------------------------------------
// 3. TAREA: DEFINIR LA RESPUESTA QUE *EL CLIENTE* ESPERA
// -----------------------------------------------------------------

// Esta es la respuesta que tu app (LoginPage, authStore) espera recibir.
// Nota que usa 'ClientUser' (con 'rol' con 'l').
export interface AuthResponse {
  token: string;
  user: ClientUser;
}

// -----------------------------------------------------------------
// 4. TAREA: MODIFICAR LA FUNCIÓN 'login'
// -----------------------------------------------------------------

export async function login(credentials: Credentials): Promise<AuthResponse> {
  try {
    // A. Hacemos la llamada y le decimos que espere la forma 'ApiResponse'
    const response = await api.post<ApiResponse, Credentials>(
      '/auth/login', // Ruta relativa
      credentials
    );

    // B. Extraemos los datos que llegaron del backend
    const { token, user: userFromApi } = response;

    // C. "Traducimos" el usuario de la API al usuario del Cliente
    const userParaElCliente: ClientUser = {
      ...userFromApi,
      // 1. Mapeamos 'role' (API) a 'rol' (Cliente)
      // 2. Traducimos 'ADMINISTRADOR' (API) a 'ADMIN' (Cliente)
      rol: userFromApi.role === 'ADMINISTRADOR' ? 'ADMIN' :
           userFromApi.role === 'VENDEDOR' ? 'VENDEDOR' : 'USER',
    };

    // D. Devolvemos los datos limpios y "traducidos"
    return {
      token: token,
      user: userParaElCliente
    };

  } catch (error: any) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
}