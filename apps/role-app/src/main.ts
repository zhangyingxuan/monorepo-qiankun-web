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

const render = (container?: HTMLElement) => {
  app = createApp(App)
  app.use(TDesign)
  app.use(createPinia())
  app.use(router)

  const mountElement = container
    ? container.querySelector('#app')
    : document.getElementById('app')

  app.mount(mountElement as HTMLElement)
}

renderWithQiankun({
  mount(props) {
    console.log('[role-app] mount', props)
    render(props.container)
  },
  bootstrap() {
    console.log('[role-app] bootstrap')
  },
  unmount() {
    console.log('[role-app] unmount')
    if (app) {
      app.unmount()
      app = null
    }
  },
  update(props) {
    console.log('[role-app] update', props)
  }
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
