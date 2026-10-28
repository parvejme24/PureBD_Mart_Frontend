// import api, { API_BASE_URL } from "./api";
// import axios from "axios";
// import { getSession } from "next-auth/react";
import categoriesData from "@/data/categories.json";

// In-memory categories store loaded directly from data/categories.json
let localCategories = [...(categoriesData.categories || [])];

// =========================================================================
// Get all categories (From JSON)
// =========================================================================
export const getAllCategories = async () => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get("/categories");
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/categories.json:
  return {
    categories: localCategories,
    total: localCategories.length,
  };
};

// =========================================================================
// Get single category by slug (From JSON)
// =========================================================================
export const getCategoryBySlug = async (slug) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/categories/${slug}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/categories.json:
  const found = localCategories.find(
    (c) => c.slug === slug || c._id === slug
  );
  return { category: found || localCategories[0] || null };
};

// =========================================================================
// Admin Actions: Create, Update, Delete Category
// =========================================================================
export const createCategory = async (formData) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.post(`${API_BASE_URL}/categories`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const newCat = {
    _id: `cat${Date.now()}`,
    slug: `cat-${Date.now()}`,
    ...formData,
    createdAt: new Date().toISOString(),
  };
  localCategories.unshift(newCat);
  return { success: true, message: "Category created successfully", category: newCat };
};

export const updateCategory = async ({ id, formData }) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.put(`${API_BASE_URL}/categories/${id}`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const idx = localCategories.findIndex((c) => c._id === id);
  if (idx !== -1) {
    localCategories[idx] = { ...localCategories[idx], ...formData };
  }
  return { success: true, message: "Category updated successfully" };
};

export const deleteCategory = async (id) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.delete(`${API_BASE_URL}/categories/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  localCategories = localCategories.filter((c) => c._id !== id);
  return { success: true, message: "Category deleted successfully" };
};
