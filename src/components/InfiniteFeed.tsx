import React, { useState, useEffect, useRef } from 'react'

// Interfaz para las publicaciones estilo Facebook Marketplace
interface Post {
  id: number
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

// Simulación de API para cargar publicaciones con más variedad
const generatePosts = (page: number, limit: number = 9): Post[] => {
  const posts: Post[] = []
  const startId = (page - 1) * limit + 1
  
  for (let i = 0; i < limit; i++) {
    const id = startId + i
    posts.push({
      id,
      author: `Usuario ${id}`,
      avatar: `https://avatar.iran.liara.run/public/${id}`,
      content: `Producto número ${id} - ${id % 2 === 0 ? 'Libro de texto en excelente estado' : id % 3 === 0 ? 'Calculadora científica' : 'Notebook gaming usado'}. ${id % 4 === 0 ? 'Precio negociable. Disponible en campus.' : 'En muy buen estado, poco uso.'}`,
      image: `https://picsum.photos/400/300?random=${id}`,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 15),
      shares: Math.floor(Math.random() * 5),
      timeAgo: `${Math.floor(Math.random() * 48)}h`,
      price: `$${(Math.random() * 500000 + 10000).toLocaleString('es-CL')}`
    })
  }
  
  return posts
}

const fetchPosts = async (page: number): Promise<{ posts: Post[], hasMore: boolean }> => {
  console.log(`Cargando página ${page}...`)
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const posts = generatePosts(page, 9) // 9 posts por página (3x3 grid)
  const hasMore = page < 10 // Máximo 10 páginas = 90 posts
  
  return { posts, hasMore }
}

const InfiniteFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [initialLoad, setInitialLoad] = useState(true)
  const [loadingRequestSent, setLoadingRequestSent] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Función para cargar más posts con control de duplicación
  const loadMorePosts = async () => {
    if (loading || !hasMore || loadingRequestSent) return

    setLoadingRequestSent(true)
    setLoading(true)
    console.log(`🚀 Cargando página ${page}`)

    try {
      const { posts: newPosts, hasMore: moreAvailable } = await fetchPosts(page)
      
      setPosts(prevPosts => {
        // Evitar duplicados de manera más robusta
        const existingIds = new Set(prevPosts.map(p => p.id))
        const uniquePosts = newPosts.filter(p => !existingIds.has(p.id))
        console.log(`✅ Agregados ${uniquePosts.length} posts nuevos`)
        return [...prevPosts, ...uniquePosts]
      })

      setHasMore(moreAvailable)
      setPage(prev => prev + 1)
      
      if (!moreAvailable) {
        console.log('📝 No hay más publicaciones')
      }
    } catch (error) {
      console.error('❌ Error al cargar posts:', error)
    } finally {
      setLoading(false)
      setInitialLoad(false)
      // Resetear el flag después de un breve delay para evitar cargas múltiples
      setTimeout(() => setLoadingRequestSent(false), 1000)
    }
  }

  // Configurar Intersection Observer MEJORADO para evitar carga infinita
  useEffect(() => {
    if (loading || loadingRequestSent) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        // MEJORA: Solo cargar si el usuario realmente llegó al elemento Y hay más contenido
        if (target.isIntersecting && hasMore && !loading && !loadingRequestSent) {
          console.log('📍 Intersection Observer activado - Cargando una vez')
          loadMorePosts()
        }
      },
      { 
        threshold: 0.3, // Aumentado para ser menos sensible
        rootMargin: '50px' // Reducido para evitar carga prematura
      }
    )

    if (loadingRef.current && hasMore) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading, hasMore, loadingRequestSent])

  // Cargar posts iniciales
  useEffect(() => {
    loadMorePosts()
  }, [])

  // Componente para una publicación estilo Marketplace
  const PostCard: React.FC<{ post: Post }> = ({ post }) => (
    <div 
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'white',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: 'fit-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      {/* Imagen del producto */}
      <div style={{ position: 'relative' }}>
        <img 
          src={post.image} 
          alt="Producto"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }}
        />
        {post.price && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {post.price}
          </div>
        )}
      </div>

      <div style={{ padding: '12px' }}>
        {/* Header del post */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <img 
            src={post.avatar} 
            alt={post.author}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              marginRight: '8px'
            }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#1f2937' }}>
              {post.author}
            </h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '11px' }}>
              {post.timeAgo}
            </p>
          </div>
        </div>

        {/* Contenido del post */}
        <p style={{ 
          margin: '0 0 12px 0', 
          lineHeight: '1.4',
          fontSize: '14px',
          color: '#374151',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {post.content}
        </p>

        {/* Acciones del post - más compactas */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f3f4f6',
            paddingTop: '8px',
            color: '#6b7280',
            fontSize: '12px'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            👍 {post.likes}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            💬 {post.comments}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            📤 {post.shares}
          </span>
        </div>
      </div>
    </div>
  )

  // Loading inicial
  if (initialLoad && posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p>Cargando productos del marketplace...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>
        Marketplace UCT
      </h1>
      
      {/* Debug info - más compacto */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#64748b',
        textAlign: 'center'
      }}>
        📊 Productos: {posts.length} | Página: {page - 1} | Más contenido: {hasMore ? '✅' : '❌'} | Estado: {loading ? '🔄 Cargando...' : '💤 Listo'}
      </div>

      {/* GRID DE 3 COLUMNAS - ESTILO FACEBOOK MARKETPLACE */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Botón de Cargar Más - REEMPLAZA LA CARGA INFINITA AUTOMÁTICA */}
      {hasMore && !loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <button
            onClick={loadMorePosts}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Ver más productos
          </button>
        </div>
      )}

      {/* Loading indicator cuando se está cargando */}
      {loading && (
        <div 
          ref={loadingRef}
          style={{ textAlign: 'center', padding: '20px' }}
        >
          <div style={{ 
            width: '30px', 
            height: '30px', 
            border: '3px solid #f3f4f6',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ color: '#6b7280' }}>Cargando más productos...</p>
        </div>
      )}

      {/* Fin del feed */}
      {!hasMore && posts.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#6b7280'
        }}>
          🎉 <strong>¡Has visto todos los productos disponibles!</strong>
          <br />
          Total: {posts.length} productos en el marketplace
          <br />
          <small style={{ color: '#9ca3af' }}>Vuelve más tarde para ver nuevos productos</small>
        </div>
      )}

      {/* Mensaje si no hay posts */}
      {posts.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          color: '#6b7280'
        }}>
          📦 No hay productos disponibles en este momento
        </div>
      )}

      {/* CSS para animación */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
            gap: 15px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default InfiniteFeed