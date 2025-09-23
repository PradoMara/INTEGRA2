// Entidad Category del dominio
export interface Category {
  id: string
  name: string
  description?: string
  parentCategoryId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Entidad User del dominio
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  campus?: string
  reputation: number
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

// Enums para User
export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// Entidad Transaction del dominio
export interface Transaction {
  id: string
  postId: number
  buyerId: string
  sellerId: string
  amount: number
  status: TransactionStatus
  createdAt: Date
  completedAt?: Date
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}