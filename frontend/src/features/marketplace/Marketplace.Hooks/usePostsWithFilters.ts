import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// 🛑 SOLUCIÓN CRÍTICA: Importar todos los tipos del nuevo archivo de tipos
// La palabra clave 'type' ayuda al compilador a resolver la referencia antes de usarse.
import type { Post, PostFilters, FetchResult, ProductApiResponse } from '../Marketplace.Types/ProductInterfaces'


// ✅ FUNCIÓN REAL que llama a la API /api/products (MÉTODO GET)
const fetchPosts = async ({ 
  pageParam = 1, 
  filters 
}: { 
  pageParam?: number
  filters: PostFilters 
}): Promise<FetchResult> => { 
  
  const limit = 20; 
  
  // Construir la URL con parámetros de consulta (search, category, page, limit)
  const categoryParam = filters.categoryId ? `&category=${encodeURIComponent(filters.categoryId)}` : '';
  const searchParam = filters.searchTerm ? `&search=${encodeURIComponent(filters.searchTerm)}` : '';
  
  const url = `/api/products?page=${pageParam}&limit=${limit}${categoryParam}${searchParam}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
    }
    
    const apiResponse: ProductApiResponse = await response.json();
    
    // Los productos ya vienen como Post[] del backend, no necesita mapeo adicional
    const posts: Post[] = apiResponse.products;
    
    // Lógica de Infinite Scroll
    const totalPages = apiResponse.pagination.totalPages;
    const hasMore = apiResponse.pagination.page < totalPages;
    const nextPage = hasMore ? apiResponse.pagination.page + 1 : undefined;

    return { posts, nextPage, hasMore };
    
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return { posts: [], nextPage: undefined, hasMore: false };
  }
}

// Hook para debounce (MANTENER)
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value) }, delay)
    return () => { clearTimeout(handler) }
  }, [value, delay])
  return debouncedValue
}

// Hook principal usePostsWithFilters (MANTENER)
export const usePostsWithFilters = (filters: PostFilters) => {
  const queryClient = useQueryClient()
  
  const queryKey = ['products', filters.searchTerm, filters.categoryId]
  
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
    clearCache: () => queryClient.removeQueries({ queryKey: ['products'] }) 
  }
}