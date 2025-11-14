import { useState, useEffect } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useAuth } from '@/app/context/AuthContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// --- 1. IMPORTA TUS COMPONENTES DE LAYOUT ---
import { Sidebar } from '@/features/shared/ui/Sidebar'
// (Asegúrate de que la ruta de tu Header sea correcta)
import Header from '@/features/shared/ui/Header' 
import { Link } from 'react-router-dom'

// --- 2. Tipos de Datos (Sin cambios) ---
interface PublicationAuthor {
  id: number
  nombre: string
  usuario: string
}
interface Publication {
  id: number
  titulo: string
  cuerpo: string
  fecha: string
  usuario: PublicationAuthor
}
interface PublicationsApiResponse {
  ok: boolean
  publications: Publication[]
  pagination: { /* ... */ }
}
interface NewPublicationData {
  titulo: string
  cuerpo: string
}

// --- 3. Funciones de API (Sin cambios) ---
const fetchPublications = async (): Promise<Publication[]> => {
  const res = await fetch('/api/publications') //
  if (!res.ok) throw new Error('No se pudieron cargar las publicaciones')
  return (await res.json()).publications
}

const createPublication = async (
  newData: NewPublicationData,
  token: string | null
): Promise<Publication> => {
  if (!token) throw new Error('No estás autenticado')
  const res = await fetch('/api/publications', { //
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, //
    },
    body: JSON.stringify(newData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Error al crear la publicación')
  return data.publication
}

// --- 4. Componente Principal (AHORA RENDERIZA EL LAYOUT) ---

const ForumPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 4a. Sidebar */}
      <Sidebar />

      {/* 4b. Contenido Principal (Header + Contenido) */}
      <div className="flex flex-1 flex-col">
        {/* 4c. Header */}
        <Header />

        {/* 4d. Contenido del Foro (con scroll) */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* El contenido específico de la página va aquí */}
          <ForumContent />
        </main>
      </div>
    </div>
  )
}

export default ForumPage

// --- 5. Componente de Contenido del Foro ---
// (Todo lo que antes era el 'return' de ForumPage ahora está aquí)

const ForumContent = () => {
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const [isMounted, setIsMounted] = useState(false) // Para animación de entrada

  // Animación de fundido al montar
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Hook (useQuery) para cargar las publicaciones
  const {
    data: publications,
    isLoading: isLoadingPublications,
    error: loadError,
  } = useQuery<Publication[], Error>({
    queryKey: ['publications'],
    queryFn: fetchPublications,
    refetchOnWindowFocus: true,
  })

  // Hook (useMutation) para crear publicaciones
  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: (newPostData: NewPublicationData) =>
      createPublication(newPostData, token),
    onSuccess: (newPublication) => {
      queryClient.invalidateQueries({ queryKey: ['publications'] })
    },
    onError: (error) => {
      console.error('Error al crear publicación:', error)
      alert(error.message)
    },
  })

  return (
    <div
      className={`mx-auto max-w-5xl p-4 md:p-6 transition-all duration-700 ease-out ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {/* Encabezado */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Foro General 
          <Link to="/my-publications">Mis Publicaciones</Link>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Un espacio para compartir ideas, preguntas y anuncios.
        </p>
      </div>

      {/* Formulario de creación (si está logueado) */}
      {user && (
        <CreatePostForm
          onSubmit={(data) => mutate(data)}
          isLoading={isCreating}
        />
      )}

      {/* Lista de Publicaciones */}
      <div className="mt-8">
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">
          Últimas Publicaciones
        </h2>
        
        {/* Estado de Carga */}
        {isLoadingPublications && <LoadingSpinner />}

        {/* Estado de Error */}
        {loadError && (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-center">
            <p className="font-medium text-red-700">
              Error al cargar: {loadError.message}
            </p>
          </div>
        )}

        {/* Estado Vacío */}
        {publications && publications.length === 0 && !isLoadingPublications && (
          <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              No hay publicaciones todavía. ¡Sé el primero en crear una!
            </p>
          </div>
        )}

        {/* Lista Renderizada */}
        <div className="space-y-6">
          {publications?.map((post) => (
            <PublicationCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}


// --- 6. Componentes Internos (Sin cambios) ---

const CreatePostForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: NewPublicationData) => void
  isLoading: boolean
}) => {
  const [titulo, setTitulo] = useState('')
  const [cuerpo, setCuerpo] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!titulo.trim() || !cuerpo.trim()) {
      alert('El título y el cuerpo son requeridos.')
      return
    }
    onSubmit({ titulo, cuerpo })
    setTitulo('')
    setCuerpo('')
  }

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Crear Nueva Publicación
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título de la publicación..."
          className="w-full rounded-md border-gray-300 px-4 py-2 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <textarea
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
          placeholder="Escribe tu publicación aquí..."
          rows={4}
          className="w-full rounded-md border-gray-300 px-4 py-2 shadow-sm transition-colors duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 px-4 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70 disabled:hover:translate-y-0"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.105 2.288a.75.75 0 00-.826.919l1.41 4.985a.75.75 0 00.585.636l4.491.599a.75.75 0 000 1.33l-4.491.599a.75.75 0 00-.585.636l-1.41 4.985a.75.75 0 00.826.919l16-7a.75.75 0 000-1.296z" />
          </svg>
          {isLoading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}

const PublicationCard = ({ post }: { post: Publication }) => {
  const formattedDate = format(
    new Date(post.fecha),
    "d 'de' MMMM, yyyy 'a las' HH:mm",
    { locale: es }
  )

  return (
    <article className="rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:border-gray-300">
      <div className="p-5">
        <header className="mb-3">
          <h3 className="text-xl font-semibold tracking-tight text-blue-700 transition-colors duration-300 hover:text-blue-900">
            {post.titulo}
          </h3>
          <p className="mt-1 text-sm text-gray-500 opacity-75">
            Por{' '}
            <span className="font-medium text-gray-700">
              {post.usuario.usuario}
            </span>
            {' · '}
            <span>{formattedDate}</span>
          </p>
        </header>
        <p className="text-gray-800 opacity-90 line-clamp-3">
          {post.cuerpo}
        </p>
      </div>
    </article>
  )
}

const LoadingSpinner = () => (
  <div className="flex w-full justify-center py-10">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
  </div>
)