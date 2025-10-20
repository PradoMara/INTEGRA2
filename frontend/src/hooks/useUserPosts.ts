import { useQuery } from '@tanstack/react-query'

// Interfaz para los filtros de posts
interface PostFilters {
  authorId?: string
}

// Interfaz para Post (debe coincidir con la del dominio)
interface Post {
  id: number
  title: string
  description: string
  content: string
  categoryId: string
  categoryName: string
  author: string
  avatar: string
  image?: string
  likes: number
  comments: number
  shares: number
  timeAgo: string
  price?: string
  createdAt?: Date
  updatedAt?: Date
}

// Función para obtener posts del usuario
const fetchUserPosts = async (authorId: string | undefined): Promise<{ posts: Post[] }> => {
  if (!authorId) {
    throw new Error('Author ID is required')
  }

  const params = new URLSearchParams()
  params.append('authorId', authorId)
  params.append('limit', '20') // Obtener más posts para el usuario

  const response = await fetch(`/api/posts?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch user posts')
  }
  
  const data = await response.json()
  return { posts: data.posts || [] }
}

// Reexportar el hook central desde la carpeta de features para evitar duplicación
export { useUserPosts } from '@/features/marketplace/application/useUserPosts'
