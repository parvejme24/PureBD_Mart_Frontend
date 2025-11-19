import React from "react";
import Stats from "./Stats/Stats";
import RevenueChart from "./RevenueChart/RevenueChart";
import ProductPerformanceChart from "./ProductPerformance/ProductPerformance";
import OrderStats from "./OrderStats/OrderStats";

export default function OverviewPageCompoent() {
  return (
    <div>
      <Stats />
      <RevenueChart />
      <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-5">
        <OrderStats />
        <ProductPerformanceChart />
      </div>
    </div>
  );
}
