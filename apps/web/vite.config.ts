import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      // En desarrollo, /api/... se reenvía al backend sin el prefijo /api.
      // En producción hace lo mismo la reescritura de Vercel (vercel.json).
      '/api': { target: 'http://localhost:3000', rewrite: (path) => path.replace(/^\/api/, '') },
    },
  },
})
