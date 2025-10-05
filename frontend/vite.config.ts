import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ command }) => {

  const devDefines =
    command === 'serve'
      ? {
          'import.meta.env.VITE_DEV_RUN_ID': JSON.stringify(`${Date.now()}-${Math.random()}`),
        }
      : {}

  return {
    plugins: [react(), tailwindcss()],
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
