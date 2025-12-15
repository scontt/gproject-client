<script setup lang="ts"> // eslint-disable-line vue/multi-word-component-names
import { nextTick, ref } from 'vue'
import { router } from '@/app/router'
import { useUserStore } from '@/app/stores/userStore'
import { construct, type User } from '@/entities/api/User'
import apiClient from '@/app/api/baseApi'

const username = ref('')
const password = ref('')
const isAuthenticate = ref(true);

const userStore = useUserStore()

const loginUser = async () => {
  try {
    const body = {
      username: username.value,
      password: password.value,
    }

    await apiClient.post('/auth/login', body)
    const response = await apiClient.get('/user/me');
    const jsonUser: User = construct(response.data);
    userStore.login(jsonUser);
    await nextTick();
    router.replace('/profile');
  } catch (err) {
    console.error(`Ошибка при аутентификации пользователя ${err}`)
    isAuthenticate.value = false;
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
        <span v-if="!isAuthenticate" class="input-error">Неверный логин или пароль</span>
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

      .input-error {
        color: red;
        font-size: 12px;
        text-align: center;
        margin-top: 5px;
      }
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
