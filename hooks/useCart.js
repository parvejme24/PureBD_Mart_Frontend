"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const CART_KEY = "cart";

// Get cart from localStorage
const getStoredCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("cartUpdated"));
};

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getStoredCart());
    setIsLoaded(true);
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      setCart(getStoredCart());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    const currentCart = getStoredCart();
    const existingIndex = currentCart.findIndex(
      (item) => item.productId === product._id
    );

    let newCart;
    if (existingIndex > -1) {
      // Update quantity if product already in cart
      newCart = currentCart.map((item, index) =>
        index === existingIndex
          ? { ...item, qty: item.qty + quantity }
          : item
      );
      toast.success(`Updated ${product.name} quantity in cart`);
    } else {
      // Add new product to cart
      const cartItem = {
        productId: product._id,
        product: product._id, // For order API
        title: product.name,
        name: product.name,
        price: product.price,
        qty: quantity,
        image: product.image?.url || product.image,
        slug: product.slug,
        stock: product.stock,
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
    if (item && quantity > item.stock) {
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
      if (item.qty >= item.stock) {
        toast.error(`Only ${item.stock} items available in stock`);
        return;
      }
      updateQuantity(productId, item.qty + 1);
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

  // Calculate totals
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const cartCount = cart.reduce((count, item) => count + item.qty, 0);
  const itemCount = cart.length;

  // Check if product is in cart
  const isInCart = useCallback(
    (productId) => cart.some((item) => item.productId === productId),
    [cart]
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId) => {
      const item = cart.find((item) => item.productId === productId);
      return item ? item.qty : 0;
    },
    [cart]
  );

  // Prepare cart for order API
  const getOrderItems = useCallback(() => {
    return cart.map((item) => ({
      product: item.productId,
      title: item.title,
      price: item.price,
      qty: item.qty,
    }));
  }, [cart]);

  return {
    cart,
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


