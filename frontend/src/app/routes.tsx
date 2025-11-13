// src/app/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/Login/Login.UI/LoginPage'
import HomePage from '@/features/marketplace/Marketplace.UI/HomePage'
import CrearPublicacionPage from '@/features/CrearPublicacion/CrearPublicacion.UI/CrearPublicacionPage'
import EditarPublicacionPage from '@/features/EditarPublicacion/EditarPublicacion.UI/EditarPublicacionPage'
import MisPublicacionesPage from '@/features/MyPublications/MyPublications.UI/MisPublicacionesPage'
import PerfilPage from '@/features/Perfil/Perfil.UI/PerfilPage'
import PageLayout from '@/features/shared/ui/PageLayout'
import ChatPage from '@/features/DM/DM.UI/ChatPage'
import AyudaPage from '@/features/About.Terms.Help/Help.UI/AyudaPage'
import TermsPage from '@/features/About.Terms.Help/Terms.UI/TermsPage'
import AboutPage from '@/features/About.Terms.Help/About.UI/AboutPage'
import RegisterTest from '@/features/Login/Login.UI/RegisterTest'
import LoginTest from '@/features/Login/Login.UI/LoginTest'

// --- 1. Importa tu ruta protegida ---
import { ProtectedRoute } from '@/app/context/AuthContext'
import ForumPage from '@/features/Forum/ForumPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      {/* (Cualquiera puede verlas) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterTest />} />
      <Route path="/login-test" element={<LoginTest />} />

      {/* Rutas públicas que usan el layout (navbar/footer) */}
      <Route element={<PageLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/ayuda" element={<AyudaPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* --- Rutas Protegidas --- */}
      {/* (Solo usuarios logueados pueden verlas) */}
      <Route element={<ProtectedRoute />}>
        {/* Usamos PageLayout para que también tengan navbar/footer */}
        <Route element={<PageLayout />}>
          <Route path="/crear" element={<CrearPublicacionPage />} />
          <Route path="/editar" element={<EditarPublicacionPage />} />
          <Route path="/mis-publicaciones" element={<MisPublicacionesPage />} />
          <Route path="/foro" element={<ForumPage/>} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Route>
      </Route>

      {/* Redirecciones por defecto */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes