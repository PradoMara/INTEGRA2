import { Chat } from "../types/chat";

interface ChatHeaderProps {
  chatActivo: Chat | null;
}

export function ChatHeader({ chatActivo }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-blue-500 text-white p-3">
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
      >
        ⬅ Volver
      </button>
      <h1 className="text-lg font-bold">
        {chatActivo ? chatActivo.nombre : "Selecciona un chat"}
      </h1>
      <div></div> {/* espacio para centrar */}
    </div>
  );
}
