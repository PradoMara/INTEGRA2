import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { io, type Socket } from 'socket.io-client';

import { ChatHeader } from './DM.Components/ChatHeader';
import { ChatWindow } from './DM.Components/ChatWindow';
import { ChatInput } from './DM.Components/ChatInput';
import { ChatList } from './DM.Components/ChatList';
import { MiniSidebar } from './DM.Components/MiniSidebar';
import ChatRules from './DM.Components/ChatRules';

import type { Chat, Mensaje } from '@/features/DM/DM.Types/chat';
import { uploadImageService } from '@/features/chat/services/uploadService';
import { useAuth } from '@/app/context/AuthContext';



const useEnv = () => {
  const API = useMemo(() => import.meta.env.VITE_API_URL as string, []);
  const WS_URL = useMemo(() => import.meta.env.VITE_WS_URL as string, []);
  return { API, WS_URL };
};

const horaActual = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });



export default function ChatPage() {
  const { API, WS_URL } = useEnv();
  const location = useLocation();

  const { user, token } = useAuth();
  const userIdActual = user?.id;

  const [chats, setChats] = useState<Chat[]>([]);
  const [chatActivo, setChatActivo] = useState<number | null>(null);

  const ws = useRef<Socket | null>(null);
  const previewsRef = useRef<Record<string, string>>({});

  // TODO: Implementar carga inicial de chats con Authorization: Bearer {token}

  // Conexión Socket.io
  useEffect(() => {
    if (!WS_URL || !token) {
      console.log('[ChatPage] Faltan WS_URL o token, no se conectará al chat.');
      return;
    }

    const socket = io(WS_URL, { auth: { token } });
    ws.current = socket;

    socket.on('connect', () => console.log('[ChatPage] Socket.io conectado:', socket.id));
    socket.on('connect_error', (err) => console.error('[ChatPage] Socket.io error de conexión:', err.message));
    socket.on('disconnect', () => console.log('[ChatPage] Socket.io desconectado'));

    socket.on('new_message', (incomingMessage: Mensaje) => {
      console.log('[ChatPage] Mensaje recibido:', incomingMessage);
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== (incomingMessage as any).chatId) return c;
          return {
            ...c,
            mensajes: [...(c.mensajes || []), incomingMessage],
            ultimoMensaje: incomingMessage.texto,
          };
        })
      );
    });

    socket.on('user_online', (u) => console.log('Usuario Conectado:', u.userName));
    socket.on('user_offline', (u) => console.log('Usuario Desconectado:', u.userName));

    return () => {
      socket.disconnect();
    };
  }, [WS_URL, token]);

  // Unirse a un chat activo
  useEffect(() => {
    if (!chatActivo || !ws.current) return;
    if (!ws.current.connected) return;
    ws.current.emit('join', { chatId: chatActivo, userId: userIdActual });
  }, [chatActivo, userIdActual]);





  // Enviar mensaje con soporte para imágenes
  const handleSend = useCallback(
    async (texto: string, file?: File | null) => {
      if (!chatActivo || !ws.current || !token) {
        console.error('No se puede enviar: no hay chat activo, socket o token');
        return;
      }

      const chat = chats.find((c) => c.id === chatActivo);
      if (!chat) return;

      const destinatarioId = (chat as any).partnerId || (chat as any).participantes?.find((p: any) => p.id !== userIdActual)?.id;
      if (!destinatarioId) {
        console.error('No se pudo encontrar el destinatario del chat');
        return;
      }

      const clientTempId = 'temp-' + Date.now();
      const nuevo: Mensaje & { clientTempId?: string; imagenUrl?: string } = {
        id: clientTempId,
        texto,
        autor: 'yo',
        estado: 'enviando',
        hora: horaActual(),
        clientTempId,
      };

      if (file) {
        try {
          const url = URL.createObjectURL(file);
          nuevo.imagenUrl = url;
          previewsRef.current[clientTempId] = url;
        } catch {}
      }

      setChats((prev) =>
        prev.map((c) => (c.id === chatActivo ? { ...c, mensajes: [...(c.mensajes || []), nuevo], ultimoMensaje: texto || (file ? '📷 Imagen' : '') } : c))
      );

      try {
        let contenidoFinal = texto;
        let tipoFinal = 'texto';

        if (file) {
          const uploadResponse = await uploadImageService(file, token);
          if (!uploadResponse.ok) {
            throw new Error(uploadResponse.message || 'Falló la subida');
          }
          contenidoFinal = uploadResponse.imageUrl;
          tipoFinal = 'imagen';
          if (texto) {
            contenidoFinal = `${texto}\n${uploadResponse.imageUrl}`;
            tipoFinal = 'mixto';
          }
        }

        if (!contenidoFinal) return;

        ws.current.emit('send_message', {
          destinatarioId,
          contenido: contenidoFinal,
          tipo: tipoFinal,
          clientTempId,
        });
      } catch (e) {
        console.error('[ChatPage] Error enviando mensaje:', e);
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatActivo
              ? {
                  ...c,
                  mensajes: (c.mensajes || []).map((m: any) => (m.clientTempId === clientTempId ? { ...m, estado: 'error' as const } : m)),
                }
              : c
          )
        );
        if (nuevo.imagenUrl) URL.revokeObjectURL(nuevo.imagenUrl);
      }
    },
    [chatActivo, chats, token, userIdActual]
  );

  const chatSeleccionado: Chat | null = useMemo(() => chats.find((c) => c.id === chatActivo) ?? null, [chats, chatActivo]);

  return (
    <div className="grid h-screen overflow-hidden max-h-screen grid-cols-[64px_320px_1fr] bg-gray-100 bg-pattern-chat">
      <aside className="border-r border-yellow-600 bg-yellow-600 max-h-screen">
        <MiniSidebar active="chats" />
      </aside>

      <div className="border-r border-yellow-500 min-w-0 min-h-0 max-h-screen flex flex-col bg-yellow-400">
        <div className="shrink-0 px-4 py-3 border-b border-blue-900 bg-blue-900">
          <h2 className="text-sm font-semibold text-white">Chats</h2>
        </div>
        <div className="shrink-0 px-3 py-2">
          <ChatRules inline />
        </div>
        <div className="flex-1 min-h-0 max-h-screen overflow-y-auto overflow-x-hidden">
          <ChatList chats={chats} onSelectChat={setChatActivo} chatActivo={chatActivo} />
        </div>
      </div>

      <div className="min-w-0 min-h-0 max-h-screen flex flex-col">
        <div className="shrink-0">
          <ChatHeader chatActivo={chatSeleccionado} />
        </div>
        <div className="flex-1 min-h-0 max-h-screen">
          <ChatWindow mensajes={chatSeleccionado?.mensajes ?? []} />
        </div>
        <div className="shrink-0">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}