export interface User {
  id: string
  name: string
  email: string
  avatar: string
  campus: string
  rating: number
  preferredDeliverySpots: string[]
  role: 'user' | 'admin'
}
