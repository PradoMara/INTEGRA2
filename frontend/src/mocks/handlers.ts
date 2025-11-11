import { http, HttpResponse } from 'msw'
import type { Post } from '@/types/Post'

// Estado en memoria para el usuario autenticado (demo)
let currentUser = {
  id: 'u-1',
  nombre: 'Usuario Demo',
  email: 'usuariodemo@alu.uct.cl',
  campus: 'Campus San Juan Pablo II',
  reputacion: 4.5,
  avatarUrl: 'https://via.placeholder.com/96',
  about: 'Perfil de prueba (MSW)'
}

// In-memory posts
function seedPosts(count = 30): Post[] {
  const now = new Date()
  const arr: Post[] = []
  for (let i = 1; i <= count; i++) {
    arr.push({
      id: i,
      title: `Post ${i}`,
      description: `Descripción del post ${i}`,
      content: `Contenido simulado para el post ${i}.`,
      categoryId: i % 2 === 0 ? 'electronics' : 'services',
      categoryName: i % 2 === 0 ? 'Electrónica' : 'Servicios',
      author: `Usuario ${((i - 1) % 5) + 1}`,
      avatar: 'https://via.placeholder.com/40',
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10),
      timeAgo: `${(i % 5) + 1} h`,
      price: String(10000 + i * 500),
      createdAt: now,
      updatedAt: now,
    })
  }
  return arr
}

let posts: Post[] = seedPosts()

export const handlers = [
  http.get('/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ])
  }),
  http.get('/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
    ])
  }),
  // --- Posts in-memory store ---
  http.get('/api/posts', ({ request }: any) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const start = (page - 1) * limit
    const end = start + limit
    const slice = posts.slice(start, end)
    const hasMore = end < posts.length
    const nextPage = hasMore ? page + 1 : undefined
    return HttpResponse.json({ posts: slice, hasMore, nextPage })
  }),
  http.get('/api/posts/:id', ({ params }: any) => {
    const { id } = params as { id: string }
  const found = posts.find((p: Post) => String(p.id) === String(id))
    if (!found) return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    return HttpResponse.json(found)
  }),
  http.post('/api/posts', async ({ request }: any) => {
    // simulate latency to expose optimistic updates in tests
    await new Promise((r) => setTimeout(r, 80))
    const body = (await request.json().catch(() => ({}))) as Partial<Post>
  const nextId = posts.length ? Math.max(...posts.map((p: Post) => Number(p.id))) + 1 : 1
    const now = new Date()
    const created: Post = {
      id: nextId,
      title: body.title ?? `Post ${nextId}`,
      description: body.description ?? '',
      content: body.content ?? '',
      categoryId: body.categoryId ?? 'misc',
      categoryName: body.categoryName ?? 'Misceláneo',
      author: (body as any).author ?? 'Usuario Demo',
      avatar: (body as any).avatar ?? 'https://via.placeholder.com/40',
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: 'ahora',
      price: (body as any).price,
      createdAt: now,
      updatedAt: now,
    }
    posts.unshift(created)
    return HttpResponse.json(created, { status: 201 })
  }),
  http.put('/api/posts/:id', async ({ params, request }: any) => {
    const { id } = params as { id: string }
  const idx = posts.findIndex((p: Post) => String(p.id) === String(id))
    if (idx === -1) return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    const body = (await request.json().catch(() => ({}))) as Partial<Post>
    posts[idx] = { ...posts[idx], ...body, updatedAt: new Date() }
    return HttpResponse.json(posts[idx])
  }),
  http.delete('/api/posts/:id', ({ params }: any) => {
    const { id } = params as { id: string }
  const idx = posts.findIndex((p: Post) => String(p.id) === String(id))
    if (idx === -1) return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    const [deleted] = posts.splice(idx, 1)
    return HttpResponse.json({ id: deleted.id })
  }),
  // Usuario autenticado (compat: exponemos ambos esquemas de nombres)
  http.get('/api/me', () => {
    return HttpResponse.json({
      // Esquema para nuestro dominio
      ...currentUser,
      // Campos alternativos para compat con otras vistas antiguas
      idLegacy: 1,
      name: currentUser.nombre,
      rating: currentUser.reputacion,
      avatar: currentUser.avatarUrl,
      role: 'user',
    })
  }),

  // Obtener usuario por id
  http.get('/api/users/:id', (ctx: any) => {
    const { params } = ctx as { params: { id: string } }
    const { id } = params
    if (id !== currentUser.id) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json(currentUser)
  }),

  // Actualizar usuario por id
  http.put('/api/users/:id', async (ctx: any) => {
    const { params, request } = ctx as { params: { id: string }; request: Request }
    const { id } = params
    if (id !== currentUser.id) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const body = (await request.json().catch(() => ({}))) as Partial<typeof currentUser>
    currentUser = { ...currentUser, ...body }
    return HttpResponse.json(currentUser)
  }),
  http.get('/perfil', () => {
    return HttpResponse.json({
      id: 1,
      name: 'User 1',
      email: 'user1@example.com',
      role: 'user',
      campus: 'Main Campus',
      deliveryPlaces: ['Place 1', 'Place 2'],
      rating: 4.5,
      avatar: 'https://via.placeholder.com/96',
    })
  }),
  http.get('/home', () => {
    return HttpResponse.json({ message: 'Home page' })
  }),
]
