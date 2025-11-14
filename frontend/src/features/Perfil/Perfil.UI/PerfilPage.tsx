import React, { useState, useRef, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/app/context/AuthContext" // Ajusta la ruta si es necesario
import { Sidebar } from "@/features/shared/ui/Sidebar"
import MyPublicationsFeed from "./Perfil.Components/PublicationsFeed"
import UserDefault from "@/assets/img/user_default.png"

// Iconos para editar/guardar
import { LuPencil, LuSave, LuX, LuLoader, LuMapPin, LuPhone, LuUser, LuMail } from "react-icons/lu"

// Tipos
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

interface UpdateProfileData {
  usuario: string
  apellido: string
  campus: string
}

// --- Funciones de API ---
const fetchProfile = async (token: string | null): Promise<UserProfile> => {
  if (!token) throw new Error("No token")
  const res = await fetch("/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al cargar perfil")
  const data = await res.json()
  return data.data
}

const updateProfile = async (data: UpdateProfileData, token: string | null) => {
  if (!token) throw new Error("No token")
  const res = await fetch("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Error al actualizar")
  return result.user
}

// --- Componente StarRating (Sin cambios) ---
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
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill={fill} stroke="currentColor" strokeWidth="1" />
          </svg>
        )
      })}
    </div>
  )
}

// --- Componente Principal ---
export default function PerfilPage() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Estado de Edición
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateProfileData>({
    usuario: "",
    apellido: "",
    campus: "",
  })

  // 1. Cargar datos del perfil
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchProfile(token),
    enabled: !!token,
  })

  // 2. Sincronizar formulario cuando llegan los datos
  useEffect(() => {
    if (user) {
      setFormData({
        usuario: user.usuario || "",
        apellido: user.apellido || "",
        campus: user.campus || "Campus San Juan Pablo II",
      })
    }
  }, [user])

  // 3. Mutación para actualizar
  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      setIsEditing(false)
      alert("Perfil actualizado correctamente")
    },
    onError: (err) => alert(err.message),
  })

  const handleSave = () => {
    saveProfile(formData)
  }

  const handleCancel = () => {
    if (user) {
      // Revertir cambios
      setFormData({
        usuario: user.usuario || "",
        apellido: user.apellido || "",
        campus: user.campus || "",
      })
    }
    setIsEditing(false)
  }

  // Mock data para las secciones que aún no tienen API dedicada en este contexto
  const reviews = [
    { id: "r1", author: "Estudiante1", rating: 5 },
    { id: "r2", author: "Comprador2", rating: 4 },
  ]
  // Nota: Para publicaciones reales, deberías conectar el fetchMyPublications aquí también

  if (isLoading) return <div className="flex h-screen items-center justify-center"><LuLoader className="animate-spin h-10 w-10 text-blue-600" /></div>
  if (error) return <div className="p-10 text-center text-red-600">Error al cargar perfil</div>
  if (!user) return null

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar active="marketplace" className="hidden md:flex w-64" />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 w-full bg-gradient-to-br from-blue-50 to-white scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* --- TARJETA DE PERFIL --- */}
            <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 relative transition-all duration-300 hover:shadow-xl">
              
              {/* Botón de Editar (Top Right) */}
              <div className="absolute top-6 right-6 z-10">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <LuPencil size={16} /> Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <LuX size={16} /> Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? <LuLoader className="animate-spin" /> : <LuSave size={16} />}
                      Guardar
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={UserDefault}
                    alt={user.nombre}
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                </div>

                {/* Info de Usuario */}
                <div className="flex-1 text-center md:text-left w-full space-y-4">
                  
                  {/* Encabezado Editable: Usuario y Rating */}
                  <div>
                    {isEditing ? (
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre de Usuario</label>
                        <input
                          type="text"
                          value={formData.usuario}
                          onChange={(e) => setFormData({...formData, usuario: e.target.value})}
                          className="w-full md:w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xl"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900">{user.usuario}</h1>
                    )}
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                      <StarRating value={Number(user.reputacion)} />
                      <span className="text-sm text-gray-700 font-medium">
                        {Number(user.reputacion).toFixed(1)} / 5.0
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({user.role})
                      </span>
                    </div>
                  </div>

                  {/* Grid de Datos Personales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    
                    {/* Nombre (Solo lectura según backend) */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm text-blue-500"><LuUser /></div>
                      <div>
                        <p className="text-xs text-gray-500">Nombre</p>
                        <p className="font-medium text-gray-800">{user.nombre}</p>
                      </div>
                    </div>

                    {/* Apellido (Editable) */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm text-blue-500"><LuUser /></div>
                      <div className="w-full">
                        <p className="text-xs text-gray-500">Apellido</p>
                        {isEditing ? (
                          <input
                            className="w-full px-2 py-1 text-sm border rounded focus:border-blue-500 outline-none"
                            value={formData.apellido}
                            onChange={e => setFormData({...formData, apellido: e.target.value})}
                            placeholder="Tu apellido"
                          />
                        ) : (
                          <p className="font-medium text-gray-800">{user.apellido || "No especificado"}</p>
                        )}
                      </div>
                    </div>

                    {/* Correo (Solo lectura) */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm text-blue-500"><LuMail /></div>
                      <div className="w-full overflow-hidden">
                        <p className="text-xs text-gray-500">Correo Institucional</p>
                        <p className="font-medium text-gray-800 truncate" title={user.correo}>{user.correo}</p>
                      </div>
                    </div>

                    {/* Campus (Editable) */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full shadow-sm text-blue-500"><LuMapPin /></div>
                      <div className="w-full">
                        <p className="text-xs text-gray-500">Campus</p>
                        {isEditing ? (
                          <select
                            className="w-full px-2 py-1 text-sm border rounded focus:border-blue-500 outline-none bg-white"
                            value={formData.campus}
                            onChange={e => setFormData({...formData, campus: e.target.value})}
                          >
                            <option value="Campus San Francisco">Campus San Francisco</option>
                            <option value="Campus San Juan Pablo II">Campus San Juan Pablo II</option>
                            <option value="Campus Menchaca Lira">Campus Menchaca Lira</option>
                          </select>
                        ) : (
                          <p className="font-medium text-gray-800">{user.campus || "No especificado"}</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* --- VALORACIONES (Mock) --- */}
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

            {/* --- PUBLICACIONES (Componente Existente) --- */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-1">Tus Publicaciones</h2>
              {/* Aquí pasas el componente que ya tienes. 
                  Nota: Si quieres que este componente cargue datos reales, 
                  asegúrate de que 'MyPublicationsFeed' use la API o pásale los datos aquí */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-h-[200px]">
                 <MyPublicationsFeed />
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}