"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductReviews } from "@/hooks/useReview";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import RatingStars from "@/components/shared/RatingStars/RatingStars";

export default function ProductDetails({ product }) {
  const { data: session } = useSession();
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { data: reviewsData } = useProductReviews(product?._id, {
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Product Not Found
        </h1>
        <p className="text-gray-600">
          The product you&apos;re looking for is not available.
        </p>
      </div>
    );
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [{ url: "/placeholder-product.png" }];

  const productInCart = product._id ? isInCart(product._id) : false;
  const cartQuantity =
    productInCart && product._id ? getItemQuantity(product._id) : 0;

  const handleAddToCart = () => {
    if ((product.stock || 0) > 0 && product._id) {
      addToCart(product);
    }
  };

  const handleIncrement = () => {
    if (product._id) {
      incrementQuantity(product._id);
    }
  };

  const handleDecrement = () => {
    if (product._id) {
      decrementQuantity(product._id);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-[#3BB77E]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#3BB77E]">
          Shop
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={
                images[selectedImage]?.url ||
                images[selectedImage]?.src ||
                images[selectedImage] ||
                "/placeholder-product.png"
              }
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto justify-center">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                    selectedImage === index
                      ? "border-[#3BB77E]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={
                      image?.url ||
                      image?.src ||
                      image ||
                      "/placeholder-product.png"
                    }
                    alt={`${product.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <RatingStars
                  rating={reviewsData?.averageRating || 0}
                  showValue={true}
                  size="w-5 h-5"
                />
              </div>
              <span className="text-sm text-gray-600">•</span>
              <span className="text-sm text-gray-600">
                {product.sold || 0} sold
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#3BB77E]">
                ৳{product.price || 0}
              </span>
              {product.withDiscountPrice &&
                product.withDiscountPrice > (product.price || 0) && (
                  <span className="text-xl text-gray-500 line-through">
                    ৳{product.withDiscountPrice}
                  </span>
                )}
            </div>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              {/* Quantity Controls */}
              {productInCart ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      Quantity in cart:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDecrement}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {cartQuantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleIncrement}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Remove from Cart and Favorite Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromCart(product._id);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold cursor-pointer"
                    >
                      <Minus className="w-5 h-5 mr-2" />
                      Remove from Cart
                    </Button>
                    <Button
                      onClick={() => toggleWishlist(product._id)}
                      variant="outline"
                      size="lg"
                      className={`px-4 py-3 border-gray-300 hover:border-red-500 cursor-pointer transition-colors ${
                        isInWishlist(product._id)
                          ? "text-red-500 bg-red-50 border-red-300"
                          : "hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${
                          isInWishlist(product._id) ? "fill-current" : ""
                        }`}
                      />
                      {isInWishlist(product._id) ? "Favorited" : "Favorite"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart and Wishlist */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#3BB77E] hover:bg-[#2a9c66] text-white py-3 text-lg font-semibold cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={() => toggleWishlist(product._id)}
                      variant="outline"
                      size="lg"
                      className={`p-3 border-gray-300 hover:border-red-500 cursor-pointer transition-colors ${
                        isInWishlist(product._id)
                          ? "text-red-500 bg-red-50 border-red-300"
                          : "hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${
                          isInWishlist(product._id) ? "fill-current" : ""
                        }`}
                      />
                      {isInWishlist(product._id) ? "Favorited" : "Favorite"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="w-5 h-5 text-[#3BB77E]" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-gray-600">Orders over ৳500</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-[#3BB77E]" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-[#3BB77E]" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600">30 Days Return</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {product.category && (
              <div>
                <span className="text-gray-600">Category: </span>
                <Badge variant="secondary" className="ml-1">
                  {product.category.name}
                </Badge>
              </div>
            )}
            {product.sku && (
              <div>
                <span className="text-gray-600">SKU: </span>
                <span className="font-medium">{product.sku}</span>
              </div>
            )}
            {product.weight > 0 && product.weightUnit && (
              <div>
                <span className="text-gray-600">Weight: </span>
                <span className="font-medium">
                  {product.weight} {product.weightUnit}
                </span>
              </div>
            )}
            {product.sold > 0 && (
              <div>
                <span className="text-gray-600">Sold: </span>
                <span className="font-medium">{product.sold} items</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="max-w-none space-y-6">
              {/* Main Product Description */}
              <div className="prose prose-gray max-w-none">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">
                  Detailed Description
                </h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {product.description ? (
                    product.description
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0 text-base">
                          {paragraph.split("\n").map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < paragraph.split("\n").length - 1 && (
                                <br />
                              )}
                            </span>
                          ))}
                        </p>
                      ))
                  ) : (
                    <p className="text-gray-500 italic">
                      No detailed description available for this product.
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {product.note && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Additional Information
                  </h4>
                  <p className="text-amber-700 leading-relaxed">
                    {product.note}
                  </p>
                </div>
              )}

              {/* Shipping Information */}
              {(product.transportCost || product.otherCost) && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">
                    Shipping & Cost Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    {product.transportCost && (
                      <div className="flex justify-between">
                        <span className="text-green-700">Transport Cost:</span>
                        <span className="font-medium text-green-900">
                          ৳{product.transportCost}
                        </span>
                      </div>
                    )}
                    {product.otherCost && (
                      <div className="flex justify-between">
                        <span className="text-green-700">Other Costs:</span>
                        <span className="font-medium text-green-900">
                          ৳{product.otherCost}
                        </span>
                      </div>
                    )}
                    {product.transportCost && product.otherCost && (
                      <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                        <span className="text-green-700 font-medium">
                          Total Additional Cost:
                        </span>
                        <span className="font-bold text-green-900">
                          ৳{product.transportCost + product.otherCost}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-8">
            {/* Reviews List */}
            <ReviewList productId={product._id} />

            {/* Review Form */}
            <ReviewForm productId={product._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
