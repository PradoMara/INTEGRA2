// ChatBubble.tsx
import type { Mensaje } from "@/features/DM/DM.Types/chat";

interface ChatBubbleProps {
  mensaje: Mensaje;
}

export function ChatBubble({ mensaje }: ChatBubbleProps) {
  const esPropio = mensaje.autor === "yo";
  const estado = (mensaje as any).estado as string | undefined;
  const imagen = (mensaje as any).imagenUrl ?? (mensaje as any).imgUrl ?? null;
  const wrapText = (text: string, max = 30) => {
    if (!text) return "";
    return text
      .split("\n")
      .map((line) => {
        if (line.length <= max) return line;
        const parts: string[] = [];
        for (let i = 0; i < line.length; i += max) {
          parts.push(line.slice(i, i + max));
        }
        return parts.join("\n");
      })
      .join("\n");
  };
  const displayText = wrapText(String(mensaje.texto ?? ""), 30);
  const renderEstado = () => {
    if (!estado) return null;
    let texto = "";
    let color = "";
    switch (estado) {
      case "enviando":
        texto = "⏳ Enviando...";
        color = "text-gray-400"; // CAMBIO: Más claro
        break;
      case "enviado":
        texto = "✔ Enviado";
        color = "text-gray-400"; // CAMBIO: Más claro
        break;
      case "recibido":
        texto = "✔✔ Recibido";
        color = "text-gray-400"; // CAMBIO: Más claro
        break;
      case "leido":
        texto = "✔✔ Leído";
        color = "text-blue-400 font-semibold"; // CAMBIO: Azul más claro
        break;
      case "error":
        texto = "⚠ Error";
        color = "text-red-400"; // CAMBIO: Más claro
        break;
      default:
        texto = estado;
        color = "text-gray-400"; // CAMBIO: Más claro
    }
    return <span className={`ml-2 text-xs ${color}`}>{texto}</span>;
  };

  return (
    <div className={`flex mb-3 ${esPropio ? "justify-end" : "justify-start"}`}>
      <div>
        <div
          className="px-4 py-3 rounded-xl text-sm shadow-md transform transition-all duration-150 ease-out flex items-start"
          style={{
            maxWidth: '68%',
            background: esPropio ? '#1F6FA3' : '#FFFFFF',
            color: esPropio ? '#FFFFFF' : '#0B2D52',
            border: esPropio ? 'none' : '1px solid rgba(11,45,82,0.06)',
            borderBottomRightRadius: esPropio ? 8 : 18,
            borderBottomLeftRadius: esPropio ? 18 : 8,
            boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
            whiteSpace: 'pre-wrap'
          }}
        >
          <div className="w-full flex items-center gap-3">
            {imagen ? (
              <img
                src={imagen}
                alt="miniatura"
                className="object-cover rounded-md flex-shrink-0"
                style={{ width: 64, height: 64 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : null}
            <div className={`flex-1 ${imagen ? "" : "text-left"}`} style={{ lineHeight: 1.35 }}>
              {displayText}
            </div>
          </div>
        </div>
        {esPropio && (
          <div className="flex justify-end mt-1 text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {renderEstado()}
          </div>
        )}
      </div>
    </div>
  );
}