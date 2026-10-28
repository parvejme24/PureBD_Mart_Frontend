// import api, { API_BASE_URL } from "./api";
// import axios from "axios";
// import { getSession } from "next-auth/react";
import reviewsData from "@/data/reviews.json";

// In-memory reviews store loaded directly from data/reviews.json
let localReviews = [...(reviewsData.reviews || [])];

// =========================================================================
// Get reviews for a specific product (From JSON)
// =========================================================================
export const getProductReviews = async (productId, params = {}) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  const response = await api.get(`/reviews/${productId}?${queryParams.toString()}`);
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently loading directly from data/reviews.json:
  const { page = 1, limit = 10, sortOrder = "desc" } = params;

  // Filter reviews matching the product
  let productReviews = localReviews.filter(
    (r) => r.product === productId || r.productId === productId
  );

  // If no specific reviews exist for this ID, use sample reviews
  if (productReviews.length === 0) {
    productReviews = localReviews.slice(0, 3).map((r, idx) => ({
      ...r,
      _id: `rev-${productId}-${idx}`,
      product: productId,
    }));
  }

  // Sort
  productReviews.sort((a, b) => {
    const aDate = new Date(a.createdAt || 0).getTime();
    const bDate = new Date(b.createdAt || 0).getTime();
    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  });

  const totalReviews = productReviews.length;
  const avg =
    totalReviews > 0
      ? productReviews.reduce((acc, cur) => acc + (cur.reviewRating || 5), 0) / totalReviews
      : 5.0;

  return {
    reviews: productReviews.slice((page - 1) * limit, page * limit),
    averageRating: Number(avg.toFixed(1)),
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalReviews / limit) || 1,
      totalReviews: totalReviews,
      hasNextPage: page * limit < totalReviews,
      hasPrevPage: page > 1,
    },
  };
};

// =========================================================================
// Add a review to a product (In-Memory + JSON support)
// =========================================================================
export const addProductReview = async ({ productId, reviewText, reviewRating }) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.post(`/reviews/${productId}`, {
    reviewText,
    reviewRating,
  });
  return response.data;
  // -----------------------------------------------------------
  */

  // Currently saving directly to in-memory store:
  const newReview = {
    _id: `rev-${Date.now()}`,
    product: productId,
    user: {
      _id: `usr-${Date.now()}`,
      name: "Verified Customer",
      email: "customer@purebdmart.com",
    },
    reviewRating: Number(reviewRating),
    reviewText: reviewText?.trim() || "",
    isVerified: true,
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  localReviews.unshift(newReview);

  return {
    success: true,
    message: "Review submitted successfully!",
    review: newReview,
  };
};

// =========================================================================
// Update own review
// =========================================================================
export const updateReview = async ({ reviewId, reviewText, reviewRating }) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.put(`/reviews/${reviewId}`, {
    reviewText,
    reviewRating,
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const idx = localReviews.findIndex((r) => r._id === reviewId);
  if (idx !== -1) {
    localReviews[idx] = {
      ...localReviews[idx],
      reviewText,
      reviewRating: Number(reviewRating),
      updatedAt: new Date().toISOString(),
    };
  }
  return { success: true, message: "Review updated successfully" };
};

// =========================================================================
// Delete own review
// =========================================================================
export const deleteOwnReview = async (reviewId) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
  // -----------------------------------------------------------
  */

  localReviews = localReviews.filter((r) => r._id !== reviewId);
  return { success: true, message: "Review deleted successfully" };
};

// =========================================================================
// Reply to a review
// =========================================================================
export const replyToReview = async ({ reviewId, replyText }) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.put(`/reviews/${reviewId}/reply`, {
    replyText,
  });
  return response.data;
  // -----------------------------------------------------------
  */

  const idx = localReviews.findIndex((r) => r._id === reviewId);
  if (idx !== -1) {
    localReviews[idx].reply = {
      user: {
        _id: "admin001",
        name: "PureBD Mart Official Support",
        email: "support@purebdmart.com",
      },
      replyText: replyText?.trim(),
      createdAt: new Date().toISOString(),
    };
  }
  return { success: true, message: "Reply posted successfully" };
};

// =========================================================================
// Delete reply from review
// =========================================================================
export const deleteReviewReply = async (reviewId) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.delete(`/reviews/${reviewId}/reply`);
  return response.data;
  // -----------------------------------------------------------
  */

  const idx = localReviews.findIndex((r) => r._id === reviewId);
  if (idx !== -1) {
    delete localReviews[idx].reply;
  }
  return { success: true, message: "Reply deleted successfully" };
};

// =========================================================================
// Admin Review Operations
// =========================================================================
export const getUserReviews = async (userId, params = {}) => {
  const { page = 1, limit = 10 } = params;
  const userList = localReviews.filter((r) => r.user?._id === userId);
  return {
    reviews: userList.slice((page - 1) * limit, page * limit),
    total: userList.length,
  };
};

export const getAllReviews = async (params = {}) => {
  /*
  // --- UNCOMMENT THIS WHEN READY TO CONNECT TO BACKEND API ---
  const response = await api.get(`/reviews/admin/all`);
  return response.data;
  // -----------------------------------------------------------
  */

  const { page = 1, limit = 20 } = params;
  return {
    reviews: localReviews.slice((page - 1) * limit, page * limit),
    total: localReviews.length,
  };
};

export const deleteReviewAdmin = async (reviewId) => {
  localReviews = localReviews.filter((r) => r._id !== reviewId);
  return { success: true, message: "Review deleted by admin" };
};

export const deleteReviewReplyAdmin = async (reviewId) => {
  const idx = localReviews.findIndex((r) => r._id === reviewId);
  if (idx !== -1) {
    delete localReviews[idx].reply;
  }
  return { success: true, message: "Reply deleted by admin" };
};