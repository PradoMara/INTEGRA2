import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa todas tus páginas
import MarketplacePage from './pages/MarketplacePage'; // <-- Tu página principal
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

// Importa los componentes de ruta
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<MarketplacePage />} /> {/* <-- Tu marketplace es la página de inicio */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- Rutas Protegidas para Usuarios --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>

        {/* --- Rutas Protegidas para Administradores --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* --- Ruta para Páginas no Encontradas --- */}
        <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;