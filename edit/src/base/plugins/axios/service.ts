import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// import {
//     removeCookie
// } from '@u/cookie'

// 创建axios实例
const service = axios.create({
    baseURL: "",
    withCredentials: true, // 是否携带cookie信息
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers: {
        "X-Requested-With": "XMLHttpRequest"
    }
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
});

service.defaults.headers.post["Content-Type"] = "application/json";

// request拦截器
service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        return response.data;
    },
    errors => {
        const error = errors.response;
        if (error.status == 302 || error.status == 401) {
            // Toast.fail('授权已失效')
            // removeCookie('open_id')
        }
        if (error.status == 500) {
            // Toast.fail('网络错误')
        }
        return Promise.reject(error);
    }
);

export default service;
