import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';
import { resolve } from 'path';

export default defineConfig(({ mode }) => ({
  // 开发模式使用绝对路径，生产构建使用相对路径
  base: mode === 'development' ? 'http://localhost:8005/' : '/gomoku/',
  plugins: [
    qiankun('gomoku-app', {
      useDevMode: mode === 'development',
    }),
  ],
  // 使用 esbuild 处理 JSX
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8005,
    cors: true,
    origin: 'http://localhost:8005',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}));
