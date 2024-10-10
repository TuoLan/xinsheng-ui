import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // 配置项目可以局域网访问
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  }
})
