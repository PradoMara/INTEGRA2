import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export function ChatInput({ onSend }: { onSend: (t: string, file?: File|null)=>Promise<void> }) {
  const [texto, setTexto] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const fileInputRef = useRef<HTMLInputElement|null>(null);
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  // panel emojis
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Emoticonos");
  const emojiPanelRef = useRef<HTMLDivElement|null>(null);
  const wrapperRef = useRef<HTMLDivElement|null>(null);

  // IME / composición
  const isComposingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!showEmoji) return;
      const target = e.target as Node | null;
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(target) && wrapperRef.current && !wrapperRef.current.contains(target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showEmoji]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isComposingRef.current) return;
    const isEnter = e.key === "Enter";
    const isSendShortcut = (e.ctrlKey || e.metaKey) && isEnter;
    const isShiftEnter = e.shiftKey && isEnter;
    if (isSendShortcut) {
      e.preventDefault();
      submit();
      return;
    }
    if (isEnter && !isShiftEnter) {
      e.preventDefault();
      submit();
    }
  };

  const handleCompositionStart = () => { isComposingRef.current = true; };
  const handleCompositionEnd = () => { isComposingRef.current = false; };

  // emojis por categoría (en español)
  const EMOJI_CATEGORIES: Record<string, string[]> = {
    "Emoticonos": ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😍","😘","😇","🤩","🙂","🤗","😎","😴","😡","🤔"],
    "Gestos": ["👍","👎","👏","🙌","🙏","🤝","✌️","🤟","👌","🤏","✋","👋","🤙","🤘"],
    "Personas": ["👨","👩","👧","👦","🧑‍🚀","🧑‍🍳","🧑‍💻","🧑‍🏫","👴","👵","👶","🧑‍🎓"],
    "Objetos": ["📷","📎","🔗","📌","🔔","💡","🔒","📁","🖨️","💳","🧾","📦"],
    "Símbolos": ["✅","❌","⚠️","✨","❤️","💔","🔥","⭐","📛","🔰","🔖"],
    "Comida": ["🍎","🍌","🍕","🍔","🍣","🍪","☕","🍩","🍰","🍫"],
    "Animales": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐷"]
  };

  const CATEGORIES = Object.keys(EMOJI_CATEGORIES);

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setTexto((t) => (t + emoji));
      return;
    }
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? start;
    const before = texto.slice(0, start);
    const after = texto.slice(end);
    const next = before + emoji + after;
    setTexto(next);
    requestAnimationFrame(() => {
      const pos = start + emoji.length;
      ta.focus();
      ta.selectionStart = ta.selectionEnd = pos;
    });
  };

  return (
    <footer className="w-full border-t border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div className="max-w-full mx-auto flex flex-col gap-2" ref={wrapperRef}>
        <div className="flex items-center gap-2 relative">
          <motion.button
            type="button"
            onClick={() => setShowEmoji(v => !v)}
            aria-expanded={showEmoji}
            aria-label="Abrir panel de emojis"
            className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            😊
          </motion.button>

          <AnimatePresence>
            {showEmoji && (
              <motion.div
                ref={emojiPanelRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 mb-3 w-96 max-h-72 overflow-hidden bg-white border border-gray-200 rounded-xl shadow-2xl z-50"
                role="dialog"
                aria-label="Selector de emojis por categoría"
              >
                <div className="flex flex-col h-full">
                  {/* categorías */}
                  <div className="flex gap-1 px-3 py-2 border-b overflow-x-auto bg-gradient-to-r from-blue-50 to-indigo-50">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                          activeCategory === cat 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md" 
                            : "hover:bg-white/80"
                        }`}
                        aria-pressed={activeCategory === cat}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* grid de emojis */}
                  <div className="p-3 overflow-auto">
                    <div className="flex justify-center">
                      <div className="inline-grid grid-cols-8 gap-2 justify-items-center">
                        {(EMOJI_CATEGORIES[activeCategory] || []).map((e) => (
                          <motion.button
                            key={e}
                            type="button"
                            onClick={() => { insertEmoji(e); }}
                            className="w-12 h-12 flex items-center justify-center text-2xl rounded-lg hover:bg-blue-50 transition-colors"
                            aria-label={`Emoji ${e}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {e}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* pie con categoría activa */}
                  <div className="px-3 py-2 border-t text-xs text-gray-600 bg-gray-50">
                    Categoría: <strong className="text-orange-600">{activeCategory}</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Escribe un mensaje..."
            rows={2}
            className="flex-1 resize-none rounded-2xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="Escribe un mensaje"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            aria-label="Adjuntar archivo"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => submit()}
            className="px-5 py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(90deg, #1F6FA3 0%, #0B3A66 100%)' }}
            disabled={!texto.trim() && !file}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar
          </motion.button>
        </div>

        <AnimatePresence>
          {preview && (
            <motion.div 
              className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <img src={preview} alt="preview" className="h-16 w-16 object-cover rounded-lg shadow-sm" />
              <span className="text-sm text-gray-700 flex-1">Imagen adjunta</span>
              <motion.button 
                onClick={cancelFile} 
                className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
