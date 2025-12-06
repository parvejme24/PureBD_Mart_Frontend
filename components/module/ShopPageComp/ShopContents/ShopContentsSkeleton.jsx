"use client";

export default function ShopContentsSkeleton() {
  return (
    <div className="w-full">
      {/* Results count skeleton */}
      <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-[#D8F1E5]/10 rounded-md p-5 border animate-pulse"
          >
            {/* Image skeleton */}
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
            
            <hr className="mb-2" />
            
            {/* Stock badge skeleton */}
            <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
            
            {/* Title skeleton */}
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
            
            {/* Description skeleton */}
            <div className="h-4 w-full bg-gray-200 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
            
            {/* Category skeleton */}
            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
            
            {/* Price and button skeleton */}
            <div className="flex justify-between items-center mt-2">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-9 w-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



