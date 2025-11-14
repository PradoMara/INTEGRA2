import React, { useRef, useEffect, useState, useCallback } from 'react' // FIX: Era 'in'
import { useNavigate, Link } from 'react-router-dom'

// Hooks y Tipos
import { usePostsWithFilters } from '@/features/marketplace/Marketplace.Hooks/usePostsWithFilters'
import type { Post } from '@/features/marketplace/Marketplace.Types/ProductInterfaces'
import { RatingStars } from '@/features/marketplace/Marketplace.UI/Marketplace.Components/RatingStars'
import { formatInt, formatCLP } from '@/features/marketplace/Marketplace.Utils/format'
import { PostDetailModal } from '@/features/marketplace/Marketplace.UI/Marketplace.Components/PostDetailModal'

// -----------------------------------------------------------------

interface InfiniteFeedProps {
  searchTerm: string
  selectedCategoryName: string
  onStatsChange?: (hasResults: boolean, totalResults: number) => void
}

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  searchTerm = '',
  selectedCategoryName = '',
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
    categoryId: selectedCategoryName
  })

  // Modal state
  const [openModal, setOpenModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const onOpenDetail = (post: Post) => {
    setSelectedPost(post)
    setOpenModal(true)
  }
  
  const handleContact = (detail: Post) => {
    const toId = detail.vendedor?.id ?? undefined
    const toName = detail.vendedor?.nombre ?? ''
    // FIX: El avatar es la primera imagen del POST (detail), no del vendedor
    const toAvatar = detail.imagenes?.[0]?.url ?? '' 
    const qs = new URLSearchParams()
    if (toId) qs.set('toId', String(toId))
    if (toName) qs.set('toName', toName)
    if (toAvatar) qs.set('toAvatar', toAvatar)

    navigate(`/chats${qs.toString() ? `?${qs}` : ''}`, {
      state: { toUser: detail.vendedor }
    })
    setOpenModal(false)
  }


  useEffect(() => {
    if (onStatsChange && !isLoading) onStatsChange(hasResults, totalResults)
  }, [hasResults, totalResults, isLoading, onStatsChange])

  useEffect(() => {
    if (isLoading || isFetchingNextPage) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.5, rootMargin: '200px' }
    )
    if (lastPostElementRef.current) observer.current.observe(lastPostElementRef.current)
    return () => observer.current?.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, posts.length])


  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
      <div className="text-8xl mb-6">🛒</div>
      <h3 className="text-2xl font-semibold mb-3 text-gray-700">No se encontraron productos</h3>
      <p className="text-center max-w-md text-gray-600 leading-relaxed">
        {searchTerm || selectedCategoryName
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
      <div className="relative aspect-video w-full bg-gray-300" />
      <div className="p-4 md:p-5">
        <div className="flex items-center mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 mr-3" />
          <div className="flex-1">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-24 mb-1" />
            <div className="h-2 md:h-3 bg-gray-300 rounded w-16" />
          </div>
        </div>
        <div className="h-4 md:h-5 bg-gray-300 rounded w-full mb-2" />
        <div className="h-4 md:h-5 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-full mb-2" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-5/6 mb-2" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-2/3 mb-4" />
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
          <div className="h-3 md:h-4 bg-gray-300 rounded w-24" />
          <div className="h-3 md:h-4 bg-gray-300 rounded w-16" />
        </div>
      </div>
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
          </p>{/* FIX: Era 'p>' */}
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
              </>
            ) : hasResults ? (
              'Cargando resultados...'
            ) : (
              'No hay resultados para mostrar'
            )}
          </div>
        </div>
      )}

      {isError && <ErrorState />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {isLoading ? (
          <InitialLoadingState />
        ) : !hasResults ? (
          <EmptyState />
        ) : (
          <>
            {posts.map((post: Post, index) => { 
              
              const finalRating = post.calificacion || 0;
              const authorName = post.vendedor?.nombre;
              const priceDisplay = formatCLP(post.precioActual || 0);
              const stockDisplay = formatInt(Number(post.cantidad));
              const timeDisplay = post.fechaAgregado ? new Date(post.fechaAgregado).toLocaleDateString() : 'hace poco';
              const primaryImage = post.imagenes?.[0]?.url; 

              return (
                <div
                  key={`${post.id}-${searchTerm}-${selectedCategoryName}`}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full"
                >
                  {primaryImage && (
                    <div className="relative aspect-video w-full">
                      <img
                        src={primaryImage}
                        alt={post.nombre}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {post.precioActual && (
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                          {priceDisplay}
                        </div>
                      )}
                      {post.categoria && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/95 text-gray-800 font-medium shadow-sm">
                            {post.categoria}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 md:p-5">
                    <div className="flex items-center mb-3 md:mb-4">
                      {/* Aquí iría el avatar si lo tuviéramos en Vendedor */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {authorName}
                        </h4>
                        <p className="text-xs text-gray-500">{timeDisplay}</p>
                      </div>
                    </div>

                    <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {post.nombre}
                    </h3>
                    {post.descripcion && (
                      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-3 leading-relaxed">
                        {post.descripcion}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <RatingStars rating={finalRating} />
                          <span className="font-semibold text-gray-700">
                            {Number(finalRating || 0).toFixed(1)}
                          </span>
                        </span>
                        {typeof post.cantidad !== 'undefined' && (
                          <>
                            <span className="opacity-60">•</span>
                            <span>{stockDisplay} en stock</span>
                          </>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => onOpenDetail(post)}
                        className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {isFetchingNextPage && <LoadingMoreSkeleton />}
          </>
        )}
      </div>

      {!hasNextPage && posts.length > 0 && !isFetchingNextPage && posts.length >= 27 && (
        <div className="text-center py-8 text-gray-500">
          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <span className="mr-2">🎉</span>
            <span>Has visto todas las publicaciones disponibles</span>
          </div>
        </div>
      )}

      <PostDetailModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        post={selectedPost}
        onContact={handleContact}
      />
    </div>
  )
}

export default InfiniteFeed