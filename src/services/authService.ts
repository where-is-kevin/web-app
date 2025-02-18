import {setCookie, getCookie} from 'cookies-next';
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import {config} from "@/utils/config";

// Interface for login response
export interface OAuthResponse {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
    client_id?: string|null;
    client_secret?: string|null;
    grant_type: string;
}

// Login method for requesting an access token and refresh token
export const login = async (credentials: LoginCredentials): Promise<OAuthResponse> => {
    try {
        const response = await axiosInstance.post<OAuthResponse>('/oauth/token', {
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password,
            client_id: credentials.client_id ?? process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: credentials.client_secret ?? process.env.NEXT_PUBLIC_CLIENT_SECRET,
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Store access and refresh tokens in HTTP-only cookies
        setCookie('access_token', access_token, {
            httpOnly: false,
            sameSite: 'strict',
            path: '/',
            maxAge: expires_in,
        });

        setCookie('refresh_token', refresh_token, {
            httpOnly: false,
            sameSite: 'strict',
            path: '/',
        });

        return response.data;
    } catch (_) {
        throw new Error('Login failed');
    }
};

// Method to refresh the access token using the refresh token
export const refreshAccessToken = async (): Promise<void> => {
    try {
        const refreshToken = getCookie('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token found');
        }

        const response = await axios.post<OAuthResponse>(config.baseURL + '/oauth/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: 'default_consumer',  // Provide client_id from environment variables
            client_secret: 'd37a403c',  // Provide client_secret from environment variables
        }, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, expires_in } = response.data;

        // Update the access token in cookies
        setCookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: expires_in,
        });
    } catch (_) {
        throw new Error('Token refresh failed');
    }
};

// Logout method to clear tokens from cookies
