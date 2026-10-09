import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://192.168.18.6:8000/api',
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export default api;