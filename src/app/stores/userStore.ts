import type { User } from '@/entities/User'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const isAuthenticated = ref(false as boolean);
  const user = ref<User | null>(null);

  function login(userData: import('@/entities/User').User) {
    isAuthenticated.value = true
    user.value = userData
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
  }

  return { isAuthenticated, user, login, logout }
},
{
  persist: { storage: localStorage }
})
