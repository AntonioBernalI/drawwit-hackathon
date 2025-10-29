import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitPowersA-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitPowersA.html'),
      },
      output: {
        entryFileNames: `drawwitPowersA-assets/[name].js`,
        chunkFileNames: `drawwitPowersA-assets/[name]-[hash].js`,
        assetFileNames: `drawwitPowersA-assets/[name]-[hash][extname]`,
      },
    },
  },
});
