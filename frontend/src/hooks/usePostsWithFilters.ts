import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// Interfaz para los filtros
interface PostFilters {
  searchTerm: string
  categoryId: string
}

// Interfaz para Post (mantener consistencia)
interface Post {
  id: number
  title: string
  description: string
  categoryId: string
  categoryName: string
  author: string
  avatar: string
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timeAgo: string
  price?: string
}

// Interfaz para la respuesta de la API
interface ApiResponse {
  posts: Post[]
  nextPage: number | undefined
  hasMore: boolean
}

// Función para fetch de posts desde la API mock
const fetchPosts = async ({ 
  pageParam = 1, 
  filters 
}: { 
  pageParam?: number
  filters: PostFilters 
}): Promise<ApiResponse> => {
  const params = new URLSearchParams()
  params.append('page', String(pageParam))
  params.append('limit', '9')
  if (filters.categoryId) {
    params.append('categoryId', filters.categoryId)
  }
  if (filters.searchTerm) {
    params.append('searchTerm', filters.searchTerm)
  }
  
  const response = await fetch(`/api/posts?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  
  return response.json()
}

// Hook personalizado para el manejo de posts con filtros
export const usePostsWithFilters = (filters: PostFilters) => {
  const queryClient = useQueryClient()
  
  // Crear clave única para la query basada en los filtros
  const queryKey = ['posts', filters]
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery<ApiResponse>({
    queryKey,
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  // Limpiar cache cuando cambian los filtros significativamente
  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['posts'] })
  }

  // Aplanar todas las páginas en un solo array
  const posts = useMemo(() => {
    return data?.pages.flatMap(page => page.posts) ?? []
  }, [data])

  // Información de resultados
  const hasResults = posts.length > 0
  const totalResults = data?.pages[0]?.totalCount ?? 0 // Asumiendo que la API devuelve totalCount

  return {
    posts,
    hasResults,
    totalResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    clearCache
  }
}

// Hook para debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}