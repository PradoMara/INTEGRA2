import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // Obtenemos la función de login de nuestro store
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Función para simular el login como usuario normal
  const handleLoginAsUser = () => {
    // En una aplicación real, estos datos vendrían de tu API después de un login exitoso
    const fakeToken = 'user-token-123';
    const fakeUser = { id: '1', nombre: 'Usuario de Prueba', rol: 'user' as const };
    
    login(fakeToken, fakeUser);
    navigate('/perfil'); // Redirigir al perfil después del login
  };

  // Función para simular el login como administrador
  const handleLoginAsAdmin = () => {
    // En una aplicación real, estos datos vendrían de tu API
    const fakeToken = 'admin-token-456';
    const fakeUser = { id: '99', nombre: 'Administrador', rol: 'admin' as const };

    login(fakeToken, fakeUser);
    navigate('/admin'); // Redirigir al panel de admin después del login
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Página de Login</h1>
      <p>Usa estos botones para simular un inicio de sesión.</p>
      <button onClick={handleLoginAsUser} style={{ marginRight: '10px' }}>
        Login como Usuario
      </button>
      <button onClick={handleLoginAsAdmin}>
        Login como Admin
      </button>
    </div>
  );
};

export default LoginPage;