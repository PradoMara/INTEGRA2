// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// --- 1. Definición de Tipos ---
// (Basado en la respuesta de tu API en /api/auth/login)
interface AuthUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
  campus: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// --- 2. Creación del Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Hook para Consumir el Contexto ---
/**
 * Hook para acceder al contexto de autenticación.
 * Lanza un error si se usa fuera de un AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// --- 4. Componente Proveedor (El Cerebro) ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ¡Clave!

  /**
   * Función para validar el token guardado al cargar la app.
   * Llama a /api/auth/me
   */
  const validateToken = useCallback(async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setIsLoading(false); // No hay token, terminamos de cargar
      return;
    }

    try {
      // (Asumiendo que el proxy de Vite está configurado para /api)
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`, // El backend espera un Bearer token
        },
      });

      if (res.ok) {
        const data = await res.json();
        // El token es válido. Establecemos la sesión.
        setUser(data.user);
        setToken(storedToken);
      } else {
        // El token es inválido o expiró. Limpiamos.
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error al validar el token:', error);
      localStorage.removeItem('token');
    } finally {
      // Terminamos de cargar, sin importar el resultado
      setIsLoading(false);
    }
  }, []);

  // Efecto que se ejecuta UNA SOLA VEZ al montar el componente
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  /**
   * Función para iniciar sesión.
   * Se llama desde el componente LoginTest.
   */
  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken); // Persiste el token
  };

  /**
   * Función para cerrar sesión.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Limpia la persistencia
  };

  // Prepara el valor que proveerá el contexto
  const value = {
    user,
    token,
    login,
    logout,
  };

  // Muestra un "cargando" global mientras se valida el token.
  // Esto evita que la app "parpadee" o muestre contenido protegido
  // antes de tiempo.
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está cargando, provee el contexto a los hijos (tu app)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 5. Componente de Ruta Protegida ---
/**
 * Este componente revisa si el usuario está logueado.
 * Si lo está, renderiza el componente hijo (ej. <ForumPanel />).
 * Si NO lo está, lo redirige a la página de login.
 */
export const ProtectedRoute = () => {
  const { user } = useAuth(); // Lee el estado del contexto
  const location = useLocation();

  if (!user) {
    // Si no hay usuario, redirige a /login
    // 'replace' evita que el usuario pueda "volver" a la página protegida
    // 'state' guarda la página que intentaba visitar, para volver a ella después
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Si hay usuario, renderiza el contenido (usando <Outlet /> de react-router)
  return <Outlet />;
};

// --- (Opcional) Un componente de Carga simple ---
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        {/* Puedes poner tu logo aquí */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Cargando sesión...</p>
      </div>
    </div>
  );
};