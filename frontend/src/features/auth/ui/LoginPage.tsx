import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; // ¡El store de la Tarea 1!
import { login } from '../api/authApi'; // ¡La función de API real!
import LoginForm from './LoginForm'; // ¡El formulario que me pasaste!
import LoginInstitutional from './LoginInstitutional';
import Logo from '@/assets/img/logouct.png'; // Asumiendo que tienes tu logo aquí

export default function LoginPage() {
  const navigate = useNavigate();
  // Traemos la función de login de nuestro store de Zustand
  const authLogin = useAuthStore((state) => state.login);

  // Estados para manejar el formulario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esta función se la pasaremos al LoginForm
  async function handleEmailPasswordLogin(email: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      // 1. Llama a la API real
      const { token, user } = await login({ email, password });

      // 2. Si tiene éxito, guarda en el store de Zustand
      authLogin(token, user);

      // 3. Redirige al home
      navigate('/home', { replace: true });

    } catch (err: any) {
      // 4. Si falla, muestra el error de la API
      setError(err.message);
      setLoading(false);
    }
  }

  // Esta es la función para el botón de Google
  async function handleOAuth() {
    // Por ahora, solo redirige (lógica de Google es Tarea aparte)
    navigate('/home', { replace: true });
  }

  return (
    // He copiado un layout de tu archivo Login.module.css que vi en la estructura
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <img
          src={Logo}
          alt="MarketUCT Logo"
          className="mx-auto mb-6 h-20 w-auto"
        />
        
        {/* Mostramos el LoginForm */}
        <LoginForm onSubmit={handleEmailPasswordLogin} loading={loading} />

        {/* Mostramos el error si existe */}
        {error && (
          <div className="my-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Separador */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink text-sm text-gray-500">O</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Mostramos el Login Institucional */}
        <LoginInstitutional onOAuth={handleOAuth} />
      </div>
    </div>
  );
}