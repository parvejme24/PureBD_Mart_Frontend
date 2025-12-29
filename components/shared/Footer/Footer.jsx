"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

import { useSettings } from "@/hooks/useSettings";
import LOGO from "@/public/logo.png"; // Fallback logo

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSettings();

  return (
    <footer className="bg-gradient-to-br from-[#D8F1E5]/60 via-white to-[#3BB77E]/5 border-t border-gray-200/50">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={settings?.siteLogo?.url || LOGO}
                  alt={settings?.siteTitle || "PureBD Mart Logo"}
                  width={100}
                  height={56}
                  className=""
                  priority
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted online marketplace for quality products. We bring the
              best of Bangladesh to your doorstep with fast delivery and
              exceptional service.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Bangladesh</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/wishlist", label: "Wishlist" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-600 hover:text-[#3BB77E] transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Customer Service
            </h3>
            <div className="space-y-2">
              {[
                { href: "/cart", label: "Shopping Cart" },
                { href: "/checkout", label: "Checkout" },
                { href: "/dashboard/orders", label: "Track Order" },
                { href: "/contact", label: "Support" },
                { href: "/dashboard", label: "My Account" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-600 hover:text-[#3BB77E] transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#3BB77E] mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#3BB77E] flex-shrink-0" />
                <span className="text-gray-600 text-sm">+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#3BB77E] flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  support@purebdmart.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-200/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium text-sm">
                Follow Us:
              </span>
              <div className="flex space-x-3">
                {[
                  {
                    href: "https://facebook.com",
                    Icon: Facebook,
                    color: "hover:text-blue-600",
                  },
                  {
                    href: "https://twitter.com",
                    Icon: Twitter,
                    color: "hover:text-blue-400",
                  },
                  {
                    href: "https://instagram.com",
                    Icon: Instagram,
                    color: "hover:text-pink-600",
                  },
                  {
                    href: "https://youtube.com",
                    Icon: Youtube,
                    color: "hover:text-red-600",
                  },
                ].map(({ href, Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-white/80 shadow-sm border border-gray-200/50 ${color} transition-all duration-200 hover:shadow-md hover:scale-105`}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
                <p className="text-gray-600 text-sm">
                  © {currentYear}{" "}
                  <span className="font-semibold text-[#3BB77E]">
                    {settings?.siteTitle || "PureBD Mart"}
                  </span>
                  . All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
