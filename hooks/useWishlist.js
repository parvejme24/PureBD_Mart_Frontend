"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const WISHLIST_KEY = "wishlist";

// Get wishlist from localStorage
const getStoredWishlist = () => {
  if (typeof window === "undefined") return [];
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlist = (wishlist) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    setWishlist(getStoredWishlist());
    setIsLoaded(true);
  }, []);

  // Listen for wishlist updates from other components
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setWishlist(getStoredWishlist());
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.productId === productId);
  }, [wishlist]);

  // Add to wishlist
  const addToWishlist = useCallback((product) => {
    const currentWishlist = getStoredWishlist();
    const existingItem = currentWishlist.find((item) => item.productId === product._id);

    if (!existingItem) {
      const newItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        addedAt: new Date().toISOString(),
      };

      const newWishlist = [...currentWishlist, newItem];
      saveWishlist(newWishlist);
      setWishlist(newWishlist);
      toast.success(`${product.name} added to wishlist`);
    } else {
      toast.info(`${product.name} is already in wishlist`);
    }
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId) => {
    const currentWishlist = getStoredWishlist();
    const item = currentWishlist.find((item) => item.productId === productId);
    const newWishlist = currentWishlist.filter((item) => item.productId !== productId);

    saveWishlist(newWishlist);
    setWishlist(newWishlist);

    if (item) {
      toast.success(`${item.name} removed from wishlist`);
    }
  }, []);

  // Toggle wishlist (add if not present, remove if present)
  const toggleWishlist = useCallback((product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  // Clear entire wishlist
  const clearWishlist = useCallback(() => {
    saveWishlist([]);
    setWishlist([]);
    toast.success("Wishlist cleared");
  }, []);

  return {
    wishlist,
    isLoaded,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };
}
