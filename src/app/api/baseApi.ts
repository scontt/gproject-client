import axios from "axios";
import { useTokenStore } from "../stores/tokenStore";
import { router } from "../router";

const url = "https://localhost:7272";
// const url = "api";

const apiClient = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(response => {
  return response;
},
  async (error) => {
    const tokenStore = useTokenStore();
    const originalRequest = error.config;
    console.log(error);
    if (error.response && error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      try {
        const refreshResponse = await axios.post(`${url}/auth/refresh`, {}, { withCredentials: true });
        tokenStore.setToken(refreshResponse.data);
        console.log(refreshResponse);
        originalRequest.headers.Authorization = `Bearer ${tokenStore.getAccessToken()}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStore.clearToken();
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
});

export default apiClient;
