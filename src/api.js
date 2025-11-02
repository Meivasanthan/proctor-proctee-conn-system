import axios from "axios";

// ✅ Base URL of your backend server
const API_BASE_URL = "http://localhost:5000/api"; // change port if needed

// ✅ Create and export axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Define endpoints (for easy reuse)
export const endpoints = {
  registerStudent: "/students/register",
  loginStudent: "/students/login",
  registerStaff: "/staff/register",
  loginStaff: "/staff/login",
};

// ✅ Define helper API functions
export const apiClient = {
  // Student Register
  registerStudent: async (studentData) => {
    const res = await axiosInstance.post(endpoints.registerStudent, studentData);
    return res.data;
  },

  // Student Login
  loginStudent: async (credentials) => {
    const res = await axiosInstance.post(endpoints.loginStudent, credentials);
    return res.data;
  },

  // Staff Register
  registerStaff: async (staffData) => {
    const res = await axiosInstance.post(endpoints.registerStaff, staffData);
    return res.data;
  },

  // Staff Login
  loginStaff: async (credentials) => {
    const res = await axiosInstance.post(endpoints.loginStaff, credentials);
    return res.data;
  },
};
