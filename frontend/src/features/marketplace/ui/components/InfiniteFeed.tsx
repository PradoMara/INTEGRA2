import React, { useRef, useEffect } from 'react'
import { usePostsWithFilters } from '../../../../hooks/usePostsWithFilters'

// Props para el componente con filtros optimizado
interface InfiniteFeedProps {
  searchTerm: string
  selectedCategoryId: string
  onStatsChange?: (hasResults: boolean, totalResults: number) => void
}

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({ 
  searchTerm = '', 
  selectedCategoryId = '',
  onStatsChange
}) => {
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostElementRef = useRef<HTMLDivElement | null>(null)

  // Usar el hook refactorizado con Clean Architecture
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
    categoryId: selectedCategoryId
  })

  // Notificar cambios en las estadísticas al componente padre
  useEffect(() => {
    if (onStatsChange && !isLoading) {
      onStatsChange(hasResults, totalResults)
    }
  }, [hasResults, totalResults, isLoading, onStatsChange])

  // Configurar Intersection Observer para scroll infinito
  useEffect(() => {
    if (isLoading || isFetchingNextPage) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('🚀 Loading more posts... Page:', posts.length / 9 + 1)
          fetchNextPage()
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '200px'
      }
    )

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, posts.length])

  // Mapeo de categorías para mostrar nombres legibles
  const categoryNames: Record<string, string> = {
    'electronics': 'Electrónicos',
    'books': 'Libros y Materiales',
    'clothing': 'Ropa y Accesorios',
    'sports': 'Deportes',
    'home': 'Hogar y Jardín',
    'vehicles': 'Vehículos',
    'services': 'Servicios'
  }

  // Componente para mostrar estado vacío
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
      <div className="text-8xl mb-6">🛒</div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-700">No se encontraron productos</h3>
      <p className="text-center max-w-md text-gray-600 leading-relaxed">
        {searchTerm || selectedCategoryId ? 
          'Intenta ajustar tus filtros de búsqueda o explora otras categorías.' :
          'No hay publicaciones disponibles en este momento.'
        }
      </p>
    </div>
  )

  // Componente de estado de carga inicial
  const InitialLoadingState = () => (
    <div className="col-span-full flex items-center justify-center py-20">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-gray-600 text-lg">Cargando publicaciones...</p>
      </div>
    </div>
  )

  // Componente Skeleton para tarjetas individuales
  const PostSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="relative aspect-video w-full bg-gray-300"></div>
      <div className="p-4 md:p-5">
        <div className="flex items-center mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 mr-3"></div>
          <div className="flex-1">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="h-2 md:h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        <div className="h-4 md:h-5 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 md:h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-3 md:h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-3 md:h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-8"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded w-8"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded w-8"></div>
          </div>
          <div className="h-3 md:h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  )

  // Componente para mostrar skeletons durante la carga de más páginas
  const LoadingMoreSkeleton = () => (
    <>
      {Array.from({ length: 9 }, (_, index) => (
        <PostSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  )

  // Componente de error
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
      {/* Header con información de resultados */}
      {!isLoading && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {posts.length > 0 ? (
              <>
                Mostrando {posts.length} publicación{posts.length !== 1 ? 'es' : ''}
                {(searchTerm || selectedCategoryId) && (
                  <span className="ml-2">
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2 font-medium">
                        🔍 "{searchTerm}"
                      </span>
                    )}
                    {selectedCategoryId && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                        📁 {categoryNames[selectedCategoryId]}
                      </span>
                    )}
                  </span>
                )}
              </>
            ) : hasResults ? (
              'Cargando resultados...'
            ) : (
              'No hay resultados para mostrar'
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && <ErrorState />}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          <InitialLoadingState />
        ) : !hasResults ? (
          <EmptyState />
        ) : (
          <>
            {posts.map((post, index) => (
              <div
                key={`${post.id}-${searchTerm}-${selectedCategoryId}`}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full"
              >
                {/* Post Image */}
                {post.image && (
                  <div className="relative aspect-video w-full">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {post.price && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                        {post.price}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/95 text-gray-800 font-medium shadow-sm">
                        {post.categoryName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4 md:p-5">
                  {/* Header */}
                  <div className="flex items-center mb-3 md:mb-4">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                        {post.author}
                      </h4>
                      <p className="text-xs text-gray-500">{post.timeAgo}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
                      <span className="flex items-center hover:text-red-500 transition-colors cursor-pointer">
                        <span className="mr-1">❤️</span>
                        {post.likes}
                      </span>
                      <span className="flex items-center hover:text-blue-500 transition-colors cursor-pointer">
                        <span className="mr-1">💬</span>
                        {post.comments}
                      </span>
                      <span className="flex items-center hover:text-green-500 transition-colors cursor-pointer">
                        <span className="mr-1">📤</span>
                        {post.shares}
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium transition-colors">
                      Ver detalles →
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Mostrar skeletons durante la carga de más páginas */}
            {isFetchingNextPage && <LoadingMoreSkeleton />}
          </>
        )}
      </div>

      {/* Mensaje cuando no hay más posts */}
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