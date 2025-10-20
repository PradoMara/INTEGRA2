import { Link } from "react-router-dom";
import React from "react";
import logo from "../../../../assets/img/logouct.png";

export function Sidebar({
  active = "marketplace",
  className = "",
}: {
  active?: "marketplace" | "chats" | "terminos" | "ayuda" | "crear";
  className?: string;
}) {
  return (
    // Parche alto completo: fondo del aside crece con la página, contenido sticky interno
    <aside className={`relative bg-gradient-to-br from-blue-50 to-gray-100 min-h-[100dvh] border-r ${className}`}>
      <div className="sticky top-0 min-h-[100dvh] flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="w-11 h-11 rounded-xl grid place-items-center bg-slate-50">
            <img
              src={logo}
              alt="Logo UCT"
              className="max-w-[70%] max-h-[70%] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <strong className="font-extrabold">MarketUCT</strong>
        </div>

        <nav role="navigation" className="grid gap-1.5">
          <Link
            to="/marketplace"
            className={[
              "px-3 py-2 rounded-xl font-semibold no-underline",
              active === "marketplace"
                ? "text-violet-600 bg-violet-50"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-600",
            ].join(" ")}
          >
            MarketPlace
          </Link>
          <Link
            to="/chats"
            className={[
              "px-3 py-2 rounded-xl font-semibold no-underline",
              active === "chats"
                ? "text-violet-600 bg-violet-50"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-600",
            ].join(" ")}
          >
            Chats
          </Link>
          <Link
            to="/terminos"
            className={[
              "px-3 py-2 rounded-xl font-semibold no-underline",
              active === "terminos"
                ? "text-violet-600 bg-violet-50"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-600",
            ].join(" ")}
          >
            Terminos y Condiciones
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;