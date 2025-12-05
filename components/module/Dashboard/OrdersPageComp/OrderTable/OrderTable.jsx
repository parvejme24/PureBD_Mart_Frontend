"use client";

import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrder";
import { Loader2, Trash2, Eye, Download, RefreshCw, Search, Filter, X } from "lucide-react";
import { loadBanglaFont, containsBangla } from "@/lib/banglaFont";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format address object to string
const formatAddress = (address) => {
  if (!address) return "N/A";
  if (typeof address === "string") return address;
  
  const parts = [
    address.detailsAddress,
    address.upazila,
    address.district,
    address.division,
    address.postalCode ? `Postal: ${address.postalCode}` : "",
    address.country,
  ].filter(Boolean);
  
  return parts.join(", ") || "N/A";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Shipping charge (you can make this dynamic)
const SHIPPING_CHARGE = 0; // Free shipping

// Status options for filter
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// Payment options for filter
const PAYMENT_OPTIONS = [
  { value: "all", label: "All Payments" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "bKash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
];

export default function OrdersTable() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Fetch orders from API
  const { data: ordersData, isLoading, error, refetch } = useOrders();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  const orders = ordersData?.orders || [];

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter (name, email, phone)
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = searchLower === "" || 
        (order.customer?.name?.toLowerCase().includes(searchLower)) ||
        (order.customer?.email?.toLowerCase().includes(searchLower)) ||
        (order.customer?.phone?.includes(searchQuery.trim()));

      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;

      // Payment filter
      const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || paymentFilter !== "all";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId, {
      onSuccess: () => setDeleteConfirmId(null),
    });
  };

  // Generate Professional Invoice PDF with Bangla support
  const handleDownloadInvoice = async (order) => {
    // Calculate dynamic page height based on content
    const itemCount = order.items?.length || 0;
    const addressText = formatAddress(order.customer?.address);
    
    // Estimate address lines (roughly 60 chars per line)
    const estimatedAddressLines = Math.ceil(addressText.length / 60);
    
    // Calculate heights for each section
    const headerHeight = 40;
    const orderInfoHeight = 30;
    const customerBaseHeight = 55;
    const customerAddressExtra = Math.max(0, (estimatedAddressLines - 1) * 5);
    const tableHeaderHeight = 25;
    const tableRowHeight = 10;
    const tableContentHeight = itemCount * tableRowHeight;
    const totalsHeight = 50;
    const footerHeight = 40;
    const padding = 30;
    
    // Total dynamic height
    const dynamicHeight = headerHeight + orderInfoHeight + customerBaseHeight + 
                          customerAddressExtra + tableHeaderHeight + tableContentHeight + 
                          totalsHeight + footerHeight + padding;
    
    // Minimum height of 250 (roughly A5), maximum reasonable height
    const pageHeight = Math.max(250, Math.min(dynamicHeight, 500));
    
    // Create PDF with custom dimensions (width: 210mm for A4 width, dynamic height)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, pageHeight]
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Load and register Bangla font if needed
    let hasBanglaFont = false;
    const customerName = order.customer?.name || "";
    const productNames = order.items?.map(item => item.title || item.product?.name || "") || [];
    const allText = [customerName, addressText, ...productNames].join(" ");
    
    if (containsBangla(allText)) {
      try {
        const fontBase64 = await loadBanglaFont();
        if (fontBase64) {
          doc.addFileToVFS('NotoSansBengali-Regular.ttf', fontBase64);
          doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
          hasBanglaFont = true;
        }
      } catch (error) {
        console.error('Error loading Bangla font:', error);
      }
    }
    
    // Helper function to set smart font based on text content
    const setFont = (text, style = 'normal') => {
      if (hasBanglaFont && containsBangla(text)) {
        doc.setFont('NotoSansBengali', 'normal');
      } else {
        doc.setFont('helvetica', style);
      }
    };
    
    // Colors
    const primaryColor = [59, 183, 126]; // #3BB77E
    const darkColor = [31, 41, 55]; // Dark gray
    const lightGray = [156, 163, 175];
    const bgGray = [249, 250, 251];

    // Calculate totals
    const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
    const shipping = SHIPPING_CHARGE;
    const total = order.total || subtotal + shipping;

    let y = 15;

    // ===== HEADER SECTION =====
    // Company Name / Logo
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("PureBD Mart", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Quality Products, Trusted Service", 20, 33);

    // Invoice Title on right
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 20, 25, { align: "right" });
    
    y = 55;

    // ===== ORDER INFO SECTION =====
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Order ID:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primaryColor);
    doc.text(`#${order._id?.slice(-8).toUpperCase() || "N/A"}`, 50, y);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("Date:", pageWidth - 70, y);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(order.createdAt), pageWidth - 55, y);

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Status:", 20, y);
    doc.setFont("helvetica", "normal");
    const statusText = order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending";
    doc.setTextColor(...primaryColor);
    doc.text(statusText, 50, y);

    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "bold");
    doc.text("Payment:", pageWidth - 70, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.paymentMethod || "COD", pageWidth - 55, y);

    y += 15;

    // ===== CUSTOMER DETAILS SECTION =====
    // Calculate address lines to determine box height (reuse addressText from above)
    const addressMaxWidth = pageWidth - 70; // Width for address text
    const addressLines = doc.splitTextToSize(addressText, addressMaxWidth);
    const addressHeight = addressLines.length * 5; // 5 points per line
    
    // Dynamic box height based on address length
    const baseBoxHeight = 50;
    const extraAddressHeight = Math.max(0, addressHeight - 5); // Extra height if address > 1 line
    const customerBoxHeight = baseBoxHeight + extraAddressHeight;

    // Background box with dynamic height
    doc.setFillColor(...bgGray);
    doc.roundedRect(15, y - 5, pageWidth - 30, customerBoxHeight, 3, 3, "F");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 20, y + 5);

    y += 15;
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    
    // Left column
    doc.setFont("helvetica", "bold");
    doc.text("Name:", 20, y);
    const customerNameText = order.customer?.name || "N/A";
    setFont(customerNameText);
    doc.text(customerNameText, 45, y);

    doc.setFont("helvetica", "bold");
    doc.text("Email:", 20, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(order.customer?.email || "N/A", 45, y + 8);

    // Right column
    doc.setFont("helvetica", "bold");
    doc.text("Phone:", 110, y);
    doc.setFont("helvetica", "normal");
    doc.text(order.customer?.phone || "N/A", 135, y);

    // Address (full width with multi-line support)
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Address:", 20, y);
    setFont(addressText);
    
    // Draw each line of address
    addressLines.forEach((line, index) => {
      doc.text(line, 20, y + 6 + (index * 5));
    });

    // Move y position based on number of address lines
    y += 10 + (addressLines.length * 5);

    // ===== PRODUCTS TABLE =====
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Items", 20, y);

    y += 8;

    // Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(15, y, pageWidth - 30, 10, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("#", 20, y + 7);
    doc.text("Product Name", 30, y + 7);
    doc.text("Qty", 120, y + 7);
    doc.text("Unit Price", 140, y + 7);
    doc.text("Total", pageWidth - 25, y + 7, { align: "right" });

    y += 12;

    // Table Body
    doc.setTextColor(...darkColor);
    doc.setFont("helvetica", "normal");

    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        const isEven = index % 2 === 0;
        if (isEven) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, y - 2, pageWidth - 30, 10, "F");
        }

        const productName = item.title || item.product?.name || "Product";
        const truncatedName = productName.length > 40 ? productName.substring(0, 40) + "..." : productName;
        const itemTotal = item.price * item.qty;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(String(index + 1), 20, y + 5);
        
        // Use Bangla font for product name if it contains Bangla text
        setFont(productName);
        doc.text(truncatedName, 30, y + 5);
        
        doc.setFont("helvetica", "normal");
        doc.text(String(item.qty), 122, y + 5);
        doc.text(`৳${item.price.toFixed(2)}`, 140, y + 5);
        doc.setFont("helvetica", "bold");
        doc.text(`৳${itemTotal.toFixed(2)}`, pageWidth - 25, y + 5, { align: "right" });
        doc.setFont("helvetica", "normal");

        y += 10;
      });
    }

    // Table bottom line
    doc.setDrawColor(...lightGray);
    doc.line(15, y, pageWidth - 15, y);

    y += 10;

    // ===== TOTALS SECTION =====
    const totalsX = pageWidth - 80;

    // Subtotal
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text("Subtotal:", totalsX, y);
    doc.text(`৳${subtotal.toFixed(2)}`, pageWidth - 25, y, { align: "right" });

    y += 8;

    // Shipping
    doc.text("Shipping:", totalsX, y);
    if (shipping === 0) {
      doc.setTextColor(...primaryColor);
      doc.text("FREE", pageWidth - 25, y, { align: "right" });
    } else {
      doc.text(`৳${shipping.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
    }

    y += 3;
    doc.setDrawColor(...lightGray);
    doc.line(totalsX - 5, y, pageWidth - 15, y);

    y += 10;

    // Total Payable
    doc.setFillColor(...primaryColor);
    doc.roundedRect(totalsX - 10, y - 6, 80, 14, 2, 2, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Total Payable:", totalsX, y + 3);
    doc.setFontSize(12);
    doc.text(`৳${total.toFixed(2)}`, pageWidth - 25, y + 3, { align: "right" });

    y += 25;

    // ===== FOOTER SECTION =====
    doc.setDrawColor(...lightGray);
    doc.line(15, y, pageWidth - 15, y);

    y += 10;

    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for shopping with PureBD Mart!", pageWidth / 2, y, { align: "center" });

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text("For any queries, contact us at support@purebdmart.com | +880 1XXX-XXXXXX", pageWidth / 2, y, { align: "center" });

    y += 5;
    doc.text("www.purebdmart.com", pageWidth / 2, y, { align: "center" });

    // Save the PDF
    doc.save(`PureBD_Mart_Invoice_${order._id?.slice(-8).toUpperCase() || "order"}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="p-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Filters Skeleton */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border overflow-hidden">
          {/* Table Header Skeleton */}
          <div className="bg-gray-50 p-3 border-b">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 border-b last:border-b-0">
              <div className="flex items-center gap-4">
                {/* Serial */}
                <Skeleton className="h-4 w-6" />
                {/* Customer Name */}
                <div className="w-28">
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Contact */}
                <div className="w-36 space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                {/* Address */}
                <div className="w-40">
                  <Skeleton className="h-4 w-full" />
                </div>
                {/* Items */}
                <Skeleton className="h-4 w-8" />
                {/* Total */}
                <Skeleton className="h-4 w-16" />
                {/* Payment */}
                <Skeleton className="h-4 w-16" />
                {/* Status */}
                <Skeleton className="h-8 w-28 rounded-md" />
                {/* Actions */}
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Failed to load orders</p>
        <Button onClick={() => refetch()} variant="outline" className="cursor-pointer">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  // Calculate order totals for modal
  const getOrderSubtotal = (order) => {
    return order.items?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters and Search Section */}
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
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-white rounded-full text-xs border">
                Search: "{searchQuery}"
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

      {/* No Results State */}
      {filteredOrders.length === 0 && hasActiveFilters && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border mb-4">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No orders match your filters</p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="cursor-pointer"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Orders Table */}
      {filteredOrders.length > 0 && (
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold w-[60px]">#</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Address</TableHead>
              <TableHead className="font-semibold">Items</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow key={order._id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-500">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {order.customer?.name || "N/A"}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{order.customer?.email || "N/A"}</p>
                    <p className="text-gray-500">{order.customer?.phone || "N/A"}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="text-sm text-gray-600 truncate" title={formatAddress(order.customer?.address)}>
                    {formatAddress(order.customer?.address)}
                  </p>
                </TableCell>
                <TableCell>{order.items?.length || 0}</TableCell>
                <TableCell className="font-semibold text-[#3BB77E]">
                  ৳{order.total || 0}
                </TableCell>
                <TableCell>
                  <span className="text-sm">{order.paymentMethod || "N/A"}</span>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order._id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className={`w-[130px] h-8 text-xs font-medium border ${getStatusColor(order.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewInvoice(order)}
                      className="h-8 px-2 cursor-pointer"
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(order)}
                      className="h-8 px-2 cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirmId(order._id)}
                      className="h-8 px-2 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete Order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Enhanced Invoice Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-[#3BB77E]">
                  PureBD Mart
                </DialogTitle>
                <p className="text-sm text-gray-500">Quality Products, Trusted Service</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">INVOICE</p>
                <p className="text-sm text-gray-500">#{selectedOrder?._id?.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Info */}
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Date: </span>
                  <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-[#3BB77E] mb-3">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.customer?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{selectedOrder.customer?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.customer?.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Method</p>
                    <p className="font-medium">{selectedOrder.paymentMethod || "COD"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Shipping Address</p>
                    <p className="font-medium">{formatAddress(selectedOrder.customer?.address)}</p>
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h3 className="font-semibold text-[#3BB77E] mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#3BB77E] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">
                            {item.title || item.product?.name || "Product"}
                          </td>
                          <td className="px-4 py-3 text-center">{item.qty}</td>
                          <td className="px-4 py-3 text-right">৳{item.price?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            ৳{(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>৳{getOrderSubtotal(selectedOrder).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-[#3BB77E] font-medium">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold text-gray-800">Total Payable</span>
                    <span className="font-bold text-xl text-[#3BB77E]">
                      ৳{(selectedOrder.total || getOrderSubtotal(selectedOrder)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 text-center text-sm text-gray-500">
                <p className="font-medium text-gray-700">Thank you for shopping with PureBD Mart!</p>
                <p>For any queries, contact us at support@purebdmart.com</p>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => handleDownloadInvoice(selectedOrder)}
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={() => setOpenModal(false)} 
              className="cursor-pointer bg-[#3BB77E] hover:bg-[#2a9c66]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete this order? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteOrder(deleteConfirmId)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
