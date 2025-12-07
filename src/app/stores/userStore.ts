import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const isAuthenticated = ref(false as boolean)
  const user = ref(null as null | import('@/entities/User').User)

  function login(userData: import('@/entities/User').User) {
    isAuthenticated.value = true
    user.value = userData
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
  }

  return { isAuthenticated, user, login, logout }
})
