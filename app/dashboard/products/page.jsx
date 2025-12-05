"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, X, Plus, Package, Loader2, Trash2 } from "lucide-react";
import DashboardProductCard from "@/components/shared/DashboardProductCard/DashboardProductCard";
import DashboardProductCardSkeleton from "@/components/shared/DashboardProductCard/DashboardProductCardSkeleton";
import { useProducts, useDeleteProduct } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategory";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products and categories
  const { data: productsData, isLoading, isError } = useProducts();
  const { data: categoriesData } = useCategories();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const products = useMemo(
    () => productsData?.products || [],
    [productsData?.products]
  );
  const categories = categoriesData?.categories || [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (product) => product.category?._id === categoryFilter
      );
    }

    // Sort
    switch (sortBy) {
      case "low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "low-stock":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, categoryFilter, sortBy]);

  // Handle delete
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-64 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <DashboardProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <p className="font-medium">Failed to load products</p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} total products
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="low-to-high">Price: Low to High</SelectItem>
              <SelectItem value="high-to-low">Price: High to Low</SelectItem>
              <SelectItem value="low-stock">Low Stock First</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Product Button */}
          <Link href="/dashboard/products/add">
            <Button className="bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Package className="h-16 w-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600">
            {searchQuery || categoryFilter !== "all"
              ? "No products found"
              : "No products yet"}
          </h3>
          <p className="text-sm mt-1">
            {searchQuery
              ? `No products matching "${searchQuery}"`
              : categoryFilter !== "all"
              ? "No products in this category"
              : "Create your first product to get started"}
          </p>
          {!searchQuery && categoryFilter === "all" && (
            <Link href="/dashboard/products/add">
              <Button className="mt-4 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <DashboardProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
