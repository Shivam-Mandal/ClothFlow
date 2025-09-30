// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://clothflow-backend.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
  withCredentials: true, 
});

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;

