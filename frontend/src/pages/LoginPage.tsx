import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types/User';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // CORREGIDO: Agregar tipo explícito al selector
  const login = useAuthStore((state: any) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulación de llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación básica de correo institucional UCT
      const isUCTEmail = email.endsWith('@alu.uct.cl') || email.endsWith('@uct.cl');
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        nombre: email.split('@')[0] || 'Usuario UCT',
        rol: email.includes('admin') ? 'admin' : 'user',
        campus: 'Campus Principal'
      };

      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
      
      if (isUCTEmail) {
        login(mockToken, mockUser);
      } else {
        alert('Por favor, usa tu correo institucional UCT (@alu.uct.cl o @uct.cl)');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ... (el resto del código igual) ... */}
    </div>
  );
};

export default LoginPage;