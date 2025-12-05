"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { incrementProductView } from "@/lib/dashboard";

// Key for storing viewed products in localStorage
const VIEWED_PRODUCTS_KEY = "viewed_products";
const VIEW_EXPIRY_HOURS = 24; // Don't count same product view within 24 hours

// Get viewed products from localStorage
const getViewedProducts = () => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save viewed products to localStorage
const saveViewedProducts = (viewed) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewed));
};

// Check if product was recently viewed
const wasRecentlyViewed = (productId) => {
  const viewed = getViewedProducts();
  const viewedTime = viewed[productId];
  
  if (!viewedTime) return false;
  
  const hoursSinceView = (Date.now() - viewedTime) / (1000 * 60 * 60);
  return hoursSinceView < VIEW_EXPIRY_HOURS;
};

// Mark product as viewed
const markAsViewed = (productId) => {
  const viewed = getViewedProducts();
  viewed[productId] = Date.now();
  
  // Clean up old entries (older than 7 days)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  Object.keys(viewed).forEach((key) => {
    if (viewed[key] < sevenDaysAgo) {
      delete viewed[key];
    }
  });
  
  saveViewedProducts(viewed);
};

/**
 * Hook to track product views
 * Call this hook on your product detail page
 * 
 * @param {string} productId - The product ID to track
 * @param {boolean} enabled - Whether to enable tracking (default: true)
 */
export function useProductView(productId, enabled = true) {
  const { mutate: trackView } = useMutation({
    mutationFn: incrementProductView,
    onError: (error) => {
      console.error("Failed to track product view:", error);
    },
  });

  useEffect(() => {
    // Don't track if disabled or no productId
    if (!enabled || !productId) return;

    // Don't track if recently viewed
    if (wasRecentlyViewed(productId)) return;

    // Track the view
    trackView(productId);
    
    // Mark as viewed locally
    markAsViewed(productId);
  }, [productId, enabled, trackView]);
}

/**
 * Hook to manually track a view (e.g., on button click)
 */
export function useTrackProductView() {
  const { mutate: trackView, isPending } = useMutation({
    mutationFn: incrementProductView,
  });

  const track = (productId) => {
    if (!productId || wasRecentlyViewed(productId)) return;
    
    trackView(productId);
    markAsViewed(productId);
  };

  return { track, isPending };
}

