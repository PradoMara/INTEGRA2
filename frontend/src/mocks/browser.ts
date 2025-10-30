import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Exporta el worker. El arranque se hace desde main.tsx para evitar dobles start.
export const worker = setupWorker(...handlers)
