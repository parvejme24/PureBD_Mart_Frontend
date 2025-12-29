"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { HiOutlineClipboardCopy, HiCheckCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import { toast } from "sonner";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const formatAddress = (address) => {
  if (!address) return "N/A";
  const parts = [];
  if (address.detailsAddress) parts.push(address.detailsAddress);
  if (address.upazila) parts.push(address.upazila);
  if (address.district) parts.push(address.district);
  if (address.division) parts.push(address.division);
  if (address.postalCode) parts.push(address.postalCode);
  if (address.country) parts.push(address.country);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get order data from sessionStorage
    if (typeof window !== "undefined") {
      const storedOrder = sessionStorage.getItem("lastOrder");
      if (storedOrder) {
        try {
          const order = JSON.parse(storedOrder);
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setOrderData(order);
            // Clear sessionStorage after reading
            sessionStorage.removeItem("lastOrder");
          }, 0);
        } catch (error) {
          console.error("Error parsing order data:", error);
        }
      }
    }
  }, []);

  const copyOrderId = () => {
    const idToCopy = orderId || orderData?._id || orderData?.id;
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      toast.success("Order ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-4"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-[#3BB77E]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center"
        >
          Order Placed Successfully!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 mb-6 text-center"
        >
          Thank you for your order! We&apos;ve received your order and will
          begin processing it soon.
        </motion.p>

        {/* Order Details Card */}
        {(orderId || orderData) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="bg-white border rounded-lg p-4 sm:p-5 mb-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4 pb-3 border-b">
              Order Details
            </h2>

            <div className="space-y-3">
              {/* Order ID */}
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-600">
                  Order ID
                </span>
                <div className="flex items-center">
                  <code className="text-xs font-bold text-[#3BB77E] bg-gray-50 px-2 py-1 rounded border break-all">
                    {orderId || orderData?._id || orderData?.id || "N/A"}
                  </code>
                  <motion.button
                    onClick={copyOrderId}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-1.5 rounded transition-all cursor-pointer shrink-0 ${
                      copied
                        ? "text-green-600"
                        : "text-gray-400 hover:text-[#3BB77E] hover:bg-gray-100"
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

              {/* Total Payable */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Payable
                </span>
                <span className="text-lg font-bold text-[#3BB77E]">
                  ৳
                  {orderData?.total?.toFixed?.(2) || orderData?.total || "0.00"}
                </span>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Payment Method
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {orderData?.paymentMethod || "COD"}
                </span>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Shipping Address
                  </span>
                </div>
                <p className="text-sm text-gray-700 wrap-break-word">
                  {orderData?.customer?.address
                    ? formatAddress(orderData.customer.address)
                    : "N/A"}
                </p>
              </div>

              {/* Order Date */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Order Date
                </span>
                <span className="text-sm text-gray-700 wrap-break-word text-right">
                  {orderData?.createdAt
                    ? formatDate(orderData.createdAt)
                    : orderData?.date
                    ? formatDate(orderData.date)
                    : formatDate(new Date().toISOString())}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            asChild
            variant="outline"
            className="flex-1 h-11 text-sm font-medium"
          >
            <Link href="/" className="flex items-center justify-center">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-[#3BB77E] hover:bg-[#2a9c66] h-11 text-sm font-medium"
          >
            <Link href="/shop" className="flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="bg-white border rounded-lg p-4 sm:p-5 mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-11 bg-gray-200 rounded flex-1"></div>
              <div className="h-11 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
