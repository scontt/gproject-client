<script setup lang="ts">
import apiClient from '@/app/api/baseApi';
import Header from '@/widgets/header.vue';

const getUser = async () => {
  try {
    const result = await apiClient.get('/user/me');
    console.log(result);
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
