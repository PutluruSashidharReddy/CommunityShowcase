import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // ✅ This is valid
  },
  server: {
    hmr: {
      overlay: false, // ✅ Optional: Disable Vite HMR error overlay
    }
  }
})
