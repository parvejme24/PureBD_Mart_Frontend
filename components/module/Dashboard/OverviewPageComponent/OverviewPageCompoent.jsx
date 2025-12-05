"use client";

import React from "react";
import Stats from "./Stats/Stats";
import RevenueChart from "./RevenueChart/RevenueChart";
import ProductPerformanceChart from "./ProductPerformance/ProductPerformance";
import OrderStats from "./OrderStats/OrderStats";

export default function OverviewPageCompoent() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <Stats />

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Bottom Section - Product Performance & Category Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStats />
        <ProductPerformanceChart />
      </div>
    </div>
  );
}
