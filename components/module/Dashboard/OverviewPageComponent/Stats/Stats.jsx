"use client";

import React from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

const data = [
  {
    id: 1,
    title: "Total Users",
    count: 1280,
    icon: <Users size={26} />,
    progress: 12,
    trend: "up",
  },
  {
    id: 2,
    title: "Total Orders",
    count: 540,
    icon: <ShoppingCart size={26} />,
    progress: 8,
    trend: "up",
  },
  {
    id: 3,
    title: "Revenue",
    count: 78500,
    icon: <DollarSign size={26} />,
    progress: 5,
    trend: "up",
  },
  {
    id: 4,
    title: "Products",
    count: 320,
    icon: <Package size={26} />,
    progress: 2,
    trend: "up",
  },
];

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              {item.icon}
            </div>
            <div>
              {item.trend === "up" && (
                <span className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp size={18} className="mr-1" />+{item.progress}%
                </span>
              )}
              {item.trend === "down" && (
                <span className="flex items-center text-red-600 text-sm font-medium">
                  <TrendingDown size={18} className="mr-1" />
                  {item.progress}%
                </span>
              )}
            </div>
          </div>

          <h3 className="text-gray-600 dark:text-gray-300 text-sm mt-4">
            {item.title}
          </h3>

          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {item.title === "Revenue" ? `৳${item.count}` : item.count}
          </p>
        </div>
      ))}
    </div>
  );
}
