import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { registerMicroApps, start } from 'qiankun'

const app = createApp(App)

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)

// 注册微应用 - 仅注册支持 qiankun 的应用
registerMicroApps([
  {
    name: 'role-app',
    entry: '//localhost:8002',
    container: '#micro-container',
    activeRule: '/role',
    props: {
      mainApp: 'main-app'
    }
  },
  {
    name: 'user-app',
    entry: '//localhost:8003',
    container: '#micro-container',
    activeRule: '/user',
    props: {
      mainApp: 'main-app'
    }
  }
], {
  beforeLoad: (app) => {
    console.log('[主应用] 加载前', app.name)
    return Promise.resolve()
  },
  beforeMount: (app) => {
    console.log('[主应用] 挂载前', app.name)
    return Promise.resolve()
  },
  afterMount: (app) => {
    console.log('[主应用] 挂载后', app.name)
    return Promise.resolve()
  },
  beforeUnmount: (app) => {
    console.log('[主应用] 卸载前', app.name)
    return Promise.resolve()
  },
  afterUnmount: (app) => {
    console.log('[主应用] 卸载后', app.name)
    return Promise.resolve()
  }
})

// 启动 qiankun
start({
  prefetch: false,
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: false
  }
})

app.mount('#app')
