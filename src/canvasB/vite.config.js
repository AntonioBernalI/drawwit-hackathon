import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitCanvasB-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitCanvasB.html'),
      },
      output: {
        entryFileNames: `drawwitCanvasB-assets/[name].js`,
        chunkFileNames: `drawwitCanvasB-assets/[name]-[hash].js`,
        assetFileNames: `drawwitCanvasB-assets/[name]-[hash][extname]`,
      },
    },
  },
});
