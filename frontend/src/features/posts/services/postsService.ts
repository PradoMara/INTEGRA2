import type { Post } from '@/types/Post'

export interface ListPostsParams {
  page?: number
  limit?: number
}

export interface ListPostsResult {
  posts: Post[]
  nextPage?: number
  hasMore: boolean
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function listPosts(params: ListPostsParams = {}): Promise<ListPostsResult> {
  const { page = 1, limit = 10 } = params
  const res = await fetch(`/api/posts?page=${page}&limit=${limit}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to list posts: ${res.status} ${text}`)
  }
  return res.json()
}

export async function getPostById(id: number | string): Promise<Post> {
  if (!id) throw new Error('post id is required')
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch post ${id}: ${res.status} ${text}`)
  }
  return res.json()
}

export async function createPost(input: Partial<Post>): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to create post: ${res.status} ${text}`)
  }
  return res.json()
}

export async function updatePost(id: number | string, input: Partial<Post>): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to update post ${id}: ${res.status} ${text}`)
  }
  return res.json()
}

export async function deletePost(id: number | string): Promise<{ id: number | string }> {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to delete post ${id}: ${res.status} ${text}`)
  }
  // some APIs return 204, we normalize to payload with id
  return { id }
}
