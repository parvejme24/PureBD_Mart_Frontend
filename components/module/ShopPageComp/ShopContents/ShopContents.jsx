"use client";

import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { useProducts, useBestSellingProducts, useDealOfTheDay } from "@/hooks/useProduct";
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
  const { data: allProductsData, isLoading: allLoading, isError: allError } = useProducts();
  const { data: bestSellingData, isLoading: bestSellingLoading, isError: bestSellingError } = useBestSellingProducts();
  const { data: dealOfDayData, isLoading: dealOfDayLoading, isError: dealOfDayError } = useDealOfTheDay();
  const { filters, filterProducts, hasActiveFilters, clearFilters } = useShopFilter();

  let data, isLoading, isError;
  if (filters.productType === "best-selling") {
    data = bestSellingData;
    isLoading = bestSellingLoading;
    isError = bestSellingError;
  } else if (filters.productType === "deal-of-day") {
    data = dealOfDayData;
    isLoading = dealOfDayLoading;
    isError = dealOfDayError;
  } else {
    data = allProductsData;
    isLoading = allLoading;
    isError = allError;
  }
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

  const filterKey = filters.search + filters.categories.join(",") + filters.minPrice + "-" + filters.maxPrice;
  const paginationKey = showAll ? "all" : "p" + page + "-s" + pageSize;
  const animationKey = filterKey + "|" + paginationKey;

  if (isLoading) return <ShopContentsSkeleton />;

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5 shadow-inner">
          <Package className="h-10 w-10 text-gray-300" />
        </div>
        <p className="text-lg font-bold text-gray-700 mb-1">Failed to load products</p>
        <p className="text-sm text-gray-400">Please try again later</p>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5 shadow-inner">
          <Package className="h-10 w-10 text-gray-300" />
        </div>
        <p className="text-lg font-bold text-gray-700 mb-1">No products found</p>
        <p className="text-sm text-gray-400">Check back later for new arrivals</p>
      </div>
    );
  }

  if (filteredProducts.length === 0 && hasActiveFilters) {
    return (
      <div className="w-full">
        <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-amber-700 mr-1">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 bg-white text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              &quot;{filters.search}&quot;
            </span>
          )}
          {filters.categories.length > 0 && (
            <span className="inline-flex items-center gap-1 bg-white text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              {filters.categories.join(", ")}
            </span>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <span className="inline-flex items-center gap-1 bg-white text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              ৳{filters.minPrice} – ৳{filters.maxPrice}
            </span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <SearchX className="h-10 w-10 text-red-300" />
          </div>
          <p className="text-lg font-bold text-gray-700 mb-2">No products match your filters</p>
          <p className="text-sm text-gray-400 mb-6 text-center max-w-sm">
            Try adjusting your search, categories, or price range.
          </p>
          <Button
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl font-bold gap-2 cursor-pointer"
            onClick={clearFilters}
          >
            <FilterX className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-600">
            Showing{" "}
            <span className="text-emerald-700 font-black">
              {showAll ? filteredProducts.length : visibleProducts.length}
            </span>{" "}
            of{" "}
            <span className="text-gray-800 font-bold">{filteredProducts.length}</span> products
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {!showAll && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => { setPageSize(Number(val)); setPage(1); }}
                >
                  <SelectTrigger className="h-8 w-16 text-xs rounded-lg border-gray-200 bg-white font-bold">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    {[8, 12, 16, 24].map((size) => (
                      <SelectItem key={size} value={String(size)} className="text-xs font-semibold">{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button className="h-8 px-3 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>←</button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)} className={"h-8 w-8 text-xs font-bold rounded-lg transition-all cursor-pointer " + (currentPage === pageNum ? "bg-emerald-600 text-white shadow-sm" : "border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700")}>{pageNum}</button>
                    );
                  })}
                </div>
                <button className="h-8 px-3 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>→</button>
              </div>
            )}
            <button className="h-8 px-3 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all cursor-pointer" onClick={() => { setShowAll(!showAll); setPage(1); }}>
              {showAll ? "Paginate" : "Show all"}
            </button>
          </div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div key={animationKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleProducts.map((product, idx) => (
              <motion.div key={product._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22, delay: idx * 0.03 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      {!showAll && totalPages > 1 && filteredProducts.length > 8 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm">
            <button className="h-9 px-4 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Prev</button>
            <span className="text-sm font-bold text-gray-500 px-2">{currentPage} / {totalPages}</span>
            <button className="h-9 px-4 text-sm font-bold rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer" disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
