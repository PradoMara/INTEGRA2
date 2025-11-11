import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Post } from '@/types/Post'
import { createPost } from '../services/postsService'
import { postKeys } from './postKeys'

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<Post>) => createPost(input),
    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: postKeys.lists() })

      const previousLists = qc.getQueriesData<{
        posts: Post[]
        nextPage?: number
        hasMore: boolean
      }>({ queryKey: postKeys.lists() })

      // Optimist: prepend to every cached list (first page)
      previousLists.forEach(([key, data]) => {
        if (!data) return
        const tempId = `temp-${Date.now()}`
        const optimistic: Post = {
          id: tempId as unknown as number,
          title: newPost.title ?? 'Nuevo',
          description: newPost.description ?? '',
          content: newPost.content ?? '',
          categoryId: newPost.categoryId ?? 'misc',
          categoryName: newPost.categoryName ?? 'Misceláneo',
          author: (newPost as any).author ?? 'Yo',
          avatar: (newPost as any).avatar ?? 'https://via.placeholder.com/40',
          likes: 0,
          comments: 0,
          shares: 0,
          timeAgo: 'ahora',
          price: (newPost as any).price,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        qc.setQueryData(key, { ...data, posts: [optimistic, ...data.posts] })
        // seed detail cache too
        qc.setQueryData(postKeys.detail(optimistic.id), optimistic)
      })

      return { previousLists }
    },
    onError: (_err, _newPost, ctx) => {
      // rollback
      ctx?.previousLists?.forEach(([key, data]) => {
        if (data) {
          // refetch instead of complex diff, keep it simple
          qc.invalidateQueries({ queryKey: key as any })
        }
      })
    },
    onSuccess: (created) => {
      // Replace temp item if present and update detail cache
      const allLists = qc.getQueriesData<{ posts: Post[] }>({ queryKey: postKeys.lists() })
      allLists.forEach(([key, data]) => {
        if (!data) return
        const replaced = data.posts.map((p) => (String(p.id).startsWith('temp-') ? created : p))
        qc.setQueryData(key, { ...data, posts: replaced })
      })
      qc.setQueryData(postKeys.detail(created.id), created)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: postKeys.lists() })
    },
  })
}
