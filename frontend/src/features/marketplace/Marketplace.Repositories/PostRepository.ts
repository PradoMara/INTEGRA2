import type { Post } from "@/features/marketplace/Marketplace.Types/ProductInterfaces";

// Este tipo define qué datos necesita el formulario para crear un producto.
// Coincide con el 'body' que espera tu backend en 'products.js'
export interface CreateProductData {
  nombre: string;
  descripcion: string;
  precioActual: number;
  precioAnterior?: number | null;
  categoriaId: number; // ¡Importante! Usamos el ID de la categoría
  cantidad: number;
}

// Este tipo define la respuesta que esperamos del backend (basado en tu products.js)
export interface CreateProductResponse {
  ok: boolean;
  message: string;
  roleChanged: boolean;
  newRole: string; // "VENDEDOR", etc.
  product: Post; // Asumiendo que devuelve el producto completo o parcial
}

/**
 * Esta es la función 'productService.create' de tu tarea.
 * Llama al endpoint POST /api/products para crear un nuevo producto.
 * @param productData Los datos del formulario (nombre, precio, etc.)
 * @param token El token de autenticación del usuario
 * @returns La respuesta completa del backend (incluyendo 'roleChanged')
 */
export async function create(
  productData: CreateProductData, 
  token: string
): Promise<CreateProductResponse> {

  // 1. Llama al endpoint POST que viste en 'products.js'
  // ❗️Asegúrate de que la URL base '/api' sea correcta para tu proyecto
  const response = await fetch('/api/products', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 2. ¡MUY IMPORTANTE! Envía el token para la autenticación
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(productData)
  });

  // 3. Obtiene la respuesta del backend
  const data = await response.json();

  // 4. Si la respuesta no fue exitosa (ej. error 400, 500), lanza un error
  if (!response.ok) {
    if (data.errors) {
      const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
      throw new Error(errorMessages || 'Error de validación');
    }
    throw new Error(data.message || 'Error al crear el producto');
  }

  // 5. Devuelve la respuesta completa
  return data as CreateProductResponse;
}

// Exportamos un objeto, como sugiere 'productService'
export const productService = {
  create,
};