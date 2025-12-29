<script setup lang="ts">
import Header from '@/widgets/header.vue';
import { ref } from 'vue';

const gameName = ref("");

const searchGames = () => {

};

</script>

<template>
  <Header />
  <div class="main-container">
    <div class="search-block">
      <input v-model="gameName" @input="searchGames" type="text" class="steam-search">
      <div class="search-tips"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-block {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .steam-search {
    height: 30px;
    width: 50%;
  }

  .search-tips {
    width: 50%;
    height: 300px;
    background: #636779;
    border: 1px solid #979cb6;
    border-radius: 10px;

    .save-button {
      border: 1px solid #979cb6;
      border-radius: 10px;
      padding: 5px 20px;
      align-self: center;
    }
  }

}
</style>
