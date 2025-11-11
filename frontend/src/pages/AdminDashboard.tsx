import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  // CORREGIDO: Agregar tipo explícito al selector
  const { user, logout } = useAuthStore((state: any) => ({
    user: state.user,
    logout: state.logout,
  }));
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', border: '2px solid red' }}>
      <h1>Panel de Administración</h1>
      <p>¡Bienvenido, {user?.nombre}! Esta es una ruta protegida solo para administradores.</p>
      
      <p>Si puedes ver esto, es porque tienes el rol 'admin'.</p>

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default AdminDashboard;