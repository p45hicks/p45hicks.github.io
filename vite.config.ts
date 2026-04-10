import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  root: path.resolve(__dirname, './packages/site'),
  resolve: {
    alias: {
      '@site/site': path.resolve(__dirname, './packages/site/src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
