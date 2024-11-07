import axios from "axios";

const Api = axios.create({
   // baseURL: 'http://192.168.1.208:8000/api/',
    baseURL: 'http://127.0.0.1:8000/api/',

    // timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
});
Api.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});


export default Api;