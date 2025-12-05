"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useRevenueOverview } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

// Format currency for display
const formatCurrency = (value) => {
  if (value >= 1000000) {
    return "৳" + (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return "৳" + (value / 1000).toFixed(1) + "K";
  }
  return "৳" + value;
};

export default function RevenueChart() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartType, setChartType] = useState("line"); // 'line' or 'bar'

  const { data, isLoading, error } = useRevenueOverview(selectedYear);

  const revenueData = data?.revenueByMonth || [];
  const availableYears = data?.availableYears || [currentYear];

  // Chart data
  const chartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((item) => item.revenue),
        fill: chartType === "line",
        borderColor: "#3BB77E",
        backgroundColor: chartType === "line" 
          ? (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(59, 183, 126, 0.3)");
              gradient.addColorStop(1, "rgba(59, 183, 126, 0)");
              return gradient;
            }
          : "rgba(59, 183, 126, 0.8)",
        tension: 0.4,
        pointRadius: chartType === "line" ? 5 : 0,
        pointBackgroundColor: "#3BB77E",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        borderRadius: chartType === "bar" ? 6 : 0,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context) => `${context[0].label} ${selectedYear}`,
          label: (context) => {
            const monthData = revenueData[context.dataIndex];
            return [
              `Revenue: ৳${context.raw.toLocaleString()}`,
              `Orders: ${monthData?.orderCount || 0}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
          color: "#6B7280",
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
      x: {
        ticks: { color: "#6B7280" },
        grid: { display: false },
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-5">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white p-6 rounded-xl shadow-md border border-red-200 mt-5">
        <p className="text-red-600 text-center">Failed to load revenue data</p>
      </div>
    );
  }

  const ChartComponent = chartType === "line" ? Line : Bar;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#3BB77E]" />
            Revenue Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monthly revenue for {selectedYear}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("line")}
              className={`rounded-none px-3 cursor-pointer ${
                chartType === "line" ? "bg-[#3BB77E] hover:bg-[#2a9c66]" : ""
              }`}
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className={`rounded-none px-3 cursor-pointer ${
                chartType === "bar" ? "bg-[#3BB77E] hover:bg-[#2a9c66]" : ""
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Year Selector */}
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value={String(currentYear)}>{currentYear}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ChartComponent data={chartData} options={options} />
      </div>
    </div>
  );
}
