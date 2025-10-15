import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { ChatList } from '../components/ChatList'
import { ChatHeader } from '../components/ChatHeader'
import { ChatWindow } from '../components/ChatWindow'
import { ChatInput } from '../components/ChatInput'
import {MiniSidebar} from '../../marketplace/ui/components/MiniSidebar'
import type { Chat, Mensaje } from '@/features/chat/types/chat'
import { MockChatWS } from '../mocks/MockChatWS'
import { mockChats } from '../mocks/mockChats'

const useEnv = () => {
  const API = useMemo(() => import.meta.env.VITE_API_URL as string, [])
  const WS_URL = useMemo(() => import.meta.env.VITE_WS_URL as string, [])
  return { API, WS_URL }
}
const horaActual = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function ChatPage() {
  const { API, WS_URL } = useEnv()
  const location = useLocation()
  const [chats, setChats] = useState<Chat[]>([])
  const [chatActivo, setChatActivo] = useState<number | null>(null)
  const userIdActual = useMemo(() => 'u1', [])
  const ws = useRef<WebSocket | MockChatWS | null>(null)
  const isMockWS = !WS_URL || WS_URL === "mock"

  // 0) Target opcional para iniciar/abrir chat (desde /chat?toId=...&toName=...&toAvatar=... o location.state.toUser)
  const startTarget = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const toId = params.get('toId') || params.get('to') || undefined
    const toName = params.get('toName') || undefined
    const toAvatar = params.get('toAvatar') || undefined
    const fromState = (location.state as any)?.toUser
    const merged = {
      id: String(fromState?.id ?? toId ?? ''),
      nombre: fromState?.nombre ?? toName ?? '',
      avatarUrl: fromState?.avatarUrl ?? toAvatar ?? ''
    }
    if (!merged.id && !merged.nombre) return null
    return merged
  }, [location.search, location.state])

  /* 1) Cargar lista de chats */
  useEffect(() => {
    if (isMockWS) {
      setChats(mockChats)
      setChatActivo(mockChats[0]?.id ?? null)
      return
    }
    (async () => {
      try {
        const res = await fetch(`${API}/chats`, { credentials: 'include' })
        if (!res.ok) throw new Error(String(res.status))
        const data: Chat[] = await res.json()
        setChats(data)
        // Si no viene target desde la URL/state, selecciona el primero
        if (!startTarget && data.length) setChatActivo((data[0] as any).id)
      } catch (e) {
        console.error('[ChatPage] Error cargando chats:', e)
      }
    })()
  }, [API, startTarget])

  /* 1.1) Si viene un target (?toId / state), buscar chat y si no existe, crearlo (o stub local) */
  const usedStartRef = useRef(false)
  useEffect(() => {
    if (!startTarget) return
    if (usedStartRef.current) return
    if (!chats) return

    const findExisting = (list: Chat[]) =>
      list.find((c: any) => {
        // Intenta por id del partner o por nombre
        const byId =
          String(c.partnerId ?? '') === String(startTarget.id ?? '') ||
          (Array.isArray(c.participantes) &&
            c.participantes.some((p: any) => String(p?.id ?? '') === String(startTarget.id ?? '')))
        const byName =
          String(c.partnerName ?? '').toLowerCase() === String(startTarget.nombre ?? '').toLowerCase() ||
          String(c.nombre ?? '').toLowerCase() === String(startTarget.nombre ?? '').toLowerCase() ||
          String(c.titulo ?? '').toLowerCase() === String(startTarget.nombre ?? '').toLowerCase()
        return byId || byName
      })

    const ensureChat = async () => {
      usedStartRef.current = true

      // 1) Si ya existe, selecciona
      const existing = findExisting(chats)
      if (existing) {
        setChatActivo((existing as any).id)
        return
      }

      // 2) Intentar crearlo en backend (ajusta endpoint si tu API usa otro)
      try {
        const res = await fetch(`${API}/chats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            toUserId: startTarget.id || undefined,
            toName: startTarget.nombre || undefined,
            toAvatar: startTarget.avatarUrl || undefined
          })
        })
        if (res.ok) {
          const created: Chat = await res.json()
          setChats(prev => [created, ...prev])
          setChatActivo((created as any).id)
          return
        }
      } catch (e) {
        console.warn('[ChatPage] No se pudo crear chat en backend, usando stub local:', e)
      }

      // 3) Fallback local (stub) para permitir conversación inmediata
      const tempId = Number(Date.now())
      const stub: any = {
        id: tempId,
        // Campos comunes usados por tus componentes de UI (ajusta si hace falta)
        partnerId: startTarget.id ?? undefined,
        partnerName: startTarget.nombre || 'Usuario',
        partnerAvatar: startTarget.avatarUrl || undefined,
        ultimoMensaje: '',
        mensajes: [],
        participantes: startTarget.id
          ? [{ id: startTarget.id, nombre: startTarget.nombre, avatarUrl: startTarget.avatarUrl }]
          : [{ id: 'desconocido', nombre: startTarget.nombre || 'Usuario', avatarUrl: startTarget.avatarUrl }]
      }
      setChats(prev => [stub as Chat, ...prev])
      setChatActivo(tempId)
    }

    ensureChat()
  }, [API, chats, startTarget])

  /* 2) Conectar WebSocket una vez */
  useEffect(() => {
    const socket = isMockWS
      ? new MockChatWS()
      : new WebSocket(`${WS_URL}?userId=${encodeURIComponent(userIdActual)}`)
    ws.current = socket

    socket.onopen = () => console.log('[ChatPage] WS conectado')
    socket.onclose = () => console.log('[ChatPage] WS cerrado')
    socket.onerror = (e: any) => console.error('[ChatPage] WS error:', e)
    socket.onmessage = (evt: { data: string }) => {
      const data = JSON.parse(evt.data)

      // mensaje entrante
      if (data.tipo === 'nuevo' || data.tipo === 'mensaje') {
        setChats(prev =>
          prev.map((c: any) =>
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
      // actualización de estado
      if (data.tipo === 'estado') {
        setChats(prev =>
          prev.map((c: any) =>
            c.id === data.chatId
              ? {
                  ...c,
                  mensajes: c.mensajes.map((m: any) =>
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
  }, [WS_URL, userIdActual, isMockWS])

  // 3) Unirse al chat cuando cambie
  useEffect(() => {
    if (!chatActivo || !ws.current) return
    if (!isMockWS && ws.current.readyState !== WebSocket.OPEN) return
    ws.current.send(JSON.stringify({ tipo: 'join', chatId: chatActivo, userId: userIdActual }))
  }, [chatActivo, userIdActual, isMockWS])

  // 4) Enviar mensaje
  const handleSend = useCallback(
    async (texto: string) => {
      if (!chatActivo) return

      const tempId = 'temp-' + Date.now()
      const nuevo: Mensaje = { id: tempId, texto, autor: 'yo', estado: 'enviando', hora: horaActual() }

      setChats(prev =>
        prev.map((c: any) =>
          c.id === chatActivo ? { ...c, mensajes: [...c.mensajes, nuevo], ultimoMensaje: texto } : c
        )
      )

      if (isMockWS) {
        setTimeout(() => {
          const guardado: Mensaje = { ...nuevo, id: Date.now(), estado: 'enviado' }
          setChats(prev =>
            prev.map(c =>
              c.id === chatActivo
                ? { ...c, mensajes: c.mensajes.map(m => (m.id === tempId ? { ...guardado, estado: 'enviado' } : m)) }
                : c
            )
          )
          ws.current?.send(JSON.stringify({ tipo: 'nuevo', chatId: chatActivo, mensaje: guardado }))
        }, 500)
      } else {
        try {
          const res = await fetch(`${API}/mensajes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto, autor: 'yo', hora: nuevo.hora, chatId: chatActivo }),
          })
          if (!res.ok) throw new Error('HTTP ' + res.status)
          const guardado: Mensaje = await res.json()
          setChats(prev =>
            prev.map(c =>
              c.id === chatActivo
                ? { ...c, mensajes: c.mensajes.map(m => (m.id === tempId ? { ...guardado, estado: 'enviado' } : m)) }
                : c
            )
          )
          ws.current?.send(JSON.stringify({ tipo: 'nuevo', chatId: chatActivo, mensaje: guardado }))
        } catch (e) {
          console.error('[ChatPage] No se pudo enviar:', e)
        }
      }
    },
    [API, chatActivo, isMockWS]
  )

  // 5) Marcar leído al entrar/actualizar chat
  useEffect(() => {
    if (!chatActivo || !ws.current) return
    const chat: any = chats.find((c: any) => c.id === chatActivo)
    const last = chat?.mensajes?.[chat.mensajes.length - 1]
    if (last?.id) {
      ws.current.send(JSON.stringify({ tipo: 'estado', chatId: chatActivo, estado: 'leido', mensajeId: last.id }))
    }
  }, [chatActivo, chats])

  const chatSeleccionado = (chats as any).find((c: any) => c.id === chatActivo) ?? null

  return (
    <div className="grid h-screen overflow-hidden max-h-222 grid-cols-[64px_320px_1fr]">
      <aside className="border-r bg-white max-h-222">
        <MiniSidebar active="chats" />
      </aside>

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
          <ChatHeader chatActivo={chatSeleccionado as any} />
        </div>
        <div className="flex-1 min-h-0 max-h-222">
          <ChatWindow mensajes={(chatSeleccionado as any)?.mensajes ?? []} />
        </div>
        <div className="shrink-0">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}