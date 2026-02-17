import axios from 'axios';


// Ha a böngészőben nem localhoston vagyunk (pl. IP címen érjük el a fejlesztői gépet), 
// akkor a backendet is azon az IP-n keressük a 7234-es porton.
const getBackendUrl = () => {
    // Ha van környezeti változó, azt használjuk
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    const hostname = window.location.hostname;
    // Ha localhoston vagyunk, marad a bevált 7234-es port
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'https://localhost:7234';
    }

    // Ha IP címmel érjük el (pl. hálózati tesztelés), feltételezzük a backendet ugyanazon a gépen
    return `https://${hostname}:7234`;
};

const API_BASE_URL = getBackendUrl();

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
