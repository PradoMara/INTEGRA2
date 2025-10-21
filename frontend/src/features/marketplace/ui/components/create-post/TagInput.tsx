import React, { useRef, useState } from "react";

type TagInputProps = {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
  placeholder?: string;
  error?: string;
};

export function TagInput({
  label = "Etiquetas",
  tags,
  onChange,
  disabled,
  maxTags = 10,
  placeholder = "Escribe y presiona Enter…",
  error,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const newTag = raw.trim();
    if (
      !newTag ||
      tags.includes(newTag) ||
      (maxTags && tags.length >= maxTags) ||
      newTag.length > 32
    )
      return;
    onChange([...tags, newTag]);
    setInput("");
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" ||
      e.key === "," ||
      e.key === "Tab"
    ) {
      e.preventDefault();
      if (input) addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      // Si el input está vacío y presionas backspace, elimina el último tag
      removeTag(tags.length - 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",")) {
      e.preventDefault();
      pasted.split(",").map(s => s.trim()).forEach(addTag);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
      <div
        className={[
          "flex flex-wrap gap-1 rounded-lg border bg-white px-2 py-1 min-h-[40px] focus-within:border-violet-400",
          error ? "border-rose-400" : "border-gray-200"
        ].join(" ")}
      >
        {tags.map((tag, idx) => (
          <span
            key={tag + idx}
            className="flex items-center bg-violet-100 text-violet-800 rounded px-2 py-0.5 text-xs font-semibold gap-1"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-violet-700 hover:text-rose-600 font-bold px-1 focus:outline-none"
              onClick={() => removeTag(idx)}
              disabled={disabled}
              aria-label={`Eliminar etiqueta ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onInputKeyDown}
          onPaste={onPaste}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] border-none outline-none bg-transparent text-sm py-1"
          disabled={disabled || (maxTags && tags.length >= maxTags)}
          maxLength={32}
        />
      </div>
      {error && (
        <div className="text-xs text-rose-600 font-semibold mt-1">{error}</div>
      )}
    </div>
  );
}