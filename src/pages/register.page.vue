<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { router } from '@/app/router'
import apiClient from '@/app/api/baseApi'

const username = ref('')
const password = ref('')
const passwordVerification = ref('')
const isUsernameValid = ref(true);
const isPasswordValid = ref(true);
const isPasswordMatches = ref(true);

const registerUser = async () => {
  if (username.value.length < 6) {
    isUsernameValid.value = false;
    return;
  }
  else {
    isUsernameValid.value = true;
  }

  if (password.value.length < 7) {
    isPasswordValid.value = false;
    return;
  }
  else {
    isPasswordValid.value = true;
  }

  if (password.value != passwordVerification.value) {
    isPasswordMatches.value = false;
    return;
  }
  else {
    isPasswordMatches.value = true;
  }

  try {
    isUsernameValid.value = true;
    isPasswordValid.value = true;
    isPasswordMatches.value = true;

    const body = {
      username: username.value,
      password: password.value,
    }

    const response = await apiClient.post('/auth/register', body);

    if (response.status != 401) {
      await nextTick();
      router.replace("/");
    }
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
        <span v-if="!isUsernameValid" class="block-text input-error">Никнейм должен содержать не менее 5 символов</span>
      </div>
      <div class="register-block__sector password">
        <span class="block-text">Пароль</span>
        <input v-model="password" type="password" />
        <span v-if="!isPasswordValid" class="block-text input-error">Пароль должен содержать не менее 6 символов</span>
      </div>
      <div class="register-block__sector repeat-password">
        <span class="block-text">Подтверждение пароля</span>
        <input v-model="passwordVerification" type="password" />
        <span v-if="!isPasswordMatches" class="block-text input-error">Пароли должны совпадать</span>
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
    font-size: 18px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .register-block__sector {
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
