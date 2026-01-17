import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // 子应用路由占位
    {
      path: '/shop/:pathMatch(.*)*',
      name: 'shop',
      component: () => import('@/views/MicroApp.vue')
    },
    {
      path: '/role/:pathMatch(.*)*',
      name: 'role',
      component: () => import('@/views/MicroApp.vue')
    },
    {
      path: '/user/:pathMatch(.*)*',
      name: 'user',
      component: () => import('@/views/MicroApp.vue')
    }
  ]
})

export default router
