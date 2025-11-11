import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePosts } from '../../hooks/usePosts'
import { useCreatePost } from '../../hooks/useCreatePost'
import { useUpdatePost } from '../../hooks/useUpdatePost'
import { useDeletePost } from '../../hooks/useDeletePost'
import { postKeys } from '../../hooks/postKeys'

function ListLoader() {
  const { data, isLoading } = usePosts({ page: 1, limit: 5 })
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="count">{data?.posts?.length ?? 0}</div>
      <ul>
        {data?.posts?.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  )
}

function Mutator() {
  const create = useCreatePost()
  const update = useUpdatePost()
  const del = useDeletePost()
  return (
    <div>
      <button onClick={() => create.mutate({ title: 'X', description: 'Y' })}>create</button>
      <button onClick={() => update.mutate({ id: 1, changes: { title: 'Z' } })}>update1</button>
      <button onClick={() => del.mutate(1)}>delete1</button>
    </div>
  )
}

describe('posts hooks cache', () => {
  it('optimistically adds on create and invalidates lists', async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: 0, staleTime: 0, gcTime: 60_000 } },
    })
    render(
      <QueryClientProvider client={qc}>
        <ListLoader />
        <Mutator />
      </QueryClientProvider>
    )

    // initial load
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    const initial = Number(screen.getByTestId('count').textContent)
    expect(initial).toBeGreaterThan(0)

    // create
    fireEvent.click(screen.getByText('create'))

    await waitFor(() => {
      const data = qc.getQueryData<{ posts: any[] }>(postKeys.list({ page: 1, limit: 5 }) as any)
      expect(data?.posts?.length).toBeGreaterThanOrEqual(initial + 1)
    })
  })
})
