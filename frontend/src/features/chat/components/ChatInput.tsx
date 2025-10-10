import { useState } from "react";

export function ChatInput({ onSend }: { onSend: (t: string)=>Promise<void> }) {
  const [texto, setTexto] = useState("");

  const submit = async () => {
    const t = texto.trim();
    if (!t) return;
    await onSend(t);
    setTexto("");
  };

  return (
    <div className="bg-[#EEF3F8] border-t">
      <div className="px-8 py-4">
        <div className="flex items-center gap-3">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Escribe un mensaje..."
            className="flex-1 h-11 rounded-full border border-slate-300 bg-white px-4 text-[15px] outline-none focus:border-slate-400"
          />
          <button
            onClick={submit}
            className="h-11 px-5 rounded-full bg-black text-gray text-sm font-medium hover:bg-gray-900"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}