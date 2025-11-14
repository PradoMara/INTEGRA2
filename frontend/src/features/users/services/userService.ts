import type { User } from '../types'

const handleErrors = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || res.statusText || 'Error en userService')
  }
  return res.json()
}

/**
 * userService
 * - Llama a rutas relativas /api/* (MSW debe interceptar estas rutas en dev)
 * - No hace llamadas a APIs externas
 */
export const userService = {
  async getMe(): Promise<User> {
    const res = await fetch('/api/me', { credentials: 'include' })
    return handleErrors(res)
  },

  async getUserById(id: string): Promise<User> {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { credentials: 'include' })
    return handleErrors(res)
  },

  async updateUser(id: string, payload: Partial<User>): Promise<User> {
    const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return handleErrors(res)
  },
}