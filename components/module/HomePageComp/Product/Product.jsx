"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProducts } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategory";
import ProductSkeleton from "./ProductSkeleton";
import { ArrowRight, Sparkles, Filter, Leaf, ShieldCheck, Flame } from "lucide-react";

// Optional emoji mapping for popular organic categories
const getCategoryEmoji = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("all")) return "🌾";
  if (lower.includes("oil")) return "🫒";
  if (lower.includes("snack") || lower.includes("bakery")) return "🍪";
  if (lower.includes("clean") || lower.includes("house")) return "🧼";
  if (lower.includes("veg")) return "🥦";
  if (lower.includes("fruit")) return "🍎";
  if (lower.includes("honey")) return "🍯";
  if (lower.includes("dairy") || lower.includes("milk") || lower.includes("ghee")) return "🥛";
  if (lower.includes("spice")) return "🌶️";
  return "🌿";
};

export default function Product() {
  const { data: productData, isLoading, isError } = useProducts();
  const { data: categoryData } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = useMemo(() => productData?.products || [], [productData?.products]);
  const categories = useMemo(() => categoryData?.categories || [], [categoryData?.categories]);

  // Build clean, specific tabs (filter out "test" categories and select categories that have products)
  const filterTabs = useMemo(() => {
    // Exclude test/dummy categories
    const cleanCategories = categories.filter((cat) => {
      const name = cat?.name?.trim().toLowerCase() || "";
      return name && !name.includes("test") && !name.includes("demo");
    });

    // Find categories that actually have products in the currently loaded list
    const activeCategories = cleanCategories.filter((cat) => {
      const catName = cat.name?.trim().toLowerCase();
      return products.some((p) => {
        const pCat = p.category;
        const pId = typeof pCat === "object" ? pCat?._id : pCat;
        const pSlug = typeof pCat === "object" ? pCat?.slug : null;
        const pName = typeof pCat === "object" ? pCat?.name?.toLowerCase() : null;
        return (
          pId === cat._id ||
          pSlug === cat.slug ||
          pName === catName
        );
      });
    });

    const chosenCategories = activeCategories.length > 0 ? activeCategories : cleanCategories;

    return [
      { label: "All Items", value: "all", count: products.length },
      ...chosenCategories.slice(0, 5).map((cat) => {
        const catName = cat.name?.trim().toLowerCase();
        const itemCount = products.filter((p) => {
          const pCat = p.category;
          const pId = typeof pCat === "object" ? pCat?._id : pCat;
          const pSlug = typeof pCat === "object" ? pCat?.slug : null;
          const pName = typeof pCat === "object" ? pCat?.name?.toLowerCase() : null;
          return pId === cat._id || pSlug === cat.slug || pName === catName;
        }).length;

        return {
          label: cat.name,
          value: cat.slug || cat._id || cat.name,
          count: itemCount,
        };
      }),
    ];
  }, [categories, products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products.slice(0, 10);
    }
    const valLower = selectedCategory.toLowerCase();
    return products
      .filter((p) => {
        const pCat = p.category;
        if (!pCat) return false;
        if (typeof pCat === "string") {
          return pCat === selectedCategory || pCat.toLowerCase() === valLower;
        }
        const catId = pCat._id || pCat.id;
        const catSlug = pCat.slug;
        const catName = pCat.name?.toLowerCase();
        return (
          catId === selectedCategory ||
          catSlug === selectedCategory ||
          catSlug?.toLowerCase() === valLower ||
          catName === valLower
        );
      })
      .slice(0, 10);
  }, [products, selectedCategory]);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <section className="relative py-10 sm:py-16 bg-gradient-to-b from-white via-emerald-50/20 to-white overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Section Header & Interactive Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7 sm:mb-9">
          
          {/* Header Title & Subtitle */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 mb-2 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pure & Organic Selection</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              Our Special <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Products</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
              Hand-picked chemical-free daily harvest with direct farm savings. Guaranteed quality on every order.
            </p>
          </div>

          {/* Interactive Category Filter Pills (No Scrollbar) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto md:flex-wrap pb-1 max-w-full no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => {
              const isActive = selectedCategory === tab.value;
              const emoji = getCategoryEmoji(tab.label);
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102 ring-2 ring-emerald-500/20"
                      : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-100/80 hover:border-emerald-200"
                  }`}
                >
                  <span className="text-sm">{emoji}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100/70 text-emerald-800"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Product Grid (2 cols mobile, 3 sm, 4 lg, 5 xl) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-emerald-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              No products found in this category right now
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              We are constantly restocking fresh harvest. Check back soon or view our other categories.
            </p>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              Show All Products
            </Button>
          </div>
        )}

        {/* Bottom Banner & Explore CTA */}
        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl shadow-emerald-950/10 border border-emerald-800/40">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0 hidden sm:flex">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Looking for something specific?
              </h4>
              <p className="text-xs text-emerald-200/90">
                Browse our complete collection of over 5,000+ certified organic groceries.
              </p>
            </div>
          </div>

          <Link href="/shop" className="shrink-0 w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-black px-6 py-2.5 rounded-2xl shadow-md transition-all text-xs sm:text-sm cursor-pointer"
            >
              <span>Explore All 5,000+ Products</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
