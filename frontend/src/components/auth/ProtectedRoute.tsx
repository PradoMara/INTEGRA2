import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = () => {
  // Obtenemos la función para saber si el usuario está logueado desde nuestro store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  // Si el usuario no está logueado, lo redirigimos a la página de login.
  // 'replace' evita que el usuario pueda volver a la página anterior con el botón de retroceso.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario sí está logueado, renderizamos el componente hijo (la página protegida).
  // <Outlet /> es el marcador de posición para esos componentes hijos.
  return <Outlet />;
};

export default ProtectedRoute;