import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar token en cada petición
adminApi.interceptors.request.use((config) => {
    const adminData = localStorage.getItem('conexion_admin_auth');
    if (adminData) {
        const { token } = JSON.parse(adminData);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor global para detectar 401s (token expirado o inválido)
adminApi.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // En un entorno ideal limpiaríamos el localStorage y forzaríamos redirect
        console.warn("Acceso denegado o sesión expirada");
    }
    return Promise.reject(error);
});

export default adminApi;
