import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL;
const LOGIN_URL = process.env.REACT_APP_LOGIN_URL;

export default axios.create({
    baseURL: LOGIN_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
    }
});