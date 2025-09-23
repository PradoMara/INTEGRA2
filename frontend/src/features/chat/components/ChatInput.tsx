import { useState } from "react";

interface ChatInputProps {
  onSend: (texto: string) => Promise<void>; // puede fallar si backend no responde
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!texto.trim()) {
      setError("⚠️ El mensaje no puede estar vacío");
      return;
    }
    setError("");

    try {
      await onSend(texto);
      setTexto(""); // limpiar input si se envió bien
    } catch (e) {
      setError("❌ No se pudo enviar el mensaje, intenta nuevamente");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-gray-100 flex flex-col">
      <div className="flex">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 rounded-l-lg border focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg font-bold hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
