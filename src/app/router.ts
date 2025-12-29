import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from './stores/userStore'

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
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile.page.vue'),
  },
  {
    path: '/createlist',
    name: 'createList',
    component: () => import('@/pages/createList.page.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }
