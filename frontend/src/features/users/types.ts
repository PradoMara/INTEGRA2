export type User = {
  id: string
  nombre: string
  email?: string
  avatarUrl?: string
  telefono?: string
  campus?: string
  about?: string
  reputacion?: number // 0..5
}