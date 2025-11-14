// ChatHeader.tsx
import { motion } from 'framer-motion';
import type { Chat } from "@/types/chat";

export function ChatHeader({ chatActivo }: { chatActivo: Chat | null }) {
  return (
    <motion.header 
      className="h-[64px] bg-gradient-to-r from-blue-900 to-blue-800 flex items-center px-6 shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5Z" fill="currentColor"/>
            <path d="M4 20c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1Z" fill="currentColor"/>
          </svg>
        </motion.div>
        <div className="min-w-0">
          <div className="font-semibold text-white truncate text-base">
            {chatActivo?.nombre ?? "Nombre"}
          </div>
          <div className="text-xs text-blue-200 truncate flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {(chatActivo as any)?.email ?? "nombre@alu.uct.cl"}
          </div>
        </div>
      </div>
    </motion.header>
  );
}