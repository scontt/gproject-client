import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home.page.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth.page.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/pages/register.page.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }
