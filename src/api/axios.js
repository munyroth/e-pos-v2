import axios from 'axios';
const BASE_URL = 'https://kh-pos.furniturestores.me/api/admin';
// const BASE_URL = 'http://localhost:8000/api/admin';
const LOGIN_URL = 'https://kh-pos.furniturestores.me/api';

export default axios.create({
    baseURL: LOGIN_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
    }
});