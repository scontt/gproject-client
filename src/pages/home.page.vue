<script setup lang="ts">
import Header from '@/widgets/header.vue';
import { userService } from '@/services/userService';

const getUser = async () => {
  try {
    await userService.getCurrentUser();
  } catch (err) {
    console.error(`Ошибка при получении данных пользователя ${err}`);
  }
}
</script>

<template>
  <Header />
  <div class="container">
    <span @click="getUser">Test</span>
  </div>
</template>
