import React, { useRef } from "react"
import { Sidebar } from "@/features/shared/ui/Sidebar"
import MyPublicationsFeed from "./Perfil.Components/PublicationsFeed"
import UserDefault from "@/assets/img/user_default.png"
import { LuMapPin, LuPhone, LuUser, LuMail } from "react-icons/lu"

// Tipos
interface Review {
  id: string
  author: string
  rating: number
}

interface Publication {
  id: string
  title: string
  price: number
  status: string
}

interface UserProfile {
  id: number
  correo: string
  usuario: string
  nombre: string
  apellido: string | null
  role: string
  campus: string | null
  reputacion: string | number
  telefono?: string
  direccion?: string
  resumen?: {
    totalVentas: number
    totalProductos: number
  }
}

// --- Componente StarRating ---
function StarRating({ value = 0, size = 18 }: { value?: number; size?: number }) {
  const rating = Number(value) || 0
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const total = 5

  return (
    <div className="inline-flex items-center gap-1" aria-hidden>
      {Array.from({ length: total }).map((_, i) => {
        const fill = i < full ? "currentColor" : i === full && half ? "url(#half)" : "none"
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="text-amber-500 flex-shrink-0">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z"
              fill={fill}
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        )
      })}
    </div>
  )
}

// --- Componente Principal ---
export default function PerfilPage() {
  const user = {
    name: "Nombre",
    email: "nombre@alu.uct.cl",
    campus: "Campus San Juan Pablo II",
    rating: 4.5,
  }

  const reviews: Review[] = [
    { id: "r1", author: "Usuario", rating: 4.5 },
    { id: "r2", author: "Usuario", rating: 5 },
    { id: "r3", author: "Usuario", rating: 4 },
    { id: "r4", author: "Usuario", rating: 4.5 },
    { id: "r5", author: "Usuario", rating: 5 },
    { id: "r6", author: "Usuario", rating: 3.5 },
  ]

  const publications: Publication[] = [
    { id: "p1", title: "Publicación", price: 8900, status: "Disponible" },
    { id: "p2", title: "Publicación", price: 5900, status: "Disponible" },
    { id: "p3", title: "Publicación", price: 12900, status: "Agotado" },
  ]

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr]">
      <Sidebar />

      <div className="min-w-0 flex flex-col h-screen">
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full bg-gradient-to-br from-blue-100 to-white scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* PERFIL */}
          <section className="flex flex-col items-center gap-4 pt-4 pb-8">
            <img
              src={UserDefault}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <StarRating value={user.rating} />
                <span className="text-sm text-gray-700 font-medium">{user.rating.toFixed(1)}</span>
              </div>
              <p className="text-base text-gray-600 mt-2">{user.email}</p>
              <p className="text-base text-gray-600">{user.campus}</p>
            </div>
          </section>

          {/* VALORACIONES */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Valoraciones Recientes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
                    {r.author.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.author}</p>
                    <StarRating value={r.rating} size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PUBLICACIONES */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Tus Publicaciones</h2>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-h-[200px]">
              <MyPublicationsFeed />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
