import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { env } from 'process';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno desde el archivo .env
  const env = loadEnv(mode, process.cwd(), '');

  // Crea un objeto para definir las variables en el cliente
  const envWithProcessPrefix = {
    'import.meta.env': JSON.stringify(env),
  };

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        // Redirige las peticiones que empiezan por /api a tu servidor local de Express
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      }
    },
    plugins: [react()],
    define: envWithProcessPrefix,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
