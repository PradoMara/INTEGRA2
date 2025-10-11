import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { mockChats } from "../mocks/mockChats";
import { ChatWindow } from "./ChatWindow";
import { ChatInput } from "./ChatInput";
import { ChatList } from "./ChatList";
import type { Chat, Mensaje } from "../types/chat";

export function FloatingChat() {
  const location = useLocation();
  if (location.pathname === "/chats") return null;

  // Estado local solo con mockChats
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [open, setOpen] = useState(false);
  const [chatActivo, setChatActivo] = useState<number | null>(mockChats[0]?.id || null);

  // Calcular chats con mensajes "no leídos"
  const unreadChatsCount = chats.filter(chat =>
    chat.mensajes.some(msg => msg.autor === "otro" && msg.estado !== "leido")
  ).length;

  const chatSeleccionado = chats.find((c) => c.id === chatActivo) ?? null;

  // Enviar mensaje simulado
  const handleSend = useCallback(async (texto: string) => {
    if (!chatActivo) return;
    const tempId = "temp-" + Date.now();
    const nuevo: Mensaje = {
      id: tempId,
      texto,
      autor: "yo",
      estado: "enviando",
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChats(prev =>
      prev.map(c =>
        c.id === chatActivo
          ? { ...c, mensajes: [...c.mensajes, nuevo], ultimoMensaje: texto }
          : c
      )
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    const guardado: Mensaje = {
      ...nuevo,
      id: Date.now(),
      estado: "enviado",
      autor: "yo",
    };
    setChats(prev =>
      prev.map(c =>
        c.id === chatActivo
          ? {
              ...c,
              mensajes: c.mensajes.map(m =>
                m.id === tempId ? guardado : m
              ),
            }
          : c
      )
    );
  }, [chatActivo]);

  return (
    <div>
      {/* Botón flotante para abrir/cerrar */}
      {!open && (
        <button
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            borderRadius: "50%",
            width: 56,
            height: 56,
            background: "#0075B4",
            color: "white",
            fontSize: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setOpen(true)}
          title="Abrir chat"
        >
          💬
          {unreadChatsCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#EDC500",
                color: "#222",
                borderRadius: "50%",
                padding: "2px 7px",
                fontSize: "13px",
                fontWeight: "bold",
                boxShadow: "0 1px 4px rgba(0,0,0,0.19)",
                pointerEvents: "none",
              }}
            >
              {unreadChatsCount}
            </span>
          )}
        </button>
      )}

      {/* Widget flotante */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: 360,
            height: 480,
            background: "white",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 8, borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold" }}>Mensajes</span>
            <button
              style={{
                border: "none",
                background: "transparent",
                fontSize: 20,
                cursor: "pointer",
                color: "#1a365d",
                fontWeight: "bold",
              }}
              onClick={() => setOpen(false)}
              title="Cerrar"
            >
              Cerrar
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
            <div style={{ width: 110, borderRight: "1px solid #eee", overflowY: "auto", minHeight: 0 }}>
              <ChatList chats={chats} onSelectChat={setChatActivo} chatActivo={chatActivo} />
            </div>
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ChatWindow mensajes={chatSeleccionado?.mensajes ?? []} />
              </div>
              <div>
                <ChatInput onSend={handleSend} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}