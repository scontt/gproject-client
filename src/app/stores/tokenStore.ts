import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore('tokenStore', () => {
  const accessToken = ref<string>("");
  const refreshToken = ref<string>("");

  function setTokens(access: string, refresh: string) {
    accessToken.value = access;
    refreshToken.value = refresh;
  }

  function clearTokens() {
    accessToken.value = '';
    refreshToken.value = '';
  }

  function getAccessToken() {
    return accessToken.value;
  }

  function getRefreshToken() {
    return refreshToken.value;
  }

  return {
    accessToken,
    refreshToken,
    setTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
  };
});
