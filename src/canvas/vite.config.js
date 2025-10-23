import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitCanvas-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitCanvas.html'),
      },
      output: {
        entryFileNames: `drawwitCanvas-assets/[name].js`,
        chunkFileNames: `drawwitCanvas-assets/[name]-[hash].js`,
        assetFileNames: `drawwitCanvas-assets/[name]-[hash][extname]`,
      },
    },
  },
});
