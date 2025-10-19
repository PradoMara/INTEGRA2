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
    }

    return <span className={`ml-2 text-xs ${color}`}>{texto}</span>;
  };

  // Cambiado: contenedor flex w-full con justify-start/justify-end para alinear correctamente
  return (
    <div className={`w-full px-3 py-2 flex ${esPropio ? "justify-end" : "justify-start"}`}>
      <div className="mx-2 max-w-[80%]">
        <div
          className={`w-fit px-4 py-2 rounded-lg shadow text-sm ${
            esPropio
              ? "bg-[#0075B4] text-white rounded-br-none"
              : "bg-[#EDC500] text-black rounded-bl-none"
          }`}
        >
          {mensaje.texto}
        </div>
        {esPropio ? (
          <div className="flex justify-end mt-1 text-xs">{renderEstado()}</div>
        ) : (
          // para mensajes ajenos dejamos el texto de estado oculto (o puedes mostrar uno distinto)
          null
        )}
      </div>
    </div>
  );
}