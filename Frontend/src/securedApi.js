import axios from 'axios';

const securedApi = axios.create({
    baseURL: 'http://192.168.18.6:8000/api',
    withCredentials: true,
    headers: {
        'credentials': 'include',
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default securedApi;