"use client";

import React, { Suspense } from "react";
import ShopSidebar from "./ShopSidebar/ShopSidebar";
import ShopContents from "./ShopContents/ShopContents";
import ShopContentsSkeleton from "./ShopContents/ShopContentsSkeleton";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Sparkles } from "lucide-react";

// Sidebar skeleton for loading state
function SidebarSkeleton() {
  return (
    <aside className="hidden sm:block w-[280px] lg:w-[300px] shrink-0 self-start sticky top-6">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 animate-pulse space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-10 bg-gray-100 rounded-xl" />
        <div className="h-px bg-gray-100" />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gray-100 rounded-lg" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="h-px bg-gray-100" />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gray-100 rounded-lg" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-px bg-gray-100" />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-gray-100 rounded-lg" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-14 bg-gray-100 rounded-xl" />
            <div className="w-6 h-4 bg-gray-100 rounded" />
            <div className="flex-1 h-14 bg-gray-100 rounded-xl" />
          </div>
          <div className="h-2 bg-gray-100 rounded-full" />
          <div className="h-9 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </aside>
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
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/15 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl pointer-events-none" />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative container mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="flex flex-col gap-3">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300/80">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-emerald-600" />
              <span className="text-white">Shop</span>
            </nav>

            {/* Heading */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-lg shrink-0">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Our Shop
                </h1>
                <p className="text-emerald-300/80 text-sm sm:text-base mt-1 font-medium">
                  Fresh & organic products — directly from the farm to your table
                </p>
              </div>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-300" />
                100% Organic
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                🚚 Free Delivery over ৳500
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                ✅ Quality Guaranteed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-5 py-10">
        <div className="flex gap-6 items-start">
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
      </div>
    </div>
  );
}

