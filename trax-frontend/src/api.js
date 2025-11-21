// src/api.js
import axios from "axios";

const API = axios.create({
  // local,
  // baseURL: "http://localhost:3000/api",
  //render ->
  baseURL: "https://trax-transport-real-time-analytics.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
