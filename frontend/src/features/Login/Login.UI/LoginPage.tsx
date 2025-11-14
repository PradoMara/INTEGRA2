// frontend/src/features/Login/Login.UI/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { login as apiLogin } from '@/features/auth/api/authApi';
import LoginForm from '@/features/auth/ui/LoginForm';
import LoginInstitutional from './Login.Components/LoginInstitutional';
import styles from './Login.Components/Login.module.css'; // MISMO CSS
import Logo from '@/assets/img/logouct.png';
import useGoogleAuth from '@/features/Login/Login.Hooks/useGoogleAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const authLogin = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { exchange } = useGoogleAuth();

  useEffect(() => {
    try {
      const token = localStorage.getItem('google_credential');
      if (token) navigate('/home', { replace: true });
    } catch {}
  }, [navigate]);

  async function handleEmailPasswordLogin(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { token, user: userFromApi } = await apiLogin({ email, password });
      // El API ya entrega el usuario en la forma que espera el cliente (con 'rol').
      authLogin(token, userFromApi as any);
      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleOAuth() {
    // Intercambia el idToken (guardado por Google One Tap en localStorage)
    // por la sesión/JWT de la app antes de navegar.
    try {
      await exchange();
      navigate('/home', { replace: true });
    } catch (e: any) {
      // Mostrar feedback mínimo; no bloquea el botón
      setError(e?.message || 'No se pudo completar el inicio de sesión con Google');
    }
  }

  if (showAdminLogin) {
    return (
      // MISMO FONDO que el login institucional
      <div className={styles.heroBg}>
        <div className={styles.card}>
          {/* Header centrado - MISMO ESTILO que el login institucional */}
          <header className={`${styles.header} ${styles.centered}`} role="banner">
            <div className={styles.logo}>
              <img src={Logo} alt="Logo UCT" className={styles.logoImg} />
            </div>
            <div className={`${styles.headerText} ${styles.centered}`}>
              <h2 className={styles.title}>Inicio de Sesión (Admin)</h2>
              <span className={styles.subtitle}>Acceso para administradores del sistema</span>
            </div>
          </header>

          {/* Formulario centrado */}
          <div className={styles.googleBtnContainer}>
            <LoginForm 
              onSubmit={handleEmailPasswordLogin} 
              loading={loading}
              className={styles.form}
            />
          </div>

          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.error} role="alert">{error}</p>
            </div>
          )}

          {/* Botón de volver */}
          <div className={styles.adminContainer}>
            <button 
              onClick={() => {
                setShowAdminLogin(false);
                setError(null);
              }}
              className={styles.adminBtn}
            >
              ← Volver a Acceso Institucional
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoginInstitutional 
      onOAuth={handleOAuth} 
      onShowAdminLogin={() => setShowAdminLogin(true)}
    />
  );
}