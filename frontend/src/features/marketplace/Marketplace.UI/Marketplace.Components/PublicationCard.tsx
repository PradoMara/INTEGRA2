import type { Post } from "@/features/marketplace/Marketplace.Types/ProductInterfaces"; // FIX: Importamos el tipo 'Post'
import React from "react";
import Card from "../../../../../public/components/Card";
import Button from "../../../../../public/components/Button";
import { formatCLP } from '../../Marketplace.Utils/format';

// FIX: Eliminamos la interfaz local 'Publication' que estaba incorrecta

type PublicationCardProps = {
  publication: Post; // FIX: Usamos la interfaz 'Post'
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
};

function formatPrice(value?: string | number) {
  if (value === undefined || value === null) return "";
  const numValue = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numValue)) return String(value);
  return formatCLP(numValue);
}

function formatDate(d?: string | Date | null) {
  if (!d) return "";
  // FIX: El formato de fecha del JSON es un string, lo convertimos a Fecha
  try {
    const date = new Date(d);
    return date.toLocaleDateString("es-CL", { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return String(d);
  }
}

export default function PublicationCard({
  publication,
  onView,
  onEdit,
  onDelete,
  className = "",
}: PublicationCardProps) {
  
  // FIX: Mapeamos las propiedades correctas desde 'publication' (que ahora es de tipo 'Post')
  const title = publication.nombre ?? "";
  const subtitle = publication.vendedor?.nombre ? `Por ${publication.vendedor.nombre}` : ""; // Mostramos al vendedor como subtítulo
  const description = publication.descripcion ?? "";
  const price = publication.precioActual; // Usamos el precio actual
  const image = publication.imagenes?.[0]?.url ?? undefined; // Usamos la primera imagen del array
  const createdAt = publication.fechaAgregado ?? null;

  return (
    <Card className={`transition hover:shadow-md ${className}`} imageSrc={image} imageAlt={title || "publicación"}>
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate leading-tight">{title}</h3>
            {subtitle ? <p className="mt-1 text-xs text-gray-500 truncate">{subtitle}</p> : null}
          </div>

          {price !== undefined ? (
            <div className="flex-shrink-0 text-right ml-3">
              <div className="text-sm font-semibold text-gray-900">{formatPrice(price)}</div>
              {/* FIX: Mostramos la fecha del post, no la del autor */
                createdAt ? <div className="text-xs text-gray-400">{formatDate(createdAt)}</div> : null
              }
            </div>
          ) : null}
        </div>

        {description ? <div className="mt-3 text-sm text-gray-700 line-clamp-3">{description}</div> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          {/* FIX: El autor ya está en el subtítulo, no necesitamos mostrarlo aquí */ }
          <div className="text-xs text-gray-500">{/* Espacio vacío o puedes poner la categoría */}</div>

          <div className="ml-auto flex items-center gap-2">
            {onView && <Button type="button" className="inline-flex items-center h-8 px-3 text-sm" onClick={onView}>Ver</Button>}
            {onEdit && <Button type="button" className="inline-flex items-center h-8 px-3 text-sm" onClick={onEdit}>Editar</Button>}
            {onDelete && <Button type="button" className="inline-flex items-center h-8 px-3 text-sm text-rose-600" onClick={onDelete}>Eliminar</Button>}
          </div>
        </div>
      </div>
    </Card>
  );
}