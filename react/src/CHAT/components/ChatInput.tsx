import { useState } from "react";

interface ChatInputProps {
  onSend: (msg: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [entrada, setEntrada] = useState("");

  const handleSend = () => {
    if (!entrada.trim()) return;
    onSend(entrada);
    setEntrada("");
  };

  return (
    <div className="p-3 border-t flex">
      <input
        className="flex-1 border p-2 rounded-l focus:outline-none"
        placeholder="Escribe un mensaje..."
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-blue-500 text-white px-4 rounded-r"
        onClick={handleSend}
      >
        Enviar
      </button>
    </div>
  );
}
