import { Chat } from "../types/chat";

interface ChatWindowProps {
  chatActivo: Chat | null;
}

export function ChatWindow({ chatActivo }: ChatWindowProps) {
  return (
    <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
      {chatActivo ? (
        <p className="text-gray-600">
          Aquí aparecerán los mensajes de <b>{chatActivo.nombre}</b>
        </p>
      ) : (
        <p className="text-gray-400">Selecciona un chat para empezar</p>
      )}
    </div>
  );
}
