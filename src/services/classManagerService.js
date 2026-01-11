// src/services/classManagerService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/lms-backend/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// --- Teacher APIs ---
export const getTeacherClassesAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/teacher/my-classes`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardStatsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/teacher/dashboard-stats`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createClassAPI = async (classData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/classrooms`, classData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Student APIs ---

/**
 * Get joined classes for student
 * GET /classrooms/student/my-classes
 */
export const getStudentClassesAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/student/my-classes`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Join a class
 * POST /classrooms/join
 * Body: { code: "..." }
 */
export const joinClassAPI = async (classCode) => {
  try {
    const response = await axios.post(
        `${API_BASE_URL}/classrooms/join`,
        { classCode: classCode },
        getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- CÁC HÀM MỚI ĐƯỢC THÊM VÀO ---

/**
 * Lấy danh sách thông báo của lớp học
 * GET /classrooms/{classroomId}/announcements
 * Dùng cho cả Giáo viên và Học sinh
 */
export const getClassAnnouncementsAPI = async (classroomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/${classroomId}/announcements`, getAuthHeaders());
    // Lưu ý: Kiểm tra xem backend trả về mảng trực tiếp hay bọc trong object (ví dụ: response.data.result)
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo thông báo mới cho lớp học
 * POST /classrooms/{classroomId}/announcements
 * Chỉ dùng cho Giáo viên
 */
export const createClassAnnouncementAPI = async (classroomId, announcementData) => {
  // announcementData: { title, content, priority }
  try {
    const response = await axios.post(
        `${API_BASE_URL}/classrooms/${classroomId}/announcements`,
        announcementData,
        getAuthHeaders()
    );
    return response.data.result || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách thông báo của người dùng (Notification System)
 * GET /notifications
 * Dùng cho Học sinh (và Giáo viên nếu hệ thống hỗ trợ)
 */
export const getMyNotificationsAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, getAuthHeaders());
    return response.data.result || response.data;
  } catch (error) {
    throw error;
  }
};

// src/services/classManagerService.js

// ... (Giữ nguyên các hàm cũ)

// --- ASSIGNMENT APIs ---

/**
 * Lấy danh sách bài tập của lớp
 * GET /api/lms-backend/v1/classrooms/{classroomId}/assignments
 */
export const getClassAssignmentsAPI = async (classroomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/${classroomId}/assignments`, getAuthHeaders());
    // Backend trả về ApiResponse<List<AssignmentResponse>>, dữ liệu nằm trong field 'data'
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo bài tập mới
 * POST /api/lms-backend/v1/classrooms/{classroomId}/assignments
 */
export const createClassAssignmentAPI = async (classroomId, assignmentData) => {
  try {
    const response = await axios.post(
        `${API_BASE_URL}/classrooms/${classroomId}/assignments`,
        assignmentData,
        getAuthHeaders()
    );
    // Backend trả về ApiResponse<AssignmentResponse>
    return response.data.data;
  } catch (error) {
    throw error;
  }
};