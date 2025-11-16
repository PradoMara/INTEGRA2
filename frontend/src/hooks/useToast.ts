import { useCallback } from 'react'
import { notify } from '@/lib/toast'

// Hook ligero que expone una API estable para toasts.
// Permite futura extensión (e.g. logger, tracking) sin cambiar llamadas.
export function useToast() {
  const success = useCallback((msg: string, opts?: any) => notify.success(msg, opts), [])
  const error = useCallback((msg: string, opts?: any) => notify.error(msg, opts), [])
  const info = useCallback((msg: string, opts?: any) => notify.info(msg, opts), [])
  const warning = useCallback((msg: string, opts?: any) => notify.warning(msg, opts), [])

  return { success, error, info, warning }
}

export type UseToast = ReturnType<typeof useToast>