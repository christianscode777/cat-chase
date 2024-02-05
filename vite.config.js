import { defineConfig } from 'vite';
import path from 'path';

// Base path where Vite serves files from
export default defineConfig({
  base: './',

  // Resolve aliases for easier imports
  resolve: {
    alias: {
      // Use `phaser/src` for latest development features
      '@phaser': path.resolve(__dirname, 'node_modules/phaser/src'),
      // Or use `phaser/lib/phaser.module.js` for production-ready build
      // phaser: path.resolve(__dirname, 'node_modules/phaser/lib/phaser.module.js'),
      // Example alias for your src directory
      '@/': path.resolve(__dirname, 'src') + '/',
    },
  },

  // Build options for creating distributable bundles
  build: {
    // Bundle output format (IIFE is suitable for browser use)
    rollupOptions: {
      output: {
        format: 'iife',
        globals: {
          phaser: 'Phaser',
        },
      },
    },

    // Enable CommonJS for Node.js compatibility
    commonjsOptions: {
      include: [/node_modules/],
    },

    // Specify source entry point and output file name
    lib
: {
      entry: path.resolve(__dirname, 'main.js'),
      fileName: 'phaser-game.js', // Or desired output name
      formats: ['umd'], // Create UMD bundle for browser compatibility
    },
  },

  // Serve static assets from a dedicated directory
  publicDir: 'public',

  // Development server configuration
  server: {
    host: true, // Enable network access
    port: 3000, // Custom port
  },

  // Optimize dependencies for smaller bundle size
  optimizeDeps: {
    include: ['phaser'], // Optimize Phaser specifically
  },
});
