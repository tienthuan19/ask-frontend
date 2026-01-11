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
        { code: classCode },
        getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get class details (assignments etc.)
 * Used by both Teacher and Student
 */
export const getClassAssignmentsAPI = async (classroomId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classrooms/${classroomId}/assignments`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};