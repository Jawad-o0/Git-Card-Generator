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
        manualChunks: (id) => {
          // Separate Three.js and related 3D libraries into their own chunk
          if (id.includes('three') || id.includes('@react-three') || id.includes('@paper-design')) {
            return 'three-vendor'
          }
          // Separate Spline into its own chunk (large library)
          if (id.includes('@splinetool')) {
            return 'spline'
          }
          // Separate animation/motion libraries
          if (id.includes('framer-motion') || id.includes('react-confetti')) {
            return 'motion'
          }
          // Separate canvas rendering
          if (id.includes('html2canvas')) {
            return 'canvas'
          }
          // Separate QR code
          if (id.includes('qrcode.react')) {
            return 'qr'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressed: true,
  },
  server: {
    preTransformRequests: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@react-three/fiber', 'three'],
  }
})
