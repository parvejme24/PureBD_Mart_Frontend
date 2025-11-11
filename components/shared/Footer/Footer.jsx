"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

import LOGO from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="bg-blue-50/90 border-t backdrop-blur-md">
      <div className="container mx-auto max-w-7xl text-center py-14 px-4">
        {/* Logo / Brand */}
        <div className="pb-5">
          <img src={LOGO.src} alt="PureBD Mart Logo" className="mx-auto h-14" />
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-gray-700 font-medium mb-4">
          <Link href="/" className="hover:text-blue-500 transition">
            Home
          </Link>
          <Link href="/shop" className="hover:text-blue-500 transition">
            Shop
          </Link>
          <Link href="/about" className="hover:text-blue-500 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-500 transition">
            Contact
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-4">
          <Link
            href="https://facebook.com"
            className="p-2 rounded-full bg-white shadow hover:bg-gradient-to-r hover:from-[#1E0B9B] hover:to-[#0BA8DD] hover:text-white transition"
          >
            <Facebook className="w-5 h-5 text-[#1E0B9B]" />
          </Link>
          <Link
            href="https://twitter.com"
            className="p-2 rounded-full bg-white shadow hover:bg-gradient-to-r hover:from-[#1E0B9B] hover:to-[#0BA8DD] hover:text-white transition"
          >
            <Twitter className="w-5 h-5 text-[#1E0B9B]" />
          </Link>
          <Link
            href="https://instagram.com"
            className="p-2 rounded-full bg-white shadow hover:bg-gradient-to-r hover:from-[#1E0B9B] hover:to-[#0BA8DD] hover:text-white transition"
          >
            <Instagram className="w-5 h-5 text-[#1E0B9B]" />
          </Link>
          <Link
            href="https://linkedin.com"
            className="p-2 rounded-full bg-white shadow hover:bg-gradient-to-r hover:from-[#1E0B9B] hover:to-[#0BA8DD] hover:text-white transition"
          >
            <Linkedin className="w-5 h-5 text-[#1E0B9B]" />
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} PureBD Mart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
