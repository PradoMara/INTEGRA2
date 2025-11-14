import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { User } from '../types'
import { userKeys } from './userKeys'

export function useMe(options?: { enabled?: boolean }) {
	const { enabled = true } = options ?? {}
	return useQuery<User>({
		queryKey: userKeys.me(),
		queryFn: userService.getMe,
		enabled,
		// Ajustes suaves para dev con MSW
		staleTime: 30_000,
		retry: 1,
	})
}

export type UseMeResult = ReturnType<typeof useMe>

