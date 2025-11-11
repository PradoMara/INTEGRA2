import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../services/postsService'
import { postKeys } from './postKeys'
import type { Post } from '@/types/Post'

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => deletePost(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: postKeys.all })

      const detailKey = postKeys.detail(id)
      const previousDetail = qc.getQueryData(detailKey)
      qc.removeQueries({ queryKey: detailKey, exact: true })

      const previousLists = qc.getQueriesData<{ posts: Post[] }>({ queryKey: postKeys.lists() })
      previousLists.forEach(([key, data]) => {
        if (!data) return
        qc.setQueryData(key, { ...data, posts: data.posts.filter((p) => String(p.id) !== String(id)) })
      })

      return { previousDetail, previousLists, id }
    },
    onError: (_err, _id, ctx) => {
      // rollback
      if (ctx?.previousDetail && ctx.id) {
        qc.setQueryData(postKeys.detail(ctx.id), ctx.previousDetail)
      }
      ctx?.previousLists?.forEach(([key, data]) => {
        if (data) qc.setQueryData(key, data)
      })
    },
    onSettled: (_data, _err, id) => {
      qc.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}
