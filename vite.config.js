import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // For deployment at domain root
  plugins: [react()],
});




// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // Bind to all network interfaces
//     port: process.env.PORT ? Number(process.env.PORT) : 5173,
//     proxy: {
//
//       '/api': {
//         target: 'https://zombified-store.onrender.com',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   preview: {
//     allowedHosts: ['zombified-store.onrender.com'],
//   },
// })
