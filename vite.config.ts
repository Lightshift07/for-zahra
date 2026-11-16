import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { validateContent } from './vite/validate-content.ts'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works from any path/host (Cloudflare Pages, Netlify, subfolder).
  base: './',
  plugins: [react(), validateContent()],
})
