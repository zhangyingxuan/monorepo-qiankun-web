import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'

export default defineConfig({
  // 关键：设置 base 为绝对路径，qiankun 开发模式必需
  base: 'http://localhost:8002/',
  plugins: [
    vue(),
    qiankun('role-app', {
      useDevMode: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8002,
    cors: true,
    origin: 'http://localhost:8002',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
