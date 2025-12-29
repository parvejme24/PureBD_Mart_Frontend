"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategorySlug,
  getBestSellingProducts,
  getDealOfTheDay,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/product";

// Query keys
export const productKeys = {
  all: ["products"],
  single: (slug) => ["product", slug],
  byCategory: (categorySlug) => ["products", "category", categorySlug],
  bestSelling: ["products", "analytics", "best-selling"],
  dealOfTheDay: ["products", "analytics", "deal-of-the-day"],
};

// Hook to get all products
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get single product by slug
export const useProduct = (slug) => {
  return useQuery({
    queryKey: productKeys.single(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

// Hook to get products by category slug
export const useProductsByCategory = (categorySlug) => {
  return useQuery({
    queryKey: productKeys.byCategory(categorySlug),
    queryFn: () => getProductsByCategorySlug(categorySlug),
    enabled: !!categorySlug,
  });
};

// Hook to get best selling products
export const useBestSellingProducts = () => {
  return useQuery({
    queryKey: productKeys.bestSelling,
    queryFn: getBestSellingProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get deal of the day products
export const useDealOfTheDay = () => {
  return useQuery({
    queryKey: productKeys.dealOfTheDay,
    queryFn: getDealOfTheDay,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(data.message || "Product created successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

// Hook to update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      // Also invalidate single product query if slug changed
      if (data.product?.slug) {
        queryClient.invalidateQueries({
          queryKey: productKeys.single(data.product.slug),
        });
      }
      toast.success(data.message || "Product updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

// Hook to delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success(data.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};














