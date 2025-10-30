import { Post, PostFilters } from '../domain/entities/Post'

const API_URL = '/api'

export const postService = {
  list: async (filters: Partial<PostFilters>): Promise<Post[]> => {
    const params = new URLSearchParams()
    if (filters.authorId) {
      params.append('authorId', filters.authorId)
    }
    // ... otros filtros si son necesarios

    const response = await fetch(`${API_URL}/posts?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Error fetching posts')
    }
    const data = await response.json()
    // El mock de MSW devuelve un objeto con una propiedad 'posts'
    return data.posts || []
  },
}
