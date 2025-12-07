<script setup lang="ts">
import Header from '@/widgets/header.vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5120/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getUser = async () => {
  try {
    const result = await api.get('/user/me');
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
