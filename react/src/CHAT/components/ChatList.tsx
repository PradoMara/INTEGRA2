import { Chat } from "../types/chat";

interface ChatListProps {
  chats: Chat[];
  chatActivo: Chat | null;
  setChatActivo: (chat: Chat) => void;
}

export function ChatList({ chats, chatActivo, setChatActivo }: ChatListProps) {
  return (
    <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
      <h2 className="p-4 font-bold border-b">Mis chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`p-3 cursor-pointer hover:bg-gray-200 ${
              chatActivo?.id === chat.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setChatActivo(chat)}
          >
            <p className="font-semibold">{chat.nombre}</p>
            <p className="text-sm text-gray-600 truncate">
              {chat.ultimoMensaje}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
