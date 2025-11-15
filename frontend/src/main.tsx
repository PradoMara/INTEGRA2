<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './app/context/AuthContext'
import AppRoutes from './app/routes'   // <- usa este import
import './index.css'
=======
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './app/routes';
import './index.css';
>>>>>>> origin/Daniel

// 1. IMPORTAMOS EL STORE DE AUTENTICACIÓN
import { useAuthStore } from './store/authStore';

// -----------------------------------------------------------------
// MEJORA (SOLO PARA PRUEBAS): Exponer funciones en la consola de desarrollo
// -----------------------------------------------------------------
if (import.meta.env.DEV) {
  // Adjuntamos funciones al objeto 'window' para llamarlas desde la consola
  // @ts-ignore
  window.testLoginUser = () => {
    const fakeToken = 'fake-user-token-123';
    const fakeUser = {
      id: 'cl_user_1',
      nombre: 'Usuario de Prueba',
      rol: 'USER', // ❗️ Asegúrate que 'USER' sea uno de tus roles
    };
    useAuthStore.getState().login(fakeToken, fakeUser);
    console.log('✅ [TEST] Sesión iniciada como USUARIO:', fakeUser);
    location.reload(); // Recargamos para simular el flujo completo
  };
  // @ts-ignore
  window.testLoginAdmin = () => {
    const fakeToken = 'fake-admin-token-456';
    const fakeUser = {
      id: 'cl_admin_1',
      nombre: 'Admin de Prueba',
      rol: 'ADMIN', // ❗️ Asegúrate que 'ADMIN' sea uno de tus roles
    };
    useAuthStore.getState().login(fakeToken, fakeUser);
    console.log('✅ [TEST] Sesión iniciada como ADMIN:', fakeUser);
    location.reload();
  };
  // @ts-ignore
  window.testLogout = () => {
    useAuthStore.getState().logout();
    console.log('🔴 [TEST] Sesión cerrada.');
    location.reload();
  };
}
// -----------------------------------------------------------------

// Código original de prepareMocks
async function prepareMocks() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser');
      //await worker.start({ onUnhandledRequest: 'bypass' });
    } catch (e) {
      // MSW opcional; si falla, continuamos sin mocks
      console.warn('[MSW] No se pudo iniciar el worker:', e);
    }
  }
}

// Código original de VITE_DEV_RUN_ID
if (import.meta.env.DEV) {
  try {
    const currentId = import.meta.env.VITE_DEV_RUN_ID as string | undefined;
    const storedId = localStorage.getItem('dev_run_id') || undefined;
    if (currentId && storedId && storedId !== currentId) {
      // New dev run detected → clear auth tokens
      localStorage.removeItem('google_credential');
    }
    if (currentId && storedId !== currentId) {
      localStorage.setItem('dev_run_id', currentId);
    }
    // First run in this browser tab: set the id if missing
    if (currentId && !storedId) {
      localStorage.setItem('dev_run_id', currentId);
    }
  } catch {
    // ignore storage errors (e.g., private mode)
  }
}

// Código original de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

<<<<<<< HEAD
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* --- 2. Envuelve AppRoutes con AuthProvider --- */}
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
=======
// 2. INICIALIZAMOS LA AUTENTICACIÓN
useAuthStore.getState().checkAuth();

// Código original de render
prepareMocks().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
});
>>>>>>> origin/Daniel
