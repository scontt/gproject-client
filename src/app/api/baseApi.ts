import axios from "axios";

const url = "https://localhost:7272";
// const url = "api";

const apiClient = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default apiClient;
