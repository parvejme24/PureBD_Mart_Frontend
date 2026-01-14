import api, { API_BASE_URL } from "./api";
import axios from "axios";
import { getSession } from "next-auth/react";

// Get all products with filtering, pagination, and search (public)
export const getAllProducts = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });

  if (category) queryParams.append('category', category);
  if (minPrice) queryParams.append('minPrice', minPrice.toString());
  if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
  if (search) queryParams.append('search', search);

  const response = await api.get(`/products?${queryParams.toString()}`);
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

// Get best selling products (public)
export const getBestSellingProducts = async (limit = 10) => {
  try {
    const response = await api.get(`/products/best-selling?limit=${limit}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Endpoint not implemented, return empty data
      console.warn("Best selling products endpoint not available");
      return { products: [], count: 0 };
    }
    throw error;
  }
};

// Get deal of the day products (public)
export const getDealOfTheDay = async () => {
  try {
    const response = await api.get("/products/deal-of-the-day");
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Endpoint not implemented, return empty data
      console.warn("Deal of the day endpoint not available");
      return { dealOfTheDay: [], count: 0 };
    }
    throw error;
  }
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











