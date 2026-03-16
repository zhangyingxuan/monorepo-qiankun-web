import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const port = 8008;
  const host = '127.0.0.1';

  return {
    // 开发环境下必须使用绝对路径，确保 qiankun 能正确加载资源
    base: isDev ? `http://${host}:${port}/` : '/ocr-app/',
    server: {
      port,
      host,
      cors: true,
      origin: `http://${host}:${port}`,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    plugins: [
      qiankun('ocr-app', {
        useDevMode: isDev,
      }),
      react({
        fastRefresh: !isDev,
      }),
      viteStaticCopy({
        targets: [
          {
            src: '../../node_modules/tesseract.js-core/tesseract-core.wasm',
            dest: 'assets'
          }
        ]
      })
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
