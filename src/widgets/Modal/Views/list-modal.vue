<script setup lang="ts">
const props = defineProps({
  isOpened: Boolean
});


</script>

<template>
  <div v-if="props.isOpened" class="list-modal">
    <div class="list-modal__content">
        
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-modal {
  position: fixed;
  width: 900px;
  height: 650px;
  background-color: aqua;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}
</style>
