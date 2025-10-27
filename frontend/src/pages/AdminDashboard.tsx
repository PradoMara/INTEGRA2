import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  // Obtenemos los datos del usuario y la función de logout
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir al login después de cerrar sesión
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