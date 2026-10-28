"use client";

import React from "react";

export default function CategorySkeleton() {
  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between mb-5 sm:mb-7 animate-pulse">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded-full" />
            <div className="h-7 w-48 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>

        {/* Large screen 16 items grid */}
        <div className="hidden lg:grid lg:grid-cols-8 gap-3.5 xl:gap-4">
          {[...Array(16)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-50/70 rounded-2xl p-3.5 border border-gray-100 flex flex-col items-center justify-center animate-pulse"
            >
              <div className="w-15 h-15 bg-gray-200 rounded-full mb-2" />
              <div className="h-3 bg-gray-200 rounded-full w-16 mb-1.5" />
              <div className="h-2 bg-gray-150 rounded-full w-10" />
            </div>
          ))}
        </div>

        {/* Small screen horizontal scroll */}
        <div className="flex lg:hidden gap-3 overflow-hidden py-2">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="shrink-0 w-28 sm:w-32 bg-gray-50/70 rounded-2xl p-3 border border-gray-100 flex flex-col items-center justify-center animate-pulse"
            >
              <div className="w-13 h-13 bg-gray-200 rounded-full mb-1.5" />
              <div className="h-3 bg-gray-200 rounded-full w-14 mb-1" />
              <div className="h-2 bg-gray-150 rounded-full w-8" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
