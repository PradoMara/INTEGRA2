import { http, HttpResponse } from 'msw'
import { Post } from '../features/marketplace/domain/entities/Post'
import { User } from '../features/auth/entities/User'

const API_URL = '/api' // Usar ruta relativa

// Datos de categorías (puedes moverlos a un archivo compartido si es necesario)
const categories = [
  { id: 'electronics', name: 'Electrónicos' },
  { id: 'books', name: 'Libros y Materiales' },
  { id: 'clothing', name: 'Ropa y Accesorios' },
  { id: 'sports', name: 'Deportes' },
  { id: 'home', name: 'Hogar y Jardín' },
  { id: 'vehicles', name: 'Vehículos' },
  { id: 'services', name: 'Servicios' }
]

// Datos de productos (puedes moverlos a un archivo compartido si es necesario)
const productData = [
  { title: 'iPhone 14 Pro Max', desc: 'Excelente estado, incluye cargador y caja original', category: 'electronics', priceRange: [800000, 1200000] },
  { title: 'Laptop Gaming ASUS', desc: 'Perfect para gaming y diseño, RTX 4060, 16GB RAM', category: 'electronics', priceRange: [1500000, 2000000] },
  { title: 'Samsung Galaxy S23', desc: 'Como nuevo, sin rayones, batería al 100%', category: 'electronics', priceRange: [600000, 900000] },
  { title: 'MacBook Air M2', desc: 'Ideal para estudiantes, muy poco uso', category: 'electronics', priceRange: [1200000, 1800000] },
  { title: 'Cálculo I - Stewart', desc: 'Libro universitario en perfecto estado, sin marcas', category: 'books', priceRange: [45000, 65000] },
  { title: 'Programación en Java', desc: 'Libro técnico con ejemplos prácticos', category: 'books', priceRange: [35000, 55000] },
  { title: 'Física Universitaria', desc: 'Volumen 1 y 2, ideales para ingeniería', category: 'books', priceRange: [80000, 120000] },
  { title: 'Calculadora Científica HP', desc: 'Modelo HP-35s, perfecta para exámenes', category: 'books', priceRange: [80000, 100000] },
  { title: 'Zapatillas Nike Air Max', desc: 'Talla 42, usadas pocas veces, muy cómodas', category: 'clothing', priceRange: [60000, 90000] },
  { title: 'Chaqueta North Face', desc: 'Impermeable, talla M, ideal para lluvia', category: 'clothing', priceRange: [120000, 180000] },
  { title: 'Reloj Casio G-Shock', desc: 'Resistente al agua, batería nueva', category: 'clothing', priceRange: [80000, 120000] },
  { title: 'Bicicleta de Montaña Trek', desc: 'Aro 29, frenos hidráulicos, excelente estado', category: 'sports', priceRange: [400000, 600000] },
  { title: 'Pelota de Fútbol Nike', desc: 'Oficial FIFA, poco uso, ideal para entrenar', category: 'sports', priceRange: [25000, 35000] },
  { title: 'Raqueta de Tenis Wilson', desc: 'Profesional, incluye funda y overgrips', category: 'sports', priceRange: [80000, 150000] },
  { title: 'Sofá de 3 Cuerpos', desc: 'Muy cómodo, color gris, estado impecable', category: 'home', priceRange: [200000, 350000] },
  { title: 'Mesa de Comedor', desc: 'Madera sólida, para 6 personas, barnizada', category: 'home', priceRange: [150000, 250000] },
  { title: 'Microondas Samsung', desc: '20 litros, funciona perfecto, poco uso', category: 'home', priceRange: [60000, 90000] },
  { title: 'Toyota Corolla 2018', desc: 'Automático, 50.000 km, mantenciones al día', category: 'vehicles', priceRange: [12000000, 15000000] },
  { title: 'Honda CB600F', desc: 'Moto deportiva, revisión técnica vigente', category: 'vehicles', priceRange: [3500000, 4500000] },
  { title: 'Clases de Matemáticas', desc: 'Profesor universitario, online o presencial', category: 'services', priceRange: [15000, 25000] },
  { title: 'Reparación de Computadores', desc: 'Servicio técnico especializado, domicilio', category: 'services', priceRange: [20000, 50000] }
]

// Simulamos una "base de datos" en memoria para el usuario actual
const CURRENT_USER_ID = '1'

