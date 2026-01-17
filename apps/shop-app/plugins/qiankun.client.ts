// qiankun 环境检测插件
export default defineNuxtPlugin(() => {
  // 检测是否在 qiankun 环境中运行
  const isQiankun = typeof window !== 'undefined' && (window as any).__POWERED_BY_QIANKUN__

  console.log('[shop-app] Nuxt plugin initialized, isQiankun:', isQiankun)

  return {
    provide: {
      isQiankun
    }
  }
})
