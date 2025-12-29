"use client";

import React, { Suspense } from "react";
import ShopSidebar from "./ShopSidebar/ShopSidebar";
import ShopContents from "./ShopContents/ShopContents";
import ShopContentsSkeleton from "./ShopContents/ShopContentsSkeleton";

// Sidebar skeleton for loading state
function SidebarSkeleton() {
  return (
    <div className="hidden sm:block sm:w-[350px] bg-green-50/40 border rounded-lg border-gray-200 p-5 h-fit">
      <div className="animate-pulse space-y-4">
        {/* Search skeleton */}
        <div className="h-10 bg-gray-200 rounded-md"></div>

        {/* Categories Section skeleton */}
        <div className="space-y-3 pt-4">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Product Type Section skeleton */}
        <div className="space-y-3 pt-4">
          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Price filter skeleton */}
        <div className="space-y-3 pt-2">
          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Inner component that uses the hooks (needs Suspense boundary)
function ShopPageInner() {
  return (
    <>
      <ShopSidebar />
      <ShopContents />
    </>
  );
}

export default function ShopPageContainer() {
  return (
    <div className="container mx-auto max-w-7xl px-5 py-14 flex gap-5">
      <Suspense
        fallback={
          <>
            <SidebarSkeleton />
            <ShopContentsSkeleton />
          </>
        }
      >
        <ShopPageInner />
      </Suspense>
    </div>
  );
}
