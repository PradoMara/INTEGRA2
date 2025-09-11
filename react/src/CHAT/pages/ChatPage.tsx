import { useState } from "react";
import { ChatList } from "../components/ChatList";
import { ChatHeader } from "../components/ChatHeader";
import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";
import { Chat, Mensaje } from "../types/chat";

export default function ChatPage() {
  const [chats] = useState<Chat[]>([
    { id: 1, nombre: "Juan Pérez", ultimoMensaje: "Nos vemos mañana 👋" },
    { id: 2, nombre: "María López", ultimoMensaje: "Gracias por la ayuda 🙏" },
    { id: 3, nombre: "Profesor Soto", ultimoMensaje: "No olvides el trabajo 📚" },
  ]);

  const [chatActivo, setChatActivo] = useState<number | null>(1);

  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { id: 1, texto: "Hola 👋", autor: "otro" },
    { id: 2, texto: "¿Cómo estás?", autor: "otro" },
    { id: 3, texto: "Bien, probando el chat 😎", autor: "yo", estado: "leido" },
  ]);

  const handleSend = (texto: string) => {
    const nuevo: Mensaje = {
      id: mensajes.length + 1,
      texto,
      autor: "yo",
      estado: "enviando",
    };
    setMensajes([...mensajes, nuevo]);

    // Simulación de cambio de estado
    setTimeout(() => {
      setMensajes((prev) =>
        prev.map((m) =>
          m.id === nuevo.id ? { ...m, estado: "enviado" } : m
        )
      );
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {/* Columna izquierda con chats */}
      <ChatList
        chats={chats}
        onSelectChat={setChatActivo}
        chatActivo={chatActivo}
      />

      {/* Columna derecha con chat abierto */}
      <div className="flex flex-col w-3/4">
        <ChatHeader />
        <ChatWindow mensajes={mensajes} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
