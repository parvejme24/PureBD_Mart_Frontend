"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Plus, Minus, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Get display text (short description preferred, fallback to truncated description)
  const getDisplayText = (product) => {
    if (product.shortDescription) {
      return product.shortDescription.length > 60
        ? product.shortDescription.slice(0, 60) + "..."
        : product.shortDescription;
    }
    if (product.description) {
      return product.description.length > 60
        ? product.description.slice(0, 60) + "..."
        : product.description;
    }
    return "";
  };

  // Get image URL - support both old format (product.image) and new API format (product.image.url)
  const imageUrl = product.image?.url || product.image || "/placeholder-product.png";

  // Get stock status
  const inStock = product.stock > 0;

  // Price calculations
  const originalPrice = Number(product.price) || 0;
  const discountAmount = Number(product.discount) || 0;
  const discountedPrice = product.withDiscountPrice || (originalPrice - discountAmount);
  const hasDiscount = discountAmount > 0 && discountedPrice > 0;
  const discountPercentage = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const productInCart = isInCart(product._id);
  const quantity = productInCart ? getItemQuantity(product._id) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      addToCart(product);
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
    <div className="relative group">
      {/* Wishlist Icon - Top Right */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="outline"
          size="sm"
          className={`h-8 w-8 p-0 cursor-pointer border-gray-300 hover:border-red-500 bg-white/90 backdrop-blur-sm shadow-sm transition-colors ${
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
            className={`h-4 w-4 ${isInWishlist(product._id) ? "fill-current" : ""}`}
          />
        </Button>
      </div>

      <Link href={`/shop/${encodeURIComponent(product.slug || product._id)}`}>
        <div className="bg-[#D8F1E5]/10 rounded-md p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer">
          {/* Product Image */}
          <div className="relative w-full h-40 mb-3">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <hr className="mb-2" />
          
          {/* Stock Badge */}
          <span
            className={`uppercase font-bold text-xs ${
              inStock ? "text-green-700" : "text-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 group-hover:text-[#3BB77E] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Display Text (short description or truncated description) */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {getDisplayText(product)}
          </p>

          {/* Product Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>{product.category?.name}</span>
            {product.sold > 0 && (
              <span>{product.sold} sold</span>
            )}
          </div>

          {/* Price and Buttons */}
          <div className="flex justify-between items-center mt-3">
            <div className="flex flex-col">
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#3BB77E] text-lg">৳{discountedPrice}</p>
                  <p className="text-sm text-gray-500 line-through">৳{originalPrice}</p>
                  <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                    -{discountPercentage}%
                  </span>
                </div>
              ) : (
                <p className="font-bold text-[#3BB77E] text-lg">৳{originalPrice}</p>
              )}
              {product.weight > 0 && product.weightUnit && (
                <p className="text-xs text-gray-500">{product.weight} {product.weightUnit}</p>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!inStock ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50 cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              ) : productInCart ? (
                <>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
                      onClick={handleDecrement}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
                      onClick={handleIncrement}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer bg-[#DEF9EC] text-[#50BB88] font-bold hover:bg-[#3BB77E] hover:text-white transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}

            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
