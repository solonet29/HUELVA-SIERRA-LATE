import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, // Fuerza a Vite a usar este puerto
        strictPort: true, // Si el puerto está ocupado, Vite fallará en lugar de buscar otro
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});