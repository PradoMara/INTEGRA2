import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminRoute = () => {
  // ✅ FORMA CORRECTA - Acceder a cada valor por separado
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn());
  const user = useAuthStore((state: any) => state.user);

  console.log('🔐 AdminRoute - Estado actual:');
  console.log('   isLoggedIn:', isLoggedIn);
  console.log('   user:', user);
  console.log('   user.rol:', user?.rol);

  // Primera validación: ¿Está logueado?
  if (!isLoggedIn) {
    console.log('❌ Redirigiendo a login: usuario no logueado');
    return <Navigate to="/login" replace />;
  }

  // Segunda validación: ¿Tiene el rol de 'admin'?
  if (user?.rol !== 'admin') {
    console.log('❌ Redirigiendo a home: usuario no es admin, rol actual:', user?.rol);
    return <Navigate to="/" replace />;
  }

  // Si pasa ambas validaciones, puede acceder a la ruta de admin.
  console.log('✅ Acceso permitido: usuario es admin');
  return <Outlet />;
};

export default AdminRoute;