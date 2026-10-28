"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Sparkles,
  Check,
  Share2,
  Package,
  Tag,
  Weight,
  ChevronRight as BreadcrumbChevron,
  Info,
  ZoomIn,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductReviews } from "@/hooks/useReview";
import { useProductsByCategory } from "@/hooks/useProduct";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function StarRating({ rating = 0, size = "w-4 h-4", showValue = false }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rounded
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      {showValue && (
        <span className="text-sm font-bold text-amber-700 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

function InfoPill({ icon: Icon, label, value, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
  };
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border ${colors[color]}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function ProductDetails({ product }) {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const tabsRef = useRef(null);

  const { data: reviewsData } = useProductReviews(product?._id, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const categorySlug = product?.category?.slug || "";
  const { data: relatedData } = useProductsByCategory(categorySlug);

  if (!product) return null;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [{ url: "/placeholder-product.png", alt: product.name }];

  const productInCart = product._id ? isInCart(product._id) : false;
  const cartQuantity =
    productInCart && product._id ? getItemQuantity(product._id) : 0;
  const inStock = (product.stock || 0) > 0;

  const originalPrice = Number(product.price) || 0;
  const discountAmount = Number(product.discount) || 0;
  const discountedPrice =
    product.withDiscountPrice || originalPrice - discountAmount;
  const hasDiscount = discountAmount > 0 && discountedPrice < originalPrice;
  const discountPct = hasDiscount
    ? Math.round((discountAmount / originalPrice) * 100)
    : 0;
  const savings = hasDiscount ? originalPrice - discountedPrice : 0;

  const avgRating =
    reviewsData?.averageRating || product.averageRating || 4.9;
  const totalReviews =
    reviewsData?.pagination?.totalReviews ||
    product.reviewsCount ||
    reviewsData?.reviews?.length ||
    18;

  const handleAddToCart = () => {
    if (inStock && product._id) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setJustAdded(true);
      toast.success(`Added ${quantity} ${product.name} to basket!`);
      setTimeout(() => setJustAdded(false), 1500);
    }
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Product link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("Could not copy link");
    }
  };

  const scrollToReviews = () => {
    setActiveTab("reviews");
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const nextImage = () =>
    setSelectedImage((p) => (p + 1) % images.length);
  const prevImage = () =>
    setSelectedImage((p) => (p - 1 + images.length) % images.length);

  const getImageUrl = (img) =>
    img?.url || img?.src || (typeof img === "string" ? img : "/placeholder-product.png");

  // Related products filtered without current
  const relatedProducts = (relatedData?.products || [])
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50/40 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar">
            <Link
              href="/"
              className="hover:text-emerald-600 transition-colors shrink-0"
            >
              Home
            </Link>
            <BreadcrumbChevron className="w-3 h-3 text-gray-300 shrink-0" />
            <Link
              href="/shop"
              className="hover:text-emerald-600 transition-colors shrink-0"
            >
              Shop
            </Link>
            {product.category && (
              <>
                <BreadcrumbChevron className="w-3 h-3 text-gray-300 shrink-0" />
                <Link
                  href={`/shop?category=${product.category.slug || product.category._id}`}
                  className="hover:text-emerald-600 transition-colors shrink-0"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <BreadcrumbChevron className="w-3 h-3 text-gray-300 shrink-0" />
            <span className="text-gray-900 font-bold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs">
          {/* ---- LEFT: Image Gallery ---- */}
          <div className="space-y-4">
            {/* Main Stage */}
            <div className="relative group rounded-3xl overflow-hidden bg-gray-50/60 border border-gray-100 aspect-square flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src={getImageUrl(images[selectedImage])}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain p-8 transition-transform duration-500 ${
                      zoomed ? "scale-135 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
                    }`}
                    onClick={() => setZoomed(!zoomed)}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges on Top Left */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                    🔥 -{discountPct}% OFF
                  </span>
                )}
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3" /> 100% Organic
                </span>
              </div>

              {/* Top Right Action Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={() => setZoomed(!zoomed)}
                  className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:scale-105 transition-all cursor-pointer"
                  title={zoomed ? "Zoom out" : "Zoom in"}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className={`w-10 h-10 rounded-2xl bg-white/90 backdrop-blur border border-gray-100 shadow-sm flex items-center justify-center transition-all cursor-pointer ${
                    copied
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-600 hover:text-emerald-600 hover:scale-105"
                  }`}
                  title="Share product link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-2xl shadow-md flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-2xl shadow-md flex items-center justify-center text-gray-700 hover:text-emerald-600 transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === selectedImage ? "bg-emerald-600 w-5" : "bg-gray-300 w-2 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 bg-gray-50 transition-all cursor-pointer ${
                      selectedImage === i
                        ? "border-emerald-600 shadow-sm ring-2 ring-emerald-200"
                        : "border-gray-200/80 hover:border-emerald-300"
                    }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ---- RIGHT: Product Info ---- */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Stock Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {product.category && (
                  <Link
                    href={`/shop?category=${product.category.slug || product.category._id}`}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category.name}
                    </span>
                  </Link>
                )}

                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating + Sold pill */}
              <div className="flex items-center flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 hover:border-amber-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <StarRating rating={avgRating} showValue />
                  <span className="text-xs font-bold text-amber-800 underline decoration-amber-400">
                    ({totalReviews} reviews)
                  </span>
                </button>

                {product.sold > 0 && (
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    🔥 {product.sold.toLocaleString()} sold recently
                  </span>
                )}
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-black text-emerald-800 tracking-tight">
                    ৳{hasDiscount ? discountedPrice : originalPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through font-semibold">
                        ৳{originalPrice}
                      </span>
                      <span className="text-xs font-black text-white bg-rose-500 px-2.5 py-1 rounded-xl shadow-xs">
                        -{discountPct}% OFF
                      </span>
                    </>
                  )}
                </div>

                {hasDiscount && (
                  <p className="text-xs text-emerald-800 font-bold mt-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Special Discount! You save ৳{savings} on this item today.
                  </p>
                )}
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Cart / Quantity Section */}
              <div className="pt-2">
                {inStock ? (
                  productInCart ? (
                    <div className="space-y-3 bg-emerald-50/50 border border-emerald-200 rounded-3xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                          Item in your basket
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Total: ৳{(discountedPrice * cartQuantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-2xl p-1 shadow-xs flex-1">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(product._id)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-emerald-600 hover:text-white transition-all text-gray-700 cursor-pointer"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="text-center px-4">
                            <span className="text-lg font-black text-gray-900">
                              {cartQuantity}
                            </span>
                            <span className="text-[10px] text-gray-500 block font-semibold">
                              in cart
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(product._id)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <Link
                          href="/cart"
                          className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Checkout
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product._id)}
                          className={`h-12 w-12 flex items-center justify-center rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                            isInWishlist(product._id)
                              ? "border-rose-300 bg-rose-50 text-rose-500"
                              : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500 bg-white"
                          }`}
                          title="Wishlist"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isInWishlist(product._id) ? "fill-rose-500" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product._id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Remove from basket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-black text-gray-900 text-base">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={handleAddToCart}
                          className={`flex-1 h-13 font-black text-base rounded-2xl shadow-md transition-all cursor-pointer gap-2 ${
                            justAdded
                              ? "bg-emerald-500 text-white"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98"
                          }`}
                        >
                          {justAdded ? (
                            <>
                              <Check className="w-5 h-5" />
                              Added to Basket!
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-5 h-5" />
                              Add to Basket • ৳{(discountedPrice * quantity).toLocaleString()}
                            </>
                          )}
                        </Button>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product._id)}
                          className={`h-13 w-13 flex items-center justify-center rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                            isInWishlist(product._id)
                              ? "border-rose-300 bg-rose-50 text-rose-500"
                              : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500 bg-white"
                          }`}
                          title="Add to Wishlist"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isInWishlist(product._id) ? "fill-rose-500" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200 text-center">
                    <p className="font-bold text-gray-500 text-sm">
                      Currently Out of Stock
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Check back soon or explore related products below.
                    </p>
                  </div>
                )}
              </div>

              {/* Info Trust Pills */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <InfoPill
                  icon={Truck}
                  label="Shipping"
                  value="Free over ৳500"
                  color="emerald"
                />
                <InfoPill
                  icon={Shield}
                  label="Safety"
                  value="100% Genuine"
                  color="blue"
                />
                <InfoPill
                  icon={RotateCcw}
                  label="Guarantee"
                  value="Easy Returns"
                  color="amber"
                />
              </div>

              {/* Tags & Weight Meta Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {product.sku && (
                  <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    SKU: {product.sku}
                  </span>
                )}
                {product.weight > 0 && (
                  <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Weight className="w-3 h-3 text-gray-400" />
                    {product.weight} {product.weightUnit || "g"}
                  </span>
                )}
                {Array.isArray(product.tags) &&
                  product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- Tabs Section: Description & Reviews ---- */}
        <div ref={tabsRef} className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 bg-white rounded-t-3xl px-6 pt-3 shadow-2xs">
              <TabsList className="h-auto bg-transparent border-0 rounded-none w-full justify-start gap-4 p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:bg-transparent text-gray-500 font-black px-4 py-3.5 text-sm sm:text-base transition-all hover:text-gray-900 cursor-pointer"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Product Story & Details
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 data-[state=active]:bg-transparent text-gray-500 font-black px-4 py-3.5 text-sm sm:text-base transition-all hover:text-gray-900 cursor-pointer"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Customer Reviews ({totalReviews})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Description Tab Content */}
            <TabsContent value="description" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Detailed Description */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8">
                    <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Package className="w-4 h-4" />
                      </div>
                      About this Product
                    </h3>
                    <div className="text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base">
                      {product.description ? (
                        product.description.split("\n\n").map((para, i) => (
                          <p key={i} className="mb-3 last:mb-0">
                            {para}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">
                          No additional description provided.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Note Banner */}
                  {product.note && (
                    <div className="flex gap-4 bg-amber-50/80 border border-amber-200 rounded-3xl p-6">
                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm mb-1">
                          Freshness & Storage Guidelines
                        </h4>
                        <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                          {product.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Specifications & Shipping */}
                <div className="space-y-6">
                  {/* Specifications Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
                      Product Specifications
                    </h3>
                    <div className="divide-y divide-gray-100 text-sm">
                      <div className="flex justify-between py-2.5">
                        <span className="text-gray-400 font-semibold">Category</span>
                        <span className="font-bold text-gray-900">
                          {product.category?.name || "Organic Grocery"}
                        </span>
                      </div>
                      {product.sku && (
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-400 font-semibold">SKU</span>
                          <span className="font-mono font-bold text-gray-900">
                            {product.sku}
                          </span>
                        </div>
                      )}
                      {product.weight > 0 && (
                        <div className="flex justify-between py-2.5">
                          <span className="text-gray-400 font-semibold">Net Weight</span>
                          <span className="font-bold text-gray-900">
                            {product.weight} {product.weightUnit || "g"}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-2.5">
                        <span className="text-gray-400 font-semibold">Stock Availability</span>
                        <span
                          className={`font-bold ${
                            inStock ? "text-emerald-700" : "text-rose-600"
                          }`}
                        >
                          {inStock ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2.5">
                        <span className="text-gray-400 font-semibold">Source</span>
                        <span className="font-bold text-gray-900">
                          Bangladeshi Local Farmers
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info Card */}
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6">
                    <h4 className="text-sm font-black text-emerald-900 flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Delivery & Charges
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                      We dispatch fresh orders every day before 10 AM. Packaged with eco-friendly temperature-controlled materials.
                    </p>
                    <div className="text-xs font-bold text-emerald-900 space-y-1">
                      <div className="flex justify-between">
                        <span>Inside Dhaka:</span>
                        <span>৳60 (Standard 24h)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outside Dhaka:</span>
                        <span>৳120 (48h Express)</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 pt-1 border-t border-emerald-200/60">
                        <span>Orders above ৳500:</span>
                        <span className="text-emerald-800 font-black">FREE Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab Content */}
            <TabsContent value="reviews" className="mt-6 space-y-10">
              <ReviewList
                productId={product._id}
                averageRating={avgRating}
                totalReviews={totalReviews}
              />
              <ReviewForm productId={product._id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* ---- Related Products Section ---- */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  You Might Also Like
                </span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  Related Products
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category?.slug || ""}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                View all in {product.category?.name || "category"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
