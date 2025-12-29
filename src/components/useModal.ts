import { ref } from "vue"

interface Modal {
  component: any
  props?: Record<string, any>
}

const isOpen = ref(false);
const currentModal = ref<Modal | null>(null);

export function useModal() {
  const open = (component: any, props = {}) => {
    currentModal.value = { component, props }
    isOpen.value = true;
  }

  const close = () => {
    isOpen.value = false;
    setTimeout(() => {
      currentModal.value = null;
    }, 200);
  }

  return {
    isOpen,
    currentModal,
    open,
    close,
  };
}
