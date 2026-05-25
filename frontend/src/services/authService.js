// src/services/authService.js
import axios from "axios";

import { API_BASE_URL } from '../constants/api.js';
import { getServiceToken, setServiceAuth, clearServiceAuth } from '../utils/authCookies.js';

const API_URL = `${API_BASE_URL}/stock/auth`;

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${getServiceToken('stock') || localStorage.getItem('token')}`,
    },
});

export const authService = {
    /** REGISTER */
    register: async (data) => {
        const res = await axios.post(`${API_URL}/register`, data);
        if (res.data?.token) {
            setServiceAuth('stock', { token: res.data.token, user: res.data.user });
        }
        return res.data;
    },

    /** LOGIN */
    login: async (data) => {
        const res = await axios.post(`${API_URL}/login`, data);
        if (res.data?.token) {
            setServiceAuth('stock', { token: res.data.token, user: res.data.user });
        }
        return res.data;
    },

    /** GET CURRENT USER */
    me: async () => {
        const res = await axios.get(`${API_URL}/me`, getAuthHeader());
        return res.data;
    },

    /** LOGOUT */
    logout: async () => {
        const res = await axios.post(`${API_URL}/logout`, {}, getAuthHeader());
        clearServiceAuth('stock');
        return res.data;
    },

    /** REFRESH TOKEN */
    refresh: async () => {
        const oldToken = getServiceToken('stock');
        if (!oldToken) return null;

        const res = await axios.post(`${API_URL}/refresh`, { token: oldToken });

        if (res.data?.token) {
            setServiceAuth('stock', { token: res.data.token, user: res.data.user });
        }

        return res.data;
    },

    /** FORGOT PASSWORD (SEND RESET LINK) */
    forgotPassword: async (data) => {
        const res = await axios.post(`${API_URL}/forgot-password`, data);
        return res.data;
    },

    /** RESET PASSWORD */
    resetPassword: async (data) => {
        const res = await axios.post(`${API_URL}/reset-password`, data);
        return res.data;
    },
};
