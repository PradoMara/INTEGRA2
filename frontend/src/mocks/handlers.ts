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

// Función para generar posts (similar a la que tenías, pero ahora en el mock de MSW)
const generatePosts = (page: number, limit: number, filters: { categoryId?: string, searchTerm?: string, authorId?: string }): Post[] => {
  const posts: Post[] = []
  const startId = (page - 1) * limit

  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1
    const productIndex = (id - 1) % productData.length
    const product = productData[productIndex]
    const category = categories.find(cat => cat.id === product.category)!

    if (filters.authorId && `user-${filters.authorId}` !== `user-${id}`) {
        continue;
    }

    const post: Post = {
      id,
      title: `${product.title} ${Math.floor(id / productData.length) > 0 ? `(${Math.floor(id / productData.length) + 1})` : ''}`,
      description: product.desc,
      content: `${product.title} - ${product.desc}`,
      categoryId: product.category,
      categoryName: category.name,
      author: `${category.name === 'Servicios' ? 'Proveedor' : 'Usuario'} ${id}`,
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

  // Aplicar filtros
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
  http.get(`${API_URL}/posts`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)
    const categoryId = url.searchParams.get('categoryId') || undefined
    const searchTerm = url.searchParams.get('searchTerm') || undefined
    const authorId = url.searchParams.get('authorId') || undefined

    const posts = generatePosts(page, limit, { categoryId, searchTerm, authorId })
    const nextPage = posts.length === limit ? page + 1 : null
    const totalCount = 100 // Simula un conteo total

    return HttpResponse.json({
      posts,
      nextPage,
      totalCount,
    })
  }),

  http.get(`${API_URL}/me`, () => {
    const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://avatar.iran.liara.run/public/1',
        campus: 'San Francisco',
        rating: 4.5,
        preferredDeliverySpots: ['Biblioteca', 'Gimnasio'],
        role: 'user',
    }
    return HttpResponse.json(user)
  }),
]
