import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Post } from '@/types/Post'
import { updatePost } from '../services/postsService'
import { postKeys } from './postKeys'

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: number | string; changes: Partial<Post> }) => updatePost(id, changes),
    onMutate: async ({ id, changes }) => {
      await qc.cancelQueries({ queryKey: postKeys.all })

      const detailKey = postKeys.detail(id)
      const previousDetail = qc.getQueryData<Post>(detailKey)

      // optimistic detail
      if (previousDetail) {
        qc.setQueryData<Post>(detailKey, { ...previousDetail, ...changes, updatedAt: new Date() })
      }

      // optimistic in all list caches
      const previousLists = qc.getQueriesData<{ posts: Post[] }>({ queryKey: postKeys.lists() })
      previousLists.forEach(([key, data]) => {
        if (!data) return
        qc.setQueryData(key, {
          ...data,
          posts: data.posts.map((p) => (String(p.id) === String(id) ? { ...p, ...changes } : p)),
        })
      })

      return { previousDetail, previousLists }
    },
    onError: (_err, vars, ctx) => {
      // rollback
      const id = vars.id
      if (ctx?.previousDetail) qc.setQueryData(postKeys.detail(id), ctx.previousDetail)
      ctx?.previousLists?.forEach(([key, data]) => {
        if (data) qc.setQueryData(key, data)
      })
    },
    onSuccess: (updated) => {
      qc.setQueryData(postKeys.detail(updated.id), updated)
    },
    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries({ queryKey: postKeys.detail(vars.id) })
      qc.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}
