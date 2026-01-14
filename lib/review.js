import api, { API_BASE_URL } from "./api";
import axios from "axios";
import { getSession } from "next-auth/react";

// Get reviews for a specific product (public)
export const getProductReviews = async (productId, params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });

  try {
    const response = await api.get(`/reviews/${productId}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Reviews endpoint not implemented, return empty data
      console.warn("Reviews endpoint not available for product:", productId);
      return {
        reviews: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalReviews: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      };
    }
    throw error;
  }
};

// Add a review to a product (authenticated users)
export const addProductReview = async ({ productId, reviewText, reviewRating }) => {
  // Use the api instance which has automatic token handling via interceptor
  const response = await api.post(`/reviews/${productId}`, {
    reviewText,
    reviewRating
  });
  return response.data;
};

// Update own review (authenticated users)
export const updateReview = async ({ reviewId, reviewText, reviewRating }) => {
  const response = await api.put(`/reviews/${reviewId}`, {
    reviewText,
    reviewRating
  });
  return response.data;
};

// Delete own review (authenticated users)
export const deleteOwnReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// Add or update reply to a review (authenticated users)
export const replyToReview = async ({ reviewId, replyText }) => {
  const response = await api.put(`/reviews/${reviewId}/reply`, {
    replyText
  });
  return response.data;
};

// Delete own reply from review (authenticated users)
export const deleteReviewReply = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}/reply`);
  return response.data;
};

// Get user's reviews (admin only)
export const getUserReviews = async (userId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await api.get(`/reviews/user/${userId}?${queryParams.toString()}`);
  return response.data;
};

// Get all reviews for admin (admin only)
export const getAllReviews = async (params = {}) => {
  const {
    page = 1,
    limit = 20,
    product,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });

  if (product) queryParams.append('product', product);

  const response = await api.get(`/reviews/admin/all?${queryParams.toString()}`);
  return response.data;
};

// Delete review (admin only - same endpoint as user delete, differentiated by middleware)
export const deleteReviewAdmin = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// Delete reply from review (admin only - same endpoint as user delete reply, differentiated by middleware)
export const deleteReviewReplyAdmin = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}/reply`);
  return response.data;
};