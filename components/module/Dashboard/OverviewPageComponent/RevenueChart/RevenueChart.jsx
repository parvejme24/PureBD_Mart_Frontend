"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function RevenueChart() {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: [
          12000, 15000, 18000, 13000, 21000, 25000, 30000, 28000, 26000, 29000,
          31000, 35000,
        ],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.4)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0)");
          return gradient;
        },
        pointRadius: 4,
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `৳${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `৳${value / 1000}k`,
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 mt-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Revenue Overview
      </h2>
      <Line data={data} options={options} height={90} />
    </div>
  );
}
