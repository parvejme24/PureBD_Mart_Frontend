import api, { API_BASE_URL } from "./api";
import axios from "axios";
import { getSession } from "next-auth/react";

// Get all products (public)
export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Get single product by slug (public)
export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

// Get products by category slug (public)
export const getProductsByCategorySlug = async (categorySlug) => {
  const response = await api.get(`/products/category/${categorySlug}`);
  return response.data;
};

// Create product (admin only)
export const createProduct = async (formData) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.post(`${API_BASE_URL}/products`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

// Update product (admin only)
export const updateProduct = async ({ id, formData }) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

// Delete product (admin only)
export const deleteProduct = async (id) => {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};










