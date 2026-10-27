"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LOGO from "@/public/logo.png";
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Phone,
  Truck,
  Sparkles,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  Flame,
  Award,
  Grid,
  Layers,
  HelpCircle,
  Clock,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useCategories } from "@/hooks/useCategory";
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
  const [mobileTab, setMobileTab] = useState("categories"); // 'categories' or 'menu'
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchCat, setSelectedSearchCat] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();

  const {
    cart,
    cartTotal,
    cartCount,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const { count: wishlistCount } = useWishlist();
  const { data: categoryData } = useCategories();
  const categories = useMemo(() => {
    const list = categoryData?.categories || [];
    return list.filter((c) => !c.name?.toLowerCase().includes("test"));
  }, [categoryData]);

  // Scroll detection for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer and dropdowns on route transition during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setCartOpen(false);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let url = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
      if (selectedSearchCat && selectedSearchCat !== "all") {
        url += `&categories=${encodeURIComponent(selectedSearchCat)}`;
      }
      router.push(url);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const mainNavItems = [
    { name: "Home", href: "/" },
    { name: "Shop Mart", href: "/shop" },
    { name: "Flash Deals", href: "/shop", badge: "HOT", badgeColor: "bg-rose-500 text-white" },
    { name: "Best Sellers", href: "/shop", badge: "TOP", badgeColor: "bg-amber-500 text-white" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* =========================================================================
          TIER 1: TOP MICRO ANNOUNCEMENT STRIP
      ========================================================================= */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-3 border-b border-emerald-900/60 hidden sm:block">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          
          {/* Left Highlights */}
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Certified Chemical-Free Groceries</span>
            </span>
            <span className="text-emerald-800">|</span>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Delivery on Orders Over ৳500</span>
            </span>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/dashboard/orders"
              className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <span className="text-emerald-800">|</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Help Center</span>
            </Link>
            <span className="text-emerald-800">|</span>
            <a
              href="tel:+8801700000000"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-bold text-white"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+880 1700-000000</span>
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          TIER 2: MAIN E-COMMERCE HEADER (Sticky with Search & Actions)
      ========================================================================= */}
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
          isScrolled
            ? "shadow-md border-b border-gray-200/90 py-2 sm:py-2.5"
            : "border-b border-gray-100 py-2.5 sm:py-3.5"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-3 md:gap-5 lg:gap-8">
            
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
                aria-label="Open Menu and Categories"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center shrink-0 group">
                <Image
                  src={LOGO}
                  alt="PureBD Mart"
                  width={115}
                  height={42}
                  priority
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-102"
                />
              </Link>
            </div>

            {/* Delivery Location Pill (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 text-xs text-gray-700 shrink-0">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-gray-500 block">Deliver to:</span>
                <span className="font-extrabold text-emerald-950">Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Central E-commerce Mega Search Bar (Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-1">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full flex items-center bg-gray-50 border-2 border-emerald-600 rounded-full shadow-inner overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white transition-all"
              >
                {/* Category Selector Dropdown inside Search Bar */}
                <select
                  value={selectedSearchCat}
                  onChange={(e) => setSelectedSearchCat(e.target.value)}
                  className="bg-transparent text-xs font-bold text-gray-700 px-3.5 py-2.5 border-r border-gray-200 focus:outline-none cursor-pointer max-w-[140px] truncate hidden lg:block"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.slug || c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Input */}
                <input
                  type="text"
                  placeholder="Search 5,000+ organic groceries, vegetables, cooking oil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />

                {/* Search Button */}
                <button
                  type="submit"
                  aria-label="Search PureBD Mart"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Right Action Icons: Wishlist, Cart Drawer, User Account */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer group"
                aria-label="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:flex flex-col text-left leading-none">
                  <span className="text-[10px] text-gray-400 font-medium">Favorite</span>
                  <span className="text-xs font-bold text-gray-800">Wishlist</span>
                </div>
              </Link>

              {/* Cart Popover */}
              <Popover open={cartOpen} onOpenChange={setCartOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="relative flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-gray-800 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer group border border-transparent hover:border-emerald-200"
                    aria-label="Shopping Cart"
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 text-emerald-700" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-[10px] text-gray-400 font-medium">My Cart</span>
                      <span className="text-xs font-black text-emerald-700">
                        ৳{cartTotal.toFixed(0)}
                      </span>
                    </div>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-80 sm:w-96 p-0 rounded-3xl shadow-2xl border-emerald-100 bg-white overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-sm text-gray-900">
                        Shopping Basket
                      </h4>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {cartCount} item{cartCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Cart Items list */}
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {cart.length === 0 ? (
                      <div className="py-12 text-center px-4">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-700">
                          Your basket is empty
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Add fresh items from our shop to get started!
                        </p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.productId}
                          className="p-3.5 flex items-center gap-3 hover:bg-gray-50/70 transition-colors"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                            <Image
                              src={item.image || "/placeholder-product.png"}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/shop/${item.slug || item.productId}`}
                              onClick={() => setCartOpen(false)}
                              className="text-xs font-bold text-gray-800 hover:text-emerald-600 truncate block transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                              ৳{item.price}{" "}
                              <span className="text-gray-400 font-normal">
                                x {item.qty}
                              </span>
                            </p>

                            <div className="flex items-center gap-1.5 mt-1.5">
                              <button
                                type="button"
                                onClick={() => decrementQuantity(item.productId)}
                                className="h-5 w-5 rounded bg-gray-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-gray-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => incrementQuantity(item.productId)}
                                className="h-5 w-5 rounded bg-gray-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-gray-600"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Subtotal:</span>
                        <span className="text-base font-extrabold text-emerald-700">
                          ৳{cartTotal.toFixed(0)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gray-200 text-xs font-bold h-9"
                          asChild
                          onClick={() => setCartOpen(false)}
                        >
                          <Link href="/cart">View Cart</Link>
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 shadow-sm"
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

              {/* User Account Menu */}
              <div>
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                ) : isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-emerald-50 transition-colors cursor-pointer border border-emerald-100"
                        aria-label="User Account"
                      >
                        <Avatar className="h-8 w-8 border border-emerald-500">
                          <AvatarImage src={user?.image} alt={user?.name} />
                          <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-56 p-1.5 rounded-2xl shadow-xl border-gray-100"
                    >
                      <DropdownMenuLabel className="p-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-900 truncate">
                            {user?.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </span>
                          {isAdmin() && (
                            <span className="mt-1 inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                              Admin
                            </span>
                          )}
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href="/dashboard" className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold">My Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href="/dashboard/orders" className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold">My Orders</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link href="/dashboard/profile" className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold">Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={logout}
                        className="rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer flex items-center gap-2.5 text-xs font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login" className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 sm:px-4 py-2 rounded-full text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                )}
              </div>

            </div>

          </div>

          {/* Mobile Search Bar (Directly below logo on mobile screens) */}
          <div className="mt-2.5 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search fresh groceries, spices, fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-gray-50 border border-emerald-500/80 rounded-full focus:outline-none focus:bg-white shadow-inner"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 text-white rounded-full p-1.5"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>
      </header>

      {/* =========================================================================
          TIER 3: CATEGORIES & MAIN NAVIGATION BAR (Desktop E-commerce Strip)
      ========================================================================= */}
      <div className="bg-white border-b border-gray-200/80 hidden lg:block">
        <div className="container mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex items-center justify-between">
            
            {/* Left: "Browse All Categories" Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm px-5 py-3 rounded-t-xl flex items-center gap-2.5 cursor-pointer transition-colors shadow-xs"
              >
                <Grid className="w-4 h-4" />
                <span>Browse Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Category Floating Menu */}
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 w-64 bg-white rounded-b-2xl shadow-2xl border border-emerald-100 z-50 py-2 overflow-hidden"
                  >
                    {categories.slice(0, 10).map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/shop?categories=${encodeURIComponent(cat.slug || cat._id)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="px-4 py-2.5 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/80 transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{cat.name}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      </Link>
                    ))}
                    <div className="p-2 border-t border-gray-100 mt-1">
                      <Link
                        href="/shop"
                        onClick={() => setCategoriesOpen(false)}
                        className="block text-center text-xs font-black text-emerald-700 hover:underline py-1"
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle: Horizontal Nav Items */}
            <nav className="flex items-center gap-7">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative py-3 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? "text-emerald-700"
                        : "text-gray-700 hover:text-emerald-600"
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Guarantee Dispatch Banner */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>30-Min Fast Delivery in Dhaka</span>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 4: MOBILE E-COMMERCE SIDEBAR DRAWER (With Dual Tabs)
      ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs lg:hidden"
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs sm:max-w-sm bg-white z-50 shadow-2xl flex flex-col justify-between lg:hidden overflow-hidden"
            >
              <div className="flex flex-col h-full">
                
                {/* 1. Sidebar Top Header */}
                <div className="p-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={LOGO}
                      alt="PureBD Mart"
                      width={100}
                      height={36}
                      className="h-7 w-auto object-contain bg-white px-2 py-0.5 rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. User Greeting or Sign In Header Strip */}
                <div className="bg-emerald-900/90 text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-emerald-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-300" />
                    <span className="font-bold truncate max-w-[180px]">
                      {isAuthenticated && user ? `Hello, ${user.name}` : "Hello, Welcome"}
                    </span>
                  </div>
                  {!isAuthenticated && (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-amber-300 font-extrabold hover:underline"
                    >
                      Sign In →
                    </Link>
                  )}
                </div>

                {/* 3. Dual Tab Switcher: [ Categories | Menu ] */}
                <div className="grid grid-cols-2 bg-gray-100 p-1 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setMobileTab("categories")}
                    className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileTab === "categories"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Categories ({categories.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileTab("menu")}
                    className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mobileTab === "menu"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Navigation</span>
                  </button>
                </div>

                {/* 4. Tab Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  {mobileTab === "categories" ? (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Shop By Department
                      </p>
                      <div className="space-y-1">
                        {categories.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/shop?categories=${encodeURIComponent(cat.slug || cat._id)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span>{cat.name}</span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                          </Link>
                        ))}
                        <Link
                          href="/shop"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center text-xs font-black text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl mt-3"
                        >
                          View Entire Store Catalog →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Quick Links
                      </p>
                      <div className="space-y-1">
                        {mainNavItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            <span>{item.name}</span>
                            {item.badge && (
                              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                        <Link
                          href="/wishlist"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>My Wishlist</span>
                          </span>
                          {wishlistCount > 0 && (
                            <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/cart"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-emerald-600" />
                            <span>My Shopping Basket</span>
                          </span>
                          {cartCount > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-emerald-600" />
                            <span>Track Orders</span>
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Helpline info inside drawer */}
                  <div className="mt-5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Express Dispatch in 30 Mins</span>
                    </div>
                    <a
                      href="tel:+8801700000000"
                      className="flex items-center gap-2 text-gray-700 font-semibold"
                    >
                      <Phone className="w-4 h-4 text-amber-600" />
                      <span>Hotline: +880 1700-000000</span>
                    </a>
                  </div>
                </div>

                {/* 5. Bottom Account / Sign Out Area */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 text-xs font-bold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs py-2.5">
                        Sign In / Register
                      </Button>
                    </Link>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
