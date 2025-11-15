"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LOGO from "@/public/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-[#D8F1E5]/40 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={LOGO} alt="Logo" className="w-auto h-10" />
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-500"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right: Cart + Login */}
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-500 transition" />
          </Link>
          <Button
            asChild
            className="bg-[#3BB77E] hover:bg-[#29A56C] duration-300 text-white"
          >
            <Link href="/login">Login</Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Blur Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/60 flex flex-col items-center justify-center space-y-6 md:hidden transition-all">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700 hover:text-blue-500"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="flex items-center space-x-4 pt-4">
            <Link href="/cart" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-500" />
            </Link>
            <Button
              asChild
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
