// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/identity-service/v1/auth';

export const loginAPI = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const registerAPI = async (fullName, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username: fullName,
            email: email,
            password: password,
            roles: [role.toUpperCase()]
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};