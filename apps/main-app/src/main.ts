import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { registerMicroApps, start } from 'qiankun'
import { performanceMonitor } from './utils/performance-monitor'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)

// 路由变更监听 - 用于捕获应用切换的起始时间
router.beforeEach((to, from, next) => {
  const microApps = ['role', 'user', 'map']
  const toApp = microApps.find(app => to.path.startsWith(`/${app}`))

  if (toApp) {
    performanceMonitor.startSwitch(`${toApp}-app`)
  }
  next()
})

router.afterEach((to) => {
  const microApps = ['role', 'user', 'map']
  const toApp = microApps.find(app => to.path.startsWith(`/${app}`))

  if (toApp) {
    performanceMonitor.markRouteChangeEnd(`${toApp}-app`)
  }
})

// 注册微应用 - 仅注册支持 qiankun 的应用
registerMicroApps([
  {
    name: 'role-app',
    entry: '//localhost:8002',
    container: '#micro-container',
    activeRule: '/role',
    props: {
      mainApp: 'main-app',
      performanceMonitor // 传递性能监控实例给子应用
    }
  },
  {
    name: 'user-app',
    entry: '//localhost:8003',
    container: '#micro-container',
    activeRule: '/user',
    props: {
      mainApp: 'main-app',
      performanceMonitor // 传递性能监控实例给子应用
    }
  },
  {
    name: 'map-app',
    entry: '//localhost:8004',
    container: '#micro-container',
    activeRule: '/map',
    props: {
      mainApp: 'main-app',
      performanceMonitor // 传递性能监控实例给子应用
    }
  }
], {
  beforeLoad: (app) => {
    console.log('[主应用] 加载前', app.name)
    performanceMonitor.markBeforeLoad(app.name)
    return Promise.resolve()
  },
  beforeMount: (app) => {
    console.log('[主应用] 挂载前', app.name)
    performanceMonitor.markBeforeMount(app.name)
    return Promise.resolve()
  },
  afterMount: (app) => {
    console.log('[主应用] 挂载后', app.name)
    performanceMonitor.markAfterMount(app.name)
    return Promise.resolve()
  },
  beforeUnmount: (app) => {
    console.log('[主应用] 卸载前', app.name)
    performanceMonitor.markBeforeUnmount(app.name)
    return Promise.resolve()
  },
  afterUnmount: (app) => {
    console.log('[主应用] 卸载后', app.name)
    performanceMonitor.markAfterUnmount(app.name)
    return Promise.resolve()
  }
})

// 启动 qiankun
start({
  prefetch: 'all',
  // prefetch: false,
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: false
  }
})

app.mount('#app')

// 开发环境下，暴露一些调试命令
if (import.meta.env.DEV) {
  console.log('%c[微前端性能监控] 已启用', 'color: #1890ff; font-weight: bold;')
  console.log('可用调试命令:')
  console.log('  window.__MICRO_APP_PERF__.getReports() - 获取所有性能报告')
  console.log('  window.__MICRO_APP_PERF__.getSummary() - 获取性能统计摘要')
  console.log('  window.__MICRO_APP_PERF__.clear() - 清除所有记录')
}