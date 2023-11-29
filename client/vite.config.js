import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // each request to /api/* will be proxied to the target
        target: 'http://localhost:3000', // to match with the port of the server
        secure: false,
      },
    },
  },

  plugins: [react()],
});