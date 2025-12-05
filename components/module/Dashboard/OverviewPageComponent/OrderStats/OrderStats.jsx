"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useCategoryPerformance } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

// Color palette for categories
const COLORS = [
  "rgba(59, 183, 126, 0.8)",   // Green
  "rgba(59, 130, 246, 0.8)",   // Blue
  "rgba(249, 115, 22, 0.8)",   // Orange
  "rgba(168, 85, 247, 0.8)",   // Purple
  "rgba(236, 72, 153, 0.8)",   // Pink
  "rgba(234, 179, 8, 0.8)",    // Yellow
  "rgba(20, 184, 166, 0.8)",   // Teal
  "rgba(239, 68, 68, 0.8)",    // Red
];

export default function OrderStats() {
  const { data, isLoading, error } = useCategoryPerformance();
  
  const categories = data?.categories || [];

  // Take top 6 categories by revenue
  const topCategories = categories.slice(0, 6);

  // Chart data
  const chartData = {
    labels: topCategories.map((cat) => cat.name),
    datasets: [
      {
        data: topCategories.map((cat) => cat.totalRevenue),
        backgroundColor: COLORS.slice(0, topCategories.length),
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    cutout: "60%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 },
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = topCategories[context.dataIndex];
            return [
              `Revenue: ৳${context.raw.toLocaleString()}`,
              `Products: ${category?.productCount || 0}`,
              `Sold: ${category?.totalSold || 0}`,
            ];
          },
        },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
        <Skeleton className="h-6 w-48 mb-4 mx-auto" />
        <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
        <div className="flex justify-center gap-4 mt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-red-200">
        <p className="text-red-600 text-center">Failed to load category data</p>
      </div>
    );
  }

  // Empty state
  if (topCategories.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
          <PieChart className="h-5 w-5 text-[#3BB77E]" />
          Category Revenue
        </h2>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No category data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
        <PieChart className="h-5 w-5 text-[#3BB77E]" />
        Category Revenue
      </h2>

      {/* Chart */}
      <div className="h-[280px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
