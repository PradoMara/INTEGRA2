import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

interface Post {
  id: number
  title: string
  content: string
  author: string
}

// API simulada simple
const fetchPosts = async (page: number): Promise<{ posts: Post[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const posts: Post[] = Array.from({ length: 5 }, (_, i) => ({
    id: (page - 1) * 5 + i + 1,
    title: `Post ${(page - 1) * 5 + i + 1}`,
    content: `Contenido del post ${(page - 1) * 5 + i + 1}`,
    author: `Usuario ${(page - 1) * 5 + i + 1}`
  }))
  
  return { posts, hasMore: page < 4 }
}

const OptimizedFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([])
  
  const VISIBLE_LIMIT = 10 // Solo mantener 10 posts en DOM

  const fetchMore = useCallback(async () => {
    const { posts: newPosts, hasMore: moreAvailable } = await fetchPosts(currentPage)
    setPosts(prevPosts => {
      const updated = [...prevPosts, ...newPosts]
      // Solo mantener los últimos posts visibles para optimizar DOM
      if (updated.length > VISIBLE_LIMIT) {
        setVisiblePosts(updated.slice(-VISIBLE_LIMIT))
      } else {
        setVisiblePosts(updated)
      }
      return updated
    })
    setCurrentPage(prev => prev + 1)
    setHasMore(moreAvailable)
  }, [currentPage])

  const { isFetching } = useInfiniteScroll({ fetchMore, hasMore })

  useEffect(() => {
    fetchMore()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Feed Optimizado</h1>
      <p className="text-sm text-gray-500 mb-4">
        Mostrando {visiblePosts.length} de {posts.length} posts (DOM optimizado)
      </p>
      
      {visiblePosts.map((post) => (
        <div key={post.id} className="bg-white p-4 mb-4 rounded-lg shadow border">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-gray-600 mt-2">{post.content}</p>
          <div className="text-sm text-gray-400 mt-3">Por {post.author}</div>
        </div>
      ))}
      
      {isFetching && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-4 text-gray-500">¡Final del feed!</div>
      )}
    </div>
  )
}

export default OptimizedFeed