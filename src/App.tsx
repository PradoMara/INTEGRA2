import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './presentation/components/Header'
import HomePage from './presentation/pages/HomePage'
import CrearPublicacionPage from './presentation/pages/CrearPublicacionPage'
import MisPublicacionesPage from './presentation/pages/MisPublicacionesPage'
import PerfilPage from './presentation/pages/PerfilPage'
import LoginInstitutionalPage from './presentation/pages/LoginInstitutionalPage'

function App() {
  return (
    <Routes>
      {/* Rutas sin header */}
      <Route path="/login" element={<LoginInstitutionalPage />} />

      {/* Rutas con header */}
      <Route
        path="/"
        element={
          <div>
            <Header />
            <HomePage />
          </div>
        }
      />
      <Route
        path="/crear"
        element={
          <div>
            <Header />
            <CrearPublicacionPage />
          </div>
        }
      />
      <Route
        path="/mis-publicaciones"
        element={
          <div>
            <Header />
            <MisPublicacionesPage />
          </div>
        }
      />
      <Route
        path="/perfil"
        element={
          <div>
            <Header />
            <PerfilPage />
          </div>
        }
      />
    </Routes>
  )
}

export default App
