export const userKeys = {
	all: ['users'] as const,
	me: () => [...userKeys.all, 'me'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	byId: (id: string | undefined) => [...userKeys.all, 'by-id', id ?? ''] as const,
}

export type UserKey = ReturnType<typeof userKeys.me> | ReturnType<typeof userKeys.byId>

