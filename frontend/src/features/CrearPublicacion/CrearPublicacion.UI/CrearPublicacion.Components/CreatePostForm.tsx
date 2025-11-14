import React, { useMemo, useState } from "react";
import { formatCLP } from "@/features/CrearPublicacion/CrearPublicacion.Utils/format";
import { LabeledInput, LabeledNumber, LabeledSelect, LabeledTextArea } from "./fields";
import { MultiImageUploader } from "./MultiImageUploader";
import { TagInput } from "./TagInput";

// FIX: Importamos el hook de categorías Y el tipo 'CategoryResponse'
import { useCategories, CategoryResponse } from "@/features/marketplace/Marketplace.Hooks/useCategories";
import { productService, CreateProductData } from "@/features/marketplace/Marketplace.Repositories/PostRepository";

// --- SIMULACIÓN DE AUTH (para tu "login tester") ---
const useAuth = () => {
  const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2MCwiZW1haWwiOiJwcnVlYmEudHNAYWx1LnVjdC5jbCIsInJvbGUiOiJDTElFTlRFIiwiaWF0IjoxNzYzMTI4ODExLCJleHAiOjE3NjM3MzM2MTF9.Lcobl70BYXYsD6PmAbeoOdALyQogL7xT6RRJATBtWmo"; // ❗️ Pega tu token aquí

  const updateUserRole = (newRole: string) => {
    console.log(`🎉 ¡ROL ACTUALIZADO EN LA SESIÓN (FRONTEND) A: ${newRole}!`);
    alert(`¡Felicidades! Tu rol ha sido actualizado a: ${newRole}`);
  };

  return { token: MOCK_TOKEN, updateUserRole };
};
// --- FIN DE SIMULACIÓN DE AUTH ---


const CAMPUS = ["San Juan Pablo II", "San Francisco"] as const;
const CONDICIONES = ["Nuevo", "Usado"] as const;

type Errors = Partial<Record<
  "titulo" | "precio" | "stock" | "descripcion" | "campus" | "categoriaId" | "condicion" | "imagenes" | "etiquetas",
  string
>>;

