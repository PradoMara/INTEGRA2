// ChatList.tsx
import { motion } from 'framer-motion';
import type { Chat } from "../types/chat";

export function ChatList({
  chats,
  onSelectChat,
  chatActivo,
}: { chats: Chat[]; onSelectChat: (id:number)=>void; chatActivo: number|null }) {
  if (!chats || chats.length === 0) {
    return (
      <aside className="h-full w-full min-w-0 flex flex-col bg-[#FFC400] text-[#0B2D52]">
        <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-medium">No hay conversaciones</p>
          </div>
        </div>
      </aside>
    );
  }
  return (
    <aside className="h-full w-full min-w-0 flex flex-col bg-[#FFC400] text-[#0B2D52]">
      <ul className="min-h-0 overflow-y-auto overflow-x-hidden">
        {chats.map((chat, index) => {
          const active = chatActivo === chat.id;
          return (
            <motion.li
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              role="button"
              tabIndex={0}
              aria-selected={active}
              className={`group cursor-pointer px-4 py-3 border-b border-gray-200/30 transition-all duration-200 ease-in-out
                ${active ? "bg-white/20 border-l-4 border-l-[#0B3A66]" : "bg-transparent hover:bg-white/10"}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3A66]`}
              onClick={() => onSelectChat(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectChat(chat.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full grid place-items-center shrink-0 transition-all duration-200
                                 ${active 
                                  ? "bg-white shadow-md" 
                                  : "bg-white/90 group-hover:bg-white shadow-sm"}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={active ? "text-[#0B3A66]" : "text-[#0B2D52]"}>
                    <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Z" fill="currentColor"/>
                    <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold leading-5 truncate transition-colors ${active ? "text-gray-900" : "text-[#0B2D52] group-hover:text-gray-900"}`}>
                    {chat.nombre}
                  </p>
                  <p className="text-xs text-[#0B2D52]/80 leading-5 truncate">
                    {chat.ultimoMensaje ?? ""}
                  </p>
                </div>
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-orange-500"
                  />
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </aside>
  );
}