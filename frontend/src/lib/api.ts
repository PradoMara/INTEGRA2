// frontend/src/lib/api.ts - CORREGIDO

// Importamos el store para poder leer el token
import { useAuthStore } from '../store/authStore';

// Obtenemos la URL base de las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;
  payload: any;
  constructor(message: string, status = 0, payload: any = null) {
    super(message);
    this.status = status;
    this.payload = payload;
    this.name = "ApiError";
  }
}

/**
 * apiFetch: fetch wrapper que:
 * - concatena VITE_API_URL si path es relativo
 * - parsea JSON y lanza ApiError con mensaje amigable cuando !res.ok
 */
export async function apiFetch(input: string, init?: RequestInit) {
  const base = (import.meta.env.VITE_API_URL as string) || "";
  const url = /^https?:\/\//.test(input) ? input : `${base.replace(/\/$/, "")}${input.startsWith("/") ? "" : "/"}${input}`;
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
  } catch (err) {
    throw new ApiError("Error de red: revisa tu conexión", 0, null);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    // mensaje proveniente del body (si existe) o mapeo por status
    const serverMsg = isJson && body && (body.message || body.error) ? (body.message || body.error) : null;
    let friendly = serverMsg ?? `${res.status}: Error en la petición`;

    switch (res.status) {
      case 400: friendly = serverMsg ?? "400: Petición inválida"; break;
      case 401: friendly = serverMsg ?? "401: No autorizado. Por favor inicia sesión."; break;
      case 403: friendly = serverMsg ?? "403: Acceso denegado."; break;
      case 404: friendly = serverMsg ?? "404: No encontrado."; break;
      case 500: friendly = serverMsg ?? "500: Error interno del servidor. Intenta más tarde."; break;
      default: friendly = serverMsg ?? `${res.status}: Error del servidor`; break;
    }

    throw new ApiError(friendly, res.status, body);
  }

  return body;
}

// Exportamos métodos específicos
export const api = {
  get: <T>(endpoint: string): Promise<T> => apiFetch(endpoint),

  post: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T, U>(endpoint: string, body: U): Promise<T> =>
    apiFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string): Promise<T> =>
    apiFetch(endpoint, {
      method: 'DELETE',
    }),
};