"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders, useUpdateOrderStatus, useDeleteOrder } from "@/hooks/useOrder";
import { Trash2, Eye, Download, RefreshCw, Search } from "lucide-react";
import { motion } from "framer-motion";

import OrdersTableSkeleton from "./OrdersTableSkeleton";
import OrderFilters from "./OrderFilters";
import OrderInvoiceModal from "./OrderInvoiceModal";
import OrderDeleteModal from "./OrderDeleteModal";
import { formatAddress, getStatusColor, getPaymentStatusColor, generateInvoicePDF } from "./orderUtils";

export default function OrdersTable() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Fetch orders from API
  const { data: ordersData, isLoading, isFetching, error, refetch } = useOrders();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();

  // Memoize orders to prevent unnecessary re-renders
  const orders = useMemo(() => ordersData?.orders || [], [ordersData?.orders]);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        searchLower === "" ||
        order.customer?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.email?.toLowerCase().includes(searchLower) ||
        order.customer?.phone?.includes(searchQuery.trim());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || paymentFilter !== "all";

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

  const handleDeleteOrder = () => {
    if (deleteConfirmId) {
      deleteOrder(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const handleDownloadInvoice = async (order) => {
    await generateInvoicePDF(order);
  };

  // Loading state
  if (isLoading) {
    return <OrdersTableSkeleton />;
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

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isFetching}
          className="cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        filteredCount={filteredOrders.length}
        totalCount={orders.length}
      />

      {/* No Results State */}
      {filteredOrders.length === 0 && hasActiveFilters && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border mb-4">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No orders match your filters</p>
          <Button variant="outline" onClick={clearFilters} className="cursor-pointer">
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
                <TableHead className="font-semibold">Pay Status</TableHead>
                <TableHead className="font-semibold">Order Status</TableHead>
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
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={formatAddress(order.customer?.address)}
                    >
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
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "unpaid"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger
                        className={`w-[130px] h-8 text-xs font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
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
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewInvoice(order)}
                          className="h-8 px-2 cursor-pointer hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] transition-all duration-200 group"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        </Button>
                      </motion.div>
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

      {/* Invoice Modal */}
      <OrderInvoiceModal
        open={openModal}
        onOpenChange={setOpenModal}
        order={selectedOrder}
        onDownloadInvoice={handleDownloadInvoice}
      />

      {/* Delete Confirmation Modal */}
      <OrderDeleteModal
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteOrder}
        isDeleting={isDeleting}
      />
    </div>
  );
}

