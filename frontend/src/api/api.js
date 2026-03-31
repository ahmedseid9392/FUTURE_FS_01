import axios from "axios";

const API = axios.create({

  baseURL: "https://my-react-portfolio-bwzx.onrender.com/api" || 'http://localhost:5000/api',
 headers: {
    'Content-Type': 'application/json',
  },
  timeout: 70000, // 30 seconds timeout for large files
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);
export default API;
