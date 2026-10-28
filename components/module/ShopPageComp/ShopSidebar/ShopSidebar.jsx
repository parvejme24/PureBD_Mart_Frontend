"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  X,
  RotateCcw,
  Loader2,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Zap,
  Tag,
  LayoutGrid,
} from "lucide-react";
import React, { useState } from "react";
import { useCategories } from "@/hooks/useCategory";
import { useShopFilter } from "@/hooks/useShopFilter";

// Collapsible section component
const SectionHeader = ({ title, icon: Icon, isOpen, toggle, badge }) => (
  <button
    onClick={toggle}
    className="w-full flex justify-between items-center py-3 text-left group cursor-pointer"
  >
    <div className="flex items-center gap-2.5">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
          <Icon className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      )}
      <span className="font-bold text-sm text-gray-800 group-hover:text-emerald-700 transition-colors">
        {title}
      </span>
      {badge && (
        <span className="text-[10px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </div>
    <div className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </div>
  </button>
);

const PRODUCT_TYPES = [
  { value: "all", label: "All Products", icon: LayoutGrid },
  { value: "best-selling", label: "Best Selling", icon: TrendingUp },
  { value: "deal-of-day", label: "Deal of the Day", icon: Zap },
];

export default function ShopSidebar() {
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [productTypeOpen, setProductTypeOpen] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    filters,
    setSearch,
    toggleCategory,
    setPriceRange: applyPriceFilter,
    setProductType,
    clearFilters,
    hasActiveFilters,
  } = useShopFilter();

  const [searchInput, setSearchInput] = useState(() => filters.search || "");
  const [priceRange, setPriceRange] = useState(() => [
    filters.minPrice ?? 0,
    filters.maxPrice ?? 10000,
  ]);

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData?.categories || [];

  const handleSearch = (e) => {
    e?.preventDefault();
    setSearch(searchInput);
  };

  const handleApplyPriceFilter = () => {
    applyPriceFilter(priceRange[0], priceRange[1]);
    setShowSidebar(false);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setPriceRange([0, 10000]);
    setProductType("all");
    clearFilters();
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    (filters.productType !== "all" ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 10000 ? 1 : 0);

  const SidebarContent = () => (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <h2 className="font-black text-gray-900 text-base tracking-tight">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="text-[10px] font-black bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-red-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-2">
        <form onSubmit={handleSearch} className="relative group">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearch(e.target.value);
            }}
            className="w-full pr-10 pl-4 h-10 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-emerald-400 focus-visible:border-emerald-400 placeholder:text-gray-400 text-sm font-medium transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </form>

        {filters.search && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              <Search className="w-2.5 h-2.5" />
              &quot;{filters.search}&quot;
              <button
                onClick={() => { setSearchInput(""); setSearch(""); }}
                className="hover:text-red-500 cursor-pointer ml-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Product Type */}
      <div>
        <SectionHeader
          title="Product Type"
          icon={Tag}
          isOpen={productTypeOpen}
          toggle={() => setProductTypeOpen(!productTypeOpen)}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            productTypeOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-3 space-y-1.5">
            {PRODUCT_TYPES.map(({ value, label, icon: Icon }) => {
              const isSelected = filters.productType === value;
              return (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-transparent border-transparent hover:bg-gray-50 text-gray-600 hover:border-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="productType"
                    value={value}
                    checked={isSelected}
                    onChange={(e) => setProductType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-emerald-600" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${isSelected ? "text-emerald-800" : ""}`}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Categories */}
      <div>
        <SectionHeader
          title="Categories"
          icon={LayoutGrid}
          isOpen={catOpen}
          toggle={() => setCatOpen(!catOpen)}
          badge={filters.categories.length > 0 ? filters.categories.length : null}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            catOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-3">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400 py-3 text-center">No categories found</p>
            ) : (
              <ul className="space-y-0.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                {categories.map((category) => {
                  const isChecked = filters.categories.includes(category.slug);
                  return (
                    <li key={category._id}>
                      <label
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-150 ${
                          isChecked
                            ? "bg-emerald-50 text-emerald-800"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <Checkbox
                          id={`category-${category._id}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleCategory(category.slug)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded-md"
                        />
                        <span className={`text-sm font-medium leading-none ${isChecked ? "font-bold text-emerald-800" : ""}`}>
                          {category.name}
                        </span>
                        {isChecked && (
                          <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-1" />

      {/* Price Filter */}
      <div>
        <SectionHeader
          title="Price Range"
          icon={Sparkles}
          isOpen={priceOpen}
          toggle={() => setPriceOpen(!priceOpen)}
        />
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            priceOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-3 space-y-4">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Min</p>
                <p className="text-sm font-black text-emerald-800">৳{priceRange[0]}</p>
              </div>
              <div className="text-gray-300 font-bold">—</div>
              <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">Max</p>
                <p className="text-sm font-black text-emerald-800">৳{priceRange[1]}</p>
              </div>
            </div>

            <Slider
              value={priceRange}
              min={0}
              max={10000}
              step={100}
              className="w-full"
              onValueChange={(value) => setPriceRange(value)}
            />

            <div className="flex justify-between text-xs text-gray-400 font-medium -mt-2">
              <span>৳0</span>
              <span>৳10,000</span>
            </div>

            <Button
              variant="default"
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-9 shadow-sm hover:shadow-emerald-500/30 transition-all cursor-pointer"
              onClick={handleApplyPriceFilter}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter FAB */}
      <button
        className="sm:hidden fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl py-3 px-5 shadow-xl shadow-emerald-600/30 font-bold text-sm transition-all cursor-pointer"
        onClick={() => setShowSidebar(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-white text-emerald-700 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm sm:hidden transition-all duration-300 z-40 ${
          showSidebar ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setShowSidebar(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 sm:hidden overflow-y-auto`}
        style={{ transform: showSidebar ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <h2 className="font-black text-gray-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-black bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-[280px] lg:w-[300px] shrink-0 self-start sticky top-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}
