import react from '@vitejs/plugin-react'
import laravel from 'laravel-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/build',
  plugins: [
    react(),
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.tsx',
        'resources/js/Pages/Explore.tsx',
        'resources/js/Pages/Home.tsx',
        'resources/js/Pages/Login.tsx',
        'resources/js/Pages/Profile.tsx',
      ],
      refresh: [
        'resources/**',
        'routes/**',
        'resources/views/**',
        'resources/vara/**'
      ],
    }),
  ],
  server: {
    host: '192.168.33.77',
    https: false,
    cors: true,
    hmr: {
      host: '192.168.33.77',
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
})
