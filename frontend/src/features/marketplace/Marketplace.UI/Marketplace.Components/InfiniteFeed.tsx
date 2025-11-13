import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// 1. CORRECCIÓN: Usar ruta relativa para usePostsWithFilters
import { usePostsWithFilters } from '@/features/marketplace/Marketplace.Hooks/usePostsWithFilters'

import { RatingStars } from '@/features/marketplace/Marketplace.UI/Marketplace.Components/RatingStars'

import { formatInt, formatCLP } from '@/features/marketplace/Marketplace.Utils/format'

import { PostDetailModal, PostDetailData } from '@/features/marketplace/Marketplace.UI/Marketplace.Components/PostDetailModal' 

interface InfiniteFeedProps {
  searchTerm: string
  selectedCategoryName: string
  onStatsChange?: (hasResults: boolean, totalResults: number) => void
}

// Modal eliminado: ya no se requiere lógica extra para imágenes o descripciones

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  searchTerm = '',
  selectedCategoryName = '', // ✅ Recibimos la prop correcta
  onStatsChange
}) => {
  const navigate = useNavigate()
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useRef<HTMLDivElement | null>(null)

  const {
    posts,
    hasResults,
    totalResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = usePostsWithFilters({
    searchTerm: searchTerm.trim(),
    // 2. CORRECCIÓN: Pasamos el nombre de la categoría al hook de filtro
    categoryId: selectedCategoryName 
  })

  // Modal eliminado: sin estado de modal

  // ... (parsePrice, buildDevImages, mapPostToDetail, onOpenDetail, handleContact) ...
  
  // 3. ❌ ELIMINAR EL MAPEO MOCK categoryNames (si lo tenías en tu código original)
  /* const categoryNames: Record<string, string> = { ... } */
  
  // 4. CORRECCIÓN DE SCOPE: Las funciones internas acceden a las props
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
      <div className="text-8xl mb-6">🛒</div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-700">No se encontraron productos</h3>
      <p className="text-center max-w-md text-gray-600 leading-relaxed">
        {searchTerm || selectedCategoryName // ✅ Usa las props en scope
          ? 'Intenta ajustar tus filtros de búsqueda o explora otras categorías.'
          : 'No hay publicaciones disponibles en este momento.'}
      </p>
    </div>
  )

  const InitialLoadingState = () => (
    <div className="col-span-full flex items-center justify-center py-20">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6" />
        <p className="text-gray-600 text-lg">Cargando publicaciones...</p>
      </div>
    </div>
  )

  const PostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* ... (código del skeleton se mantiene) ... */}
    </div>
  )

  const LoadingMoreSkeleton = () => (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <PostSkeleton key={`skeleton-${i}`} />
      ))}
    </>
  )

  const ErrorState = () => (
    <div className="col-span-full mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <div className="text-red-400 mr-4 text-2xl">⚠️</div>
        <div>
          <h4 className="text-red-800 font-medium text-lg">Error al cargar las publicaciones</h4>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!isLoading && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {posts.length > 0 ? (
              <>
                Mostrando {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
                {(searchTerm || selectedCategoryName) && ( 
                  <span className="ml-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2 font-medium">
                        🔍 "{searchTerm}"
                      </span>
                    )}
                    {selectedCategoryName && ( 
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                        📁 {selectedCategoryName} 
                      </span>
                    )}
                  </span>
                )}
                {selectedCategoryId && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                    📁 {categoryNames[selectedCategoryId]}
                  </span>
                )}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {isError && <ErrorState />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          <InitialLoadingState />
        ) : !hasResults ? (
          <EmptyState />
        ) : (
          <>
            {posts.map((post, index) => {
              const rating = (post as any).sellerRating ?? (post as any).rating ?? 0
              const sales = (post as any).sellerSales ?? (post as any).sales

              return (
                <div
                  key={`${post.id}-${searchTerm}-${selectedCategoryName}`} 
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full"
                >
                  {/* ... (código de post y detalle se mantiene) ... */}
                </div>
              )
            })}

            {isFetchingNextPage && <LoadingMoreSkeleton />}
          </>
        )}
      </div>

      {/* ... (código de no more posts y modal se mantiene) ... */}
      {!hasNextPage && posts.length > 0 && !isFetchingNextPage && posts.length >= 27 && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <span className="mr-2">🎉</span>
            <span>Has visto todas las publicaciones disponibles</span>
        </div>
          </div>
      )}

    </div>
  )
}

export default InfiniteFeed