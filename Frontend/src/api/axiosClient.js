// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    // Use environment variable or fallback to Laravel backend URL
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Required if using Laravel Sanctum stateful cookies/sessions
    withCredentials: true,
});

// Request Interceptor: Attach Auth Token if using Bearer Tokens
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (401, 403, 500)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle unauthenticated state
            if (error.response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN');
                // Optional: window.location.href = '/login';
            }
        }
        return Promise.reject(error);
            }
);

export default axiosClient;