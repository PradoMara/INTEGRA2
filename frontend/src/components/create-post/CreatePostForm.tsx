import React, { useMemo, useState } from "react";
import { formatCLP } from "../../utils/format";
import {
  LabeledInput,
  LabeledNumber,
  LabeledSelect,
  LabeledTextArea,
} from "./fields";
import { ImageUploader } from "./ImageUploader";

const CAMPUS = ["San Juan Pablo II", "San Francisco"] as const;

export function CreatePostForm() {
  // estado (visual por ahora)
  const [descripcion, setDescripcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState<string>("");
  const [campus, setCampus] = useState<(typeof CAMPUS)[number]>(CAMPUS[0]);
  const [stock, setStock] = useState<string>("");
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const pricePreview = useMemo(() => formatCLP(precio || 0), [precio]);

  const onImageFile = (file: File | null) => {
    if (!file) return setPreviewURL(null);
    const url = URL.createObjectURL(file);
    setPreviewURL((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Versión UI: conecta tu API para publicar 🙂");
  };

  return (
    <form
      className="bg-slate-50 border border-gray-200 rounded-xl p-4 min-w-0"
      onSubmit={onSubmit}
      noValidate
    >
      {/* Descripción */}
      <section className="grid gap-1.5 mb-5 rounded-xl p-4 border border-gray-200">
        <label className="text-sm font-semibold text-gray-700">Descripción</label>
        <LabeledTextArea
          value={descripcion}
          onChange={(v) => setDescripcion(v)}
          placeholder="Escribe una descripción detallada de tu producto..."
          rows={6}
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 min-w-0">
        {/* Columna izquierda */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end min-w-0">
          {/* Título */}
          <div className="md:col-span-12">
            <LabeledInput
              label="Título"
              value={titulo}
              onChange={(v) => setTitulo(v)}
              placeholder="Ej. Libro Cálculo I"
            />
          </div>

          {/* Precio */}
          <div className="md:col-span-12">
            <LabeledNumber
              label="Precio"
              value={precio}
              onChange={(v) => setPrecio(v)}
              placeholder="Ej. 10000"
              min={0}
              step={1}
            />
          </div>

          {/* Fila: Campus + Stock + Publicar (12 columnas) */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Campus */}
            <div className="md:col-span-7">
              <LabeledSelect
                label="Campus"
                value={campus}
                onChange={(v) => setCampus(v as any)}
                options={CAMPUS.map((c) => ({ label: c, value: c }))}
                className="w-full"
              />
            </div>

            {/* Stock */}
            <div className="md:col-span-2">
              <LabeledNumber
                label="Stock"
                value={stock}
                onChange={(v) => setStock(v)}
                placeholder="0"
                min={0}
                step={1}
              />
            </div>

            {/* Publicar */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="h-11 w-full rounded-full px-4 border-2 border-violet-500 bg-violet-500 text-white font-extrabold hover:brightness-95 active:scale-[0.99] transition"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha (vista previa) */}
        <div className="grid gap-2.5 content-end min-w-0">
          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-200">
            {previewURL ? (
              <img src={previewURL} alt="Vista previa" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-lime-200" />
            )}
          </div>

          <div className="flex items-center justify-between text-gray-500 text-xs px-0.5">
            <span className="font-semibold text-gray-700">Vista Previa</span>
            <span className="font-extrabold text-gray-900">{precio ? pricePreview : ""}</span>
          </div>

          <ImageUploader label="Imagen" onFile={onImageFile} />
        </div>
      </div>
    </form>
  );
}
