import { useState } from "react";
import { Chat } from "../types/chat";
import { ChatList } from "../components/ChatList";
import { ChatHeader } from "../components/ChatHeader";
import { ChatWindow } from "../components/ChatWindow";
import { ChatInput } from "../components/ChatInput";

export default function ChatPage() {
  const [chats] = useState<Chat[]>([
    { id: 1, nombre: "Juan Pérez", ultimoMensaje: "Nos vemos mañana 👋" },
    { id: 2, nombre: "María López", ultimoMensaje: "¿Me ayudas con la tarea?" },
    { id: 3, nombre: "Grupo UCT", ultimoMensaje: "Reunión el viernes" },
  ]);

  const [chatActivo, setChatActivo] = useState<Chat | null>(chats[0]);
  const [mensajes, setMensajes] = useState<string[]>([]);

  const handleSend = (msg: string) => {
    setMensajes((prev) => [...prev, msg]);
  };

  return (
    <div className="flex h-screen">
      <ChatList chats={chats} chatActivo={chatActivo} setChatActivo={setChatActivo} />
      <div className="flex-1 flex flex-col">
        <ChatHeader chatActivo={chatActivo} />
        <ChatWindow chatActivo={chatActivo} />
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
