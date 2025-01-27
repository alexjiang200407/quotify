import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '192.168.33.77',
        https: false,
        cors: true,
        hmr: {
            host: '192.168.33.77',
        }
    },
});