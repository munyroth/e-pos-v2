import axios from 'axios';
const BASE_URL = 'https://kh-pos.furniturestores.me/api';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
    }
});