<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modal.isOpen" class="modal-overlay" @click="modal.close">
        <component
          :is="modal.currentModal?.component"
          v-bind="modal.currentModal?.props"
          @close="modal.close"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '@/components/useModal';

const modal = useModal()
</script>
