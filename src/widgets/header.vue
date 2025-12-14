<script setup lang="ts">
import { router } from '@/app/router';
import { useUserStore } from '@/app/stores/userStore';
import axios from 'axios'
import { nextTick } from 'vue';

const userStore = useUserStore();

const api = axios.create({
  baseURL: 'https://localhost:7272/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const logoutHandler = async () => {
  await api.post("/auth/logout");
  await nextTick();
  userStore.logout();
  await nextTick();
  await router.replace('/');
};

</script>

<template>
  <header class="header">
    <div v-if="!userStore.isAuthenticated" class="header-block">
      <RouterLink to="/login" class="header-item auth-link"> Вход </RouterLink>
      <RouterLink to="/signup" class="header-item auth-link"> Регистрация </RouterLink>
    </div>
    <div v-else class="header-block">
      <RouterLink to="/profile" class="header-item profile-link">Профиль</RouterLink>
      <a @click="logoutHandler" class="header-item logout-button">Выход</a>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  position: relative;
  background-color: transparent;
  justify-content: end;
  color: #fff;
  height: 50px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.288);

  .header-block {
    margin: auto 10px;

    .header-item {
      margin: 0 10px;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
