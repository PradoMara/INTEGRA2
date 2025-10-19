import { useState, useRef, useEffect } from "react";

export function ChatInput({ onSend }: { onSend: (t: string, file?: File|null)=>Promise<void> }) {
  const [texto, setTexto] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const submit = async () => {
    const t = texto.trim();
    if (!t && !file) return;
    await onSend(t, file);
    setTexto("");
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(f);
    if (f && f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const cancelFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Cambiado: KeyboardEvent para input; Enter envía el mensaje
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <footer className="w-full border-t bg-white/60 px-4 py-3">
      <div className="max-w-full mx-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 min-w-0 h-10 rounded-full border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
            title="Adjuntar archivo"
          >
            📎
          </button>
          <button
            onClick={submit}
            disabled={!texto.trim() && !file}
            className="ml-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>

        {file && (
          <div className="flex items-center gap-3 px-2">
            {preview ? (
              <img src={preview} alt="preview" className="h-16 w-16 object-cover rounded-md border" />
            ) : (
              <div className="h-16 w-16 rounded-md border grid place-items-center text-sm text-slate-600">
                {file.name}
              </div>
            )}
            <div className="flex-1 min-w-0 text-sm truncate">
              <div className="font-medium">{file.name}</div>
              <div className="text-xs text-slate-500">{(file.size/1024).toFixed(1)} KB</div>
            </div>
            <button
              onClick={cancelFile}
              className="inline-flex items-center justify-center rounded-md bg-red-100 px-2 py-1 text-sm text-red-700 hover:bg-red-200"
              title="Cancelar archivo"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
