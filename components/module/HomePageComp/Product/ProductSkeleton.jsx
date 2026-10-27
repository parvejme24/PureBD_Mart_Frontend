"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <section className="py-8 sm:py-14 bg-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 animate-pulse">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 bg-gray-200" />
            <Skeleton className="h-7 w-48 bg-gray-200" />
            <Skeleton className="h-4 w-72 bg-gray-100" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col justify-between animate-pulse h-80"
            >
              <div className="w-full h-36 bg-gray-100 rounded-xl mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-3 w-3/4 bg-gray-100" />
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-auto">
                <Skeleton className="h-5 w-16 bg-gray-200" />
                <Skeleton className="h-8 w-16 rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
