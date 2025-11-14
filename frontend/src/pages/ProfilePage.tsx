import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  // Obtenemos los datos del usuario y la función de logout del store
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
    <div style={{ padding: '20px' }}>
      <h1>Perfil de Usuario</h1>
      <p>Si puedes ver esto, estás logueado. ¡Esta es una ruta protegida!</p>
      
      {/* Mostramos los datos del usuario para confirmar quién ha iniciado sesión */}
      {user && (
        <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      )}

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default ProfilePage;