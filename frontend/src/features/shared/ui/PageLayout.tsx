// src/shared/ui/PageLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import FloatingChat from './FloatingChat'

export default function PageLayout() {
  const { pathname } = useLocation()
  // Oculta el chat flotante en la vista de DMs
  const showFloatingChat = !pathname.startsWith('/chats')

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] overflow-hidden bg-gray-50">
      {/* Header fijo arriba (su propia altura) */}
      <Header />

      {/* Área de contenido: la vista hija maneja su propio scroll */}
      <main className="min-h-0">
        {/* wrapper por si la ruta interna necesita 100% del alto disponible */}
        <div className="h-full min-h-0">
          <Outlet />
        </div>
      </main>

      {/* Chat flotante global (oculto en /chats) */}
      {showFloatingChat && <FloatingChat width={360} height={560} corner="right" />}
    </div>
  )
}
