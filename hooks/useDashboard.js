"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import {
  getDashboardStats,
  getRevenueOverview,
  getProductPerformance,
  getCategoryPerformance,
} from "@/lib/dashboard";

// Hook for dashboard stats
export function useDashboardStats() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Hook for revenue overview
export function useRevenueOverview(year) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["revenueOverview", year],
    queryFn: () => getRevenueOverview(year),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for product performance
export function useProductPerformance(startDate, endDate) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["productPerformance", startDate, endDate],
    queryFn: () => getProductPerformance(startDate, endDate),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for category performance
export function useCategoryPerformance(startDate, endDate) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ["categoryPerformance", startDate, endDate],
    queryFn: () => getCategoryPerformance(startDate, endDate),
    enabled: !isAuthLoading && isAuthenticated && isAdmin,
    staleTime: 5 * 60 * 1000,
  });
}

