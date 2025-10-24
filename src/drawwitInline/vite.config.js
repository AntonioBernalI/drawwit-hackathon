import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitInline-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitInline.html'),
      },
      output: {
        entryFileNames: `drawwitInline-assets/[name].js`,
        chunkFileNames: `drawwitInline-assets/[name]-[hash].js`,
        assetFileNames: `drawwitInline-assets/[name]-[hash][extname]`,
      },
    },
  },
});
