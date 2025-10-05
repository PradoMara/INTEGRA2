import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// import { msw } from 'vite-plugin-msw'
// import { handlers } from './src/mocks/handlers'

export default defineConfig(({ command }) => {

  const devDefines =
    command === 'serve'
      ? {
          'import.meta.env.VITE_DEV_RUN_ID': JSON.stringify(`${Date.now()}-${Math.random()}`),
        }
      : {}

  return {
    plugins: [
      react(),
      tailwindcss(),
      // msw({
      //   serviceWorker: {
      //     url: './public/mockServiceWorker.js',
      //     options: {
      //       scope: '/',
      //       // Evita que MSW intercepte rutas que no son de la API
      //       onUnhandledRequest: ({ method, url }) => {
      //         if (url.pathname.startsWith('/api/')) {
      //           console.error(`[MSW] Unhandled request: ${method} ${url.href}`);
      //         }
      //       },
      //     },
      //   },
      //   handlers,
      // }),
    ],
    define: {
      ...devDefines,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
