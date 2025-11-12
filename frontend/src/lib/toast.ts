import { toast } from 'react-hot-toast'

// API global de notificaciones (no sobrescribe métodos internos para evitar recursión)
export const notify = {
  success: (message: string, opts?: Parameters<typeof toast.success>[1]) => toast.success(message, opts),
  error: (message: string, opts?: Parameters<typeof toast.error>[1]) => toast.error(message, opts),
  info: (message: string, opts?: Parameters<typeof toast>[1]) => toast(message, opts),
  warning: (message: string, opts?: Parameters<typeof toast>[1]) => toast(message, { icon: '⚠️', ...opts }),
  promise: toast.promise,
  dismiss: toast.dismiss,
  raw: toast,
}

export type Notify = typeof notify
