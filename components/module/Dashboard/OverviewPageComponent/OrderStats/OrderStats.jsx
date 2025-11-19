"use client";

import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderStats() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Fake data
    const fakeOrders = {
      completed: 250,
      pending: 75,
      cancelled: 20,
    };

    // Create gradient colors
    const gradientCompleted = ctx.createLinearGradient(0, 0, 200, 200);
    gradientCompleted.addColorStop(0, "rgba(34, 197, 94, 0.9)"); // Green
    gradientCompleted.addColorStop(1, "rgba(16, 185, 129, 0.6)"); // Teal

    const gradientPending = ctx.createLinearGradient(0, 0, 200, 200);
    gradientPending.addColorStop(0, "rgba(234, 179, 8, 0.9)"); // Yellow
    gradientPending.addColorStop(1, "rgba(245, 158, 11, 0.6)"); // Amber

    const gradientCancelled = ctx.createLinearGradient(0, 0, 200, 200);
    gradientCancelled.addColorStop(0, "rgba(239, 68, 68, 0.9)"); // Red
    gradientCancelled.addColorStop(1, "rgba(190, 18, 60, 0.6)"); // Dark Red

    setChartData({
      labels: ["Completed", "Pending", "Cancelled"],
      datasets: [
        {
          data: [
            fakeOrders.completed,
            fakeOrders.pending,
            fakeOrders.cancelled,
          ],
          backgroundColor: [
            gradientCompleted,
            gradientPending,
            gradientCancelled,
          ],
          borderColor: "rgba(255, 255, 255, 0.7)",
          borderWidth: 2,
        },
      ],
    });
  }, []);

  const options = {
    cutout: "50%", // Doughnut hole size
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  if (!chartData) return null; // wait for client-side rendering

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
        Order Statistics
      </h2>

      {/* Hidden canvas for gradient reference */}
      <canvas ref={chartRef} style={{ display: "none" }} />
      <Doughnut ref={chartRef} data={chartData} options={options} />

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Total Orders:{" "}
        <span className="font-semibold">
          {250 + 75 + 20} {/* Completed + Pending + Cancelled */}
        </span>
      </div>
    </div>
  );
}
