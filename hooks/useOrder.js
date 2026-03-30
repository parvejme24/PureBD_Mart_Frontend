"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelOrder,
  getAllOrders,
  getTrashedOrders,
  searchOrdersByCustomer,
  updateOrderStatus,
  moveOrderToTrash,
  restoreOrder,
  permanentlyDeleteOrder,
} from "@/lib/order";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

// ============ USER HOOKS ============

// Create a new order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      // Clear cart after successful order
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        // Store order data in sessionStorage for success page
        if (data?.order) {
          sessionStorage.setItem("lastOrder", JSON.stringify(data.order));
        }
      }
      // Navigate to success page with order ID
      const orderId = data?.order?.orderId || data?.order?._id || "";
      router.push(`/order-success${orderId ? `?orderId=${orderId}` : ""}`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    },
  });
}

// Get user's orders
export function useUserOrders(params = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: ["user-orders", user?._id, params],
    queryFn: () => getUserOrders(params),
    enabled: !isAuthLoading && isAuthenticated && !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single user order by ID
export function useUserOrder(orderId) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    queryKey: ["user-order", orderId],
    queryFn: () => getUserOrderById(orderId),
    enabled: !isAuthLoading && isAuthenticated && !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}

// Cancel order (user can cancel if order is still pending)
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      toast.success("Order cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({ queryKey: ["user-order"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to cancel order"
      );
    },
  });
}

// ============ ADMIN HOOKS ============

// Get all active orders (admin only)
export function useAllOrders(params = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAllOrders(params),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get trashed orders (admin only)
export function useTrashedOrders(params = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["trashed-orders", params],
    queryFn: () => getTrashedOrders(params),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Search orders by customer (admin only)
export function useSearchOrders(searchParams = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["search-orders", searchParams],
    queryFn: () => searchOrdersByCustomer(searchParams),
    enabled: !isAuthLoading && isAuthenticated && isAdmin && (searchParams.email || searchParams.phone),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Update order status and/or payment status (admin only)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, updateData }) => updateOrderStatus(orderId, updateData),
    onSuccess: (data) => {
      toast.success("Order updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["trashed-orders"] });
      queryClient.invalidateQueries({ queryKey: ["search-orders"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update order"
      );
    },
  });
}

// Move order to trash (soft delete - admin only)
export function useMoveOrderToTrash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveOrderToTrash,
    onSuccess: (data) => {
      toast.success("Order moved to trash successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["trashed-orders"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to move order to trash"
      );
    },
  });
}

// Restore order from trash (admin only)
export function useRestoreOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreOrder,
    onSuccess: (data) => {
      toast.success("Order restored successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["trashed-orders"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to restore order"
      );
    },
  });
}

// Permanently delete order from trash (admin only - dangerous operation)
export function usePermanentlyDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentlyDeleteOrder,
    onSuccess: (data) => {
      toast.success("Order permanently deleted!");
      queryClient.invalidateQueries({ queryKey: ["trashed-orders"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to permanently delete order"
      );
    },
  });
}

// ============ LEGACY HOOKS (for backward compatibility) ============

// Legacy hook - use useAllOrders instead
export function useOrders() {
  return useAllOrders();
}

// Legacy hook - use useUserOrder instead
export function useOrder(id) {
  return useUserOrder(id);
}

// Legacy hook - use usePermanentlyDeleteOrder instead
export function useDeleteOrder() {
  return usePermanentlyDeleteOrder();
}

