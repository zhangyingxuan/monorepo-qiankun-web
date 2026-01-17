// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false, // 微前端子应用禁用 SSR

  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/styles/main.scss'
  ],

  vite: {
    server: {
      port: 8001,
      cors: true,
      origin: 'http://localhost:8001',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    build: {
      target: 'esnext'
    }
  },

  elementPlus: {
    importStyle: 'scss'
  },

  compatibilityDate: '2024-01-01'
})
