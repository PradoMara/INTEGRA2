import React, { useState, useRef } from "react";
import { useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import MyPublicationsFeed from "./components/MyPublicationsFeed";
import UserDefault from "../../../assets/img/user_default.png";

const MyPublicationsFeedAny = MyPublicationsFeed as any;

type Review = {
  id: string;
  author: string;
  rating: number;
};

type Publication = {
  id: string;
  title: string;
  price: number;
  status: "Disponible" | "Agotado";
  imageUrl?: string;
};

function StarRating({ value = 0, size = 18 }: { value?: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const total = 5;

  return (
    <div className="inline-flex items-center gap-1" aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const fill = i < full ? "currentColor" : i === full && half ? "url(#half)" : "none";
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="text-amber-500 flex-shrink-0">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill={fill} stroke="currentColor" strokeWidth="1" />
          </svg>
        );
      })}
    </div>
  );
}

export default function PerfilPage() {
  const user = {
    name: "Nombre",
    email: "nombre@alu.uct.cl",
    campus: "Campus San Juan Pablo II",
    rating: 4.5,
  };

  const reviews: Review[] = [
    { id: "r1", author: "Usuario", rating: 4.5 },
    { id: "r2", author: "Usuario", rating: 5 },
    { id: "r3", author: "Usuario", rating: 4 },
    { id: "r4", author: "Usuario", rating: 4.5 },
    { id: "r5", author: "Usuario", rating: 5 },
    { id: "r6", author: "Usuario", rating: 3.5 },
  ];

  const publications: Publication[] = [
    { id: "p1", title: "Publicación", price: 8900, status: "Disponible" },
    { id: "p2", title: "Publicación", price: 5900, status: "Disponible" },
    { id: "p3", title: "Publicación", price: 12900, status: "Agotado" },
  ];

  // Estado para el carrusel de valoraciones
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    // Desplazar el ancho completo del contenedor para mostrar las siguientes tarjetas
    const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleScrollUpdate = () => {
    if (!scrollContainerRef.current) return;
    setScrollPosition(scrollContainerRef.current.scrollLeft);
  };

  const canScrollLeft = scrollPosition > 10;
  const canScrollRight = scrollContainerRef.current 
    ? scrollPosition < (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10)
    : reviews.length > 3;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr]">
      <Sidebar />

      <div className="min-w-0">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-5 min-w-0">
              <img 
                src={UserDefault} 
                alt={user.name} 
                className="h-20 w-20 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-gray-900 truncate">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating value={user.rating} />
                  <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{user.email}</p>
                <p className="text-sm text-gray-600 truncate">{user.campus}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Carrusel de Valoraciones */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Valoraciones</h2>
            <div className="relative px-12">
              {/* Flecha Izquierda - Fuera del contenedor */}
              {canScrollLeft && (
                <button
                  onClick={() => handleScroll('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-blue-500 shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                  aria-label="Ver valoraciones anteriores"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {/* Contenedor del Carrusel - Grid de 3 columnas */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScrollUpdate}
                className="grid auto-cols-[calc(33.333%-0.67rem)] grid-flow-col gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {reviews.map((r, index) => (
                  <div
                    key={r.id}
                    className="bg-white border rounded-xl p-4 flex items-center gap-3 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 ease-out"
                    style={{
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{r.author}</p>
                      <StarRating value={r.rating} size={16} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Flecha Derecha - Fuera del contenedor */}
              {canScrollRight && (
                <button
                  onClick={() => handleScroll('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-blue-500 shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                  aria-label="Ver más valoraciones"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tus Publicaciones</h2>
            <MyPublicationsFeedAny publications={publications} />
          </section>
        </main>
      </div>
    </div>
  );
}
