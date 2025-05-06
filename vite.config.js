import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: mode === 'production' ? '/epos/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://m2web.staging-01.eposdirect.net/', // Magento server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Strip the /api prefix
      },
    },
  },
});
