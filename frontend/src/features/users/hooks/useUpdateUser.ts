import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { User } from '../types'
import { userKeys } from './userKeys'

type Variables = { id: string; data: Partial<User> }

export function useUpdateUser() {
	const qc = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: Variables) => userService.updateUser(id, data),
		onMutate: async ({ id, data }) => {
			await qc.cancelQueries({ queryKey: userKeys.me() })
			await qc.cancelQueries({ queryKey: userKeys.byId(id) })

			const prevMe = qc.getQueryData<User>(userKeys.me())
			const prevById = qc.getQueryData<User>(userKeys.byId(id))

			// Optimistic update: merge de campos
			if (prevMe && prevMe.id === id) {
				qc.setQueryData<User>(userKeys.me(), { ...prevMe, ...data })
			}
			if (prevById) {
				qc.setQueryData<User>(userKeys.byId(id), { ...prevById, ...data })
			}

			return { prevMe, prevById }
		},
		onError: (_err, { id }, ctx) => {
			if (ctx?.prevMe) qc.setQueryData(userKeys.me(), ctx.prevMe)
			if (ctx?.prevById) qc.setQueryData(userKeys.byId(id), ctx.prevById)
		},
		onSuccess: (user, { id }) => {
			// Fuente de la verdad: server/mock responde el usuario actualizado
			qc.setQueryData(userKeys.byId(id), user)
			if (user.id === id) qc.setQueryData(userKeys.me(), user)
		},
		onSettled: (_data, _err, { id }) => {
			qc.invalidateQueries({ queryKey: userKeys.byId(id) })
			qc.invalidateQueries({ queryKey: userKeys.me() })
		},
	})
}

export type UseUpdateUserResult = ReturnType<typeof useUpdateUser>

