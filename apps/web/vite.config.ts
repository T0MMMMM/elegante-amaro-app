import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@elegante-amaro-app/shared': path.resolve(__dirname, '../../shared'),
    },
  },
})
