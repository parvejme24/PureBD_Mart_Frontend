"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    isLoaded,
    cartTotal,
    cartCount,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Button asChild className="bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer">
            <Link href="/shop">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-1">
            {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.slug || item.productId}`}
                  className="font-semibold text-gray-800 hover:text-[#3BB77E] transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-[#3BB77E] font-bold text-lg mt-1">
                  ৳{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => decrementQuantity(item.productId)}
                      disabled={item.qty <= 1}
                      className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.productId)}
                      className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-sm text-gray-500">
                    Subtotal:{" "}
                    <span className="font-semibold text-gray-800">
                      ৳{(item.price * item.qty).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.productId)}
                className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[#3BB77E] hover:text-[#2a9c66] font-medium mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 border-b pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between py-4 border-b">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-[#3BB77E]">
                ৳{cartTotal.toFixed(2)}
              </span>
            </div>

            <Button
              asChild
              className="w-full mt-6 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer h-12 text-lg"
            >
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            {/* Payment Methods */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 mb-2">We accept</p>
              <div className="flex justify-center gap-2 text-gray-400 text-sm">
                <span className="px-2 py-1 border rounded">COD</span>
                <span className="px-2 py-1 border rounded">bKash</span>
                <span className="px-2 py-1 border rounded">Nagad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










