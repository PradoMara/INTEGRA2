import { useState, useEffect, useMemo } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// 🛑 Importar tipos canónicos desde el archivo de Marketplace.Types
// Ajusta la ruta si es necesario (ej: si estás en ../Perfil/Perfil.Hooks)
import type { Post, PostFilters, FetchResult, ProductApiResponse } from '../../marketplace/Marketplace.Types/ProductInterfaces'


// ✅ FUNCIÓN REAL que llama al endpoint de productos del usuario autenticado (Método GET)
const fetchPosts = async ({ 
  pageParam = 1, 
  filters 
}: { 
  pageParam?: number
  filters: PostFilters 
}): Promise<FetchResult> => { 
  
  const limit = 20; 
  // 🛑 ENDPOINT CORREGIDO: Usamos la ruta protegida para obtener MIS productos.
  const BASE_URL = '/api/products/my-products'; 
  
  // El backend para 'my-products' no usa 'category' en el ejemplo, pero sí 'search'.
  const searchParam = filters.searchTerm ? `&search=${encodeURIComponent(filters.searchTerm)}` : '';
  
  // Incluimos page y limit en la URL
  const url = `${BASE_URL}?page=${pageParam}&limit=${limit}${searchParam}`;
  
  // NOTA: Esta llamada debe ser manejada por una función que añada el token de autenticación (req.user.userId)
  // en el header, ya que el endpoint /api/products/my-products es protegido.

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
    console.error("❌ Error fetching user products:", error);
    return { posts: [], nextPage: undefined, hasMore: false };
  }
}

// Hook principal usePostsWithFilters (Adaptado para Perfil)
export const usePostsWithFilters = (filters: PostFilters) => {
  const queryClient = useQueryClient()

  // 🛑 Cambiamos la clave de caché para ser específica del usuario
  const queryKey = ['profile-products', filters.searchTerm, filters.categoryId] 

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
    clearCache: () => queryClient.removeQueries({ queryKey: ['profile-products'] })
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