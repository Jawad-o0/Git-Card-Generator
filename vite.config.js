import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js and related 3D libraries into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@paper-design/shaders'],
          // Separate Spline into its own chunk (large library)
          'spline': ['@splinetool/react-spline'],
          // Separate animation/motion libraries
          'motion': ['framer-motion', 'react-confetti'],
          // Separate canvas rendering
          'canvas': ['html2canvas'],
          // Separate QR code
          'qr': ['qrcode.react'],
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
      },
    },
  },
  server: {
    preTransformRequests: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@react-three/fiber', 'three'],
  }
})
