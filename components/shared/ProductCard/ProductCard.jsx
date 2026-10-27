"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShoppingBag, Plus, Minus, Heart, Star, Sparkles, Check, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  // Get display text
  const getDisplayText = (prod) => {
    if (prod.shortDescription) {
      return prod.shortDescription.length > 55
        ? prod.shortDescription.slice(0, 55) + "..."
        : prod.shortDescription;
    }
    if (prod.description) {
      return prod.description.length > 55
        ? prod.description.slice(0, 55) + "..."
        : prod.description;
    }
    return "Hand-picked farm fresh organic product.";
  };

  const imageUrl = product.image?.url || product.image || "/placeholder-product.png";
  const inStock = product.stock > 0;

  // Price calculations
  const originalPrice = Number(product.price) || 0;
  const discountAmount = Number(product.discount) || 0;
  const discountedPrice = product.withDiscountPrice || (originalPrice - discountAmount);
  const hasDiscount = discountAmount > 0 && discountedPrice > 0;
  const discountPercentage = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const savings = hasDiscount ? (originalPrice - discountedPrice) : 0;

  const productInCart = isInCart(product._id);
  const quantity = productInCart ? getItemQuantity(product._id) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    incrementQuantity(product._id);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    decrementQuantity(product._id);
  };

  return (
    <div className="relative group bg-white rounded-3xl p-3 sm:p-4 border border-emerald-100/70 hover:border-emerald-400/90 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/8 hover:-translate-y-1.5 flex flex-col justify-between h-full overflow-hidden">
      
      {/* Top Floating Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {hasDiscount ? (
          <span className="pointer-events-auto inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 sm:py-1 rounded-full shadow-md shadow-rose-500/25">
            <span>🔥</span> -{discountPercentage}%
          </span>
        ) : inStock ? (
          <span className="pointer-events-auto inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500 text-white shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Organic</span>
          </span>
        ) : (
          <span className="pointer-events-auto inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
            Out of Stock
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label="Add to Wishlist"
          className={`pointer-events-auto h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md shadow-sm ${
            isInWishlist(product._id)
              ? "bg-rose-50 text-rose-500 border border-rose-200 shadow-rose-200/50 scale-105"
              : "bg-white/95 text-gray-400 hover:text-rose-500 hover:bg-white border border-gray-100 hover:scale-110 active:scale-95"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              isInWishlist(product._id) ? "fill-rose-500 text-rose-500 scale-110" : ""
            }`}
          />
        </button>
      </div>

      <Link
        href={`/shop/${encodeURIComponent(product.slug || product._id)}`}
        className="flex flex-col flex-1"
      >
        {/* Product Image Frame */}
        <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 via-emerald-50/25 to-white mb-3 flex items-center justify-center p-3 group-hover:bg-emerald-50/40 transition-colors">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Category & Weight Pill */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-extrabold text-emerald-600 uppercase tracking-wider text-[10px] sm:text-[11px] truncate max-w-[65%]">
            {product.category?.name || "Pure Harvest"}
          </span>
          {product.weight > 0 && product.weightUnit && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0">
              {product.weight} {product.weightUnit}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1 leading-snug">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] sm:min-h-[36px] mb-2 leading-relaxed">
          {getDisplayText(product)}
        </p>

        {/* Rating Stars & Sold Count */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span className="font-bold text-amber-900 text-[11px]">4.9</span>
            <span className="text-[10px] text-amber-700/80">({product.reviewsCount || "24"})</span>
          </div>
          {product.sold > 0 && (
            <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
              {product.sold} sold
            </span>
          )}
        </div>
      </Link>

      {/* Price & Action Footer */}
      <div className="pt-2.5 border-t border-gray-100/90 flex flex-col gap-2 mt-auto">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl text-emerald-700 leading-tight">
              ৳{hasDiscount ? discountedPrice : originalPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ৳{originalPrice}
              </span>
            )}
          </div>
          {hasDiscount && savings > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Save ৳{savings}
            </span>
          )}
        </div>

        {/* Action Button: Stepper or Add to Cart */}
        <div>
          {!inStock ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="w-full h-9 text-xs opacity-50 cursor-not-allowed rounded-xl bg-gray-50 font-semibold text-gray-400"
            >
              Out of Stock
            </Button>
          ) : productInCart ? (
            <div
              className="flex items-center justify-between bg-emerald-50/90 border border-emerald-300 rounded-xl p-1 shadow-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer shadow-xs active:scale-90"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-black text-emerald-900 px-2">
                {quantity} in basket
              </span>
              <button
                type="button"
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs active:scale-90"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl shadow-sm hover:shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4 text-emerald-200" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Basket</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
