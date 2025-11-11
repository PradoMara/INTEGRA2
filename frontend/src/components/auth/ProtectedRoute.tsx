import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = () => {
  // ✅ Acceder directamente al valor, no por destructuring
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn());

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;