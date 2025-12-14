import axios from "axios";

const apiClient = axios.create({
  baseURL: 'https://localhost:7272/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default apiClient;
