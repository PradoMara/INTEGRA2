// ChatBubble.tsx
import { motion } from 'framer-motion';
import type { Mensaje } from "@/types/chat";

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
        texto = "⏳";
        color = "text-gray-400";
        break;
      case "enviado":
        texto = "✔";
        color = "text-gray-400";
        break;
      case "recibido":
        texto = "✔✔";
        color = "text-gray-400";
        break;
      case "leido":
        texto = "✔✔";
        color = "text-blue-500 font-semibold";
        break;
      case "error":
        texto = "⚠";
        color = "text-red-500";
        break;
      default:
        texto = estado;
        color = "text-gray-400";
    }
    return <span className={`ml-1 text-xs ${color}`}>{texto}</span>;
  };

  return (
    <motion.div 
      className={`flex mb-3 ${esPropio ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <motion.div
          className={`px-4 py-3 rounded-xl text-sm shadow-md`}
          style={{
            maxWidth: '68%',
            background: esPropio ? '#1F6FA3' : '#FFFFFF',
            color: esPropio ? '#FFFFFF' : '#0B2D52',
            border: esPropio ? 'none' : '1px solid rgba(11,45,82,0.06)',
            borderBottomRightRadius: esPropio ? 6 : 18,
            borderBottomLeftRadius: esPropio ? 18 : 6
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{ whiteSpace: "pre-wrap" as const }}
        >
          <div className="w-full flex items-center gap-3">
            {imagen ? (
              <img
                src={imagen}
                alt="miniatura"
                className="h-16 w-16 object-cover rounded-lg flex-shrink-0 shadow-sm"
                style={{ width: 64, height: 64 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : null}
            <div className={`flex-1 ${imagen ? "" : "text-left"}`} style={{ lineHeight: 1.4 }}>
              {displayText}
            </div>
          </div>
        </motion.div>
        {esPropio && (
          <div className="flex justify-end mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              {mensaje.hora && <span>{mensaje.hora}</span>}
              {renderEstado()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}