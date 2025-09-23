import type { Mensaje } from "../types/chat";

interface ChatWindowProps {
  mensajes: Mensaje[];
}

export function ChatWindow({ mensajes }: ChatWindowProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {mensajes.map((m) => (
        <div key={m.id} className={`mb-3 flex ${m.autor === "yo" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-xs px-4 py-2 rounded-lg shadow-md relative ${
              m.autor === "yo" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
            }`}
          >
            <p>{m.texto}</p>
            <div className="flex justify-end items-center gap-2 mt-1 text-xs opacity-70">
              <span>{m.hora}</span>
              {m.autor === "yo" && (
                <span
                  className={
                    m.estado === "leido"
                      ? "text-blue-400"
                      : "text-white"
                  }
                >
                  {m.estado === "enviando" && "⏳"}
                  {m.estado === "enviado" && "✔"}
                  {m.estado === "recibido" && "✔✔"}
                  {m.estado === "leido" && "✔✔"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
