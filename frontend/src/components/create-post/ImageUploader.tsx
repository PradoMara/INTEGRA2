import React from "react";

export function ImageUploader({ label = "Imagen", onFile }: { label?: string; onFile: (file: File | null) => void }) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFile(file);
  };

  return (
    <label className="inline-grid place-items-center h-9 rounded-xl border border-gray-200 bg-white font-bold cursor-pointer select-none px-3">
      <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
      {label}
    </label>
  );
}
