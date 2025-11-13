import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";

// 🛑 SOLUCIÓN 1: Importar el tipo canónico Post (Producto) y utilidades de formato
import type { Post } from '../../Marketplace.Types/ProductInterfaces';
import { formatCLP, formatInt } from '../../Marketplace.Utils/format'; 

// 🛑 SOLUCIÓN 2: El componente DEBE recibir el objeto 'post' completo
export type ItemCardProps = {
  post: Post; // Aceptamos el objeto Post real
};

export default function ItemCard({ post }: ItemCardProps) {
  
  // 🛑 SOLUCIÓN 3: Desestructurar las propiedades necesarias del objeto 'post'
  const {
    id, title, description, image, price, categoryName,
    author, avatar, calificacion, cantidad,
    fechaAgregado,
    vendedor // Propiedad compleja de la API
  } = post;
  
  // Adaptar y formatear campos de la API
  const finalRating = calificacion || 0; 
  const authorName = author || vendedor?.nombre; 
  const priceDisplay = formatCLP(parseFloat(String(price)) || 0); 
  const stockDisplay = formatInt(Number(cantidad));
  
  // Formatear la fecha
  const timeDisplay = fechaAgregado ? new Date(fechaAgregado).toLocaleDateString() : 'hace poco';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full">
 {image && (
        <div className="relative aspect-video w-full">
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
            {categoryName && (
                <div className="absolute top-3 left-3">
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/95 text-gray-800 font-medium shadow-sm">
                        {categoryName}
                    </span>
                </div>
            )}
        </div>
    )}

    <div className="p-4 md:p-5">
        {/* Añadir el precio junto al título en el cuerpo */}
        <div className="flex justify-between items-start">
             <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">{title}</h3>
             {price && (
                 <span className="text-lg md:text-xl font-bold text-green-600 ml-4 whitespace-nowrap">{priceDisplay}</span>
             )}
        </div>
        
        <div className="flex items-center mb-3 md:mb-4">
          {avatar && <img src={avatar} alt={authorName} className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 border-2 border-gray-100" />}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">{authorName}</h4>
            {timeDisplay && <p className="text-xs text-gray-500">{timeDisplay}</p>}
          </div>
        </div>

        {description && (
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <RatingStars rating={finalRating} />
              <span className="font-semibold text-gray-700">{Number(finalRating || 0).toFixed(1)}</span>
            </span>
            {typeof cantidad !== "undefined" && (
              <>
                <span className="opacity-60">•</span>
                <span>{stockDisplay} stock </span> 
              </>
            )}
          </div>
            <Link 
             to={`/publications/${id}`}
             state={{ publication: { id, title, description, price, images: image ? [image] : undefined, stock, seller: { name: author, avatarUrl: avatar }, categoryName } }}
             className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Ver detalle
          </Link> 
        </div>
      </div>
    </div>
  );
}