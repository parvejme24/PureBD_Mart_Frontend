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
  const products = data?.products?.slice(0, 8) || []; // Show up to 8 products

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="mb-5 flex justify-between items-center w-full">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#D8F1E5]/5 rounded-lg p-4 border border-[#3BB77E]/10"
            >
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error or no products
  if (isError || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="mb-4 md:mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="">
            <h2 className="md:text-2xl font-bold text-gray-800">
              Best Selling Products
            </h2>
            <p className="hidden md:block md:text-base text-gray-500">
              Discover our most popular products loved by customers
            </p>
          </div>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Link
            href="/shop"
            className="text-[#3BB77E] hover:text-[#2a9c66] text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {products.map((product) => (
          <div key={product._id} className="relative group">
            {/* Wishlist Icon - Top Right */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="outline"
                size="sm"
                className={`h-9 w-9 sm:h-8 sm:w-8 p-0 cursor-pointer border-gray-300 hover:border-red-500 bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${
                  isInWishlist(product._id)
                    ? "text-red-500 bg-red-50 border-red-300"
                    : "hover:text-red-500"
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
              </Button>
            </div>

            <Link
              href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
            >
              <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-100 hover:border-[#3BB77E]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <div className="flex gap-3 sm:gap-4 lg:gap-6">
                  {/* Product Image */}
                  <div className="shrink-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-white shadow-sm">
                      <Image
                        src={
                          product.image?.url ||
                          product.image ||
                          "/placeholder-product.png"
                        }
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
                          {product.description?.length > 60
                            ? product.description.slice(0, 60) + "..."
                            : product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < 4
                                    ? "text-[#3BB77E] fill-[#3BB77E]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">(4.8)</span>
                          {product.sold && (
                            <span className="text-xs text-[#3BB77E] font-medium ml-2">
                              {product.sold} sold
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex flex-col items-center justify-between gap-2 mt-3 sm:mt-0">
                        <p className="font-bold text-[#3BB77E] text-base sm:mb-2">
                          ৳{product.price}
                        </p>

                        {!product.stock > 0 ? (
                          <Button
                            size="sm"
                            disabled
                            className="text-xs px-3 py-1 h-8 sm:h-7 opacity-50 cursor-not-allowed"
                          >
                            Out of Stock
                          </Button>
                        ) : isInCart(product._id) ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 sm:h-7 sm:w-7 p-0 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                decrementQuantity(product._id);
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {getItemQuantity(product._id)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 sm:h-7 sm:w-7 p-0 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                incrementQuantity(product._id);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="bg-[#DEF9EC] hover:bg-[#3BB77E] text-[#50BB88] hover:text-white text-xs sm:text-sm px-3 py-1 h-8 sm:h-7 font-semibold transition-colors cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
