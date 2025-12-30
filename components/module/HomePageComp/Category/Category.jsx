"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import { FolderOpen } from "lucide-react";
import CategorySkeleton from "./CategorySkeleton";

export default function Category() {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.categories?.slice(0, 10) || [];

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="bg-[#D8F1E5]/10">
        <div className="container mx-auto max-w-7xl px-4 py-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-lg w-20 animate-pulse" />
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error or empty state
  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#D8F1E5]/10">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="md:text-2xl font-bold text-gray-800">Shop by Category</h2>
          <Link
            href="/shop"
            className="text-[#3BB77E] hover:text-[#2a9c66] text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?categories=${category.slug}`}
              className="group bg-white rounded-xl p-4 border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:border-[#3BB77E]/30 hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative w-16 h-16 mb-3">
                {category.image?.url ? (
                  <Image
                    src={category.image.url}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#3BB77E]/10 rounded-full">
                    <FolderOpen className="w-8 h-8 text-[#3BB77E]" />
                  </div>
                )}
              </div>

              {/* Category Name */}
              <p className="text-gray-700 font-medium text-center text-sm group-hover:text-[#3BB77E] transition-colors line-clamp-1">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
