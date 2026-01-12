// src/services/notificationService.js
import axios from 'axios';

// Đảm bảo URL này khớp với gateway hoặc backend của bạn
const API_URL = 'http://localhost:8081/api/lms-backend/v1/notifications';
// Helper để lấy token (giả sử bạn lưu token trong localStorage)
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getMyNotificationsAPI = async () => {
    try {
        // GET /api/lms-backend/v1/notifications
        const response = await axios.get(`${API_URL}`, getAuthHeader());
        return response.data.data; // Trả về ApiResponse object
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return null;
    }
};

export const markNotificationReadAPI = async (notificationId) => {
    try {
        // PUT /api/lms-backend/v1/notifications/{id}/read
        const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

export const getUnreadCountAPI = async () => {
    try {
        // GET /api/lms-backend/v1/notifications/unread-count
        const response = await axios.get(`${API_URL}/unread-count`, getAuthHeader());
        return response.data.data;
    } catch (error) {
        console.error("Error getting unread count:", error);
        return { data: 0 };
    }
};