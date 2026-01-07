<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { router } from '@/app/router'
import apiClient from '@/app/api/baseApi'

const username = ref('')
const password = ref('')
const passwordVerification = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const usernameRegex = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

const registerUser = async () => {
  errorMessage.value = ''
  isLoading.value = true

  // Валидация
  if (username.value.length < 5 || !usernameRegex.test(username.value)) {
    errorMessage.value = 'Никнейм: минимум 5 символов, только буквы, цифры, ., _, -';
    isLoading.value = false;
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов';
    isLoading.value = false;
    return;
  }

  if (password.value !== passwordVerification.value) {
    errorMessage.value = 'Пароли не совпадают';
    isLoading.value = false;
    return;
  }

  try {
    const body = {
      username: username.value.trim(),
      password: password.value,
    };

    await apiClient.post('/auth/register', body);

    await nextTick();
    await router.push('/login');
  } catch (err: any) {
    console.error('Ошибка при регистрации', err);
    errorMessage.value = err.response?.data?.message || 'Ошибка регистрации. Попробуйте другой никнейм.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="title">Регистрация в GameHub</h1>
      <p class="subtitle">Присоединяйся к сообществу геймеров!</p>

      <form @submit.prevent="registerUser" class="register-form">
        <div class="input-group">
          <label>Никнейм</label>
          <input
            v-model="username"
            type="text"
            placeholder="Придумайте никнейм"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Пароль</label>
          <input
            v-model="password"
            type="password"
            placeholder="Минимум 6 символов"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="input-group">
          <label>Подтверждение пароля</label>
          <input
            v-model="passwordVerification"
            type="password"
            placeholder="Повторите пароль"
            required
            :disabled="isLoading"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="register-btn" :disabled="isLoading">
          <span v-if="isLoading">Регистрируем...</span>
          <span v-else>Зарегистрироваться</span>
        </button>
      </form>

      <div class="footer">
        <span>Уже есть аккаунт? </span>
        <router-link to="/login" class="login-link">Войти</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1117 0%, #1e1f26 50%, #2a1b3d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(56, 92, 201, 0.15), transparent 70%);
    pointer-events: none;
  }
}

.register-card {
  background: rgba(26, 28, 36, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(67, 70, 87, 0.6);
  border-radius: 20px;
  padding: 40px 50px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  position: relative;
  z-index: 1;

  .title {
    font-size: 36px;
    font-weight: 800;
    text-align: center;
    margin: 0 0 8px;
    color: #e0e0e0;
    text-shadow: 0 0 20px rgba(56, 92, 201, 0.4);
  }

  .subtitle {
    text-align: center;
    color: #a0a4b8;
    margin-bottom: 40px;
    font-size: 16px;
  }
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #c0c4d8;
    font-size: 14px;
    font-weight: 600;
  }

  input {
    padding: 14px 18px;
    background: #2a2c36;
    border: 1px solid #434657;
    border-radius: 12px;
    color: #e0e0e0;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;

    &::placeholder {
      color: #6c6f82;
    }

    &:focus {
      border-color: #385cc9;
      box-shadow: 0 0 0 4px rgba(56, 92, 201, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.error-message {
  background: rgba(220, 53, 69, 0.15);
  color: #ff6b6b;
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.register-btn {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(to right, #385cc9, #4c79ff);
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(56, 92, 201, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #4c79ff, #5d8aff);
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(56, 92, 201, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: #888c9e;
  font-size: 14px;

  .login-link {
    color: #385cc9;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
      color: #4c79ff;
    }
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 25px;
  }

  .title {
    font-size: 30px;
  }
}
</style>
