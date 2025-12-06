import React from "react";
import OrdersTable from "./OrdersTable";

export default function OrdersPageContainer() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      <OrdersTable />
    </div>
  );
}
