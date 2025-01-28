import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: '/resources',
    plugins: [
      react(),
      laravel({
        input: [
          "resources/css/app.css",
          "resources/js/app.tsx"
        ],
        refresh: [
          'resources/**',
          'routes/**',
          'resources/views/**',
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
});