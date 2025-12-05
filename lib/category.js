import api, { API_BASE_URL } from "./api";
import axios from "axios";
import { getSession } from "next-auth/react";

// Get all categories (public)
export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Get single category by slug (public)
export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

// Create category (admin only)
export const createCategory = async (formData) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.post(`${API_BASE_URL}/categories`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

// Update category (admin only)
export const updateCategory = async ({ id, formData }) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.put(`${API_BASE_URL}/categories/${id}`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

// Delete category (admin only)
export const deleteCategory = async (id) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

