"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

// Status options for filter
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// Payment method options for filter
const PAYMENT_OPTIONS = [
  { value: "all", label: "All Payment Methods" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "ShurjoPay", label: "ShurjoPay" },
];

export default function OrderFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  paymentFilter,
  setPaymentFilter,
  hasActiveFilters,
  clearFilters,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Filter */}
        <div className="flex-1">
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="bg-white w-full">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter by Payment" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span>
            Showing {filteredCount} of {totalCount} orders
          </span>
          {searchQuery && (
            <span className="px-2 py-1 bg-white rounded-full text-xs border">
              Search: &quot;{searchQuery}&quot;
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="px-2 py-1 bg-white rounded-full text-xs border capitalize">
              Status: {statusFilter}
            </span>
          )}
          {paymentFilter !== "all" && (
            <span className="px-2 py-1 bg-white rounded-full text-xs border">
              Payment: {paymentFilter}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

