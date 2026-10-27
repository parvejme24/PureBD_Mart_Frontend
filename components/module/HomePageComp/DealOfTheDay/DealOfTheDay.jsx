"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Flame, Clock, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDealOfTheDay } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Skeleton } from "@/components/ui/skeleton";

export default function DealOfTheDay() {
  const { data, isLoading, isError } = useDealOfTheDay();
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
  } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const products = data?.products || [];

  // Countdown timer state (calculates time until midnight or 12 hours)
  const [timeLeft, setTimeLeft] = useState({
    hours: "08",
    minutes: "45",
    seconds: "12",
  });

  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const now = new Date();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-emerald-50/20 to-white">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <Skeleton className="h-7 w-56 bg-gray-200" />
            </div>
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 flex gap-4">
                <Skeleton className="w-40 h-40 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-10 w-full rounded-xl" />
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
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-rose-500 animate-pulse" />
              <span>Limited Time Mega Offers</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Deals of the Day
            </h2>
          </div>

          {/* Countdown Timer and View All */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-2xl shadow-xs">
              <Clock className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold text-rose-900">Ends in:</span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-rose-700">
                <span className="bg-white px-2 py-0.5 rounded-md shadow-xs border border-rose-100">
                  {timeLeft.hours}h
                </span>
                <span>:</span>
                <span className="bg-white px-2 py-0.5 rounded-md shadow-xs border border-rose-100">
                  {timeLeft.minutes}m
                </span>
                <span>:</span>
                <span className="bg-white px-2 py-0.5 rounded-md shadow-xs border border-rose-100">
                  {timeLeft.seconds}s
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>All Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel / Deals Grid */}
        <Carousel className="w-full">
          <CarouselContent className="-ml-3 sm:-ml-4">
            {products.map((product) => {
              const originalPrice = Number(product.price) || 0;
              const discount = Number(product.discount) || 0;
              const discountedPrice =
                product.withDiscountPrice ||
                (discount > 0 ? originalPrice - discount : originalPrice);
              const hasDiscount = discount > 0;
              const discountPct = hasDiscount
                ? Math.round((discount / originalPrice) * 100)
                : 20;

              // Mock stock progress
              const sold = product.sold || 34;
              const totalStock = product.stock || 50;
              const percentSold = Math.min(Math.round((sold / totalStock) * 100), 90);

              const imageUrl =
                product.image?.url || product.image || "/placeholder-product.png";

              return (
                <CarouselItem
                  key={product._id}
                  className="pl-3 sm:pl-4 basis-full lg:basis-1/2"
                >
                  <div className="relative bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-md shadow-emerald-950/5 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group flex flex-col sm:flex-row gap-4 sm:gap-5 items-center">
                    
                    {/* Top Left Discount Tag */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>-{discountPct}% OFF</span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      aria-label="Wishlist"
                      className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-xs ${
                        isInWishlist(product._id)
                          ? "bg-rose-50 text-rose-500 border border-rose-200"
                          : "bg-white/90 text-gray-400 hover:text-rose-500 border border-gray-100"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist(product._id) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    {/* Left: Product Image */}
                    <Link
                      href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
                      className="relative w-full sm:w-48 h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-emerald-50/20 p-2 shrink-0 flex items-center justify-center group-hover:scale-102 transition-transform"
                    >
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 220px"
                        className="object-contain p-2 group-hover:scale-108 transition-transform duration-500"
                      />
                    </Link>

                    {/* Right: Deal Details */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span className="font-semibold text-emerald-600 uppercase tracking-wider text-[11px]">
                            {product.category?.name || "Deal Special"}
                          </span>
                          <span className="flex items-center text-amber-500 text-xs font-bold">
                            ★ 4.9 <span className="text-gray-400 font-normal ml-0.5">(36)</span>
                          </span>
                        </div>

                        {/* Title */}
                        <Link
                          href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
                          className="font-bold text-base sm:text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1.5"
                        >
                          {product.name}
                        </Link>

                        {/* Description */}
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {product.shortDescription ||
                            product.description ||
                            "Fresh handpicked organic harvest. Guaranteed quality and maximum savings."}
                        </p>

                        {/* Stock Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600 mb-1">
                            <span>Sold: <strong className="text-emerald-700">{sold}</strong> items</span>
                            <span className="text-gray-400">Available: {totalStock}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                            ৳{discountedPrice}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ৳{originalPrice}
                          </span>
                          {product.weight > 0 && product.weightUnit && (
                            <span className="text-xs text-gray-500 font-medium">
                              / {product.weight} {product.weightUnit}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cart Action */}
                      <div className="pt-2 border-t border-gray-100">
                        {isInCart(product._id) ? (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                            <span className="text-xs font-bold text-emerald-800 ml-2">
                              In Cart ({getItemQuantity(product._id)})
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="h-7 w-7 rounded-lg bg-white text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-90"
                                onClick={() => decrementQuantity(product._id)}
                                aria-label="Decrease"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold text-emerald-900">
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
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl shadow-sm hover:shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                            onClick={() =>
                              addToCart({
                                _id: product._id,
                                name: product.name,
                                price: discountedPrice,
                                originalPrice: originalPrice,
                                image: imageUrl,
                                slug: product.slug,
                              })
                            }
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Claim This Deal</span>
                          </Button>
                        )}
                      </div>

                    </div>

                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <div className="hidden sm:flex items-center justify-end gap-2 mt-4">
            <CarouselPrevious className="static transform-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 h-9 w-9 shadow-xs cursor-pointer" />
            <CarouselNext className="static transform-none bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 h-9 w-9 shadow-xs cursor-pointer" />
          </div>
        </Carousel>

      </div>
    </section>
  );
}
