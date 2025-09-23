import { useEffect, useRef, useState } from "react";
import { ChatList } from "../components/ChatList";
import { ChatHeader } from "../components/ChatHeader";
import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";
import { Chat, Mensaje } from "../types/chat";

// 🔹 Función auxiliar para hora HH:mm
const horaActual = () => {
  const ahora = new Date();
  return ahora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatActivo, setChatActivo] = useState<number | null>(null);
  const ws = useRef<WebSocket | null>(null);

  // 1️⃣ Cargar lista de chats
  useEffect(() => {
    fetch("http://localhost:3000/chats")
      .then((res) => res.json())
      .then((data) => {
        setChats(data);
        if (data.length > 0) setChatActivo(data[0].id);
      })
      .catch((err) => console.error("❌ Error cargando chats:", err));
  }, []);

  // 2️⃣ Conectar WebSocket
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");
    ws.current.onopen = () => console.log("✅ Conectado al WS");

    ws.current.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.tipo === "nuevo") {
        // mensaje recibido
        setChats((prev) =>
          prev.map((c) =>
            c.id === data.chatId
              ? { ...c, mensajes: [...c.mensajes, { ...data.mensaje, estado: "recibido" }] }
              : c
          )
        );
      }

      if (data.tipo === "estado") {
        // actualización de estado
        setChats((prev) =>
          prev.map((c) =>
            c.id === data.chatId
              ? {
                  ...c,
                  mensajes: c.mensajes.map((m) =>
                    m.id === data.mensajeId ? { ...m, estado: data.estado } : m
                  ),
                }
              : c
          )
        );
      }
    };

    return () => ws.current?.close();
  }, []);

  // 3️⃣ Enviar mensaje
  const handleSend = async (texto: string) => {
    if (!chatActivo) return;

    const tempId = "temp-" + Date.now();

    const nuevoMensaje: Mensaje = {
      id: tempId,
      texto,
      autor: "yo",
      estado: "enviando",
      hora: horaActual(),
    };

    // mostrar local
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatActivo ? { ...c, mensajes: [...c.mensajes, nuevoMensaje], ultimoMensaje: texto } : c
      )
    );

    try {
      const res = await fetch("http://localhost:3000/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, autor: "yo", hora: nuevoMensaje.hora, chatId: chatActivo }),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      const mensajeGuardado = await res.json();

      // reemplazar tempId con id real
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatActivo
            ? {
                ...c,
                mensajes: c.mensajes.map((m) =>
                  m.id === tempId ? { ...mensajeGuardado, estado: "enviado" } : m
                ),
              }
            : c
        )
      );

      // notificar por WS
      ws.current?.send(JSON.stringify({ tipo: "nuevo", chatId: chatActivo, mensaje: mensajeGuardado }));
    } catch (err) {
      console.error("❌ No se pudo enviar:", err);
    }
  };

  // 4️⃣ Marcar como leído al entrar a un chat
  useEffect(() => {
    if (chatActivo && ws.current) {
      ws.current.send(JSON.stringify({ tipo: "estado", chatId: chatActivo, estado: "leido" }));
    }
  }, [chatActivo]);

  const chatSeleccionado = chats.find((c) => c.id === chatActivo);

  return (
    <div className="flex h-screen">
      <ChatList chats={chats} onSelectChat={setChatActivo} chatActivo={chatActivo} />
      <div className="flex flex-col w-3/4">
        {chatSeleccionado ? (
          <>
            <ChatHeader chatActivo={chatSeleccionado} />
            <ChatWindow mensajes={chatSeleccionado.mensajes || []} />
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona un chat para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
