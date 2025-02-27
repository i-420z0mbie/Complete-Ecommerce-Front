import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your Django backend
      '/api': {
        target: ' https://z0mbified-store.onrender.com', // Replace with your Django backend URL
        changeOrigin: true,
        secure: false, // set true if your backend has a valid SSL certificate
      },
    },
  },
})