<script setup lang="ts"> // eslint-disable-line vue/multi-word-component-names
import axios from 'axios'
import { ref } from 'vue'
import { router } from '@/app/router'
import { useUserStore } from '@/app/stores/userStore'
import { construct, type User } from '@/entities/User'

const username = ref('')
const password = ref('')

const userStore = useUserStore()

const api = axios.create({
  baseURL: 'https://localhost:5120/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const loginUser = async () => {
  try {
    const body = {
      username: username.value,
      password: password.value,
    }

    const result = await api.post('/auth/login', body)
    if (result.status === 401) {
      console.error('Неверный логин или пароль')
    } else {
      const response = await api.get('/user/me');
      const jsonUser: User = construct(response.data);
      userStore.login(jsonUser);
      await router.push('/')
    }
  } catch (err) {
    console.error(`Ошибка при аутентификации пользователя ${err}`)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-block">
      <div class="login-block__sector username">
        <span class="block-text">Никнейм</span>
        <input v-model="username" type="text" />
      </div>
      <div class="login-block__sector password">
        <span class="block-text">Пароль</span>
        <input v-model="password" type="password" />
      </div>
      <div class="login-button">
        <span @click="loginUser">Войти</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;

  .login-block {
    border: 1px solid black;
    padding: 20px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .login-block__sector {
      display: flex;
      flex-direction: column;
    }
  }
}

.login-button {
  margin: auto;
  border: 1px solid black;
  border-radius: 5px;
  padding: 3px;

  &:hover {
    background-color: #bebebeff;
    cursor: pointer;
  }
}
</style>
