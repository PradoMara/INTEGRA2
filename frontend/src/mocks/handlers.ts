import { http, HttpResponse } from 'msw'

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
  http.get('/api/posts', ({ request }: any) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') || '1'
    const limit = url.searchParams.get('limit') || '9'
    // Mock data for posts
    const posts = Array.from({ length: parseInt(limit) }, (_, i) => ({
      id: (parseInt(page) - 1) * parseInt(limit) + i + 1,
      title: `Post ${(parseInt(page) - 1) * parseInt(limit) + i + 1}`,
      description: `Content ${(parseInt(page) - 1) * parseInt(limit) + i + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      category: 'electronics',
      categoryName: 'Electrónicos',
      userId: 1,
      author: 'User ' + (i + 1),
      avatar: 'https://via.placeholder.com/40',
      timeAgo: 'hace 2 horas',
      image: 'https://via.placeholder.com/300x200',
      sellerRating: 4.5,
      sellerSales: Math.floor(Math.random() * 50) + 1,
    }))
    return HttpResponse.json({
      posts,
      nextPage: parseInt(page) < 5 ? parseInt(page) + 1 : undefined, // Mock pagination
      hasMore: parseInt(page) < 5,
    })
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
