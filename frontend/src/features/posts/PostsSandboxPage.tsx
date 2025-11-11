import { useState } from 'react'
import { usePosts } from './hooks/usePosts'
import { useCreatePost } from './hooks/useCreatePost'
import { useUpdatePost } from './hooks/useUpdatePost'
import { useDeletePost } from './hooks/useDeletePost'
import { formatCLP } from '@/features/marketplace/Marketplace.Utils/format'

export default function PostsSandboxPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(6)
  const { data, isLoading, isError } = usePosts({ page, limit })
  const createMutation = useCreatePost()
  const updateMutation = useUpdatePost()
  const deleteMutation = useDeletePost()

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto grid gap-4">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="m-0 text-2xl font-semibold tracking-tight">Sandbox de Publicaciones</h1>
            <p className="m-0 text-sm text-slate-500">Página interna para probar hooks de posts (CRUD, caché y optimistas)</p>
          </div>
          <div className="inline-flex gap-2">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
              onClick={() =>
                createMutation.mutate({ title: 'Nuevo post', description: 'Creado desde sandbox' })
              }
            >
              + Crear post
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm disabled:opacity-50"
              disabled={!data?.posts?.[0]}
              onClick={() =>
                data?.posts?.[0] &&
                updateMutation.mutate({ id: data.posts[0].id, changes: { title: 'Actualizado!' } })
              }
            >
              ✏️ Actualizar primero
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 text-sm disabled:opacity-50"
              disabled={!data?.posts?.[0]}
              onClick={() => data?.posts?.[0] && deleteMutation.mutate(data.posts[0].id)}
            >
              🗑️ Eliminar primero
            </button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="text-slate-500">Items por página</span>
            <select
              className="px-2 py-1.5 rounded-md border border-slate-300 bg-white"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 6)}
            >
              {[6, 9, 12].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ◀ Anterior
            </button>
            <span className="text-sm text-slate-600">Página {page}</span>
            <button
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm disabled:opacity-50"
              disabled={!data?.hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente ▶
            </button>
          </div>
        </div>

        {/* Estados */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
            ))}
          </div>
        )}
        {isError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            Ocurrió un error al cargar las publicaciones.
          </div>
        )}

        {/* Grid de tarjetas */}
        {!!data?.posts?.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.posts.map((p) => (
              <article
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_6px_28px_rgba(0,0,0,0.06)] border border-slate-200 flex flex-col"
              >
                <div className="aspect-4/3 bg-slate-100" />
                <div className="p-4 grid gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="m-0 text-base font-semibold leading-tight line-clamp-2">{p.title}</h3>
                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 text-[11px] rounded-full bg-slate-100 text-slate-600 border border-slate-200">#{p.id}</span>
                  </div>
                  <p className="m-0 text-sm text-slate-600 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">{p.author}</div>
                    <div className="text-sm font-semibold">
                      {p.price ? formatCLP(parseFloat(String(p.price)) || 0) : '—'}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      className="px-2.5 py-1 text-xs rounded-md bg-sky-600 text-white hover:bg-sky-700"
                      onClick={() => updateMutation.mutate({ id: p.id, changes: { title: p.title + ' ✏️' } })}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2.5 py-1 text-xs rounded-md bg-rose-600 text-white hover:bg-rose-700"
                      onClick={() => deleteMutation.mutate(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
