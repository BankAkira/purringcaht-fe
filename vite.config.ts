import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  define: {
    'process.version': '""',
  },
  server: { port: 4200 },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      assert: 'assert',
      os: 'os-browserify',
      url: 'url',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Purring Chat',
        description:
          'Purring Chat (formerly CatChaChat) Winner of 4 awards at the Ethereum Global Hackathon Istanbul 2023. Download with confidence! Ultimate Privacy, Unparalleled Security, Seamless Connection',
        short_name: 'Purring Chat',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-196x196.png',
            sizes: '196x196',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'eth-istanbul-640x320.png',
            sizes: '640x320',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Wonder Widgets',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true, // Enable source maps for easier debugging
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
    }),
  ],
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          polyfills: ['buffer', 'crypto-browserify'],
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
