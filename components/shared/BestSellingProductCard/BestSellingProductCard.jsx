"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Plus, Minus, Star, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function BestSellingProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();

  // Truncate description if longer than 44 characters (same as regular ProductCard)
  const truncateDescription = (desc, maxLength = 44) => {
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };

  // Get image URL - support both old format (product.image) and new API format (product.image.url)
  const imageUrl = product.image?.url || product.image || "/placeholder-product.png";

  // Get stock status
  const inStock = product.stock > 0;
  const productInCart = isInCart(product._id);
  const quantity = getItemQuantity(product._id);

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
    <div>
      <Link href={`/shop/${product.slug || product._id}`}>
        <div className="bg-[#D8F1E5]/10 rounded-md p-5 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer relative">
          {/* Best Seller Badge */}
          <div className="absolute -top-2 -left-2 z-10">
            <div className="bg-[#3BB77E] text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 shadow-md">
              <Award className="w-3 h-3" />
              Best Seller
            </div>
          </div>

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

          {/* Rating & Sales Info */}
          <div className="flex items-center justify-between mt-2 mb-2">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < 4 ? "text-[#3BB77E] fill-[#3BB77E]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">(4.8)</span>
            </div>
            {product.sold && (
              <span className="text-xs text-[#3BB77E] font-medium">
                {product.sold} sold
              </span>
            )}
          </div>

          {/* Price and Button */}
          <div className="flex justify-between items-center mt-3">
            <p className="font-bold text-[#3BB77E] text-lg">৳{product.price}</p>

            {!inStock ? (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="text-xs px-3 py-1"
              >
                Out of Stock
              </Button>
            ) : productInCart ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDecrement();
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-medium px-2">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleIncrement();
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className="text-[#3BB77E] border-[#3BB77E] hover:bg-[#3BB77E] hover:text-white text-xs px-3 py-1"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
