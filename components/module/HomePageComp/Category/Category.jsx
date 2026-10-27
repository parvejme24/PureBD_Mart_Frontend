"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import { FolderOpen, ArrowRight, Sparkles } from "lucide-react";
import CategorySkeleton from "./CategorySkeleton";

// Soft aesthetic color palettes for categories
const colorThemes = [
  { bg: "bg-emerald-50/70 hover:bg-emerald-100/70", border: "border-emerald-100", text: "text-emerald-900", iconBg: "bg-emerald-100" },
  { bg: "bg-amber-50/70 hover:bg-amber-100/70", border: "border-amber-100", text: "text-amber-900", iconBg: "bg-amber-100" },
  { bg: "bg-orange-50/70 hover:bg-orange-100/70", border: "border-orange-100", text: "text-orange-900", iconBg: "bg-orange-100" },
  { bg: "bg-teal-50/70 hover:bg-teal-100/70", border: "border-teal-100", text: "text-teal-900", iconBg: "bg-teal-100" },
  { bg: "bg-blue-50/70 hover:bg-blue-100/70", border: "border-blue-100", text: "text-blue-900", iconBg: "bg-blue-100" },
  { bg: "bg-purple-50/70 hover:bg-purple-100/70", border: "border-purple-100", text: "text-purple-900", iconBg: "bg-purple-100" },
  { bg: "bg-rose-50/70 hover:bg-rose-100/70", border: "border-rose-100", text: "text-rose-900", iconBg: "bg-rose-100" },
  { bg: "bg-lime-50/70 hover:bg-lime-100/70", border: "border-lime-100", text: "text-lime-900", iconBg: "bg-lime-100" },
];

export default function Category() {
  const { data, isLoading, isError } = useCategories();
  const categories = data?.categories?.slice(0, 12) || [];

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-10">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex flex-row items-end justify-between mb-5 sm:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Mart</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Featured Categories
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>View All</span>
            <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full text-[11px] group-hover:bg-emerald-100">
              {data?.categories?.length || categories.length}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Responsive: 2-3 cols mobile, 4 tablet, 6-8 desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {categories.map((category, index) => {
            const theme = colorThemes[index % colorThemes.length];
            return (
              <Link
                key={category._id}
                href={`/shop?categories=${encodeURIComponent(category.slug || category._id)}`}
                className={`group relative rounded-2xl p-3 sm:p-4 border ${theme.border} ${theme.bg} flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
              >
                {/* Image / Icon container */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white shadow-xs p-2 mb-2 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  {category.image?.url ? (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 56px, 64px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <FolderOpen className="w-7 h-7 text-emerald-600" />
                  )}
                </div>

                {/* Category Name */}
                <p className={`font-bold text-xs sm:text-sm ${theme.text} line-clamp-1 group-hover:text-emerald-600 transition-colors`}>
                  {category.name}
                </p>

                {/* Optional items count or explore pill */}
                <span className="text-[10px] text-gray-500 font-medium mt-0.5 opacity-80 group-hover:opacity-100">
                  {category.productsCount ? `${category.productsCount} items` : "Explore"}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
