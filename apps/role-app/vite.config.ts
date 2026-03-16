import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  // 开发模式使用绝对路径，生产构建使用相对路径
  base: mode === 'development' ? 'http://127.0.0.1:8002/' : '/role/',
  plugins: [
    vue(),
    qiankun('role-app', {
      useDevMode: mode === 'development'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '127.0.0.1',
    port: 8002,
    cors: true,
    origin: 'http://127.0.0.1:8002',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}))
