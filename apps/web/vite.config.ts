import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Agregá este bloque:
  preview: {
    allowedHosts: ['plannery-web.onrender.com', '.onrender.com'],
  },
});