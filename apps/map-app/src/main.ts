import { createApp, App as VueApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import {
  renderWithQiankun,
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './styles/main.scss'

let app: VueApp<Element> | null = null

// 性能监控实例（由主应用传入）
let performanceMonitor: any = null

const render = (container?: HTMLElement) => {
  // 标记渲染开始
  if (performanceMonitor) {
    performanceMonitor.markRenderStart('map-app')
  }
  const renderStartTime = performance.now()

  app = createApp(App)
  app.use(TDesign)
  app.use(createPinia())
  app.use(router)

  const mountElement = container
    ? container.querySelector('#app')
    : document.getElementById('app')

  app.mount(mountElement as HTMLElement)

  // 标记渲染结束
  const renderEndTime = performance.now()
  if (performanceMonitor) {
    performanceMonitor.markRenderEnd('map-app')
  }
  console.log(`[map-app] 渲染耗时: ${(renderEndTime - renderStartTime).toFixed(2)}ms`)
}

renderWithQiankun({
  mount(props) {
    // 获取主应用传递的性能监控实例
    performanceMonitor = props.performanceMonitor

    // 标记 mount 开始
    if (performanceMonitor) {
      performanceMonitor.markMountStart('map-app')
    }
    const mountStartTime = performance.now()

    console.log('[map-app] mount', props)
    render(props.container)

    // 标记 mount 结束
    const mountEndTime = performance.now()
    if (performanceMonitor) {
      performanceMonitor.markMountEnd('map-app')
    }
    console.log(`[map-app] mount 阶段耗时: ${(mountEndTime - mountStartTime).toFixed(2)}ms`)
  },
  bootstrap() {
    // 标记 bootstrap 开始
    if (performanceMonitor) {
      performanceMonitor.markBootstrapStart('map-app')
    }
    const bootstrapStartTime = performance.now()

    console.log('[map-app] bootstrap')

    // 标记 bootstrap 结束
    const bootstrapEndTime = performance.now()
    if (performanceMonitor) {
      performanceMonitor.markBootstrapEnd('map-app')
    }
    console.log(`[map-app] bootstrap 阶段耗时: ${(bootstrapEndTime - bootstrapStartTime).toFixed(2)}ms`)
  },
  unmount() {
    console.log('[map-app] unmount')
    if (app) {
      app.unmount()
      app = null
    }
  },
  update(props) {
    console.log('[map-app] update', props)
  }
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}