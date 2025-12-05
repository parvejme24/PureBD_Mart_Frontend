"use client";

import React from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";

// Format number with commas
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num?.toLocaleString() || "0";
};

// Format currency
const formatCurrency = (num) => {
  if (num >= 1000000) {
    return "৳" + (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return "৳" + (num / 1000).toFixed(1) + "K";
  }
  return "৳" + (num?.toLocaleString() || "0");
};

// Skeleton for stats card
function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-24 mt-4" />
      <Skeleton className="h-9 w-32 mt-2" />
    </div>
  );
}

export default function Stats() {
  const { data, isLoading, error } = useDashboardStats();
  const stats = data?.stats;

  // Stats configuration
  const statsConfig = [
    {
      id: 1,
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users size={26} className="text-blue-600" />,
      bgColor: "bg-blue-100",
      format: "number",
    },
    {
      id: 2,
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart size={26} className="text-orange-600" />,
      bgColor: "bg-orange-100",
      format: "number",
    },
    {
      id: 3,
      title: "Total Revenue",
      value: stats?.revenue || 0,
      icon: <DollarSign size={26} className="text-green-600" />,
      bgColor: "bg-green-100",
      format: "currency",
    },
    {
      id: 4,
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <Package size={26} className="text-purple-600" />,
      bgColor: "bg-purple-100",
      format: "number",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#3BB77E]/30"
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 ${item.bgColor} rounded-full`}>
              {item.icon}
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp size={18} className="mr-1" />
              <span>Active</span>
            </div>
          </div>

          <h3 className="text-gray-500 text-sm mt-4 font-medium">
            {item.title}
          </h3>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {item.format === "currency"
              ? formatCurrency(item.value)
              : formatNumber(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
