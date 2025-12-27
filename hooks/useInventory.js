"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPurchase,
  createPurchaseReturn,
  deletePurchase,
  deletePurchaseReturn,
  getExpiryAlerts,
  getLowStockProducts,
  getPurchaseReturns,
  getPurchases,
  getRecentPurchases,
  getStockSummary,
  updateLowStockConfig,
  updatePurchase,
  updatePurchaseReturn,
} from "@/lib/inventory";

export const inventoryKeys = {
  purchases: ["inventory", "purchases"],
  purchasesRecent: (limit = 10) => ["inventory", "purchases", "recent", limit],
  stock: ["inventory", "stock"],
  purchaseReturns: ["inventory", "purchase-returns"],
  lowStock: ["inventory", "low-stock"],
  expiryAlerts: (params = {}) => [
    "inventory",
    "expiry-alerts",
    params?.startDate || null,
    params?.endDate || null,
    params?.windowDays || null,
    params?.year || null,
    params?.limit || null,
  ],
};

export const usePurchases = (params) => {
  return useQuery({
    queryKey: inventoryKeys.purchases,
    queryFn: () => getPurchases(params),
    staleTime: 0,
  });
};

export const useRecentPurchases = (limit = 10) => {
  return useQuery({
    queryKey: inventoryKeys.purchasesRecent(limit),
    queryFn: () => getRecentPurchases(limit),
    staleTime: 0,
  });
};

export const useStockSummary = () => {
  return useQuery({
    queryKey: inventoryKeys.stock,
    queryFn: getStockSummary,
    staleTime: 0,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchases });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchasesRecent(10) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success("Purchase recorded");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record purchase");
    },
  });
};

export const usePurchaseReturns = () => {
  return useQuery({
    queryKey: inventoryKeys.purchaseReturns,
    queryFn: getPurchaseReturns,
    staleTime: 0,
  });
};

export const useCreatePurchaseReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchaseReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchaseReturns });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchases });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchasesRecent(10) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success("Purchase return recorded");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record purchase return");
    },
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: inventoryKeys.lowStock,
    queryFn: getLowStockProducts,
    staleTime: 0,
  });
};

export const useExpiryAlerts = (params = {}) => {
  return useQuery({
    queryKey: inventoryKeys.expiryAlerts(params),
    queryFn: () => getExpiryAlerts(params),
    staleTime: 0,
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePurchase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchases });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchasesRecent(10) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success(data?.message || "Purchase updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update purchase");
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePurchase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchases });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchasesRecent(10) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success(data?.message || "Purchase deleted");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete purchase");
    },
  });
};

export const useUpdatePurchaseReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePurchaseReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchaseReturns });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success(data?.message || "Purchase return updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update return");
    },
  });
};

export const useDeletePurchaseReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePurchaseReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.purchaseReturns });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      toast.success(data?.message || "Purchase return deleted");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete return");
    },
  });
};

export const useUpdateLowStockConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLowStockConfig,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lowStock });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.stock });
      toast.success(data?.message || "Low stock settings updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update settings");
    },
  });
};


