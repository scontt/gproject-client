<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const passwordVerification = ref('')

const api = axios.create({
  baseURL: 'https://localhost:5120/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const registerUser = async () => {
  try {
    const body = {
      username: username.value,
      password: password.value,
    }

    const result = await api.post('/auth/register', body)
    console.log(result)
  } catch (err) {
    console.error(`Ошибка при регистрации пользователя ${err}`)
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-block">
      <div class="register-block__sector username">
        <span class="block-text">Никнейм</span>
        <input v-model="username" type="text" />
      </div>
      <div class="register-block__sector password">
        <span class="block-text">Пароль</span>
        <input v-model="password" type="password" />
      </div>
      <div class="register-block__sector repeat-password">
        <span class="block-text">Подтверждение пароля</span>
        <input v-model="passwordVerification" type="password" />
      </div>
      <div class="register-block__sector signup-button">
        <span @click="registerUser">Зарегистрироваться</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;

  .register-block {
    border: 1px solid black;
    padding: 20px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .register-block__sector {
      display: flex;
      flex-direction: column;
    }
  }
}

.signup-button {
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
