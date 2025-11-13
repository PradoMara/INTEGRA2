import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// 🛑 CORRECCIÓN: Importar tipos canónicos desde el archivo de Marketplace.
import type { Post, PostFilters, FetchResult, ProductApiResponse } from '../../marketplace/Marketplace.Types/ProductInterfaces'

// 🛑 CORRECCIÓN: La función fetchPosts debe usar la lógica real de la API
const fetchPosts = async ({
  pageParam = 1,
  filters
}: {
  pageParam?: number
  filters: PostFilters
}): Promise<FetchResult> => {
  
  const limit = 20; 
  // 🛑 NOTA: Se usa /api/publications/me como endpoint para obtener las publicaciones del usuario autenticado.
  const BASE_URL = '/api/publications/me'; 
  
  const searchParam = filters.searchTerm ? `&search=${encodeURIComponent(filters.searchTerm)}` : '';
  const url = `${BASE_URL}?page=${pageParam}&limit=${limit}${searchParam}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    
    const apiResponse: ProductApiResponse = await response.json();
    
    // Los productos ya vienen como Post[] del backend
    const posts: Post[] = apiResponse.products;
    
    // Lógica de Infinite Scroll
    const totalPages = apiResponse.pagination.totalPages;
    const hasMore = apiResponse.pagination.page < totalPages;
    const nextPage = hasMore ? apiResponse.pagination.page + 1 : undefined;

    return { posts, nextPage, hasMore };
    
  } catch (error) {
    console.error("❌ Error fetching user publications:", error);
    // Devolver array vacío en caso de error
    return { posts: [], nextPage: undefined, hasMore: false };
  }
}

// Hook principal usePostsWithFilters (MANTENER)
export const usePostsWithFilters = (filters: PostFilters) => {
  const queryClient = useQueryClient()

  // Mantenemos 'my-posts' para la caché de este hook específico
  const queryKey = ['my-posts', filters.searchTerm, filters.categoryId] 

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
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: true, 
  })

  const clearCache = () => {
    queryClient.removeQueries({ queryKey: ['my-posts'] })
  }

  const posts = useMemo(() => {
    return data?.pages.flatMap(page => page.posts) ?? []
  }, [data])

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

// Hook para debounce (MANTENER)
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