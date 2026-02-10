import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? 'http://localhost:8004/' : '/map/',
  plugins: [
    vue(),
    qiankun('map-app', {
      useDevMode: mode === 'development'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8004,
    cors: true,
    origin: 'http://localhost:8004',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}))