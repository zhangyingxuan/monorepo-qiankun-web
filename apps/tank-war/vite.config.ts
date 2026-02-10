import { defineConfig } from 'vite';
import qiankun from 'vite-plugin-qiankun';

export default defineConfig({
  plugins: [
    qiankun('tank-war', {
      useDevMode: true,
    }),
  ],
  server: {
    port: 8005,
    cors: true,
    origin: 'http://localhost:8005'
  },
  base: './',
  build: {
    assetsDir: 'assets',
  }
});