import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitCanvasA-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitCanvasA.html'),
      },
      output: {
        entryFileNames: `drawwitCanvasA-assets/[name].js`,
        chunkFileNames: `drawwitCanvasA-assets/[name]-[hash].js`,
        assetFileNames: `drawwitCanvasA-assets/[name]-[hash][extname]`,
      },
    },
  },
});
