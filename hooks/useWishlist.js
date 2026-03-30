"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  clearWishlist as clearWishlistAPI,
  isProductInWishlist,
} from "@/lib/wishlist";

// Query keys
export const wishlistKeys = {
  all: ["wishlist"],
  lists: () => [...wishlistKeys.all, "list"],
  list: (filters) => [...wishlistKeys.lists(), filters],
};

// Hook to get user's wishlist
export const useGetUserWishlist = () => {
  return useQuery({
    queryKey: wishlistKeys.lists(),
    queryFn: getUserWishlist,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook to add product to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWishlistAPI,
    // Optimistic update - immediately update UI
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return old;
        // If product is already in wishlist, don't add it again
        const isAlreadyInWishlist = old.wishlist.some(product => product._id === productId);
        if (isAlreadyInWishlist) return old;

        return {
          ...old,
          wishlist: [...old.wishlist],
          count: old.count + 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousWishlist };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Product added to wishlist");
      // The optimistic update should be replaced by server data on next fetch
    },
    onError: (error, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
      }

      if (error.response?.status === 400 && error.response?.data?.message?.includes("already in")) {
        toast.info("Product is already in your wishlist");
      } else if (error.response?.status === 401) {
        toast.error("Please log in to add items to wishlist");
      } else if (error.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error(error.response?.data?.message || "Failed to add product to wishlist");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

// Hook to remove product from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWishlistAPI,
    // Optimistic update - immediately update UI
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(wishlistKeys.lists(), (old) => {
        if (!old) return old;

        return {
          wishlist: old.wishlist.filter(product => product._id !== productId),
          count: Math.max(0, old.count - 1),
        };
      });

      // Return a context object with the snapshotted value
      return { previousWishlist };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Product removed from wishlist");
      // The optimistic update should be replaced by server data on next fetch
    },
    onError: (error, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
      }

      if (error.response?.status === 401) {
        toast.error("Please log in to manage your wishlist");
      } else if (error.response?.status === 404) {
        toast.error("Product not found in wishlist");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove product from wishlist");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

// Hook to clear entire wishlist
export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearWishlistAPI,
    // Optimistic update - immediately update UI
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: wishlistKeys.all });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(wishlistKeys.lists());

      // Optimistically clear the wishlist
      queryClient.setQueryData(wishlistKeys.lists(), {
        wishlist: [],
        count: 0,
      });

      // Return a context object with the snapshotted value
      return { previousWishlist };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Wishlist cleared");
      // The optimistic update should be replaced by server data on next fetch
    },
    onError: (error, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.lists(), context.previousWishlist);
      }

      toast.error(error.response?.data?.message || "Failed to clear wishlist");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state is correct
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
};

// Main wishlist hook that combines all functionality
export function useWishlist() {
  const { data: wishlistData, isLoading, error } = useGetUserWishlist();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();
  const clearMutation = useClearWishlist();

  const wishlist = wishlistData?.wishlist || [];
  const count = wishlistData?.count || 0;

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((product) => product._id === productId);
  };

  // Add to wishlist
  const addToWishlist = (productId) => {
    addMutation.mutate(productId);
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    removeMutation.mutate(productId);
  };

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    clearMutation.mutate();
  };

  return {
    wishlist,
    count,
    isLoading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    // Loading states for individual operations
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
