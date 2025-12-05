import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/category";

// Query keys
export const categoryKeys = {
  all: ["categories"],
  single: (slug) => ["category", slug],
};

// Hook to get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get single category by slug
export const useCategory = (slug) => {
  return useQuery({
    queryKey: categoryKeys.single(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

// Hook to create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(data.message || "Category created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create category"
      );
    },
  });
};

// Hook to update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(data.message || "Category updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update category"
      );
    },
  });
};

// Hook to delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success(data.message || "Category deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    },
  });
};

