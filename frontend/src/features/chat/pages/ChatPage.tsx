// src/features/chat/pages/ChatPage.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { ChatList } from '../components/ChatList'
import { ChatHeader } from '../components/ChatHeader'
import { ChatWindow } from '../components/ChatWindow'
import { ChatInput } from '../components/ChatInput'
import {MiniSidebar} from '../../marketplace/ui/components/MiniSidebar'// mini sidebar con íconos (ajusta la ruta si hace falta)
import type { Chat, Mensaje } from '@/types/chat'

/* Helpers */
const useEnv = () => {
  const API = useMemo(() => import.meta.env.VITE_API_URL as string, [])
  const WS_URL = useMemo(() => import.meta.env.VITE_WS_URL as string, [])
  return { API, WS_URL }
}
const horaActual = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function ChatPage() {
  const { API, WS_URL } = useEnv()
  const [chats, setChats] = useState<Chat[]>([])
  const [chatActivo, setChatActivo] = useState<number | null>(null)
  const userIdActual = useMemo(() => 'u1', [])
  const ws = useRef<WebSocket | null>(null)

  /* 1) Cargar lista de chats */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/chats`, { credentials: 'include' })
        if (!res.ok) throw new Error(String(res.status))
        const data: Chat[] = await res.json()
        setChats(data)
        if (data.length) setChatActivo(data[0].id)
      } catch (e) {
        console.error('[ChatPage] Error cargando chats:', e)
      }
    })()
  }, [API])

  /* 2) Conectar WebSocket una vez */
  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}?userId=${encodeURIComponent(userIdActual)}`)
    ws.current = socket

    socket.onopen = () => console.log('[ChatPage] WS conectado')
    socket.onclose = () => console.log('[ChatPage] WS cerrado')
    socket.onerror = (e) => console.error('[ChatPage] WS error:', e)
    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data)

      // mensaje entrante
      if (data.tipo === 'nuevo' || data.tipo === 'mensaje') {
        setChats(prev =>
          prev.map(c =>
            c.id === data.chatId
              ? {
                  ...c,
                  mensajes: [...c.mensajes, { ...data.mensaje, estado: 'recibido' }],
                  ultimoMensaje: data.mensaje?.texto ?? c.ultimoMensaje,
                }
              : c
          )
        )
      }

      // actualización de estado (enviado/recibido/leido)
      if (data.tipo === 'estado') {
        setChats(prev =>
          prev.map(c =>
            c.id === data.chatId
              ? {
                  ...c,
                  mensajes: c.mensajes.map(m =>
                    data.mensajeId
                      ? (m.id === data.mensajeId ? { ...m, estado: data.estado } : m)
                      : (m.autor === 'yo' ? { ...m, estado: data.estado } : m)
                  ),
                }
              : c
          )
        )
      }
    }

    return () => socket.close()
  }, [WS_URL, userIdActual])

  /* 3) Unirse al chat cuando cambie */
  useEffect(() => {
    if (chatActivo && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ tipo: 'join', chatId: chatActivo, userId: userIdActual }))
    }
  }, [chatActivo, userIdActual])

  /* 4) Enviar mensaje */
  const handleSend = useCallback(
    async (texto: string) => {
      if (!chatActivo) return

      const tempId = 'temp-' + Date.now()
      const nuevo: Mensaje = { id: tempId, texto, autor: 'yo', estado: 'enviando', hora: horaActual() }

      // pinta local
      setChats(prev =>
        prev.map(c =>
          c.id === chatActivo ? { ...c, mensajes: [...c.mensajes, nuevo], ultimoMensaje: texto } : c
        )
      )

      try {
        const res = await fetch(`${API}/mensajes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texto, autor: 'yo', hora: nuevo.hora, chatId: chatActivo }),
        })
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const guardado: Mensaje = await res.json()

        // reemplaza temporal por real
        setChats(prev =>
          prev.map(c =>
            c.id === chatActivo
              ? { ...c, mensajes: c.mensajes.map(m => (m.id === tempId ? { ...guardado, estado: 'enviado' } : m)) }
              : c
          )
        )

        // notifica a otros
        ws.current?.send(JSON.stringify({ tipo: 'nuevo', chatId: chatActivo, mensaje: guardado }))
      } catch (e) {
        console.error('[ChatPage] No se pudo enviar:', e)
      }
    },
    [API, chatActivo]
  )

  /* 5) Marcar leído al entrar/actualizar chat */
  useEffect(() => {
    if (!chatActivo || !ws.current) return
    const chat = chats.find(c => c.id === chatActivo)
    const last = chat?.mensajes?.[chat.mensajes.length - 1]
    if (last?.id) {
      ws.current.send(JSON.stringify({ tipo: 'estado', chatId: chatActivo, estado: 'leido', mensajeId: last.id }))
    }
  }, [chatActivo, chats])

  const chatSeleccionado = chats.find(c => c.id === chatActivo) ?? null

  /* ===================== Layout con scroll locales ===================== */
  return (
    <div className="grid h-screen overflow-hidden max-h-222 grid-cols-[64px_320px_1fr]">
      {/* mini sidebar */}
      <aside className="border-r bg-white max-h-222">
        <MiniSidebar active="chats" />
      </aside>

      {/* columna: lista de chats (header fijo + lista scrolleable) */}
      <div className="border-r bg-white min-w-0 min-h-0 max-h-222 flex flex-col">
        <div className="shrink-0 px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-slate-700">Mis Chats</h2>
        </div>
        <div className="flex-1 min-h-0 max-h-222 overflow-y-auto overflow-x-hidden">
          <ChatList chats={chats} onSelectChat={setChatActivo} chatActivo={chatActivo} />
        </div>
      </div>

      {/* columna: conversación (header fijo + ventana scrolleable + input fijo) */}
      <div className="min-w-0 min-h-0 max-h-222 flex flex-col">
        <div className="shrink-0">
          <ChatHeader chatActivo={chatSeleccionado} />
        </div>
        <div className="flex-1 min-h-0 max-h-222">
          <ChatWindow mensajes={chatSeleccionado?.mensajes ?? []} />
        </div>
        <div className="shrink-0">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}