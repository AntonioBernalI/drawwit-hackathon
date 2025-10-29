import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/client',
    sourcemap: true,
    target: 'esnext',
    assetsDir: 'drawwitPowersB-assets',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'drawwitPowersB.html'),
      },
      output: {
        entryFileNames: `drawwitPowersB-assets/[name].js`,
        chunkFileNames: `drawwitPowersB-assets/[name]-[hash].js`,
        assetFileNames: `drawwitPowersB-assets/[name]-[hash][extname]`,
      },
    },
  },
});
