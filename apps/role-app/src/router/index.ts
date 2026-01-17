import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const router = createRouter({
  history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/role' : '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/list',
      name: 'role-list',
      component: () => import('@/views/RoleList.vue')
    },
    {
      path: '/permission',
      name: 'permission',
      component: () => import('@/views/Permission.vue')
    }
  ]
})

export default router
