// ChatList.tsx
import type { Chat } from "@/features/DM/DM.Types/chat";

export function ChatList({
  chats,
  onSelectChat,
  chatActivo,
}: { chats: Chat[]; onSelectChat: (id:number)=>void; chatActivo: number|null }) {
  if (!chats || chats.length === 0) {
    return (
      <aside className="h-full w-full min-w-0 flex flex-col bg-[#FFC400] text-[#0B2D52]">
        <div className="flex flex-1 items-center justify-center text-black opacity-75">
          No hay conversaciones
        </div>
      </aside>
    );
  }
  return (
    <aside className="h-full w-full min-w-0 flex flex-col bg-[#FFC400] text-[#0B2D52]">
      <ul className="min-h-0 overflow-y-auto overflow-x-hidden">
        {chats.map((chat) => {
          const active = chatActivo === chat.id;
          return (
            <li
              key={chat.id}
              role="button"
              tabIndex={0}
              aria-selected={active}
              className={`group cursor-pointer px-4 py-3 border-b border-yellow-600/20 transition-colors duration-150 ease-in-out
                ${active ? "bg-white/10" : "bg-transparent hover:bg-white/5"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3A66]/30`}
              onClick={() => onSelectChat(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectChat(chat.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white grid place-items-center text-[#0B2D52] shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Z" fill="currentColor"/>
                    <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold leading-5 truncate ${active ? 'text-[#0B3A66]' : 'text-[#0B2D52]'}`}>{chat.nombre}</p>
                  <p className="text-xs text-[#0B2D52]/80 leading-5 truncate">
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