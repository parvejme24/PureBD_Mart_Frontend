"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersTableSkeleton() {
  return (
    <div className="p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Filters Skeleton */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
        <div className="flex flex-col lg:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="bg-gray-50 p-3 border-b">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 border-b last:border-b-0">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-6" />
              <div className="w-28">
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="w-36 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="w-40">
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-md" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

