"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  XCircle,
  ShoppingCart,
  ArrowLeft,
  RefreshCw,
  Home,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import { Suspense } from "react";

// Common failure reasons
const FAILURE_REASONS = {
  missing_order_id: "Transaction reference was not found.",
  verification_error: "Unable to verify your payment with the payment gateway.",
  server_error: "A server error occurred. Please try again.",
  cancelled: "You cancelled the payment.",
  insufficient_balance: "Insufficient balance in your account.",
  timeout: "Payment session timed out. Please try again.",
};

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const reason = searchParams.get("reason");

  const failureMessage =
    FAILURE_REASONS[reason] ||
    reason ||
    "Your payment could not be processed. Please try again.";

  return (
    <div className="min-h-[60vh] py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Error Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-75"></div>
            <div className="relative bg-red-100 p-6 rounded-full">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            We couldn&apos;t process your payment. Don&apos;t worry, your cart items are
            still saved.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                What went wrong?
              </h3>
              <p className="text-sm text-red-700">{failureMessage}</p>
            </div>
          </div>

          {transactionId && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Transaction Reference</p>
              <p className="font-mono text-sm font-medium text-gray-800">
                {transactionId}
              </p>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Suggestions
          </h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Check your account balance and try again</li>
            <li>• Use a different payment method</li>
            <li>• Ensure your card/mobile banking is active</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full h-12 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
          >
            <Link href="/checkout" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="h-12 cursor-pointer">
              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 cursor-pointer">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-[#3BB77E] hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="animate-pulse">
            <div className="text-center mb-8">
              <div className="bg-gray-200 p-6 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
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
      <PaymentFailedContent />
    </Suspense>
  );
}

