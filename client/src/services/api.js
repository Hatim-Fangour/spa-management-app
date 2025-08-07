import axios from "axios";

// 1. Create configured Axios instance
const api = axios.create({
  baseURL: "http://localhost:8800/api",
  // baseURL: process.env.REACT_APP_NODE_ENV === 'production'
  // ? process.env.REACT_APP_API_URL_PROD
  // : process.env.REACT_APP_API_URL_DEV,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
