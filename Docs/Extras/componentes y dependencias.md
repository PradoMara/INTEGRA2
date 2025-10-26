# Nuevos componentes y dependencias identificados

Este archivo resume los componentes y dependencias principales del proyecto y sugiere nuevos elementos a incorporar para cubrir los objetivos funcionales del marketplace universitario.

---

## Componentes actuales

### Frontend (React + Vite + TypeScript)

- **PageLayout**: Componente de layout reutilizable con header global.
- **Paginas principales**: HomePage, CrearPublicacionPage, MisPublicacionesPage, PerfilPage, ChatPage.
- **Rutas**: AppRoutes centraliza las rutas y layouts usando react-router-dom.
- **Estado y datos**: Gestion de queries con @tanstack/react-query.
- **Chat**: Estructura de chat en ChatPage, componentes como ChatList, ChatHeader, ChatWindow, ChatInput y MiniSidebar.
- **Estilos**: Tailwindcss y autoprefixer.
- **Herramientas de desarrollo**: ESLint, plugins para React y TypeScript.

### Backend (Node.js/Express + WebSocket)

- **Servidor HTTP y WebSocket**: Backend en TypeScript usando express, cors y ws para WebSocket.
- **Gestion de chats y mensajes en tiempo real**.
- **Servidor WebSocket de ejemplo**: Implementacion en JS usando la libreria ws.

### Dependencias clave

- react, react-dom
- react-router-dom
- @tanstack/react-query
- @vitejs/plugin-react-swc
- tailwindcss
- autoprefixer
- express, cors, ws
- eslint, eslint-plugin-react-hooks, typescript-eslint

---

## Nuevos componentes sugeridos

- **Notificaciones**: Componente para mostrar alertas en tiempo real (ejemplo: Toasts).
- **Panel de administracion**: Dashboard para admins con metricas y gestion de reportes.
- **Formularios avanzados**: Componentes controlados para validacion robusta de publicaciones y reportes.
- **Foros**: Componente de foros tematicos y general.
- **Perfil avanzado**: Vista de perfil con actividad, reputacion y logistica.

---

## Nuevas dependencias sugeridas

- **WebSocket para frontend**: Libreria como reconnecting-websocket o API nativa.
- **Gestion de formularios**: react-hook-form o formik.
- **Notificaciones**: react-toastify o similar.
- **Moderacion de contenido**: Paquete para filtrar texto ofensivo (bad-words o integracion con APIs externas).
- **Iconos**: react-icons o similar.
- **Testing**: jest, @testing-library/react, cypress.

---
