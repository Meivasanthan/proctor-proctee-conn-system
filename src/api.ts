// src/api.js
import axios from "axios";

// Base URL of your backend
const API_BASE_URL = "http://localhost:5000"; 

// ✅ Create Axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // optional: if you use cookies/sessions
});

// Define your endpoints (optional, useful for reference)
export const endpoints = {
  registerStudent: `${API_BASE_URL}/api/students/register`,
  loginStudent: `${API_BASE_URL}/api/students/login`,
};

// (Optional) Fetch-based API client – you can keep it if other files use it
export const apiClient = {
  registerStudent: async (studentData) => {
    const res = await fetch(endpoints.registerStudent, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });
    return res.json();
  },

  loginStudent: async (credentials) => {
    const res = await fetch(endpoints.loginStudent, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },
};
