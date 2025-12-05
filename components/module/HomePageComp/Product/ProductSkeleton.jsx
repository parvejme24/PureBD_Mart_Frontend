"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="mb-5 flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Our Special Products
          </h2>
          <p className="text-xs md:text-base text-gray-500">
            Do not miss the current offers until the end of March.
          </p>
        </div>
        <div>
          <Link href="/shop">
            <Button
              variant={"outline"}
              className={"md:w-[115px] rounded-full cursor-pointer"}
            >
              View All <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, index) => (
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
            
            {/* Price and button skeleton */}
            <div className="flex justify-between items-center mt-2">
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-9 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


