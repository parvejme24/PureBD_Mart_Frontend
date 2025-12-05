"use client";

export default function CategoryCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-3">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-3" />

        {/* Buttons Skeleton */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded-md" />
          <div className="flex-1 h-8 bg-gray-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}

