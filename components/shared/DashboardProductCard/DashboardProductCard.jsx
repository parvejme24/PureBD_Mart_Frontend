"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";

export default function DashboardProductCard({ product, onDelete }) {
  // Truncate description if longer than 60 characters
  const truncateDescription = (desc, maxLength = 60) => {
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };

  // Stock status
  const stockStatus =
    product.stock > 10
      ? { text: "In Stock", color: "text-green-600 bg-green-50" }
      : product.stock > 0
      ? { text: "Low Stock", color: "text-amber-600 bg-amber-50" }
      : { text: "Out of Stock", color: "text-red-600 bg-red-50" };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#3BB77E]/30 transition-all duration-300">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Stock Badge */}
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${stockStatus.color}`}
        >
          {stockStatus.text} ({product.stock})
        </span>

        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-400 mt-1">
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {truncateDescription(product.description)}
        </p>

        {/* Price & Actions */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <p className="font-bold text-[#3BB77E] text-lg">৳{product.price}</p>
          <div className="flex gap-2">
            <Link href={`/dashboard/products/edit/${product._id}`}>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer h-8 w-8 bg-[#DEF9EC] text-[#3BB77E] border-[#3BB77E]/20 hover:bg-[#c9f4e2]"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete(product)}
              className="cursor-pointer h-8 w-8 bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
