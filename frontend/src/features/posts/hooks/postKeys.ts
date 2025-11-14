export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  // params can be any serializable object used for pagination/filters
  list: (params?: unknown) => [...postKeys.lists(), params ?? {}] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...postKeys.details(), String(id)] as const,
}
