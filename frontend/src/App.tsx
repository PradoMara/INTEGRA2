import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Importar tus páginas
import LoginPage from './pages/LoginPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Header from './features/shared/ui/Header';
import FloatingChat from './features/shared/ui/FloatingChat';

function App() {
  // CORREGIDO: Agregar tipo explícito al selector
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn());

  return (
    <Router>
      <div className="min-h-screen">
        {/* Header visible en todas las páginas excepto login */}
        {isLoggedIn && <Header />}
        
        <main>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rutas protegidas para usuarios normales */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MarketplacePage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
            </Route>
            
            {/* Rutas protegidas solo para admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            
            {/* Ruta por defecto - redirige según autenticación */}
            <Route 
              path="*" 
              element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} 
            />
          </Routes>
        </main>
        
        {/* Chat flotante solo cuando está logueado */}
        {isLoggedIn && <FloatingChat />}
      </div>
    </Router>
  );
}

export default App;