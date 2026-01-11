// src/services/classService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/lms-backend/v1';

// Hàm helper để lấy token từ localStorage (giả sử bạn lưu token với key là 'token')
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const createClassAPI = async (classData) => {
    // classData: { code, name, subject, description }
    try {
        const response = await axios.post(`${API_URL}/classrooms`, classData, getAuthHeader());
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const getTeacherClassesAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/classrooms/teacher/my-classes`, getAuthHeader());
        return response.data; // Trả về ApiResponse.data (List<ClassroomCardResponse>)
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};

export const getDashboardStatsAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/classrooms/teacher/dashboard-stats`, getAuthHeader());
        return response.data; // Trả về ApiResponse.data (TeacherDashboardResponse)
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network Error' };
    }
};