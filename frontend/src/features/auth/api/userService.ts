import { User } from '../entities/User'

const API_URL = '/api'

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_URL}/me`)
    if (!response.ok) {
      throw new Error('Error fetching user data')
    }
    return response.json()
  },
}
