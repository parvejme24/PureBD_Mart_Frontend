"use client";

import React from "react";

export default function CategorySkeleton() {
  return (
    <section className="py-6 sm:py-10">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between mb-5 sm:mb-7 animate-pulse">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-44 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center animate-pulse"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full mb-2" />
              <div className="h-3.5 bg-gray-200 rounded-full w-16 mb-1" />
              <div className="h-2.5 bg-gray-100 rounded-full w-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
