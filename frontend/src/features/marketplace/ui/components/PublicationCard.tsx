import type { Post as PostType } from "@/types/Post";
import React from "react";
import Card from "../../../../../public/components/Card";
import Button from "../../../../../public/components/Button";
import { formatCLP } from "../../utils/format";

/* Usamos una interfaz flexible con campos opcionales para evitar errores
   cuando el tipo externo no tiene exactamente las mismas propiedades */
interface Publication {
  id?: string | number;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: string | number;
  image?: string | null;
  author?: string;
  createdAt?: string | Date | null;
}

type PublicationCardProps = {
  publication: Publication;
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
  if (typeof d === "string") return d;
  try {
    return d.toLocaleDateString();
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
  const title = publication.title ?? "";
  const subtitle = publication.subtitle ?? "";
  const description = publication.description ?? "";
  const price = publication.price;
  const image = publication.image ?? undefined;
  const author = publication.author ?? "";
  const createdAt = publication.createdAt ?? null;

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
              {createdAt ? <div className="text-xs text-gray-400">{formatDate(createdAt)}</div> : null}
            </div>
          ) : null}
        </div>

        {description ? <div className="mt-3 text-sm text-gray-700 line-clamp-3">{description}</div> : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">{author ? `Por ${author}` : (createdAt ? formatDate(createdAt) : null)}</div>

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
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { Item } from "../../../../types/types";
import { formatCLP, formatInt, placeholder } from "@/features/marketplace/Marketplace.Utils/format";
import { RatingStars } from "../../../shared/ui/RatingStars";

export function PublicationCard({
  item,
  onClick,
}: {
  item: Item;
  onClick?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, title, author, buyNow, sellerSales, sellerRating, stock } = item;

  // Navegación por defecto a DetailPage si no se pasa onClick
  const navigateToDetail = () => {
    const publication = {
      id,
      title,
      price: buyNow,
      stock,
      seller: { name: author },
    };

    navigate(`/publications/${id}`, {
      state: {
        publication,
        // IMPORTANTE: no enviamos 'background' para evitar patrones de modal-routes
      },
      replace: false,
    });
  };

  // Click en contenedor: abre modal si el padre lo pasa; si no, navega a la página
  // Ignora clics que provienen del botón/enlace "Ver detalles"
  const handleCardClick: React.MouseEventHandler<HTMLElement> = (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("a[data-no-modal='true']")) {
      // Fue un clic en el Link "Ver detalles": no abrir modal ni duplicar acciones
      return;
    }
    if (onClick) {
      onClick(id);
    } else {
      navigateToDetail();
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onClick) onClick(id);
      else navigateToDetail();
    }
  };

  // State que enviamos al Link "Ver detalles"
  const publicationState = {
    publication: {
      id,
      title,
      price: buyNow,
      stock,
      seller: { name: author },
    },
  };

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-[0_6px_28px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${title}`}
      onKeyDown={onKeyDown}
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <div style={placeholder(id)} />
      </div>

      <div className="p-4 grid gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-base font-semibold leading-tight">{title}</h3>
        </div>

        {/* Stock + Precio */}
        <div className="grid grid-cols-2 gap-2">
          <div className="grid content-start gap-1">
            <span className="text-xs text-slate-500">Disponibilidad</span>
            <span
              className={[
                "inline-block rounded-full border text-[12px] font-bold px-2.5 py-0.5",
                stock === 0
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : stock <= 5
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300",
              ].join(" ")}
              aria-label={`Stock ${stock === 0 ? "agotado" : stock}`}
              title={stock === 0 ? "Agotado" : `${formatInt(stock)} disponibles`}
            >
              {stock === 0 ? "Agotado" : `${formatInt(stock)} disponibles`}
            </span>
          </div>

          <div className="grid">
            <span className="text-xs text-slate-500">Precio</span>
            <strong className="text-sm">{formatCLP(buyNow)}</strong>
          </div>
        </div>

        {/* Datos del vendedor */}
        <div className="flex items-center justify-between mt-1">
          <div className="inline-flex items-center gap-2">
            <div className="size-5 rounded-full bg-slate-200" />
            <span className="text-xs text-slate-500">{author}</span>
          </div>
          <div className="inline-flex items-center gap-2 text-xs text-slate-500">
            <RatingStars rating={sellerRating} />
            <span className="font-semibold text-slate-700">
              {sellerRating.toFixed(1)}
            </span>
            <span className="opacity-60">•</span>
            <span>{formatInt(sellerSales)} ventas</span>
          </div>
        </div>

        {/* Botón que SIEMPRE navega a la página completa de detalle */}
        <div className="mt-3">
          <Link
            to={`/publications/${id}`}
            state={publicationState}
            data-no-modal="true"
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={(e) => {
              // Evita que el click se propague y dispare el onClick del <article>
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClickCapture={(e) => e.stopPropagation()}
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </article>
  );
}