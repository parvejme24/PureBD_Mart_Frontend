"use client";

import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { useProducts } from "@/hooks/useProduct";
import { useShopFilter } from "@/hooks/useShopFilter";
import { Package, SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopContentsSkeleton from "./ShopContentsSkeleton";

export default function ShopContents() {
  const { data, isLoading, isError } = useProducts();
  const { filters, filterProducts, hasActiveFilters, clearFilters } = useShopFilter();
  
  const allProducts = data?.products || [];
  const filteredProducts = filterProducts(allProducts);

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

  if (allProducts.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 text-gray-500">
        <Package className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Check back later for new products</p>
      </div>
    );
  }

  // No results after filtering
  if (filteredProducts.length === 0 && hasActiveFilters) {
    return (
      <div className="w-full">
        {/* Active filters info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 bg-white text-green-700 text-sm px-3 py-1 rounded-full border border-green-300">
                Search: &quot;{filters.search}&quot;
              </span>
            )}
            {filters.categories.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-white text-green-700 text-sm px-3 py-1 rounded-full border border-green-300">
                Categories: {filters.categories.join(", ")}
              </span>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
              <span className="inline-flex items-center gap-1 bg-white text-green-700 text-sm px-3 py-1 rounded-full border border-green-300">
                Price: ৳{filters.minPrice} - ৳{filters.maxPrice}
              </span>
            )}
          </div>
        </div>

        {/* No results message */}
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="relative mb-4">
            <SearchX className="h-16 w-16 text-gray-300" />
          </div>
          <p className="text-lg font-medium mb-2">No products match your filters</p>
          <p className="text-sm text-gray-400 mb-6 text-center max-w-md">
            Try adjusting your search terms, selecting different categories, or changing the price range
          </p>
          <Button
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50 cursor-pointer"
            onClick={clearFilters}
          >
            <FilterX className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
