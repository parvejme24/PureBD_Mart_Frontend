import React from "react";
import ShopSidebar from "./ShopSidebar/ShopSidebar";
import ShopContents from "./ShopContents/ShopContents";

export default function ShopPageContainer() {
  return (
    <div className="container mx-auto max-w-7xl px-5 py-14 flex gap-5">
      <ShopSidebar />
      <ShopContents />
    </div>
  );
}
