import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Attach the access token to every request, if available.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.config && error.config.skipAuthRefresh) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        // Check if error status is 401 and the request hasn't been retried yet.
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            isRefreshing = true;
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (!refreshToken) {
                // Only show an alert if the request opted in.
                if (error.config && error.config.authAlert) {
                    alert("Authentication credentials were not provided. Please log in.");
                }
                return Promise.reject(error);
            }

            return new Promise((resolve, reject) => {
                axios
                    .post(`${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`, { refresh: refreshToken })
                    .then(({ data }) => {
                        localStorage.setItem(ACCESS_TOKEN, data.access);
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
                        processQueue(null, data.access);
                        originalRequest.headers.Authorization = 'Bearer ' + data.access;
                        resolve(api(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        if (error.config && error.config.authAlert) {
                            alert("Authentication credentials were not provided. Please log in.");
                        }
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
