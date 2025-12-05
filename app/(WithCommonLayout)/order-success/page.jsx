"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, Home, Copy, Package } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-14 w-14 text-[#3BB77E]" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
        >
          Order Placed Successfully!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-6"
        >
          Thank you for your order! We&apos;ve received your order and will
          begin processing it soon. You will receive an email confirmation
          shortly.
        </motion.p>

        {/* Order ID */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="w-full mb-6"
          >
            <div className="bg-[#3BB77E]/10 border border-[#3BB77E]/30 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-5 w-5 text-[#3BB77E]" />
                <span className="text-sm font-medium text-gray-600">Order ID</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-bold text-[#3BB77E] bg-white px-3 py-1 rounded">
                  {orderId}
                </code>
                <button
                  onClick={copyOrderId}
                  className="p-2 hover:bg-[#3BB77E]/20 rounded-lg transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  <Copy className="h-4 w-4 text-[#3BB77E]" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Save this ID to track your order
              </p>
            </div>
          </motion.div>
        )}

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-lg p-6 w-full mb-8"
        >
          <p className="text-sm text-gray-500 mb-2">What&apos;s Next?</p>
          <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#3BB77E] font-bold">1.</span>
              <span>You&apos;ll receive an order confirmation email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3BB77E] font-bold">2.</span>
              <span>We&apos;ll prepare your items for shipping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#3BB77E] font-bold">3.</span>
              <span>Your order will be delivered within 3-5 business days</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full"
        >
          <Button
            asChild
            variant="outline"
            className="flex-1 cursor-pointer"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
          >
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

