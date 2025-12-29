"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export const useShopFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get current filter values from URL
  const filters = useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
      minPrice: Number(searchParams.get("minPrice")) || 0,
      maxPrice: Number(searchParams.get("maxPrice")) || 10000,
      productType: searchParams.get("productType") || "all",
    };
  }, [searchParams]);

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Handle search
      if (newFilters.search !== undefined) {
        if (newFilters.search) {
          params.set("search", newFilters.search);
        } else {
          params.delete("search");
        }
      }

      // Handle categories
      if (newFilters.categories !== undefined) {
        if (newFilters.categories.length > 0) {
          params.set("categories", newFilters.categories.join(","));
        } else {
          params.delete("categories");
        }
      }

      // Handle minPrice
      if (newFilters.minPrice !== undefined) {
        if (newFilters.minPrice > 0) {
          params.set("minPrice", newFilters.minPrice.toString());
        } else {
          params.delete("minPrice");
        }
      }

      // Handle maxPrice
      if (newFilters.maxPrice !== undefined) {
        if (newFilters.maxPrice < 10000) {
          params.set("maxPrice", newFilters.maxPrice.toString());
        } else {
          params.delete("maxPrice");
        }
      }

      // Handle productType
      if (newFilters.productType !== undefined) {
        if (newFilters.productType !== "all") {
          params.set("productType", newFilters.productType);
        } else {
          params.delete("productType");
        }
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  // Set search query
  const setSearch = useCallback(
    (search) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  // Toggle category selection
  const toggleCategory = useCallback(
    (categorySlug) => {
      const currentCategories = filters.categories;
      const newCategories = currentCategories.includes(categorySlug)
        ? currentCategories.filter((c) => c !== categorySlug)
        : [...currentCategories, categorySlug];
      updateFilters({ categories: newCategories });
    },
    [filters.categories, updateFilters]
  );

  // Set price range
  const setPriceRange = useCallback(
    (minPrice, maxPrice) => {
      updateFilters({ minPrice, maxPrice });
    },
    [updateFilters]
  );

  // Set product type
  const setProductType = useCallback(
    (productType) => {
      updateFilters({ productType });
    },
    [updateFilters]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.categories.length > 0 ||
      filters.minPrice > 0 ||
      filters.maxPrice < 10000 ||
      filters.productType !== "all"
    );
  }, [filters]);

  // Filter products based on current filters
  const filterProducts = useCallback(
    (products) => {
      if (!products) return [];

      return products.filter((product) => {
        // Search filter - match against name or description
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const nameMatch = product.name?.toLowerCase().includes(searchLower);
          const descMatch = product.description?.toLowerCase().includes(searchLower);
          if (!nameMatch && !descMatch) return false;
        }

        // Category filter
        if (filters.categories.length > 0) {
          const productCategorySlug = product.category?.slug;
          if (!productCategorySlug || !filters.categories.includes(productCategorySlug)) {
            return false;
          }
        }

        // Price filter
        const price = product.price || 0;
        if (price < filters.minPrice || price > filters.maxPrice) {
          return false;
        }

        return true;
      });
    },
    [filters]
  );

  return {
    filters,
    setSearch,
    toggleCategory,
    setPriceRange,
    setProductType,
    clearFilters,
    hasActiveFilters,
    filterProducts,
  };
};

