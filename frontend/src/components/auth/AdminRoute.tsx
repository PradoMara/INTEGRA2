import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminRoute = () => {
  // Obtenemos tanto el estado de login como la información del usuario
  const { isLoggedIn, user } = useAuthStore((state) => ({
    isLoggedIn: state.isLoggedIn(),
    user: state.user,
  }));

  // Primera validación: ¿Está logueado?
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Segunda validación: ¿Tiene el rol de 'admin'?
  // Si no es admin, lo redirigimos a la página de inicio para evitar que vea contenido no autorizado.
  if (user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si pasa ambas validaciones, puede acceder a la ruta de admin.
  return <Outlet />;
};

export default AdminRoute;