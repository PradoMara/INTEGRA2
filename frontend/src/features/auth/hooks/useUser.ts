import { useQuery } from '@tanstack/react-query'
import { userService } from '../api/userService'

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userService.getMe,
  })
}
