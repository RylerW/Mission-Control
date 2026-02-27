import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/n8n': {
        target: 'https://n8n.rylerworkflows.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      }
    }
  }
});
