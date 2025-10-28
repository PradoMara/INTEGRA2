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