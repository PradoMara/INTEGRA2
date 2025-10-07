// src/shared/ui/PageLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import FloatingChat from './FloatingChat'

export default function PageLayout() {
  const { pathname } = useLocation()
  const isDM = pathname.startsWith('/chats')
  const showFloatingChat = !isDM

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] bg-gray-50">
      <Header />

      {/* En /chats: ocultamos scroll global para evitar doble scroll.
          En el resto: habilitamos scroll vertical en <main>. */}
      <main className={isDM ? 'min-h-0 overflow-hidden' : 'min-h-0 overflow-y-auto'}>
        <div className="min-h-0">
          <Outlet />
        </div>
      </main>

      {showFloatingChat && <FloatingChat width={360} height={560} corner="right" />}
    </div>
  )
}
