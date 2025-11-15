import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/app/context/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link } from 'react-router-dom'

// Iconos
import { LuPencil, LuTrash2, LuPlus, LuX, LuSave, LuLoader } from 'react-icons/lu'

// Componentes de Layout (Si usas PageLayout en routes.tsx, quita Sidebar y Header de aquí)
import { Sidebar } from '@/features/shared/ui/Sidebar'
import Header from '@/features/shared/ui/Header'

// --- Tipos ---
interface Publication {
  id: number
  titulo: string
  cuerpo: string
  fecha: string
  estado: string
  visto: boolean
  usuario: { id: number; nombre: string; usuario: string }
}

interface UpdatePublicationData {
  id: number
  titulo: string
  cuerpo: string
}

// --- Funciones API ---

// GET (Listar)
const fetchMyPublications = async (token: string | null, userId: number | undefined): Promise<Publication[]> => {
  if (!token || !userId) return []
  const res = await fetch(`/api/publications?userId=${userId}&limit=50`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al cargar publicaciones')
  const data = await res.json()
  return data.publications // Asumiendo que el backend ya filtra correctamente
}

// DELETE (Eliminar)
const deletePublication = async (id: number, token: string | null) => {
  if (!token) throw new Error('No autorizado')
  const res = await fetch(`/api/publications/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al eliminar')
  return await res.json()
}

// PUT (Actualizar) - ¡NUEVO!
const updatePublication = async (data: UpdatePublicationData, token: string | null) => {
  if (!token) throw new Error('No autorizado')
  const res = await fetch(`/api/publications/${data.id}`, { //
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ titulo: data.titulo, cuerpo: data.cuerpo })
  })
  if (!res.ok) throw new Error('Error al actualizar')
  return await res.json()
}

// --- Componente Principal ---

const MyPublicationsPage = () => {
  // Nota: Si ya tienes PageLayout en routes.tsx, usa solo MyPublicationsContent
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active="marketplace" />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <MyPublicationsContent />
        </main>
      </div>
    </div>
  )
}

export default MyPublicationsPage

// --- Contenido Interno ---

const MyPublicationsContent = () => {
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const [isMounted, setIsMounted] = useState(false)
  
  // Estado para controlar qué publicación se está editando (null = ninguna)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => { setIsMounted(true) }, [])

  // 1. Query
  const { data: publications, isLoading, error } = useQuery({
    queryKey: ['my-publications', user?.id],
    queryFn: () => fetchMyPublications(token, user?.id),
    enabled: !!user && !!token,
  })

  // 2. Mutation Delete
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deletePublication(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-publications'] })
      queryClient.invalidateQueries({ queryKey: ['publications'] }) // Actualizar foro global
    },
    onError: (err) => alert(`Error: ${err.message}`)
  })

  // 3. Mutation Update (Guardar edición)
  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdatePublicationData) => updatePublication(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-publications'] })
      queryClient.invalidateQueries({ queryKey: ['publications'] })
      setEditingId(null) // Cerrar el panel de edición
    },
    onError: (err) => alert(`Error al actualizar: ${err.message}`)
  })

  return (
    <div className={`mx-auto max-w-5xl transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Publicaciones</h1>
          <p className="text-gray-600">Gestiona y edita tu contenido.</p>
        </div>
        <Link 
          to="/foro"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          <LuPlus size={20} /> Nueva Publicación
        </Link>
      </div>

      {/* Loading / Error / Empty States */}
      {isLoading && <div className="flex justify-center py-12"><LuLoader className="h-10 w-10 animate-spin text-blue-600" /></div>}
      {error && <div className="p-4 text-red-700 bg-red-50 rounded-lg">Error al cargar datos.</div>}
      {publications?.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed">
          <p className="text-gray-500">No tienes publicaciones aún.</p>
        </div>
      )}

      {/* Lista */}
      <div className="grid gap-6">
        {publications?.map((post) => (
          <EditablePublicationCard
            key={post.id}
            post={post}
            isEditing={editingId === post.id}
            onEditStart={() => setEditingId(post.id)}
            onEditCancel={() => setEditingId(null)}
            onSave={(data) => handleUpdate(data)}
            onDelete={() => {
              if(window.confirm('¿Eliminar publicación?')) handleDelete(post.id)
            }}
            isProcessing={isDeleting || isUpdating}
          />
        ))}
      </div>
    </div>
  )
}

// --- Componente de Tarjeta Editable ---

const EditablePublicationCard = ({ 
  post, 
  isEditing, 
  onEditStart, 
  onEditCancel, 
  onSave, 
  onDelete,
  isProcessing
}: { 
  post: Publication
  isEditing: boolean
  onEditStart: () => void
  onEditCancel: () => void
  onSave: (data: UpdatePublicationData) => void
  onDelete: () => void
  isProcessing: boolean
}) => {
  // Estado local para el formulario de edición
  const [titulo, setTitulo] = useState(post.titulo)
  const [cuerpo, setCuerpo] = useState(post.cuerpo)

  // Reiniciar formulario si se cancela la edición
  useEffect(() => {
    if (!isEditing) {
      setTitulo(post.titulo)
      setCuerpo(post.cuerpo)
    }
  }, [isEditing, post])

  const formattedDate = format(new Date(post.fecha), "d MMM yyyy, HH:mm", { locale: es })

  return (
    <article 
      className={`
        relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300
        ${isEditing ? 'border-blue-500 ring-2 ring-blue-100 shadow-lg scale-[1.01]' : 'border-gray-200 hover:shadow-md'}
      `}
    >
      <div className="p-6">
        
        {/* --- MODO VISUALIZACIÓN --- */}
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 text-xs">
                 <span className={`px-2 py-0.5 rounded-full font-medium ${post.visto ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                   {post.visto ? 'Visto' : 'Nuevo'}
                 </span>
                 <span className="text-gray-500">{formattedDate}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{post.titulo}</h3>
              <p className="text-gray-600 line-clamp-2">{post.cuerpo}</p>
            </div>
            
            {/* Botones de Acción (Solo ver) */}
            <div className="flex items-center gap-2 sm:flex-col sm:border-l sm:pl-4 sm:border-gray-100">
               <button onClick={onEditStart} disabled={isProcessing} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                 <LuPencil size={20} />
               </button>
               <button onClick={onDelete} disabled={isProcessing} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                 {isProcessing ? <LuLoader className="animate-spin" /> : <LuTrash2 size={20} />}
               </button>
            </div>
          </div>
        ) : (
          
        /* --- MODO EDICIÓN (Panel Animado) --- */
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-semibold text-blue-700 flex items-center gap-2">
                <LuPencil /> Editando Publicación
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Título</label>
                <input 
                  type="text" 
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Contenido</label>
                <textarea 
                  value={cuerpo} 
                  onChange={e => setCuerpo(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  disabled={isProcessing}
                />
              </div>
              
              {/* Botones de Guardar/Cancelar */}
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={onEditCancel}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <LuX size={16} /> Cancelar
                </button>
                <button 
                  onClick={() => onSave({ id: post.id, titulo, cuerpo })}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? <LuLoader className="animate-spin" /> : <LuSave size={16} />}
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}