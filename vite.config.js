import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: process.env.PORT ? Number(process.env.PORT) : 5173, // Use Render's PORT if provided, otherwise default to 5173
    proxy: {
      // Proxy requests starting with /api to your Django backend
      '/api': {
        target: 'https://z0mbified-store.onrender.com', // Replace with your Django backend URL
        changeOrigin: true,
        secure: false, // Set to true if your backend has a valid SSL certificate
      },
    },
  },
})
