import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore('tokenStore', () => {
  const accessToken = ref<string>("");

  function setToken(access: string) {
    accessToken.value = access;
  }

  function clearToken() {
    accessToken.value = '';
  }

  function getAccessToken() {
    return accessToken.value;
  }

  return {
    accessToken,
    setToken,
    clearToken,
    getAccessToken
  };
});
