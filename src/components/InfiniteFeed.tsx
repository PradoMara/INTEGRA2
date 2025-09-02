import React, { useState, useCallback } from 'react'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

interface Post {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
}

// Simulador simple de API
const fetchPosts = async (page: number): Promise<{ posts: Post[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const posts: Post[] = Array.from({ length: 5 }, (_, i) => ({
    id: (page - 1) * 5 + i + 1,
    title: `Publicación ${(page - 1) * 5 + i + 1}`,
    content: `Contenido de ejemplo para la publicación ${(page - 1) * 5 + i + 1}`,
    author: `Usuario ${(page - 1) * 5 + i + 1}`,
    createdAt: new Date().toISOString()
  }))
  
  return { posts, hasMore: page < 3 } // Solo 3 páginas para el ejemplo
}

const InfiniteFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchMore = useCallback(async () => {
    const { posts: newPosts, hasMore: moreAvailable } = await fetchPosts(currentPage)
    setPosts(prevPosts => [...prevPosts, ...newPosts])
    setCurrentPage(prev => prev + 1)
    setHasMore(moreAvailable)
  }, [currentPage])

  const { isFetching } = useInfiniteScroll({ fetchMore, hasMore })

  React.useEffect(() => {
    fetchMore()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Feed de Publicaciones</h1>
      
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 mb-4 rounded-lg shadow border">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-gray-600 mt-2">{post.content}</p>
          <div className="text-sm text-gray-400 mt-3">
            Por {post.author} - {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
      
      {isFetching && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando más publicaciones...</p>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          ¡Has llegado al final!
        </div>
      )}
    </div>
  )
}

export default InfiniteFeed