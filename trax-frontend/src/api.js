// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // your backend base URL
});

// Add token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
