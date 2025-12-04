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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Animation variants for mobile drawer
const drawerVariants = {
  closed: {
    x: "-100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 },
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, isAdmin } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  // Render mobile user section based on auth state
  const renderMobileUserSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#3BB77E]" />
        </div>
      );
    }

    if (isAuthenticated && user) {
      return (
        <div className="border-t pt-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
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
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              {isAdmin() && (
                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#3BB77E]/10 text-[#3BB77E] w-fit">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Menu Links */}
          <div className="space-y-2">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Profile</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        variants={itemVariants}
        className="flex items-center space-x-6 pt-6 border-t"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link href="/cart" onClick={() => setIsOpen(false)}>
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3BB77E]" />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button
            asChild
            className="bg-[#3BB77E] hover:bg-green-700 text-white px-6 transition duration-300 w-full"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/login" className="w-full">
              Login
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  };

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
              src={LOGO}
              width={100}
              height={80}
              alt="Logo"
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
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3BB77E] transition duration-300" />
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
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
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
                  className="bg-[#3BB77E] hover:bg-green-700 text-white transition duration-300"
                >
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <motion.button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {isOpen ? <IoClose size={28} /> : <IoReorderTwoOutline size={28} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-md md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={drawerVariants}
              className="fixed top-0 left-0 h-full w-80 z-40 bg-green-50/97 min-h-screen shadow-xl md:hidden flex flex-col"
            >
              <div className="p-6 flex flex-col h-full overflow-y-auto">
                {/* Close Button */}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="self-end text-gray-700 hover:text-[#3BB77E] transition duration-300 mb-8"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <IoClose size={28} />
                </motion.button>

                {/* Nav Items */}
                <div className="flex flex-col space-y-6 flex-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`text-xl font-semibold transition-colors duration-300 inline ${
                            isActive
                              ? "text-[#3BB77E] border-b-2 border-[#3BB77E] pb-1"
                              : "text-gray-700 hover:text-[#3BB77E]"
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile User Section */}
                {renderMobileUserSection()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
