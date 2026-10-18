import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for HTTP-only cookie authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;