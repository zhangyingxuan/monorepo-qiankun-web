import { defineConfig } from 'vite'
import qiankun from 'vite-plugin-qiankun'
import { resolve } from 'path'

export default defineConfig({
  // 关键：设置 base 为绝对路径，qiankun 开发模式必需
  base: 'http://localhost:8003/',
  plugins: [
    // 在 qiankun 环境下，不使用 react 插件，避免 preamble 检测问题
    // React JSX 转换由 esbuild 自动处理
    qiankun('user-app', {
      useDevMode: true
    })
  ],
  // 使用 esbuild 处理 JSX，这不会注入 HMR preamble
  // 使用自动 JSX 运行时，无需手动导入 React
  esbuild: {
    jsx: 'automatic'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 8003,
    cors: true,
    origin: 'http://localhost:8003',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
