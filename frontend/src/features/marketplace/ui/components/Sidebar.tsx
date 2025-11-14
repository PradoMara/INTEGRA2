import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import React from "react";
import logo from "../../../../assets/img/logouct.png"; // Se mantiene tu logo

export function Sidebar({ active = "marketplace" }: { active?: "marketplace" | "chats" }) {
return (
<aside className="relative bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700">
<div className="sticky top-0 h-dvh flex flex-col gap-4 p-4">
<motion.div 
  className="flex items-center gap-2.5 px-1 py-1.5"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
<motion.div 
  className="w-11 h-11 rounded-xl grid place-items-center bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg"
  whileHover={{ scale: 1.1, rotate: 360 }}
  transition={{ duration: 0.6 }}
>
<img
src={logo}
alt="Logo UCT"
className="max-w-[70%] max-h-[70%] object-contain"
loading="lazy"
decoding="async"
/>
</motion.div>
<strong className="font-extrabold text-white text-sm">MarketUCT</strong>
</motion.div>


<nav className="grid gap-2 mt-2">
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3, delay: 0.1 }}
>
<Link
to="/marketplace"
className={[
"flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold no-underline transition-all duration-200",
active === "marketplace"
? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
: "text-slate-300 hover:bg-slate-700/50 hover:text-white",
].join(" ")}
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
</svg>
<span>MarketPlace</span>
</Link>
</motion.div>
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3, delay: 0.2 }}
>
<Link
to="/chats"
className={[
"flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold no-underline transition-all duration-200",
active === "chats"
? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md"
: "text-slate-300 hover:bg-slate-700/50 hover:text-white",
].join(" ")}
>
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
</svg>
<span>Chats</span>
</Link>
</motion.div>
</nav>
</div>
</aside>
);
}

export default Sidebar;