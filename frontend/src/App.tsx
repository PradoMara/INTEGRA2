// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MarketplaceDesktop from "./pages/MarketplaceDesktop";
import CreatePost from "./pages/CrearPublicacion";
import ProfilePage from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/marketplace" element={<MarketplaceDesktop />} />
      <Route path="/publicar" element={<CreatePost />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/crear" element={<Navigate to="/publicar" replace />} />
      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
  );
}
