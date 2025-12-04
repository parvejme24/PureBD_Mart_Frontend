import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// Login user (for direct API calls, use NextAuth signIn for session management)
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Get logged in user profile
export const getLoggedInUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Update user profile (supports image upload)
export const updateProfile = async (formData) => {
  const response = await api.put("/auth/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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
