"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, X, RotateCcw, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaFilter } from "react-icons/fa";
import { useCategories } from "@/hooks/useCategory";
import { useShopFilter } from "@/hooks/useShopFilter";

// Section header component (declared outside render to avoid recreation)
const SectionHeader = ({ title, isOpen, toggle }) => (
  <div className="flex justify-between items-center mt-3">
    <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
    <Button
      variant="outline"
      size="icon"
      className="border-none hover:bg-transparent cursor-pointer"
      onClick={toggle}
    >
      {isOpen ? <FaMinus /> : <FaPlus />}
    </Button>
  </div>
);

export default function ShopSidebar() {
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [productTypeOpen, setProductTypeOpen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Get filter functions from hook
  const {
    filters,
    setSearch,
    toggleCategory,
    setPriceRange: applyPriceFilter,
    setProductType,
    clearFilters,
    hasActiveFilters,
  } = useShopFilter();

  // Local state for controlled inputs
  const [searchInput, setSearchInput] = useState(() => filters.search || "");
  const [priceRange, setPriceRange] = useState(() => [
    filters.minPrice ?? 0,
    filters.maxPrice ?? 10000,
  ]);

  // Get categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.categories || [];

  // Handle search submit
  const handleSearch = (e) => {
    e?.preventDefault();
    setSearch(searchInput);
  };

  // Handle price filter apply
  const handleApplyPriceFilter = () => {
    applyPriceFilter(priceRange[0], priceRange[1]);
    setShowSidebar(false);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    setPriceRange([0, 10000]);
    setProductType("all");
    clearFilters();
  };

  return (
    <>
      {/* ---------------- Filter Icon for Small Devices ---------------- */}
      <div className="sm:hidden fixed bottom-5 right-5 z-50">
        <Button
          className="bg-green-600 text-white rounded-full p-4 shadow-lg cursor-pointer"
          onClick={() => setShowSidebar(true)}
        >
          <FaFilter className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* ---------------- Overlay for Mobile ---------------- */}
      <div
        className={`fixed inset-0 bg-black/40 sm:hidden transition-opacity duration-300 z-40 ${
          showSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowSidebar(false)}
      ></div>

      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`fixed top-0 right-0 bg-green-50/95 p-5 shadow-lg transform transition-transform duration-300
          ${
            showSidebar
              ? "translate-x-0 z-50 h-full"
              : "translate-x-full h-full"
          }
          sm:static sm:translate-x-0 sm:w-[350px] sm:max-w-none sm:shadow-none sm:h-full
          lg:h-fit md:bg-green-50/40 md:border md:rounded-lg md:border-gray-200 overflow-y-auto`}
      >
        {/* Close button on mobile */}
        <div className="flex justify-between items-center sm:hidden mb-3">
          <h2 className="font-bold text-lg text-gray-800">Filters</h2>
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-green-600 cursor-pointer"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            className="w-full mb-4 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
            onClick={handleClearFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        )}

        {/* ---------------- Search Option ---------------- */}
        <div className="relative w-full mb-3">
          <Input
            type="text"
            placeholder="Search Product..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearch(e.target.value); // apply search immediately without Enter
            }}
            className="w-full rounded-md pl-3 pr-12 focus-visible:ring-green-500 bg-white"
          />
          <Button
            variant="default"
            className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-[#3BB77E] hover:bg-[#32a56f] text-white rounded-full p-2 cursor-pointer"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Active Search Tag */}
        {filters.search && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-500">Searching:</span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">
              &quot;{filters.search}&quot;
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                }}
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}

        {/* ---------------- Product Categories ---------------- */}
        <div>
          <SectionHeader
            title="Product Categories"
            isOpen={catOpen}
            toggle={() => setCatOpen(!catOpen)}
          />
          <div
            className={`transition-all duration-300 overflow-hidden pb-3 ${
              catOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-500 mt-3">No categories found</p>
            ) : (
              <ul className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-2">
                {categories.map((category) => {
                  const isChecked = filters.categories.includes(category.slug);
                  return (
                    <li key={category._id}>
                      <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition-colors">
                        <Checkbox
                          id={`category-${category._id}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleCategory(category.slug)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <span className={isChecked ? "text-green-700 font-medium" : ""}>
                          {category.name}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <hr className="mt-3 border-green-200" />

        {/* ---------------- Product Type Filter ---------------- */}
        <div>
          <SectionHeader
            title="Product Type"
            isOpen={productTypeOpen}
            toggle={() => setProductTypeOpen(!productTypeOpen)}
          />
          <div
            className={`transition-all duration-300 overflow-hidden pb-3 ${
              productTypeOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 mt-3">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition-colors">
                <input
                  type="radio"
                  name="productType"
                  value="all"
                  checked={filters.productType === "all"}
                  onChange={(e) => setProductType(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className={filters.productType === "all" ? "text-green-700 font-medium" : ""}>
                  All Products
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition-colors">
                <input
                  type="radio"
                  name="productType"
                  value="best-selling"
                  checked={filters.productType === "best-selling"}
                  onChange={(e) => setProductType(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className={filters.productType === "best-selling" ? "text-green-700 font-medium" : ""}>
                  Best Selling
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition-colors">
                <input
                  type="radio"
                  name="productType"
                  value="deal-of-day"
                  checked={filters.productType === "deal-of-day"}
                  onChange={(e) => setProductType(e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className={filters.productType === "deal-of-day" ? "text-green-700 font-medium" : ""}>
                  Deal of the Day
                </span>
              </label>
            </div>
          </div>
        </div>

        <hr className="mt-3 border-green-200" />

        {/* ---------------- Price Filter ---------------- */}
        <div>
          <SectionHeader
            title="Filter By Price"
            isOpen={priceOpen}
            toggle={() => setPriceOpen(!priceOpen)}
          />

          <div
            className={`transition-all duration-300 overflow-hidden ${
              priceOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="my-4">
              <Slider
                value={priceRange}
                min={0}
                max={10000}
                step={100}
                className="w-full"
                onValueChange={(value) => setPriceRange(value)}
              />
            </div>

            <div className="flex justify-between items-center text-sm mb-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Min:</span>
                <span className="font-semibold text-green-700">৳{priceRange[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Max:</span>
                <span className="font-semibold text-green-700">৳{priceRange[1]}</span>
              </div>
            </div>

            <Button
              variant="default"
              className="w-full bg-[#3BB77E] hover:bg-[#32a56f] text-white cursor-pointer"
              onClick={handleApplyPriceFilter}
            >
              Apply Price Filter
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Summary (Mobile) */}
        {hasActiveFilters && (
          <div className="sm:hidden mt-4 pt-4 border-t border-green-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Search: {filters.search}
                </span>
              )}
              {filters.productType !== "all" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {filters.productType === "best-selling" ? "Best Selling" : "Deal of the Day"}
                </span>
              )}
              {filters.categories.length > 0 && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {filters.categories.length} categories
                </span>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ৳{filters.minPrice} - ৳{filters.maxPrice}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
