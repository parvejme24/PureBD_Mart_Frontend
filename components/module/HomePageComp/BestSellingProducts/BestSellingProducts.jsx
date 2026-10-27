"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useBestSellingProducts } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Skeleton } from "@/components/ui/skeleton";

export default function BestSellingProducts() {
  const { data, isLoading, isError } = useBestSellingProducts();
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
  } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const products = data?.products?.slice(0, 8) || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-8 sm:py-14 bg-gradient-to-b from-white via-emerald-50/15 to-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="mb-6 flex justify-between items-center animate-pulse">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <Skeleton className="h-7 w-52 bg-gray-200" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 animate-pulse"
              >
                <Skeleton className="w-full h-36 rounded-xl bg-gray-100" />
                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                <Skeleton className="h-3 w-1/2 bg-gray-100" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-16 bg-gray-200" />
                  <Skeleton className="h-8 w-16 rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error or no products
  if (isError || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-14 bg-gradient-to-b from-white via-emerald-50/15 to-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex flex-row items-end justify-between mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Best Selling Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
              Discover our most popular organic groceries loved by thousands of families
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2-column or 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
          {products.map((product, idx) => {
            const originalPrice = Number(product.price) || 0;
            const discount = Number(product.discount) || 0;
            const discountedPrice =
              product.withDiscountPrice ||
              (discount > 0 ? originalPrice - discount : originalPrice);
            const hasDiscount = discount > 0;
            const inStock = product.stock > 0;
            const imageUrl =
              product.image?.url || product.image || "/placeholder-product.png";

            return (
              <div
                key={product._id}
                className="relative group bg-white rounded-2xl p-4 border border-emerald-50 hover:border-emerald-300 shadow-xs hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                  {/* Rank badge */}
                  <span className="pointer-events-auto inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <Award className="w-3 h-3" />
                    <span>#{idx + 1} Best</span>
                  </span>

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label="Add to Wishlist"
                    className={`pointer-events-auto h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all backdrop-blur-md shadow-xs ${
                      isInWishlist(product._id)
                        ? "bg-rose-50 text-rose-500 border border-rose-200"
                        : "bg-white/90 text-gray-400 hover:text-rose-500 border border-gray-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist(product._id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>

                <Link
                  href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
                  className="flex flex-col flex-1"
                >
                  {/* Image container */}
                  <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-emerald-50/20 mb-3 flex items-center justify-center p-2 group-hover:scale-103 transition-transform">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-emerald-600 uppercase tracking-wider text-[11px]">
                      {product.category?.name || "Grocery"}
                    </span>
                    <span className="flex items-center text-amber-500 text-xs font-bold">
                      ★ 4.9 <span className="text-gray-400 font-normal ml-0.5">({product.sold || 48})</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {product.shortDescription ||
                      product.description ||
                      "Premium quality verified fresh stock."}
                  </p>
                </Link>

                {/* Price and Cart Action */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex flex-col">
                    {hasDiscount ? (
                      <>
                        <span className="text-xs text-gray-400 line-through leading-none">
                          ৳{originalPrice}
                        </span>
                        <span className="font-bold text-base sm:text-lg text-emerald-600 leading-tight">
                          ৳{discountedPrice}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-base sm:text-lg text-emerald-600 leading-tight">
                        ৳{originalPrice}
                      </span>
                    )}
                  </div>

                  <div>
                    {!inStock ? (
                      <span className="text-xs text-rose-500 font-medium">Out</span>
                    ) : isInCart(product._id) ? (
                      <div
                        className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl p-0.5 shadow-xs"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <button
                          type="button"
                          className="h-7 w-7 rounded-lg bg-white text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-90"
                          onClick={() => decrementQuantity(product._id)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-emerald-900">
                          {getItemQuantity(product._id)}
                        </span>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-90"
                          onClick={() => incrementQuantity(product._id)}
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="h-8 sm:h-9 px-3 sm:px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm active:scale-95"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
