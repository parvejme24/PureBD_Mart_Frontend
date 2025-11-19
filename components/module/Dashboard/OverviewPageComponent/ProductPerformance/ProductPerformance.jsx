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

// Register chart modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ProductPerformanceChart() {
  const labels = ["Burger", "Pizza", "Chicken Wings", "Drinks", "Sandwich"];

  const data = {
    labels,
    datasets: [
      {
        label: "Views",
        data: [3200, 2700, 1900, 1400, 2200],
        backgroundColor: "rgba(59,130,246,0.7)", // Blue
      },
      {
        label: "Sales",
        data: [540, 420, 280, 150, 330],
        backgroundColor: "rgba(16,185,129,0.7)", // Green
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal Bar
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(200,200,200,0.1)" },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Product Performance
      </h2>

      <Bar data={data} options={options} height={250} />
    </div>
  );
}
