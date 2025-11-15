"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LOGO from "@/public/logo.png";
import { IoReorderTwoOutline, IoClose } from "react-icons/io5";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Animation variants for mobile drawer (slide from left)
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-[#3BB77E] transition duration-300" />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="hidden md:flex"
          >
            <Button
              asChild
              className="bg-[#3BB77E] hover:bg-green-700 text-white transition duration-300"
            >
              <Link href="/login">Login</Link>
            </Button>
          </motion.div>

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
              <div className="p-6 flex flex-col h-full">
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

                {/* Bottom Section */}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
