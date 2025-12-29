"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { usePaymentStatus, useVerifyPayment } from "@/hooks/usePayment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Loader2,
  Home,
  Receipt,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  const { clearCart } = useCart();
  const { mutate: verifyPayment } = useVerifyPayment();
  const { data: paymentData, isLoading } = usePaymentStatus(transactionId);

  const [copied, setCopied] = useState(false);
  const [hasCleared, setHasCleared] = useState(false);

  // Verify payment on mount
  useEffect(() => {
    if (transactionId) {
      verifyPayment(transactionId);
    }
  }, [transactionId, verifyPayment]);

  // Clear cart once payment is confirmed
  useEffect(() => {
    if (paymentData?.order?.paymentStatus === "paid" && !hasCleared) {
      clearCart();
      setHasCleared(true);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [paymentData, hasCleared, clearCart]);

  const handleCopyOrderId = () => {
    const id = orderId || paymentData?.order?._id;
    if (id) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("Order ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#3BB77E] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  const order = paymentData?.order;
  const displayOrderId = orderId || order?._id;

  return (
    <div className="min-h-[60vh] py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-100 p-6 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#3BB77E]" />
            Order Details
          </h2>

          <div className="space-y-3">
            {/* Order ID */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-medium text-gray-800">
                  {displayOrderId?.slice(0, 20)}
                  {displayOrderId?.length > 20 ? "..." : ""}
                </p>
              </div>
              <button
                onClick={handleCopyOrderId}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>

            {/* Transaction ID */}
            {transactionId && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="font-mono text-sm font-medium text-gray-800">
                    {transactionId}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Status */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="font-semibold text-green-600">Paid</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            {/* Total Amount */}
            {order?.total && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-semibold text-gray-800">
                    ৳{order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">What&apos;s Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• Your order will be processed within 24 hours</li>
            <li>• Track your order status from your dashboard</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            asChild
            variant="outline"
            className="h-12 cursor-pointer"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            className="h-12 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
          >
            <Link href="/dashboard/my-orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              View Orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

