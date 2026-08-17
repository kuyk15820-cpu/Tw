import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  base: '/', // วางที่ Root Domain
  build: {
    minify: true,
    sourcemap: false,
    codeSplitting: false, // รวมไฟล์ JS ทั้งหมดไว้ไฟล์เดียว
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
