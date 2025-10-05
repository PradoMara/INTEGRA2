import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers)

// Start the Service Worker.
worker.start({
  onUnhandledRequest: 'bypass',
})
