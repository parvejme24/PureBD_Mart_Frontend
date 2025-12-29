"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LOGO from "@/public/logo.png";
import { IoReorderTwoOutline, IoClose } from "react-icons/io5";
import {
  ShoppingCart,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Loader2,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { MdFavoriteBorder } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSettings } from "@/hooks/useSettings";

// Get user initials for avatar fallback
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();
  const {
    cart,
    isLoaded,
    cartTotal,
    cartCount,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();
  const { wishlist } = useWishlist();
  const { data: settings } = useSettings();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  // Cart state for popover
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href="/" className="flex items-center">
            <Image
              src={settings?.siteLogo?.url || LOGO}
              width={100}
              height={80}
              alt={settings?.siteTitle || "Logo"}
              className="h-10 w-auto"
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 font-medium text-gray-700">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  href={item.href}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-[#3BB77E] border-b-2 border-[#3BB77E] pb-1"
                      : "hover:text-[#3BB77E]"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4 md:space-x-4">
          {/* Wishlist Icon */}
          {wishlist.length > 0 && (
            <Link href="/wishlist">
              <button className="relative focus:outline-none cursor-pointer">
                <MdFavoriteBorder className="w-6 h-6 text-gray-700 hover:text-red-500 transition duration-300" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              </button>
            </Link>
          )}

          {/* Cart Dropdown - Desktop */}
          <div className="hidden md:block">
            <Popover open={cartOpen} onOpenChange={setCartOpen}>
              <PopoverTrigger asChild>
                <button className="relative focus:outline-none cursor-pointer">
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3BB77E] transition duration-300" />
                  {isLoaded && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#3BB77E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                {/* Cart Header */}
                <div className="p-4 border-b bg-gray-50 rounded-t-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Shopping Cart</h3>
                    <span className="text-sm text-gray-500">
                      {cartCount} item{cartCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="max-h-[300px] overflow-y-auto">
                  {!isLoaded ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#3BB77E]" />
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="p-8 text-center">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Your cart is empty</p>
                      <p className="text-sm text-gray-400">Add items to get started</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {cart.map((item) => (
                        <div
                          key={item.productId}
                          className="p-3 flex gap-3 hover:bg-gray-50 transition-colors"
                        >
                          {/* Product Image */}
                          <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/shop/${item.slug || item.productId}`}
                              onClick={() => setCartOpen(false)}
                              className="text-sm font-medium text-gray-800 hover:text-[#3BB77E] line-clamp-1 transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[#3BB77E] font-semibold text-sm">
                              ৳{item.price}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => decrementQuantity(item.productId)}
                                className="h-6 w-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                                disabled={item.qty <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium w-6 text-center">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => incrementQuantity(item.productId)}
                                className="h-6 w-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="self-start p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="p-4 border-t bg-gray-50 space-y-3 rounded-b-md">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-lg font-bold text-[#3BB77E]">
                        ৳{cartTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        asChild
                        onClick={() => setCartOpen(false)}
                      >
                        <Link href="/cart">View Cart</Link>
                      </Button>
                      <Button
                        className="flex-1 bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
                        asChild
                        onClick={() => setCartOpen(false)}
                      >
                        <Link href="/checkout">Checkout</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Wishlist Icon - Mobile */}
          {wishlist.length > 0 && (
            <motion.div
              className="md:hidden relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/wishlist" className="flex items-center justify-center">
                <MdFavoriteBorder className="w-6 h-6 text-gray-700 hover:text-red-500 transition duration-300" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              </Link>
            </motion.div>
          )}

          {/* Cart Icon - Mobile (simple link) */}
            <motion.div
              className="md:hidden relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/cart" className="flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3BB77E] transition duration-300" />
                {isLoaded && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#3BB77E] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </motion.div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#3BB77E]" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
                  >
                    <Avatar className="h-9 w-9 border-2 border-[#3BB77E]">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="bg-[#3BB77E] text-white text-sm font-semibold">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:block" />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  {/* User Info */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3 p-2">
                      <Avatar className="h-12 w-12 border-2 border-[#3BB77E]">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="bg-[#3BB77E] text-white font-semibold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                        {isAdmin() && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3BB77E]/10 text-[#3BB77E] w-fit">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Menu Items */}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 p-2"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 p-2"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <div className="flex items-center gap-3 p-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  asChild
                  className="bg-[#3BB77E] hover:bg-green-700 text-white transition duration-300 cursor-pointer"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu (popover) */}
          <Popover open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <PopoverTrigger asChild>
              <motion.button
                className="md:hidden text-gray-700 cursor-pointer flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {mobileMenuOpen ? <IoClose size={28} /> : <IoReorderTwoOutline size={28} />}
              </motion.button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3 md:hidden">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "text-[#3BB77E] bg-green-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 my-3" />

              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#3BB77E]" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-4 w-4 text-gray-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full bg-[#3BB77E] hover:bg-green-700 text-white mt-1 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
