"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const CART_KEY = "cart";

// Get cart from localStorage safely
const getStoredCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Failed to parse cart from localStorage:", e);
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  if (typeof window === "undefined") return;
  const safeCart = Array.isArray(cart) ? cart : [];
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(safeCart));
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("cartUpdated"));
};

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = getStoredCart();
    setCart(Array.isArray(stored) ? stored : []);
    setIsLoaded(true);
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      const stored = getStoredCart();
      setCart(Array.isArray(stored) ? stored : []);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // Safe cart items list
  const safeCart = Array.isArray(cart) ? cart : [];

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    const currentCart = getStoredCart();
    const productId = product._id || product.productId || product.id;
    const existingIndex = currentCart.findIndex(
      (item) => item.productId === productId
    );

    let newCart;
    if (existingIndex > -1) {
      // Update quantity if product already in cart
      newCart = currentCart.map((item, index) =>
        index === existingIndex
          ? { ...item, qty: (item.qty || 1) + quantity }
          : item
      );
      toast.success(`Updated ${product.name} quantity in cart`);
    } else {
      // Add new product to cart
      const cartItem = {
        productId: productId,
        product: productId, // For order API
        title: product.name,
        name: product.name,
        price: Number(product.price) || 0,
        qty: quantity,
        image: product.image?.url || product.image || "/placeholder-product.png",
        slug: product.slug,
        stock: product.stock ?? 999,
      };
      newCart = [...currentCart, cartItem];
      toast.success(`${product.name} added to cart`);
    }

    saveCart(newCart);
    setCart(newCart);
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    const currentCart = getStoredCart();
    const item = currentCart.find((item) => item.productId === productId);
    const newCart = currentCart.filter((item) => item.productId !== productId);
    
    saveCart(newCart);
    setCart(newCart);
    
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;

    const currentCart = getStoredCart();
    const item = currentCart.find((item) => item.productId === productId);
    
    // Check stock limit
    if (item && item.stock && quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    const newCart = currentCart.map((item) =>
      item.productId === productId ? { ...item, qty: quantity } : item
    );

    saveCart(newCart);
    setCart(newCart);
  }, []);

  // Increment quantity
  const incrementQuantity = useCallback((productId) => {
    const currentCart = getStoredCart();
    const item = currentCart.find((item) => item.productId === productId);
    
    if (item) {
      if (item.stock && item.qty >= item.stock) {
        toast.error(`Only ${item.stock} items available in stock`);
        return;
      }
      updateQuantity(productId, (item.qty || 1) + 1);
    }
  }, [updateQuantity]);

  // Decrement quantity
  const decrementQuantity = useCallback((productId) => {
    const currentCart = getStoredCart();
    const item = currentCart.find((item) => item.productId === productId);
    
    if (item && item.qty > 1) {
      updateQuantity(productId, item.qty - 1);
    }
  }, [updateQuantity]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    saveCart([]);
    setCart([]);
    toast.success("Cart cleared");
  }, []);

  // Calculate totals safely
  const cartTotal = safeCart.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );
  const cartCount = safeCart.reduce(
    (count, item) => count + (Number(item.qty) || 1),
    0
  );
  const itemCount = safeCart.length;

  // Check if product is in cart
  const isInCart = useCallback(
    (productId) => safeCart.some((item) => item.productId === productId),
    [safeCart]
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId) => {
      const item = safeCart.find((item) => item.productId === productId);
      return item ? item.qty : 0;
    },
    [safeCart]
  );

  // Prepare cart for order API
  const getOrderItems = useCallback(() => {
    return safeCart.map((item) => ({
      product: item.productId,
      title: item.title,
      price: item.price,
      qty: item.qty,
    }));
  }, [safeCart]);

  return {
    cart: safeCart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    cartTotal,
    cartCount,
    itemCount,
    isInCart,
    getItemQuantity,
    getOrderItems,
  };
}


