"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X, FolderOpen } from "lucide-react";
import { useCategories } from "@/hooks/useCategory";
import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

export default function CategoriesPageContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const { data, isLoading, isError } = useCategories();
  const categories = data?.categories || [];

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit click
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="container mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded-lg w-32 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-48 mt-2 animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="h-10 bg-gray-200 rounded-full w-full sm:w-64 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded-full w-36 animate-pulse" />
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {[...Array(10)].map((_, index) => (
            <CategoryCardSkeleton key={index} />
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
          <p>Failed to load categories</p>
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product categories ({categories.length} total)
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
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

        <div className="">
          {/* Add Category Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer rounded-full px-6 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <FolderOpen className="h-16 w-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600">
            {searchQuery ? "No categories found" : "No categories yet"}
          </h3>
          <p className="text-sm mt-1">
            {searchQuery
              ? `No categories matching "${searchQuery}"`
              : "Create your first category to get started"}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>
      )}

      {/* Category Grid */}
      {filteredCategories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        category={selectedCategory}
      />
    </div>
  );
}
