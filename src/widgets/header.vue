<script setup lang="ts">
import apiClient from '@/app/api/baseApi';
import { router } from '@/app/router';
import { useUserStore } from '@/app/stores/userStore';
import { nextTick } from 'vue';

const userStore = useUserStore();

const logoutHandler = async () => {
  await apiClient.post("/auth/logout");
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
