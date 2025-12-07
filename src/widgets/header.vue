<script setup lang="ts">

</script>

<template>
  <header class="header">
    <div class="login-block">
      <a href="/login" class="auth-link"> Вход </a>
      <a href="/signup" class="auth-link"> Регистрация </a>
    </div>
    <div class="profile-name">
      
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  position: relative;
  background-color: transparent;
  color: #fff;
  height: 50px;
}

.login-block {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
