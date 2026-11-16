import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { offline } from './vite/offline.ts'
import { validateContent } from './vite/validate-content.ts'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works from any path/host (GitHub Pages subpath, Netlify, Cloudflare).
  base: './',
  plugins: [react(), validateContent(), offline()],
})
