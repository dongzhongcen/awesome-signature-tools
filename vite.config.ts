import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isCdn = process.env.VITE_BASE === './'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE || '/awesome-signature-tools/',
  build: isCdn
    ? {
        cssCodeSplit: false,
        assetsInlineLimit: 4096,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      }
    : undefined,
})
