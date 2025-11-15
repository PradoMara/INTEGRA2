// src/app/routes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/Login/Login.UI/LoginPage'
import HomePage from '@/features/Marketplace/Marketplace.UI/HomePage'
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
import MyPublications from '@/features/Forum/MyPublications'

// --- 1. Importa tu ruta protegida ---
import { ProtectedRoute } from '@/app/context/AuthContext'
import ForumPage from '@/features/Forum/ForumPage'

// --- Páginas Públicas y de Layout ---
import PageLayout from '@/features/shared/ui/PageLayout';
import LoginPage from '@/features/Login/Login.UI/LoginPage';
import HomePage from '@/features/marketplace/Marketplace.UI/HomePage';
import AyudaPage from '@/features/About.Terms.Help/Help.UI/AyudaPage';
import TermsPage from '@/features/About.Terms.Help/Terms.UI/TermsPage';
import AboutPage from '@/features/About.Terms.Help/About.UI/AboutPage';
import { PublicationDetailPage } from '@/features/marketplace/ui/PublicationDetailPage';
import PostsSandboxPage from '@/features/posts/PostsSandboxPage';

// --- Páginas Protegidas (Usuario) ---
import CrearPublicacionPage from '@/features/CrearPublicacion/CrearPublicacion.UI/CrearPublicacionPage';
import EditarPublicacionPage from '@/features/EditarPublicacion/EditarPublicacion.UI/EditarPublicacionPage';
import MisPublicacionesPage from '@/features/MyPublications/MyPublications.UI/MisPublicacionesPage';
import PerfilPage from '@/features/Perfil/Perfil.UI/PerfilPage';
import OnboardingPage from '@/features/onboarding/Onboarding.UI/OnboardingPage';
import EditProfilePage from '@/features/Perfil/EditProfile';
import ChatPage from '@/features/DM/DM.UI/ChatPage';

// --- Páginas de Administrador ---
import UsersPage from '../features/admin/pages/UsersPage';
import AdminDashboardPage from '../features/admin/pages/DashboardPage';
import AdminPostsPage from '../features/admin/pages/PostsPage';
import AdminSettingsPage from '../features/admin/pages/SettingsPage';
import AdminMarketplacePage from '../features/admin/pages/MarketplacePage';
// Nota: La importación de 'PublicationsPage' no se usaba en tu archivo original.

export function AppRoutes() {
  return (
    <Routes>
      {/* Redirige la raíz a /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route element={<PageLayout />}>
        
        {/* Rutas Públicas (Cualquiera puede verlas) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/ayuda" element={<AyudaPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/publications/:id" element={<PublicationDetailPage />} />
        <Route path="/sandbox/posts" element={<PostsSandboxPage />} />

        {/* --- Rutas Protegidas (Requiere cualquier login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/crear" element={<CrearPublicacionPage />} />
          <Route path="/editar" element={<EditarPublicacionPage />} />
          <Route path="/mis-publicaciones" element={<MisPublicacionesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/perfil/editar" element={<EditProfilePage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Route>

        {/* --- Rutas de Administrador (Requiere rol 'ADMIN') --- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/usuarios" element={<UsersPage />} />
          <Route path="/admin/publicaciones" element={<AdminPostsPage />} />
          <Route path="/admin/ajustes" element={<AdminSettingsPage />} />
          <Route path="/admin/marketplace" element={<AdminMarketplacePage />} />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;