// Función para generar posts (similar a la que tenías, pero ahora en el mock de MSW)
const generatePosts = (page: number, limit: number, filters: { categoryId?: string, searchTerm?: string, authorId?: string }): Post[] => {
  const posts: Post[] = []
  const startId = (page - 1) * limit

  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1
    const productIndex = (id - 1) % productData.length
    const product = productData[productIndex]
    const category = categories.find(cat => cat.id === product.category)!

    // Si estamos filtrando por authorId, solo mostramos posts del usuario actual
    const postAuthorId = filters.authorId ? CURRENT_USER_ID : `user-${(id % 5) + 1}`
    
    if (filters.authorId && postAuthorId !== filters.authorId) {
      continue
    }

    const post: Post = {
      id,
      title: `${product.title} ${Math.floor(id / productData.length) > 0 ? `(${Math.floor(id / productData.length) + 1})` : ''}`,
      description: product.desc,
      content: `${product.title} - ${product.desc}`,
      categoryId: product.category,
      categoryName: category.name,
      author: filters.authorId ? 'Mi Usuario' : `${category.name === 'Servicios' ? 'Proveedor' : 'Usuario'} ${id}`,
      avatar: `https://avatar.iran.liara.run/public/${id}`,
      image: `https://picsum.photos/400/300?random=${id}`,
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 15),
      shares: Math.floor(Math.random() * 5),
      timeAgo: `${Math.floor(Math.random() * 48)}h`,
      price: `$${(Math.random() * (product.priceRange[1] - product.priceRange[0]) + product.priceRange[0]).toLocaleString('es-CL')}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    posts.push(post)
  }

  // Aplicar filtros adicionales
  return posts.filter(post => {
    if (filters.categoryId && post.categoryId !== filters.categoryId) {
      return false
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(searchLower)
      const matchesDescription = post.description.toLowerCase().includes(searchLower)
      return matchesTitle || matchesDescription
    }
    return true
  })
}

export const handlers = [
  // GET /api/posts - Listar posts con filtros
  http.get(`${API_URL}/posts`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)
    const categoryId = url.searchParams.get('categoryId') || undefined
    const searchTerm = url.searchParams.get('searchTerm') || undefined
    const authorId = url.searchParams.get('authorId') || undefined

    const posts = generatePosts(page, limit, { categoryId, searchTerm, authorId })
    const nextPage = posts.length === limit ? page + 1 : undefined
    const hasMore = posts.length === limit
    const totalCount = authorId ? Math.min(15, posts.length) : 100 // Simulamos que el usuario tiene menos posts

    return HttpResponse.json({
      posts,
      nextPage,
      hasMore,
      totalCount,
    })
  }),

  // GET /api/me - Información del usuario actual
  http.get(`${API_URL}/me`, () => {
    const user: User = {
      id: CURRENT_USER_ID,
      name: 'Juan Estudiante',
      email: 'juan.estudiante@alu.uct.cl',
      avatar: 'https://avatar.iran.liara.run/public/1',
      campus: 'Temuco',
      rating: 4.5,
      preferredDeliverySpots: ['Biblioteca Central', 'Cafetería'],
      role: 'user',
    }
    return HttpResponse.json(user)
  }),

  // PATCH /api/posts/:id - Actualizar un post (para optimistic updates)
  http.patch(`${API_URL}/posts/:id`, async ({ request, params }) => {
    // Simular delay de red para ver el optimistic update
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const { id } = params
    const updatedData = await request.json() as Partial<Post>

    // Buscar el post original para mantener sus datos
    const originalPost = generatePosts(1, 100, {}).find(post => post.id === Number(id))
    
    if (!originalPost) {
      return new HttpResponse(null, { status: 404 })
    }

    // Fusionar datos actualizados con los originales
    const updatedPost: Post = {
      ...originalPost,
      ...updatedData,
      updatedAt: new Date(),
    }

    return HttpResponse.json(updatedPost)
  }),

  // POST /api/posts - Crear nuevo post (para funcionalidad futura)
  http.post(`${API_URL}/posts`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const postData = await request.json() as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
    
    const newPost: Post = {
      ...postData,
      id: Date.now(), // ID temporal
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'Mi Usuario',
      avatar: 'https://avatar.iran.liara.run/public/1',
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: 'ahora',
    }

    return HttpResponse.json(newPost)
  }),

  // DELETE /api/posts/:id - Eliminar post (para funcionalidad futura)
  http.delete(`${API_URL}/posts/:id`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { id } = params
    
    // En una implementación real, eliminarías el post de la base de datos
    console.log(`Post ${id} eliminado`)
    
    return new HttpResponse(null, { status: 204 })
  }),
]
