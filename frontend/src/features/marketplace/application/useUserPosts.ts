import { useQuery } from '@tanstack/react-query'
import { postService } from '../application/postService'

export const useUserPosts = (authorId: string | undefined) => {
  return useQuery({
    queryKey: ['posts', { authorId }],
    queryFn: () => postService.list({ authorId }),
    enabled: !!authorId, // Solo ejecuta la consulta si authorId está definido
  })
}
