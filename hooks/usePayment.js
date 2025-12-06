"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  initPayment,
  verifyPayment,
  checkPaymentStatus,
  getAllTransactions,
} from "@/lib/payment";
import { useAuth } from "./useAuth";

// Hook to initialize payment
export function useInitPayment() {
  return useMutation({
    mutationFn: initPayment,
    onSuccess: (data) => {
      if (data.success && data.paymentUrl) {
        toast.success("Redirecting to payment gateway...");
        // Redirect to ShurjoPay payment page
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.message || "Failed to initialize payment");
      }
    },
    onError: (error) => {
      console.error("Payment init error:", error);
      console.error("Backend response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Payment initialization failed";
      toast.error(errorMessage);
    },
  });
}

// Hook to verify payment
export function useVerifyPayment() {
  return useMutation({
    mutationFn: verifyPayment,
    onError: (error) => {
      console.error("Payment verification error:", error);
    },
  });
}

// Hook to check payment status
export function usePaymentStatus(transactionId) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["paymentStatus", transactionId],
    queryFn: () => checkPaymentStatus(transactionId),
    enabled: !!transactionId && isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: (data) => {
      // Auto-refetch every 5 seconds if payment is still pending
      if (data?.order?.paymentStatus === "unpaid") {
        return 5000;
      }
      return false;
    },
  });
}

// Hook to get all transactions (admin)
export function useTransactions(params = {}) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getAllTransactions(params),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

