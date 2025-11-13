// Interfaces para el módulo Marketplace

export interface Vendedor {
  id: number
  nombre: string
  apellido: string
  correo: string
  campus: string
  reputacion: number
}

export interface Imagen {
    id: number
    url: string
    esPrincipal: boolean
    productoId: number
}

// Interfaz principal para el producto/post
export interface Post { 
  id: number
  title: string
  description: string
  price: string
  categoryName: string
  categoryId: string
  author: string 
  avatar: string
  image?: string
  
  // Campos del backend
  precioAnterior: number | null
  calificacion: number | null
  cantidad: number
  estado: string
  fechaAgregado: string
  imagenes: Imagen[]
  vendedor: Vendedor
}

// Interfaz para los filtros
export interface PostFilters {
  searchTerm: string
  categoryId: string
}

// Interfaces de la API (para Infinite Scroll)
export interface Pagination {
    page: number;
    limit: number; 
    total: number;
    totalPages: number;
}
export interface ProductApiResponse {
    ok: boolean;
    products: Post[]; 
    pagination: Pagination;
}
export interface FetchResult { 
  posts: Post[]; 
  nextPage: number | undefined; 
  hasMore: boolean;
}