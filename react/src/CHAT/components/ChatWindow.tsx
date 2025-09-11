import { Mensaje } from "../types/chat";
import { ChatBubble } from "./ChatBubble";

interface ChatWindowProps {
  mensajes: Mensaje[];
}

export function ChatWindow({ mensajes }: ChatWindowProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
      {mensajes.map((m) => (
        <ChatBubble key={m.id} mensaje={m} />
      ))}
    </div>
  );
}
