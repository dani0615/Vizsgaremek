import axios from 'axios';

// Base API URL
const API_BASE_URL = 'https://localhost:7234';

// Create Axios Instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
    }
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
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

// Response Interceptor: Handle Errors (401)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Opcionális: Redirect to login or dispatch a global event
            // window.location.href = '/login'; // Hagyjuk, hogy a Context/Router kezelje ezt a state változás alapján
        }
        return Promise.reject(error);
    }
);

export { apiClient, API_BASE_URL };
