import axios from "axios";
import api, { API_BASE_URL } from "./api";
import { getSession } from "next-auth/react";

// Register a new user
export const registerUser = async (userData) => {
  // Backend expects fullName, not name
  const payload = {
    fullName: userData.fullName || userData.name,
    email: userData.email,
    password: userData.password,
  };
  const response = await api.post("/auth/register", payload);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Get logged in user profile
export const getLoggedInUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Update user profile (supports image upload with FormData)
export const updateProfile = async (formData) => {
  // Get auth token from session
  const session = await getSession();
  const token = session?.accessToken;

  // Use axios directly for FormData to avoid Content-Type issues
  const response = await axios.put(`${API_BASE_URL}/auth/update`, formData, {
    headers: {
      // Let browser set Content-Type with boundary automatically
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

// Change user role (admin only)
export const changeUserRole = async (roleData) => {
  const response = await api.put("/auth/role", roleData);
  return response.data;
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  const response = await api.delete(`/auth/${userId}`);
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await api.get("/auth/all");
  return response.data;
};
