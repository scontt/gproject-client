import axios from "axios";
import { useTokenStore } from "../stores/tokenStore";

const url = "https://localhost:7272";
// const url = "api";

const apiClient = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
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


export default apiClient;
