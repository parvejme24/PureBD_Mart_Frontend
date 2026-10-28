// import api, { API_BASE_URL } from "./api";
// import axios from "axios";
// import { getSession } from "next-auth/react";
import productsData from "@/data/products.json";

// In-memory products store loaded directly from data/products.json
let localProducts = [...(productsData.products || [])];

// Helper to filter and paginate local products
const getLocalFilteredProducts = (params = {}) => {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 100,
  } = params;

  let list = [...localProducts];

  // Category filter
  if (category) {
    list = list.filter(
      (p) =>
        p.category?.slug === category ||
        p.category?._id === category ||
        p.category === category
    );
  }

  // Min price filter
  if (minPrice !== undefined && minPrice !== "") {
    list = list.filter((p) => {
      const price = p.withDiscountPrice || p.price || 0;
      return price >= Number(minPrice);
    });
  }

  // Max price filter
  if (maxPrice !== undefined && maxPrice !== "") {
    list = list.filter((p) => {
      const price = p.withDiscountPrice || p.price || 0;
      return price <= Number(maxPrice);
    });
  }

  // Keyword search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sorting
  list.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === "price") {
      aVal = a.withDiscountPrice || a.price || 0;
      bVal = b.withDiscountPrice || b.price || 0;
    } else if (sortBy === "createdAt") {
      aVal = new Date(a.createdAt || 0).getTime();
      bVal = new Date(b.createdAt || 0).getTime();
    } else if (sortBy === "rating" || sortBy === "averageRating") {
      aVal = a.averageRating || 0;
      bVal = b.averageRating || 0;
    } else if (sortBy === "sold") {
      aVal = a.sold || 0;
      bVal = b.sold || 0;
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  return {
    products: list,
    total: list.length,
    page: Number(page),
    limit: Number(limit),
  };
};

// =========================================================================
// Get all products with filtering, pagination, and search (From JSON)
// =========================================================================
export const getAllProducts = async (params = {}) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  if (category) queryParams.append("category", category);
  if (minPrice) queryParams.append("minPrice", minPrice.toString());
  if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
  if (search) queryParams.append("search", search);

  const response = await api.get(`/products?${queryParams.toString()}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/products.json:
  return getLocalFilteredProducts(params);
};

// =========================================================================
// Get single product by slug (From JSON)
// =========================================================================
export const getProductBySlug = async (slug) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/products/${slug}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/products.json:
  const decodedSlug = decodeURIComponent(slug || "");
  const found = localProducts.find(
    (p) =>
      p.slug === decodedSlug ||
      p._id === decodedSlug ||
      p.slug === slug ||
      p._id === slug
  );

  return { product: found || localProducts[0] || null };
};

// =========================================================================
// Get products by category slug (From JSON)
// =========================================================================
export const getProductsByCategorySlug = async (categorySlug) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/products/category/${categorySlug}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/products.json:
  const list = localProducts.filter(
    (p) => p.category?.slug === categorySlug || p.category?._id === categorySlug
  );
  return { products: list, count: list.length };
};

// =========================================================================
// Get best selling products (From JSON)
// =========================================================================
export const getBestSellingProducts = async (limit = 10) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/products/best-selling?limit=${limit}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/products.json:
  const sorted = [...localProducts]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, limit);
  return { products: sorted, count: sorted.length };
};

// =========================================================================
// Get deal of the day products (From JSON)
// =========================================================================
export const getDealOfTheDay = async () => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get("/products/deal-of-the-day");
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/products.json:
  const deals = localProducts.filter((p) => (p.discount || 0) > 0);
  deals.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  return { products: deals, dealOfTheDay: deals, count: deals.length };
};

// =========================================================================
// Admin Actions: Create, Update, Delete Product
// =========================================================================
export const createProduct = async (formData) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.post(`${API_BASE_URL}/products`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const newProd = {
    _id: `prod${Date.now()}`,
    slug: `product-${Date.now()}`,
    ...formData,
    createdAt: new Date().toISOString(),
  };
  localProducts.unshift(newProd);
  return { success: true, message: "Product created successfully", product: newProd };
};

export const updateProduct = async ({ id, formData }) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.put(`${API_BASE_URL}/products/${id}`, formData, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const idx = localProducts.findIndex((p) => p._id === id);
  if (idx !== -1) {
    localProducts[idx] = { ...localProducts[idx], ...formData };
  }
  return { success: true, message: "Product updated successfully" };
};

export const deleteProduct = async (id) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const session = await getSession();
  const token = session?.accessToken;

  const response = await axios.delete(`${API_BASE_URL}/products/${id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
  // -----------------------------------------------------------
  */

  localProducts = localProducts.filter((p) => p._id !== id);
  return { success: true, message: "Product deleted successfully" };
};
