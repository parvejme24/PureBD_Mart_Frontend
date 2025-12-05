import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "@/lib/order";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

// Create a new order
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // Clear cart after successful order
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }
      // Navigate to success page with order ID
      const orderId = data?.order?._id || data?.order?.id || "";
      router.push(`/order-success${orderId ? `?orderId=${orderId}` : ""}`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    },
  });
}

// Get all orders (admin only)
export function useOrders() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get single order by ID
export function useOrder(id) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !isAuthLoading && isAuthenticated && isAdmin && !!id,
    staleTime: 2 * 60 * 1000,
  });
}

// Update order status (admin only)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    },
  });
}

// Delete order (admin only)
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast.success("Order deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete order"
      );
    },
  });
}

