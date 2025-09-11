import { useState } from "react";

interface ChatInputProps {
  onSend: (texto: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [entrada, setEntrada] = useState("");

  const handleSend = () => {
    if (!entrada.trim()) return;
    onSend(entrada);
    setEntrada("");
  };

  return (
    <div className="p-3 bg-white border-t flex">
      <input
        className="flex-1 border px-3 py-2 rounded-l focus:outline-none"
        placeholder="Escribe un mensaje..."
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-[#0075B4] text-white px-4 rounded-r hover:bg-blue-700"
        onClick={handleSend}
      >
        Enviar
      </button>
    </div>
  );
}
