"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProductReviews,
  addProductReview,
  updateReview,
  deleteOwnReview,
  replyToReview,
  deleteReviewReply,
  getUserReviews,
  getAllReviews,
  deleteReviewAdmin,
  deleteReviewReplyAdmin,
} from "@/lib/review";

// Query keys
export const reviewKeys = {
  all: ["reviews"],
  productReviews: (productId, params) => [
    "reviews",
    "product",
    productId,
    params,
  ],
  userReviews: (userId, params) => ["reviews", "user", userId, params],
  adminReviews: (params) => ["reviews", "admin", params],
};

// Hook to get reviews for a product (public)
export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: reviewKeys.productReviews(productId, params),
    queryFn: () => getProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 (endpoint not implemented) or 401 (auth issues)
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
};

// Hook to add a review to a product (authenticated users)
export const useAddProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductReview,
    onSuccess: (data) => {
      // Invalidate reviews for the product
      if (data.review?.product) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", "product", data.review.product],
        });
      }
      toast.success(data.message || "Review added successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add review");
    },
  });
};

// Hook to update own review (authenticated users)
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: (data) => {
      // Invalidate reviews for the product
      if (data.review?.product) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", "product", data.review.product],
        });
      }
      toast.success(data.message || "Review updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update review");
    },
  });
};

// Hook to delete own review (authenticated users)
export const useDeleteOwnReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOwnReview,
    onSuccess: (data) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(data.message || "Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

// Hook to add or update reply to a review (authenticated users)
export const useReplyToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyToReview,
    onSuccess: (data) => {
      // Invalidate reviews for the product
      if (data.review?.product) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", "product", data.review.product],
        });
      }
      toast.success(data.message || "Reply submitted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit reply");
    },
  });
};

// Hook to delete own reply from review (authenticated users)
export const useDeleteReviewReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewReply,
    onSuccess: (data) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(data.message || "Reply deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete reply");
    },
  });
};

// Hook to get user's reviews (admin only)
export const useUserReviews = (userId, params = {}) => {
  return useQuery({
    queryKey: reviewKeys.userReviews(userId, params),
    queryFn: () => getUserReviews(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get all reviews for admin (admin only)
export const useAllReviews = (params = {}) => {
  return useQuery({
    queryKey: reviewKeys.adminReviews(params),
    queryFn: () => getAllReviews(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to delete review (admin only)
export const useDeleteReviewAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewAdmin,
    onSuccess: (data) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(data.message || "Review deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });
};

// Hook to delete reply from review (admin only)
export const useDeleteReviewReplyAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReviewReplyAdmin,
    onSuccess: (data) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(data.message || "Reply deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete reply");
    },
  });
};
