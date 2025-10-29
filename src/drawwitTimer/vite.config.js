import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitTimer-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitTimer.html'),
      },
      output: {
        entryFileNames: `drawwitTimer-assets/[name].js`,
        chunkFileNames: `drawwitTimer-assets/[name]-[hash].js`,
        assetFileNames: `drawwitTimer-assets/[name]-[hash][extname]`,
      },
    },
  },
});
