import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; // Usando alias

// --- MEJORA (Anti-Loop Infinito) ---
// Pedimos SOLO el authStatus (un string simple).
// Esto es seguro y no causa un loop.
const useAuthStatus = () => useAuthStore((state) => state.authStatus);
// ----------------------------------

const ProtectedRoute = () => {
  const authStatus = useAuthStatus();

  // 1. Mostrar 'Cargando...' mientras se revisa el token en localStorage
  if (authStatus === 'loading') {
    return <div>Cargando...</div>;
  }

  // 2. Si la revisión terminó y no está autenticado, redirigir a /login
  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está autenticado, permitir el acceso a las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;