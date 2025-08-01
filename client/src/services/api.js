import axios from "axios";

console.log(process.env.REACT_APP_API_URL)
// 1. Create configured Axios instance
const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:8800/api",
    baseURL: process.env.NODE_ENV === 'production' 
    // ? 'https://yourdomain.com/api' 
    ? process.env.REACT_APP_API_URL 
    : "http://localhost:8800/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});


export default api;
