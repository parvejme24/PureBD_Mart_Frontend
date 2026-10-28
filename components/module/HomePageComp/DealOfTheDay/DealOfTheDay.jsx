"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Clock,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDealOfTheDay } from "@/hooks/useProduct";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

  // Support both dealOfTheDay and products array
  const products = (data?.dealOfTheDay || data?.products || []).slice(0, 4);

  // Live countdown timer until midnight
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

  if (isLoading) {
    return (
      <section className="py-10 sm:py-14 bg-gradient-to-b from-amber-50/50 via-emerald-50/25 to-white border-y border-emerald-100/60">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-pulse">
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-36 bg-amber-200" />
              <Skeleton className="h-8 w-64 bg-gray-200 rounded-xl" />
              <Skeleton className="h-4 w-48 bg-gray-150" />
            </div>
            <Skeleton className="h-12 w-64 rounded-2xl bg-amber-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-emerald-100 space-y-4 animate-pulse shadow-sm"
              >
                <Skeleton className="w-full h-44 rounded-2xl bg-gray-100" />
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-5 w-4/5 bg-gray-200" />
                <Skeleton className="h-3 w-full bg-gray-100" />
                <Skeleton className="h-2 w-full bg-emerald-100 rounded-full" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-7 w-24 bg-gray-200" />
                  <Skeleton className="h-10 w-24 rounded-xl bg-emerald-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-b from-amber-50/60 via-emerald-50/30 to-white relative overflow-hidden border-y border-emerald-100/70 shadow-2xs">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 relative z-10">
        
        {/* ========================================================= */}
        {/* Highlighted Header with Glowing Timer                     */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md shadow-rose-600/20 mb-2.5">
              <Flame className="w-4 h-4 fill-white animate-bounce" />
              <span>Flash Deals of the Day • Bestsellers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Today&apos;s Super Deals &amp; Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl leading-relaxed">
              Grab our most popular organic groceries at exclusive discounted prices. Fresh farm stock with maximum savings!
            </p>
          </div>

          {/* Glowing Digital Countdown Clock */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-3xl border-2 border-rose-200 shadow-lg shadow-rose-500/10">
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider leading-none">
                  Hurry Up!
                </span>
                <span className="text-xs font-black text-rose-700">Ends in:</span>
              </div>
            </div>

            {/* Timer Pills */}
            <div className="flex items-center gap-1.5 font-mono text-center">
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white px-2.5 py-1 rounded-xl shadow-xs min-w-[36px]">
                <span className="text-base sm:text-lg font-black block leading-none">
                  {timeLeft.hours}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400 block mt-0.5">
                  Hours
                </span>
              </div>
              <span className="font-bold text-gray-800 text-sm">:</span>
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white px-2.5 py-1 rounded-xl shadow-xs min-w-[36px]">
                <span className="text-base sm:text-lg font-black block leading-none">
                  {timeLeft.minutes}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-400 block mt-0.5">
                  Mins
                </span>
              </div>
              <span className="font-bold text-gray-800 text-sm">:</span>
              <div className="bg-gradient-to-b from-rose-600 to-rose-700 text-white px-2.5 py-1 rounded-xl shadow-xs min-w-[36px] animate-pulse">
                <span className="text-base sm:text-lg font-black block leading-none">
                  {timeLeft.seconds}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-rose-200 block mt-0.5">
                  Secs
                </span>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              <span>All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4 Super Highlighted Deal Cards Grid                       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {products.map((product, idx) => {
            const originalPrice = Number(product.price) || 0;
            const discount = Number(product.discount) || 0;
            const discountedPrice =
              product.withDiscountPrice ||
              (discount > 0 ? originalPrice - discount : originalPrice);
            const hasDiscount = discount > 0;
            const discountPct = hasDiscount
              ? Math.round((discount / originalPrice) * 100)
              : 15;
            const savings = hasDiscount ? originalPrice - discountedPrice : 0;

            const sold = product.sold || 85 + idx * 25;
            const totalStock = product.stock || 120;
            const percentSold = Math.min(Math.round((sold / totalStock) * 100), 92);

            const imageUrl =
              product.image?.url || product.image || "/placeholder-product.png";

            return (
              <div
                key={product._id}
                className="group relative bg-white rounded-3xl p-4 sm:p-5 border-2 border-emerald-100 hover:border-emerald-400 shadow-md hover:shadow-xl hover:shadow-emerald-950/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Badges on Top */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                      <Flame className="w-3 h-3 fill-white" />
                      -{discountPct}% OFF
                    </span>
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      <Award className="w-2.5 h-2.5" /> #{idx + 1} Best
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    aria-label="Wishlist"
                    className={`pointer-events-auto h-8 w-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-xs cursor-pointer ${
                      isInWishlist(product._id)
                        ? "bg-rose-50 text-rose-500 border border-rose-200"
                        : "bg-white/95 text-gray-400 hover:text-rose-500 border border-gray-100"
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

                {/* Product Clickable Area */}
                <Link
                  href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
                  className="flex flex-col flex-1"
                >
                  {/* Product Image Stage */}
                  <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 via-emerald-50/20 to-white mb-3 flex items-center justify-center p-3 group-hover:scale-102 transition-transform">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Category & Rating */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {product.category?.name || "Organic Mart"}
                    </span>
                    <span className="flex items-center text-amber-500 text-xs font-bold">
                      ★ 4.9{" "}
                      <span className="text-gray-400 font-normal ml-0.5">
                        ({product.reviewsCount || 42})
                      </span>
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-black text-gray-900 text-base sm:text-lg group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1 tracking-tight">
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {product.shortDescription ||
                      product.description ||
                      "Farm-fresh organic staple guaranteed 100% natural and pesticide-free."}
                  </p>

                  {/* Urgency Progress Bar */}
                  <div className="mb-3.5 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 mb-1">
                      <span className="text-emerald-800">
                        Sold: <strong>{sold}</strong>
                      </span>
                      <span className="text-rose-600 font-extrabold animate-pulse">
                        Only {Math.max(5, totalStock - sold)} Left!
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-700"
                        style={{ width: `${percentSold}%` }}
                      />
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-black text-emerald-700 tracking-tight">
                      ৳{discountedPrice}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-sm text-gray-400 line-through font-semibold">
                          ৳{originalPrice}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md ml-auto">
                          Save ৳{savings}
                        </span>
                      </>
                    )}
                  </div>
                </Link>

                {/* Cart Action Button */}
                <div className="pt-2 border-t border-gray-100 mt-auto">
                  {isInCart(product._id) ? (
                    <div
                      className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-2xl p-1 shadow-2xs"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        type="button"
                        className="h-8 w-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-90"
                        onClick={() => decrementQuantity(product._id)}
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="text-center">
                        <span className="text-xs font-black text-emerald-900 block leading-none">
                          {getItemQuantity(product._id)}
                        </span>
                        <span className="text-[9px] text-emerald-700 font-bold block">
                          In Basket
                        </span>
                      </div>
                      <button
                        type="button"
                        className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-90"
                        onClick={() => incrementQuantity(product._id)}
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black h-11 rounded-2xl shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                      onClick={() => {
                        addToCart({
                          _id: product._id,
                          name: product.name,
                          price: discountedPrice,
                          originalPrice: originalPrice,
                          image: imageUrl,
                          slug: product.slug,
                        });
                        toast.success(`Claimed deal for ${product.name}!`);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Claim Deal • Add</span>
                    </Button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom trust banner */}
        <div className="mt-8 pt-6 border-t border-emerald-100/60 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed fresh daily harvest sourced directly from local certified farmers</span>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
          >
            <span>Explore 100+ More Daily Specials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
