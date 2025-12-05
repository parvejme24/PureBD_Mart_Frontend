"use client";

export default function CategorySkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center justify-center animate-pulse">
      {/* Image Skeleton */}
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3" />

      {/* Title Skeleton */}
      <div className="h-4 bg-gray-200 rounded-full w-20" />
    </div>
  );
}

