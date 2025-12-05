"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useProductPerformance } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

// Register chart modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ProductPerformanceChart() {
  const { data, isLoading, error } = useProductPerformance();

  const topProducts = data?.topBySales?.slice(0, 5) || [];

  // Chart data
  const chartData = {
    labels: topProducts.map((p) => 
      p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name
    ),
    datasets: [
      {
        label: "Views",
        data: topProducts.map((p) => p.views || 0),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 4,
      },
      {
        label: "Sales",
        data: topProducts.map((p) => p.sold || 0),
        backgroundColor: "rgba(59, 183, 126, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const index = context[0].dataIndex;
            return topProducts[index]?.name || "";
          },
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(200, 200, 200, 0.1)" },
        ticks: { color: "#6B7280" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#6B7280" },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-red-200">
        <p className="text-red-600 text-center">Failed to load product data</p>
      </div>
    );
  }

  // Empty state
  if (topProducts.length === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Package className="h-5 w-5 text-[#3BB77E]" />
          Top Products
        </h2>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No product data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Package className="h-5 w-5 text-[#3BB77E]" />
        Top Products by Sales
      </h2>

      {/* Chart */}
      <div className="h-[280px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
