import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' lets the built site work on GitHub Pages, Netlify, or any folder.
export default defineConfig({
  plugins: [react()],
  base: './',
})
