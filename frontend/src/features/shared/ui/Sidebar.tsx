import { Link } from "react-router-dom";
import React from "react";
import logo from "@/assets/img/logouct.png";

export function Sidebar({
  active = "marketplace",
  className = "",
}: {
  active?: "marketplace" | "chats" | "terminos" | "ayuda" | "crear" | "foro";
  className?: string;
}) {
  return (
    <aside className={`relative bg-yellow-400 min-h-[100dvh] ${className}`}>
      <div className="sticky top-0 min-h-[100dvh] flex flex-col gap-4 p-4">

        {/* Logo + Título */}
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <div className="w-11 h-11 rounded-xl grid place-items-center">
            <img
              src={logo}
              alt="Logo UCT"
              className="max-w-[70%] max-h-[70%] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <strong className="font-extrabold text-black text-xl">MarketUCT</strong>
        </div>

        {/* Navegación */}
        <nav role="navigation" className="grid gap-1.5">

          <Link
            to="/marketplace"
            className={[
              "px-3 py-2 rounded-xl no-underline text-white",
              active === "marketplace"
                ? "font-extrabold"
                : "font-medium hover:bg-yellow-500",
            ].join(" ")}
          >
            MarketPlace
          </Link>

          <Link
            to="/chats"
            className={[
              "px-3 py-2 rounded-xl no-underline text-white",
              active === "chats"
                ? "font-extrabold"
                : "font-medium hover:bg-yellow-500",
            ].join(" ")}
          >
            Chats
          </Link>

          <Link
            to="/terminos"
            className={[
              "px-3 py-2 rounded-xl no-underline text-white",
              active === "terminos"
                ? "font-extrabold"
                : "font-medium hover:bg-yellow-500",
            ].join(" ")}
          >
            Términos y Condiciones
          </Link>

          <Link
            to="/foro"
            className={[
              "px-3 py-2 rounded-xl no-underline text-white",
              active === "foro"
                ? "font-extrabold"
                : "font-medium hover:bg-yellow-500",
            ].join(" ")}
          >
            Foro
          </Link>
        </nav>

        {/* Cerrar sesión */}
        <div className="mt-auto">
          <button
            onClick={() => {
              console.log("Cerrando sesión...");
            }}
            className="px-3 py-2 rounded-xl font-medium text-white no-underline bg-red-500 hover:bg-yellow-500 w-full text-left"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