export function CreatePostForm() {
  const [descripcion, setDescripcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState<string>("");
  const [campus, setCampus] = useState<(typeof CAMPUS)[number]>(CAMPUS[0]);
  const [stock, setStock] = useState<string>("1"); 
  const [categoriaId, setCategoriaId] = useState<string>(""); 
  const [condicion, setCondicion] = useState<(typeof CONDICIONES)[number]>(CONDICIONES[0]);
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [etiquetas, setEtiquetas] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { token, updateUserRole } = useAuth();
  const { categories: categoryNames, isLoading: isLoadingCategories, data: categoriesData } = useCategories();

  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [{ label: "Cargando...", value: "" }];
    
    // FIX: Le damos el tipo 'CategoryResponse' a 'cat' para evitar el error 'any'
    const options = categoriesData.map((cat: CategoryResponse) => ({
      label: cat.nombre,
      value: String(cat.id) // FIX: Convertimos el 'id' (number) a 'string'
    }));
    
    return [{ label: "Selecciona una categoría...", value: "" }, ...options];
  }, [categoriesData]);


  const pricePreview = useMemo(() => formatCLP(Number(precio) || 0), [precio]);

  const validate = (): Errors => {
    const e: Errors = {};
    const p = Number(precio);
    const s = Number(stock);

    if (!titulo.trim()) e.titulo = "Ingresa un título";
    if (!precio.trim()) e.precio = "Ingresa un precio";
    else if (Number.isNaN(p) || p < 1) e.precio = "Precio debe ser al menos 1";

    if (!stock.trim()) e.stock = "Ingresa el stock";
    else if (!Number.isInteger(s) || s < 1) e.stock = "Stock debe ser al menos 1";
    
    if (!descripcion.trim() || descripcion.trim().length < 10)
      e.descripcion = "Describe el producto (mín. 10 caracteres)";

    if (descripcion.trim().length > 1500)
      e.descripcion = "La descripción es muy larga (máx. 1500 caracteres)";
    
    if (!categoriaId || Number(categoriaId) < 1) e.categoriaId = "Selecciona una categoría";

    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) {
      setFormError("Por favor, corrige los errores en el formulario.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateProductData = {
        nombre: titulo.trim(),
        descripcion: descripcion.trim(),
        precioActual: Number(precio),
        cantidad: Number(stock),
        categoriaId: Number(categoriaId),
      };

      const res = await productService.create(payload, token);

      if (res.ok && res.roleChanged && res.newRole) {
        updateUserRole(res.newRole); 
        setSuccessMsg(res.message); 
      } else {
        setSuccessMsg(res.message || "¡Publicación creada!");
      }

      setTitulo("");
      setDescripcion("");
      setPrecio("");
      setStock("1");
      setCategoriaId("");
      setCondicion(CONDICIONES[0]);
      setImagenes([]);
      setEtiquetas([]);

    } catch (err: any) {
      setFormError(err?.message || "Error inesperado. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form
        className="bg-slate-50 border border-gray-200 rounded-xl p-6 min-w-0"
        onSubmit={onSubmit}
        noValidate
        aria-busy={isSubmitting}
      >
        
        {formError && (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {formError}
          </div>
        )}
        {successMsg && (
          <div className="mb-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {successMsg}
          </div>
        )}

        <section className="grid gap-2 mb-5 rounded-xl p-4 border border-gray-200">
          <label className="text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <LabeledTextArea
              value={descripcion}
              onChange={setDescripcion}
              placeholder="Escribe una descripción detallada de tu producto..."
              rows={6}
              disabled={isSubmitting}
              error={errors.descripcion}
              maxLength={1000}
            />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end min-w-0">

            <div className="md:col-span-12">
                <LabeledInput
                  label="Título"
                  value={titulo}
                  onChange={setTitulo}
                  placeholder="Ej. Libro Cálculo I"
                  disabled={isSubmitting}
                  error={errors.titulo}
                  maxLength={100}
                />
            </div>

            <div className="md:col-span-12">
              <LabeledSelect
                label="Categoría"
                value={categoriaId} 
                onChange={(v) => setCategoriaId(String(v))} 
                options={categoryOptions} 
                className="w-full"
                disabled={isSubmitting || isLoadingCategories} 
                error={errors.categoriaId}
              />
            </div>

            <div className="md:col-span-12">
              <LabeledSelect
                label="Condición"
                value={condicion}
                onChange={(v) => setCondicion(v as any)}
                options={CONDICIONES.map((c) => ({ label: c, value: c }))}
                className="w-full"
                disabled={isSubmitting}
                error={errors.condicion}
              />
            </div>

            <div className="md:col-span-12">
              <TagInput
                label="Etiquetas (Opcional)"
                tags={etiquetas}
                onChange={setEtiquetas}
                disabled={isSubmitting}
                maxTags={10}
                placeholder="Ej: matemáticas, programación…"
                error={errors.etiquetas}
              />
            </div>

            <div className="md:col-span-12">
                <LabeledNumber
                  label="Precio"
                  value={precio}
                  onChange={setPrecio}
                  placeholder="Ej. 10000"
                  min={1} 
                  max={999_999_999}
                  step={1}
                  disabled={isSubmitting}
                  error={errors.precio}
                />
            </div>

            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-7">
                <LabeledSelect
                  label="Campus"
                  value={campus}
                  onChange={(v) => setCampus(v as any)}
                  options={CAMPUS.map((c) => ({ label: c, value: c }))}
                  className="w-full"
                  disabled={isSubmitting}
                  error={errors.campus}
                />
              </div>

              <div className="md:col-span-2">
                <LabeledNumber
                  label="Stock"
                  value={stock}
                  onChange={setStock}
                  placeholder="1"
                  min={1} 
                  max={10_000}
                  step={1}
                  disabled={isSubmitting}
                  error={errors.stock}
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  className="h-10 w-full rounded-lg px-4 border-2 border-violet-500 bg-violet-500 text-black opacity-90 font-medium hover:brightness-95 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publicando…" : "Publicar"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2.5 content-end min-w-0">
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-gray-200 mb-2 relative">
               {imagenes.length > 0 ? (
                <div className="flex gap-2 flex-wrap items-start p-2">
                  {imagenes.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <img
                        key={idx}
                        src={url}
                        alt={`Imagen ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center" />
              )}
            </div>
            
            <MultiImageUploader
              label={`Imágenes (máx 5)`}
              images={imagenes}
              onImagesChange={setImagenes}
              disabled={isSubmitting}
              maxImages={5}
            />
            {errors.imagenes && (
              <div className="text-xs text-rose-600 font-semibold mt-1">{errors.imagenes}</div>
            )}
          </div>
        </div>
      </form>

       {isSubmitting && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 backdrop-blur-sm">
          <div className="w-[min(400px,92vw)] rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mx-auto mb-3 size-10 rounded-full border-4 border-violet-500/30 border-t-violet-600 animate-spin" />
            <h3 className="text-lg font-bold">Enviando publicación…</h3>
            <p className="text-sm text-slate-500">No cierres esta ventana.</p>
          </div>
        </div>
      )}
    </div>
  );
}