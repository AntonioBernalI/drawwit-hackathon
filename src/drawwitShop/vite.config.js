import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitShop-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitShop.html'),
      },
      output: {
        entryFileNames: `drawwitShop-assets/[name].js`,
        chunkFileNames: `drawwitShop-assets/[name]-[hash].js`,
        assetFileNames: `drawwitShop-assets/[name]-[hash][extname]`,
      },
    },
  },
});
