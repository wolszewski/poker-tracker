import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site loads from any GitHub Pages path.
  base: './',
  plugins: [react()],
})
