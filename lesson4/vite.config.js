import { resolve } from 'path';
import { defineConfig } from 'vite';
export default defineConfig({
  publicDir: './static/',
  server: {
    host: true,
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        first: resolve(__dirname, 'first/index.html'),
        second: resolve(__dirname, 'second/index.html'),
      },
    },
  },
});
