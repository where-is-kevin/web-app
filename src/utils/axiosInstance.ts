'use client'
// @file - /utils/axiosInstance.ts
import axios, {InternalAxiosRequestConfig} from 'axios';
import {deleteCookie, getCookie} from 'cookies-next';
import {refreshAccessToken} from "@/services/authService";
import {config} from "@/utils/config";
// Use .env variables
const axiosInstance = axios.create({
    // baseURL: 'https://api.whereiskevin.com',
    // baseURL: 'https://localhost:8000',
    baseURL: config.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true // Mark the request as retried to avoid infinite loops.
            try {
                await refreshAccessToken()
                const accessToken = getCookie('access_token')
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                return axiosInstance(originalRequest)
            } catch (_) {
                deleteCookie('access_token')
                deleteCookie('refresh_token')
                window.location.href = '/login'
            }
        }
        //
        // if ((error.response.status === 401 || error.response.status === 403) && originalRequest._retry) {
        //     deleteCookie('access_token')
        //     deleteCookie('refresh_token')
        //     window.location.href = '/login'
        // }

        return Promise.reject(error)
    }
)

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie('access_token')

    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})

export default axiosInstance
