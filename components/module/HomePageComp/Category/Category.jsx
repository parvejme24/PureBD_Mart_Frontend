"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import { FolderOpen, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import CategorySkeleton from "./CategorySkeleton";

// 16 curated aesthetic color themes for 16 categories
const colorThemes = [
  { bg: "bg-emerald-50/70 hover:bg-emerald-100/70", border: "border-emerald-150", text: "text-emerald-950", countText: "text-emerald-700" },
  { bg: "bg-amber-50/70 hover:bg-amber-100/70", border: "border-amber-150", text: "text-amber-950", countText: "text-amber-700" },
  { bg: "bg-orange-50/70 hover:bg-orange-100/70", border: "border-orange-150", text: "text-orange-950", countText: "text-orange-700" },
  { bg: "bg-teal-50/70 hover:bg-teal-100/70", border: "border-teal-150", text: "text-teal-950", countText: "text-teal-700" },
  { bg: "bg-blue-50/70 hover:bg-blue-100/70", border: "border-blue-150", text: "text-blue-950", countText: "text-blue-700" },
  { bg: "bg-purple-50/70 hover:bg-purple-100/70", border: "border-purple-150", text: "text-purple-950", countText: "text-purple-700" },
  { bg: "bg-rose-50/70 hover:bg-rose-100/70", border: "border-rose-150", text: "text-rose-950", countText: "text-rose-700" },
  { bg: "bg-lime-50/70 hover:bg-lime-100/70", border: "border-lime-150", text: "text-lime-950", countText: "text-lime-700" },
  { bg: "bg-cyan-50/70 hover:bg-cyan-100/70", border: "border-cyan-150", text: "text-cyan-950", countText: "text-cyan-700" },
  { bg: "bg-amber-50/60 hover:bg-amber-100/60", border: "border-amber-200", text: "text-amber-900", countText: "text-amber-700" },
  { bg: "bg-emerald-50/60 hover:bg-emerald-100/60", border: "border-emerald-200", text: "text-emerald-900", countText: "text-emerald-700" },
  { bg: "bg-indigo-50/70 hover:bg-indigo-100/70", border: "border-indigo-150", text: "text-indigo-950", countText: "text-indigo-700" },
  { bg: "bg-stone-50 hover:bg-stone-100", border: "border-stone-200", text: "text-stone-900", countText: "text-stone-700" },
  { bg: "bg-red-50/70 hover:bg-red-100/70", border: "border-red-150", text: "text-red-950", countText: "text-red-700" },
  { bg: "bg-yellow-50/80 hover:bg-yellow-100/80", border: "border-yellow-200", text: "text-yellow-950", countText: "text-yellow-700" },
  { bg: "bg-emerald-50/80 hover:bg-emerald-100/80", border: "border-emerald-200", text: "text-emerald-950", countText: "text-emerald-700" },
];

export default function Category() {
  const { data, isLoading, isError } = useCategories();
  const scrollRef = useRef(null);

  // Take up to 16 categories for large device showcase
  const categories = data?.categories?.slice(0, 16) || [];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex flex-row items-end justify-between mb-5 sm:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore PureBD Mart</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Featured Categories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll navigation arrows for small/medium devices */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View All link */}
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>View All</span>
              <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[11px] font-black group-hover:bg-emerald-100">
                {categories.length}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. LARGE SCREENS: Perfect 8-Column Grid (2 Rows of 8 = 16)   */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:grid lg:grid-cols-8 gap-3.5 xl:gap-4">
          {categories.map((category, index) => {
            const theme = colorThemes[index % colorThemes.length];
            return (
              <Link
                key={category._id}
                href={`/shop?categories=${encodeURIComponent(category.slug || category._id)}`}
                className={`group relative rounded-2xl p-3.5 border ${theme.border} ${theme.bg} flex flex-col items-center justify-between text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer`}
              >
                {/* Icon container */}
                <div className="relative w-15 h-15 rounded-full bg-white shadow-xs p-2 mb-2 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  {category.image?.url ? (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      sizes="60px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <FolderOpen className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                {/* Category Name */}
                <p className={`font-black text-xs ${theme.text} line-clamp-1 group-hover:text-emerald-600 transition-colors`}>
                  {category.name}
                </p>

                {/* Items count */}
                <span className={`text-[10px] font-bold ${theme.countText} mt-1 opacity-80 group-hover:opacity-100`}>
                  {category.productCount || category.productsCount ? `${category.productCount || category.productsCount} items` : "Explore"}
                </span>
              </Link>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. SMALL & MEDIUM SCREENS: Smooth Horizontal Scrollable Carousel */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:hidden relative">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-1"
          >
            {categories.map((category, index) => {
              const theme = colorThemes[index % colorThemes.length];
              return (
                <Link
                  key={category._id}
                  href={`/shop?categories=${encodeURIComponent(category.slug || category._id)}`}
                  className={`group shrink-0 w-28 sm:w-32 snap-start rounded-2xl p-3 border ${theme.border} ${theme.bg} flex flex-col items-center justify-between text-center transition-all duration-200 active:scale-95 shadow-2xs`}
                >
                  <div className="relative w-13 h-13 rounded-full bg-white shadow-xs p-1.5 mb-1.5 flex items-center justify-center overflow-hidden">
                    {category.image?.url ? (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        fill
                        sizes="52px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <FolderOpen className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>

                  <p className={`font-bold text-[11px] sm:text-xs ${theme.text} line-clamp-1`}>
                    {category.name}
                  </p>

                  <span className={`text-[10px] font-semibold ${theme.countText} mt-0.5 opacity-80`}>
                    {category.productCount || category.productsCount ? `${category.productCount || category.productsCount} items` : "Explore"}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Swipe indicator hint for mobile */}
          <div className="flex items-center justify-center gap-1.5 mt-2 sm:hidden text-[10px] font-semibold text-gray-400">
            <span>Swipe horizontally to explore all {categories.length} categories</span>
          </div>
        </div>

      </div>
    </section>
  );
}
