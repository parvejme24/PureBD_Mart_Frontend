"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, FileText, User, Package, MapPin, Calendar, CreditCard, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineClipboardCopy, HiCheckCircle } from "react-icons/hi";
import { formatAddress, formatDate, getStatusColor } from "./orderUtils";

export default function OrderInvoiceModal({
  open,
  onOpenChange,
  order,
  onDownloadInvoice,
}) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  // Calculate order subtotal
  const getOrderSubtotal = () => {
    return order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;
  };

  const copyOrderId = () => {
    const orderId = order._id?.slice(-8).toUpperCase() || "";
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Section */}
              <DialogHeader className="bg-gradient-to-r from-[#3BB77E] to-[#2a9c66] text-white p-6 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                    >
                      <FileText className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <DialogTitle className="text-2xl font-bold">
                        PureBD Mart
                      </DialogTitle>
                      <p className="text-sm text-white/90">
                        Quality Products, Trusted Service
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">INVOICE</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-white/20 px-2 py-1 rounded">
                        #{order._id?.slice(-8).toUpperCase()}
                      </code>
                      <motion.button
                        onClick={copyOrderId}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-1.5 rounded transition-all ${
                          copied
                            ? "text-green-200"
                            : "text-white hover:bg-white/20"
                        }`}
                        title="Copy Order ID"
                      >
                        {copied ? (
                          <HiCheckCircle className="h-4 w-4" />
                        ) : (
                          <HiOutlineClipboardCopy className="h-4 w-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6">

                {/* Order Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order Status</p>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Customer Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#3BB77E] p-2 rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Customer Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Name
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.customer?.name || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Payment Method
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order.paymentMethod || "COD"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">
                        {order.customer?.phone || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800 break-words">
                        {order.customer?.email || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Shipping Address
                      </p>
                      <p className="font-semibold text-gray-800 break-words">
                        {formatAddress(order.customer?.address)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Products Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#3BB77E] p-2 rounded-lg">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Order Items
                    </h3>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-[#3BB77E] to-[#2a9c66] text-white">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">#</th>
                            <th className="px-4 py-3 text-left font-semibold">Product</th>
                            <th className="px-4 py-3 text-center font-semibold">Qty</th>
                            <th className="px-4 py-3 text-right font-semibold">Price</th>
                            <th className="px-4 py-3 text-right font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items?.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 + index * 0.05 }}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } hover:bg-[#3BB77E]/5 transition-colors`}
                            >
                              <td className="px-4 py-3 font-medium text-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-800">
                                {item.title || item.product?.name || "Product"}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="bg-[#3BB77E]/10 text-[#3BB77E] px-2 py-1 rounded font-medium">
                                  {item.qty}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-gray-700">
                                ৳{item.price?.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-[#3BB77E]">
                                ৳{(item.price * item.qty).toFixed(2)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>

                {/* Totals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-end"
                >
                  <div className="w-full md:w-80 bg-gradient-to-br from-[#3BB77E]/10 to-[#2a9c66]/10 border-2 border-[#3BB77E]/20 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        ৳{getOrderSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="text-[#3BB77E] font-bold">FREE</span>
                    </div>
                    <div className="border-t-2 border-[#3BB77E]/30 pt-3 flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-800">
                        Total Payable
                      </span>
                      <span className="font-bold text-2xl text-[#3BB77E]">
                        ৳{(order.total || getOrderSubtotal()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="border-t border-gray-200 pt-4 text-center space-y-1"
                >
                  <p className="font-semibold text-gray-700">
                    Thank you for shopping with PureBD Mart! 🎉
                  </p>
                  <p className="text-sm text-gray-500">
                    For any queries, contact us at support@purebdmart.com
                  </p>
                </motion.div>
              </div>

              {/* Footer Actions */}
              <DialogFooter className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex gap-3 w-full md:w-auto"
                >
                  <Button
                    variant="outline"
                    onClick={() => onDownloadInvoice(order)}
                    className="cursor-pointer flex-1 md:flex-none hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] transition-all duration-200 group"
                  >
                    <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => onOpenChange(false)}
                    className="cursor-pointer bg-[#3BB77E] hover:bg-[#2a9c66] flex-1 md:flex-none transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Close
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

