import React from "react";
import type { Mensaje } from "@/types/chat";

interface ChatBubbleProps {
  mensaje: Mensaje;
}

export function ChatBubble({ mensaje }: ChatBubbleProps) {
  const esPropio = mensaje.autor === "yo";

  const renderEstado = () => {
    if (!mensaje.estado) return null;

    let texto = "";
    let color = "";

    switch (mensaje.estado) {
      case "enviando":
        texto = "⏳ Enviando...";
        color = "text-gray-400";
        break;
      case "enviado":
        texto = "✔ Enviado";
        color = "text-gray-500";
        break;
      case "recibido":
        texto = "✔✔ Recibido";
        color = "text-gray-400";
        break;
      case "leido":
        texto = "✔✔ Leído";
        color = "text-blue-500 font-semibold";
        break;
      default:
        return null;
    }

    return <span className={`ml-2 text-xs ${color}`}>{texto}</span>;
  };

  const containerJustify = esPropio ? "justify-end" : "justify-start";
  const bubbleBg = esPropio ? "bg-[#0075B4] text-white" : "bg-[#EDC500] text-black";
  const bubbleRadius = esPropio ? "rounded-br-none" : "rounded-bl-none";

  return (
    <div
      role="article"
      aria-label={esPropio ? "Mensaje propio" : `Mensaje de ${mensaje.autor ?? "usuario"}`}
      className={`w-full px-3 py-2 flex ${containerJustify}`}
    >
      <div className="mx-2 max-w-[85%]">
        <div
          className={`break-words inline-block px-4 py-2 rounded-lg shadow-sm text-sm leading-relaxed ${bubbleBg} ${bubbleRadius}`}
        >
          {mensaje.texto}
        </div>

        {esPropio ? (
          <div className="flex justify-end mt-1 text-xs">{renderEstado()}</div>
        ) : null}
      </div>
    </div>
  );
}