// src/features/marketplace/hooks/usePost.ts
import { useQuery } from '@tanstack/react-query'
import { PostUseCasesImpl } from './PostUseCases'
import { MockPostRepository } from '@/features/marketplace/Marketplace.Repositories/MockPostRepository'

const usePosts = () => {
  const repo = new MockPostRepository()
  const usecase = new PostUseCasesImpl(repo)

  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await usecase.getPostsWithFilters({ searchTerm: '', categoryId: '' }, 1)
      return res.posts as any
    },
  })
}

export default usePosts
