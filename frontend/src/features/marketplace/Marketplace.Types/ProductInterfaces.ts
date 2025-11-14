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
  nombre: string           // FIX: Era 'title'
  descripcion: string       // FIX: Era 'description' (aunque coincidía, lo alineamos)
  precioActual: number     // FIX: Era 'price' y de tipo string
  precioAnterior: number | null
  categoria: string         // FIX: Era 'categoryName'/'categoryId'
  calificacion: number | null
  cantidad: number
  estado: string
  fechaAgregado: string
  imagenes: Imagen[]        // FIX: Tu tipo anterior tenía 'image?: string'
  vendedor: Vendedor

  // Eliminamos los campos que no venían en el JSON
  // title, price, categoryName, categoryId, author, avatar, image
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