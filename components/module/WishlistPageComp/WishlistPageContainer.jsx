"use client";

import React from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function WishlistPageContainer() {
  const { wishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Remove from wishlist after adding to cart
    removeFromWishlist(product._id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Wishlist is Empty
          </h1>
          <p className="text-gray-600 mb-8">
            Start adding your favorite products to your wishlist to keep track
            of items you&apos;re interested in.
          </p>
          <Link href="/shop">
            <Button className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer px-8 py-3">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} items in your wishlist</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="text-red-600 cursor-pointer border-red-300 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Wishlist Items - Responsive Row Layout */}
      <div className="space-y-4">
        {wishlist.map((item) => (
          <Card
            key={item.productId}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative w-full sm:w-24 h-48 sm:h-24 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image?.url || item.image || "/placeholder-product.png"}
                    alt={item.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#3BB77E] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                      <div className="text-lg font-bold text-[#3BB77E]">
                        ৳{item.price}
                      </div>
                    </div>

                    {/* Action Buttons - Responsive */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                      <Button
                        onClick={() =>
                          toggleWishlist({ _id: item.productId, name: item.name })
                        }
                        size="sm"
                        className="bg-red-400 hover:bg-red-500 cursor-pointer text-white px-4 py-2"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        Remove
                      </Button>

                      <Button
                        onClick={() =>
                          handleAddToCart({
                            _id: item.productId,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          })
                        }
                        size="sm"
                        className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer px-4 py-2"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>

                      <Link href={`/shop/${item.slug || item.productId}`}>
                        <Button variant="outline" size="sm" className="px-4 py-2 cursor-pointer">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 text-center">
        <Link href="/shop">
          <Button className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer px-8 py-3">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}