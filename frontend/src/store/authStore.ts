import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define la forma de los datos del usuario
// Puedes expandir esto más adelante con más datos si es necesario
interface User {
  id: string;
  nombre: string;
  rol: 'user' | 'admin'; // Ajusta los roles según tu aplicación
}

// Define el estado y las acciones del store
interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  // El middleware 'persist' guardará el estado en localStorage
  persist(
    (set, get) => ({
      token: null,
      user: null,

      // Función para comprobar fácilmente si el usuario está logueado
      isLoggedIn: () => !!get().token,

      // Acción para guardar el token y los datos del usuario al iniciar sesión
      login: (token, user) => {
        set({ token, user });
      },

      // Acción para limpiar el estado al cerrar sesión
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
    }
  )
);