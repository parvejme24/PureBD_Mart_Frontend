"use client";

export default function DashboardProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Badge Skeleton */}
        <div className="h-5 w-20 bg-gray-200 rounded" />

        {/* Category Skeleton */}
        <div className="h-3 w-16 bg-gray-200 rounded mt-2" />

        {/* Name Skeleton */}
        <div className="h-5 w-3/4 bg-gray-200 rounded mt-2" />

        {/* Description Skeleton */}
        <div className="h-4 w-full bg-gray-200 rounded mt-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mt-1" />

        {/* Price & Actions Skeleton */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}



