import { useQuery } from '@tanstack/react-query'
import { getPostById } from '../services/postsService'
import { postKeys } from './postKeys'

export function usePostById(id: number | string | undefined, options?: { enabled?: boolean; initialData?: any }) {
  const enabled = (options?.enabled ?? true) && !!id
  return useQuery({
    queryKey: postKeys.detail(id ?? 'unknown'),
    queryFn: () => getPostById(id!),
    enabled,
    initialData: options?.initialData,
  })
}
