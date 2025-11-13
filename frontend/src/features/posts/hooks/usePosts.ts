import { useQuery } from '@tanstack/react-query'
import { listPosts, type ListPostsParams, type ListPostsResult } from '../services/postsService'
import { postKeys } from './postKeys'

export function usePosts(params: ListPostsParams = {}) {
  return useQuery<ListPostsResult>({
    queryKey: postKeys.list(params),
    queryFn: () => listPosts(params),
    // v5 replacement for keepPreviousData
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  })
}
