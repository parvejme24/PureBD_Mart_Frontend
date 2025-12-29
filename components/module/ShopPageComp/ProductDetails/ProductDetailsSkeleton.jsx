"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Information Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-5 h-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>

          <Skeleton className="h-px w-full" />

          <div>
            <Skeleton className="h-5 w-24 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div className="flex gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Skeleton className="w-5 h-5" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
