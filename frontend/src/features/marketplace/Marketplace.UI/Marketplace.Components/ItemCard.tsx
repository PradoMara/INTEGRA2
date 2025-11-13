import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";

// 🛑 SOLUCIÓN: IMPORTAR formatCLP y formatInt
import { formatCLP, formatInt } from '../../Marketplace.Utils/format';

// Importar el tipo canónico Post
import type { Post } from '../../Marketplace.Types/ProductInterfaces';

// El componente debe recibir el objeto 'post' completo
export type ItemCardProps = {
  post: Post; // Ahora ItemCard acepta el objeto Post real
};

export default function ItemCard({ post }: ItemCardProps) {
  // Desestructurar las propiedades necesarias del objeto 'post'
  const {
    id, title, description, image, price, categoryName,
    avatar, calificacion, cantidad,
    vendedor // Usamos el objeto vendedor para obtener el nombre completo si es necesario
  } = post;
  
  // Adaptar campos de la API al componente
  const finalRating = post.calificacion || 0; 
  const authorName = post.author || post.vendedor?.nombre; 
  // ✅ Usar formatCLP, que ahora está importado.
  const priceDisplay = formatCLP(parseFloat(String(price)) || 0); 
  
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
            {post.fechaAgregado && <p className="text-xs text-gray-500">{new Date(post.fechaAgregado).toLocaleDateString()}</p>}
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
            {typeof post.cantidad !== "undefined" && (
              <>
                <span className="opacity-60">•</span>
                {/* ✅ Usar formatInt, que ahora está importado. */}
                <span>{formatInt(Number(post.cantidad))} stock </span> 
              </>
            )}
          </div>
            <Link 
             to={`/producto/${id}`} 
             className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Ver detalle
          </Link> 
        </div>
      </div>
    </div>
  );
}