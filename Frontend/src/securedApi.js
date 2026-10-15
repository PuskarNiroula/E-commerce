import axios from 'axios';

const securedApi = axios.create({
    // baseURL: 'http://localhost:8000/api',
    // baseURL: 'http://192.168.18.139:8000/api',
    baseURL: 'https://ecommerce.home.arpa/api',
    withCredentials: true,
});

export default securedApi;