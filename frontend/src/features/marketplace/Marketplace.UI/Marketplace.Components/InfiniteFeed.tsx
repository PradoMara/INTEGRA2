import React, { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePostsWithFilters } from '@/features/marketplace/Marketplace.Hooks/usePostsWithFilters'
import { RatingStars } from './RatingStars'
import { formatInt, formatCLP } from '@/features/marketplace/Marketplace.Utils/format'
// Modal eliminado: ahora navegamos a la página de detalle

interface InfiniteFeedProps {
  searchTerm: string
  selectedCategoryId: string
  onStatsChange?: (hasResults: boolean, totalResults: number) => void
}

// Modal eliminado: ya no se requiere lógica extra para imágenes o descripciones

const InfiniteFeed: React.FC<InfiniteFeedProps> = ({
  searchTerm = '',
  selectedCategoryId = '',
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
    categoryId: selectedCategoryId
  })

  // Modal eliminado: sin estado de modal

  const onOpenDetail = (post: any) => {
    // Redirección con estado inicial para que la DetailPage no dependa del fetch
    const publicationState = {
      publication: {
        id: String(post.id),
        title: post.title,
        description: post.description,
        price: typeof post.price === 'number' ? post.price : parseInt(String(post.price ?? '0').replace(/\D/g, ''), 10) || undefined,
        images: post.images ?? (post.image ? [post.image] : undefined),
        stock: post.stock,
        seller: {
          id: post.sellerId ?? post.authorId,
          name: post.author,
          avatarUrl: post.avatar,
          reputation: typeof post.sellerRating === 'number' ? post.sellerRating : (typeof post.rating === 'number' ? post.rating : undefined)
        },
        categoryName: post.categoryName,
        campus: post.campus,
        createdAt: post.publishedAt ?? post.createdAt,
        condition: post.condition,
      }
    }
    navigate(`/publications/${post.id}`, { state: publicationState })
  }

  // Chat se gestionará desde la detail page si es necesario.

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

  const categoryNames: Record<string, string> = {
    electronics: 'Electrónicos',
    books: 'Libros y Materiales',
    clothing: 'Ropa y Accesorios',
    sports: 'Deportes',
    home: 'Hogar y Jardín',
    vehicles: 'Vehículos',
    services: 'Servicios'
  }

  const EmptyState = () => (
    <motion.div 
      className="col-span-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900">No se encontraron resultados</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {searchTerm && selectedCategoryId
            ? `No hay publicaciones que coincidan con "${searchTerm}" en ${categoryNames[selectedCategoryId]}`
            : searchTerm
            ? `No encontramos publicaciones con "${searchTerm}"`
            : selectedCategoryId
            ? `No hay publicaciones en ${categoryNames[selectedCategoryId]}`
            : 'No hay publicaciones disponibles en este momento'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <motion.div 
            className="bg-white rounded-lg px-4 py-2 border border-gray-200 text-sm text-gray-700"
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            💡 Prueba con otros términos de búsqueda
          </motion.div>
          {(searchTerm || selectedCategoryId) && (
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver todas las publicaciones
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
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
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {!isLoading && posts.length > 0 && (
        <motion.div 
          className="mb-4 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-900">{posts.length}</span>
            <span>publicación{posts.length !== 1 ? 'es' : ''}</span>
            {(searchTerm || selectedCategoryId) && (
              <span className="flex items-center gap-2 ml-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    🔍 "{searchTerm}"
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
                  key={`${post.id}-${searchTerm}-${selectedCategoryId}`}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full"
                >
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
                          {formatCLP(parseFloat(String(post.price)) || 0)}
                        </div>
                      )}
                      {post.categoryName && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/95 text-gray-800 font-medium shadow-sm">
                            {post.categoryName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 md:p-5">
                    <div className="flex items-center mb-3 md:mb-4">
                      {post.avatar && (
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 border-2 border-gray-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {post.author}
                        </h4>
                        {post.timeAgo && (
                          <p className="text-xs text-gray-500">{post.timeAgo}</p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    )}

                    {/* Footer: estrellas + ventas + Ver detalle */}
                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <RatingStars rating={rating} />
                          <span className="font-semibold text-gray-700">
                            {Number(rating || 0).toFixed(1)}
                          </span>
                        </span>
                        {typeof sales !== 'undefined' && (
                          <>
                            <span className="opacity-60">•</span>
                            <span>{formatInt(Number(sales))} ventas</span>
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

      {/* Modal eliminado: navegación directa a la página de detalle */}
    </div>
  )
}

export default InfiniteFeed