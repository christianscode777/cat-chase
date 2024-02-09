import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@characters': path.resolve(__dirname, 'src/scenes/characters'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@scenes': path.resolve(__dirname, 'src/scenes'),
      // No more duplicates
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'iife',
        globals: {
          phaser: 'Phaser',
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'PhaserGame',
      fileName: 'phaser-game',
      formats: ['iife'],
    },
  },
  publicDir: 'public',
  server: {
    host: true,
    port: 3000,
  },
  optimizeDeps: {
    include: ['phaser'],
  },
});
