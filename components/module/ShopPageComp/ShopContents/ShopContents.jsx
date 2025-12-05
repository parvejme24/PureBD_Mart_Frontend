"use client";

import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { useProducts } from "@/hooks/useProduct";
import { Package, Loader2 } from "lucide-react";
import ShopContentsSkeleton from "./ShopContentsSkeleton";

export default function ShopContents() {
  const { data, isLoading, isError } = useProducts();
  const products = data?.products || [];

  if (isLoading) {
    return <ShopContentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-gray-500">
        <Package className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">Failed to load products</p>
        <p className="text-sm">Please try again later</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-gray-500">
        <Package className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {products.length} product{products.length !== 1 ? "s" : ""}
      </p>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
