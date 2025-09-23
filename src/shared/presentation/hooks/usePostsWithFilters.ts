import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { PostFilters } from '../../domain/entities/Post'
import { PostUseCasesImpl } from '../../../features/marketplace/application/use-cases/PostUseCases'
import { MockPostRepository } from '../../../features/marketplace/infrastructure/repositories/MockPostRepository'

// Instancia única del repositorio y casos de uso
const postRepository = new MockPostRepository()
const postUseCases = new PostUseCasesImpl(postRepository)

// Hook refactorizado usando Clean Architecture
export const usePostsWithFilters = (filters: PostFilters) => {
  const queryClient = useQueryClient()
  
  // Crear clave única para la query basada en los filtros
  const queryKey = ['posts', filters.searchTerm, filters.categoryId]
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`🔍 Fetching page ${pageParam} with filters:`, filters)
      return await postUseCases.getPostsWithFilters(filters, pageParam, 9)
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    enabled: true,
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
  const totalResults = posts.length

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

// Hook para debounce (reutilizable en shared)
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