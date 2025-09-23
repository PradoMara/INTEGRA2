import type { Chat } from "@/features/chat/types/chat";

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: number) => void;
  chatActivo: number | null;
}

export function ChatList({ chats, onSelectChat, chatActivo }: ChatListProps) {
  return (
    <div className="w-1/4 border-r border-gray-200 bg-gray-50 overflow-y-auto">
      <h2 className="p-4 text-lg font-bold text-[#0075B4]">Mis Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              chatActivo === chat.id ? "bg-[#EDC500]" : ""
            }`}
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
