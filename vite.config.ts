import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split out the two heaviest, rarely-changing libraries so the app's
        // own code isn't re-downloaded whenever either library updates.
        manualChunks: {
          gsap: ['gsap'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
})
