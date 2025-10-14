import type { Chat } from "@/types/chat";

export function ChatList({
  chats,
  onSelectChat,
  chatActivo,
}: { chats: Chat[]; onSelectChat: (id:number)=>void; chatActivo: number|null }) {
  return (
    <aside className="h-full w-full min-w-0 flex flex-col bg-white">
      <ul className="min-h-0 overflow-y-auto overflow-x-hidden">  {/* sin rounded y con bg claro */}
        {chats.map((chat, idx) => {
          const active = chatActivo === chat.id
          return (
            <li key={chat.id} className="min-w-0">
              <button
                onClick={() => onSelectChat(chat.id)}
                className={[
                  // ❌ sin rounded-*, sin fondos oscuros
                  "w-full flex items-center gap-3 px-4 py-4 text-left transition",
                  "border-b last:border-b-0",               // separadores finos
                  active
                    ? "bg-[#e7e7e7] text-slate-900"         // activo amarillo
                    : "bg-white hover:bg-slate-50 text-slate-800", // normal claro
                ].join(" ")}
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-gray-400 shrink-0">
                  {/* avatar */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Z" fill="currentColor"/>
                    <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1Z" fill="currentColor"/>
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-5 truncate">{chat.nombre}</p>
                  <p className="text-xs text-slate-500 leading-5 truncate">
                    {(chat as any).email ?? chat.ultimoMensaje ?? ""}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

    </aside>
  );
}
