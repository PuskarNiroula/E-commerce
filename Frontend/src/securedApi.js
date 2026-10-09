import axios from 'axios';

const securedApi = axios.create({
    // baseURL: 'http://192.168.18.6:8000/api',
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export default securedApi;