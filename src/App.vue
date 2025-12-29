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

input {
  background-color: #636779;
  border: 1px solid #979cb6;
  border-radius: 10px;

}
</style>

<template>
  <RouterView />
</template>
