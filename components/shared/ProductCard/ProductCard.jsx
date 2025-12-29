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

  // Truncate description if longer than 44 characters
  const truncateDescription = (desc, maxLength = 44) => {
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };

  // Get image URL - support both old format (product.image) and new API format (product.image.url)
  const imageUrl = product.image?.url || product.image || "/placeholder-product.png";
  
  // Get stock status
  const inStock = product.stock > 0;
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
            toggleWishlist(product);
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
          
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
            {truncateDescription(product.description)}
          </p>
          
          {/* Category */}
          {product.category?.name && (
            <p className="text-xs text-gray-400 mt-1">
              {product.category.name}
            </p>
          )}

          {/* Price and Buttons */}
          <div className="flex justify-between items-center mt-3">
            <p className="font-bold text-[#3BB77E] text-lg">৳{product.price}</p>

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
