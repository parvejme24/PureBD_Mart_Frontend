"use client";

import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { useProducts } from "@/hooks/useProduct";
import { useShopFilter } from "@/hooks/useShopFilter";
import { Package, SearchX, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopContentsSkeleton from "./ShopContentsSkeleton";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";

export default function ShopContents() {
  const { data, isLoading, isError } = useProducts();
  const { filters, filterProducts, hasActiveFilters, clearFilters } = useShopFilter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [showAll, setShowAll] = useState(false);
  
  const allProducts = data?.products || [];
  const filteredProducts = filterProducts(allProducts);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleProducts = showAll
    ? filteredProducts
    : filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filterKey = `${filters.search || ""}|${filters.categories.join(",")}|${filters.minPrice}-${filters.maxPrice}`;
  const paginationKey = showAll ? "all" : `p${page}-s${pageSize}`;
  const animationKey = `${filterKey}|${paginationKey}`;

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
      {/* Pagination controls */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {showAll ? filteredProducts.length : visibleProducts.length} of{" "}
              {filteredProducts.length} products
            </span>
            {!showAll && (
              <>
                <span className="hidden sm:inline">·</span>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span>Per page:</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(val) => {
                      const num = Number(val);
                      setPageSize(num);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20 px-2">
                      <SelectValue placeholder="Page size" />
                    </SelectTrigger>
                    <SelectContent side="bottom" align="start">
                      {[8, 12, 16, 24].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 cursor-pointer"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <span className="text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 cursor-pointer"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}

            {showAll ? (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => {
                  setShowAll(false);
                  setPage(1);
                }}
              >
                Back to paginated
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => setShowAll(true)}
              >
                Show all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Products grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
