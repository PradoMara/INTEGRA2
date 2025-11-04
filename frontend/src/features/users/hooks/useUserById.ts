import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { User } from '../types'
import { userKeys } from './userKeys'

export function useUserById(id?: string, options?: { enabled?: boolean }) {
	const enabled = !!id && (options?.enabled ?? true)
	return useQuery<User>({
		queryKey: userKeys.byId(id),
		queryFn: () => userService.getUserById(id!),
		enabled,
		staleTime: 30_000,
		retry: 1,
	})
}

export type UseUserByIdResult = ReturnType<typeof useUserById>

