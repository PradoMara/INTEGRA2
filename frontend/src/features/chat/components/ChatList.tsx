import type { Chat } from "../types/chat";

export function ChatList({
  chats,
  onSelectChat,
  chatActivo,
}: { chats: Chat[]; onSelectChat: (id:number)=>void; chatActivo: number|null }) {
  if (!chats || chats.length === 0) {
    return (
      <aside className="h-full w-full min-w-0 flex flex-col bg-transparent">
        <div className="flex flex-1 items-center justify-center text-slate-500">
          No hay conversaciones
        </div>
      </aside>
    );
  }
  return (
    <aside className="h-full w-full min-w-0 flex flex-col bg-transparent">
      <ul className="min-h-0 overflow-y-auto overflow-x-hidden">
        {chats.map((chat) => {
          const active = chatActivo === chat.id;
          return (
            <li
              key={chat.id}
              role="button"
              tabIndex={0}
              aria-selected={active}
              // estilos: transición, hover acorde a paleta, foco accesible y acento lateral al estar activo
              className={`group cursor-pointer px-4 py-3 border-b transition-colors duration-150 ease-in-out transform-gpu
                ${active ? "bg-yellow-50 border-l-4 border-yellow-400" : "bg-transparent hover:bg-yellow-50/40"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300`}
              onClick={() => onSelectChat(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectChat(chat.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 grid place-items-center text-gray-400 shrink-0
                                transition-colors duration-150 ease-in-out group-hover:bg-yellow-100">
                  {/* avatar */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Z" fill="currentColor"/>
                    <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold leading-5 truncate ${active ? "text-slate-900" : "text-slate-800"}`}>{chat.nombre}</p>
                  <p className="text-xs text-slate-500 leading-5 truncate">
                    {chat.ultimoMensaje ?? ""}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  );
}