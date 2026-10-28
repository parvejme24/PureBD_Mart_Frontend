"use client";

export default function ShopContentsSkeleton() {
  return (
    <div className="w-full">
      {/* Toolbar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3 animate-pulse">
        <div className="h-4 w-44 bg-gray-200 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse shadow-sm"
          >
            {/* Image skeleton */}
            <div className="w-full h-44 bg-gray-100 rounded-2xl mb-3" />

            {/* Category & weight */}
            <div className="flex justify-between items-center mb-2">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-12 bg-gray-100 rounded-md" />
            </div>

            {/* Title */}
            <div className="h-5 w-3/4 bg-gray-200 rounded-lg mb-2" />

            {/* Description */}
            <div className="space-y-1.5 mb-3">
              <div className="h-3.5 w-full bg-gray-100 rounded" />
              <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
            </div>

            {/* Stars */}
            <div className="h-5 w-20 bg-gray-100 rounded-full mb-3" />

            {/* Price & button */}
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <div className="h-6 w-16 bg-gray-200 rounded-lg" />
              <div className="h-9 w-28 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




