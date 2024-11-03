import axios from "axios";

const Api = axios.create({
    baseURL: process.env.API_URL || 'http://192.168.1.208:8000/api/',
});


Api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default Api;
