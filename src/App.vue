<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style lang="scss">
body,
html {
  margin: 0;
  background-color: #191A1E;
  color: white;
  font-family: "Geom", sans-serif;

  a {
    text-decoration: none;
    color: white;

    &:hover {
      color: #b3bbdc
    }
  }
}

.main-container {
  width: 1440px;
  margin: 30px auto;
}
</style>

<template>
  <RouterView />
</template>
